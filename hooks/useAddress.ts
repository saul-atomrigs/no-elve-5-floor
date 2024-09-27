import { useState } from 'react';
import axios from 'axios';
import stringSimilarity from 'string-similarity';
import addressData from '@/assets/addressData.json';
import { Alert } from 'react-native';

const useAddress = () => {
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [buildingParams, setBuildingParams] = useState({
    sigunguCd: '',
    bjdongCd: '',
    platGbCd: '',
    bun: '',
    ji: '',
  });

  const handleAddressChange = async (text: string) => {
    setAddress(text);
    if (text.length > 2) {
      const lowercaseInput = text.toLowerCase().replace(/\s+/g, '');
      const localMatches = addressData
        .filter((item) => {
          const normalizedJibun = item.법정동명.toLowerCase().replace(/\s+/g, '');
          return normalizedJibun.includes(lowercaseInput);
        })
        .slice(0, 5);

      try {
        const response = await axios.get(
          'https://business.juso.go.kr/addrlink/addrLinkApi.do',
          {
            params: {
              confmKey: process.env.EXPO_PUBLIC_ROAD_JUSO_API_KEY,
              currentPage: 1,
              countPerPage: 5,
              keyword: text,
              resultType: 'json',
            },
          }
        );

        const apiMatches = response.data.results.juso || [];
        const combinedSuggestions = [
          ...localMatches.map((item) => ({ address: item.법정동명, type: '지번' })),
          ...apiMatches.map((item) => ({ address: item.roadAddr, type: '도로명' })),
        ];

        const sortedSuggestions = combinedSuggestions
          .map((item) => ({
            ...item,
            similarity: stringSimilarity.compareTwoStrings(
              lowercaseInput,
              item.address.toLowerCase().replace(/\s+/g, '')
            ),
          }))
          .sort((a, b) => b.similarity - a.similarity)
          .slice(0, 10);

        setSuggestions(sortedSuggestions);
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
        setSuggestions(localMatches.map((item) => ({ address: item.법정동명, type: '지번' })));
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionSelect = (selectedAddress: string) => {
    setAddress(selectedAddress);
    setSuggestions([]);
    handleAddressSubmit(selectedAddress);
  };

  const handleAddressSubmit = async (submittedAddress?: string) => {
    try {
      const addressToSubmit = submittedAddress || address;
      const parsedAddress = await parseAddress(addressToSubmit);
      if (parsedAddress) {
        const params = convertToApiParams(parsedAddress);
        if (params) {
          setBuildingParams(params);
        } else {
          Alert.alert('주소 오류', '주소를 변환하는 데 실패했습니다.');
        }
      } else {
        Alert.alert('주소 오류', '올바른 주소를 입력해주세요.');
      }
    } catch (error) {
      console.error('Address processing error:', error);
      Alert.alert('오류', '주소 처리 중 오류가 발생했습니다.');
    }
  };

  const parseAddress = async (address: string) => {
    const roadNameMatch = address.match(/^(.+[로길])\s*(\d+(-\d+)?)/);
    if (roadNameMatch) {
      const response = await axios.get(
        'https://business.juso.go.kr/addrlink/addrLinkApi.do',
        {
          params: {
            confmKey: process.env.EXPO_PUBLIC_ROAD_JUSO_API_KEY,
            currentPage: 1,
            countPerPage: 1,
            keyword: address,
            resultType: 'json',
          },
        }
      );

      if (response.data.results.juso && response.data.results.juso.length > 0) {
        const juso = response.data.results.juso[0];
        const jibunAddr = juso.jibunAddr;

        const extractRegex = /(\S+동)\s+(\d+(?:-\d+)?)/;
        const extractMatch = jibunAddr.match(extractRegex);

        if (extractMatch) {
          const [, dongName, fullNumber] = extractMatch;
          const [bun, ji = '0'] = fullNumber.split('-');

          return {
            sigunguCd: juso.admCd.slice(0, 5),
            bjdongCd: juso.admCd.slice(5, 10),
            dongName,
            bun,
            ji,
          };
        }
      }
    } else {
      const jibunRegex = /^(.+동)\s*(\d+)(-(\d+))?$/;
      const jibunMatch = address.match(jibunRegex);

      if (jibunMatch) {
        return {
          dongName: jibunMatch[1],
          bun: jibunMatch[2],
          ji: jibunMatch[4] || '0',
        };
      }
    }
    return null;
  };

  const convertToApiParams = (parsedAddress: {
    sigunguCd?: string;
    bjdongCd?: string;
    dongName: string;
    bun: string;
    ji: string;
  }) => {
    if (parsedAddress.sigunguCd && parsedAddress.bjdongCd) {
      return {
        sigunguCd: parsedAddress.sigunguCd,
        bjdongCd: parsedAddress.bjdongCd,
        platGbCd: '0',
        bun: parsedAddress.bun.padStart(4, '0'),
        ji: parsedAddress.ji.padStart(4, '0'),
      };
    } else {
      const dongInfo = addressData.find(
        (item) =>
          item.법정동명.includes(parsedAddress.dongName) &&
          item.폐지여부 === '존재'
      );

      if (dongInfo) {
        const code = dongInfo.법정동코드.toString();
        return {
          sigunguCd: code.slice(0, 5),
          bjdongCd: code.slice(5, 10),
          platGbCd: '0',
          bun: parsedAddress.bun.padStart(4, '0'),
          ji: parsedAddress.ji.padStart(4, '0'),
        };
      }

      Alert.alert('주소 오류', '해당 주소를 찾을 수 없습니다.');
      return {
        sigunguCd: '',
        bjdongCd: '',
        platGbCd: '',
        bun: '',
        ji: '',
      };
    }
  };

  const clearInput = () => {
    setAddress('');
  };

  return {
    address,
    suggestions,
    buildingParams,
    handleAddressChange,
    handleSuggestionSelect,
    handleAddressSubmit,
    clearInput,
  };
}

export default useAddress;
