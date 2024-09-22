import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import stringSimilarity from 'string-similarity';

import { useBuildingInfo } from '@/hooks/useBuildingInfo';
import addressData from '@/assets/addressData.json';

export default function HomeScreen() {
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [buildingParams, setBuildingParams] = useState({
    sigunguCd: '',
    bjdongCd: '',
    platGbCd: '',
    bun: '',
    ji: '',
  });

  const {
    data: buildingInfo,
    isLoading,
    error,
  } = useBuildingInfo(
    buildingParams.sigunguCd,
    buildingParams.bjdongCd,
    buildingParams.platGbCd,
    buildingParams.bun,
    buildingParams.ji
  );

  const handleAddressChange = async (text: string) => {
    setAddress(text);
    if (text.length > 2) {
      // 지번주소 suggestions
      const lowercaseInput = text.toLowerCase().replace(/\s+/g, '');
      const localMatches = addressData
        .filter((item) => {
          const normalizedJibun = item.법정동명
            .toLowerCase()
            .replace(/\s+/g, '');
          return normalizedJibun.includes(lowercaseInput);
        })
        .slice(0, 5);

      // 도로명주소 suggestions
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
          ...localMatches.map((item) => ({
            address: item.법정동명,
            type: '지번',
          })),
          ...apiMatches.map((item) => ({
            address: item.roadAddr,
            type: '도로명',
          })),
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
        setSuggestions(
          localMatches.map((item) => ({ address: item.법정동명, type: '지번' }))
        );
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
      console.log('parsedAddress', parsedAddress);
      if (parsedAddress) {
        const params = convertToApiParams(parsedAddress);
        console.log('params', params);
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

      console.log('response 도로명', response);

      if (response.data.results.juso && response.data.results.juso.length > 0) {
        const juso = response.data.results.juso[0];
        const jibunAddr = juso.jibunAddr;
        console.log('jibunAddr', jibunAddr);

        // 동 이름과 번지수만 추출하는 정규표현식
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
        console.log('jibunMatch', jibunMatch);
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
      // 도로명주소의 경우 (API 응답에서 이미 코드를 받아옴)
      return {
        sigunguCd: parsedAddress.sigunguCd,
        bjdongCd: parsedAddress.bjdongCd,
        platGbCd: '0', // 일반 지번
        bun: parsedAddress.bun.padStart(4, '0'),
        ji: parsedAddress.ji.padStart(4, '0'),
      };
    } else {
      // 지번주소의 경우 (기존 로직)
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
          platGbCd: '0', // 일반 지번
          bun: parsedAddress.bun.padStart(4, '0'),
          ji: parsedAddress.ji.padStart(4, '0'),
        };
      }

      // 주소를 찾을 수 없을 때 null 대신 에러 메시지를 표시하고 빈 객체를 반환
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

  const renderSuggestion = ({
    item,
  }: {
    item: { address: string; type: string };
  }) => (
    <TouchableOpacity onPress={() => handleSuggestionSelect(item.address)}>
      <View style={styles.suggestionItem}>
        <Text style={styles.suggestionText}>{item.address}</Text>
        <Text style={styles.suggestionType}>{item.type}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        {/* 주소 입력창 */}
        <TextInput
          style={styles.input}
          placeholder='송파동 123-45, 신림로 67'
          value={address}
          onChangeText={handleAddressChange}
          onSubmitEditing={() => handleAddressSubmit()}
        />
        {address.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearInput}>
            <Ionicons name='close-circle' size={20} color='gray' />
          </TouchableOpacity>
        )}
      </View>

      {/* 주소 추천 목록 */}
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderSuggestion}
          style={styles.suggestionsList}
        />
      )}

      {/* 건물 정보 카드 */}
      <View style={styles.card}>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text>Error: {error.message}</Text>
        ) : buildingInfo ? (
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{buildingInfo.newPlatPlc}</Text>
            <Text style={styles.cardTitleSub}>{buildingInfo.platPlc}</Text>
            <Text>층수: {buildingInfo.grndFlrCnt}층</Text>
            <Text
              style={[
                styles.warningText,
                buildingInfo.rideUseElvtCnt > 0 ? styles.blueText : null,
              ]}
            >
              엘리베이터: {buildingInfo.rideUseElvtCnt > 0 ? '있음' : '없음'}
              {buildingInfo.rideUseElvtCnt === 0 && (
                <Ionicons name='warning' size={16} color='red' />
              )}
            </Text>
          </View>
        ) : (
          <Text>위 검색창에서 주소를 입력해주세요 (서울 지역 서비스)</Text>
        )}
      </View>

      {/* Dynamically displayed image */}
      {buildingInfo && address.length > 0 && (
        <Image
          source={
            buildingInfo.rideUseElvtCnt > 0
              ? require('../../assets/images/elevator.webp')
              : require('../../assets/images/stairs.webp')
          }
          style={styles.image}
          resizeMode='contain'
        />
      )}

      {/* 지도 보기 버튼 */}
      {/* <TouchableOpacity style={styles.mapButton}>
        <Text style={styles.mapButtonText}>지도에서 보기</Text>
      </TouchableOpacity> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingRight: 40, // Add space for the clear button
  },
  clearButton: {
    position: 'absolute',
    right: 8,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  micButton: {
    marginLeft: 8,
    padding: 8,
    backgroundColor: '#D1D5DB',
    borderRadius: 20,
  },
  card: {
    marginTop: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardTitleSub: {
    fontSize: 14,
    color: 'gray',
  },
  warningText: {
    color: 'red',
  },
  blueText: {
    color: 'blue',
  },
  mapButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  mapButtonText: {
    color: 'white',
  },
  image: {
    width: '100%',
    height: 400,
    marginTop: 16,
  },
  // Existing styles
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  suggestionsList: {
    maxHeight: 200,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
  },
  suggestionType: {
    fontSize: 12,
    color: '#666',
  },
});
