import { useState } from 'react';
import axios from 'axios';
import stringSimilarity from 'string-similarity';
import addressData from '@/assets/addressData.json';

const useAddressSearch = (onAddressSubmit: (address: string) => void) => {
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState<
    { address: string; type: string; similarity?: number }[]
  >([]);

  const handleAddressChange = async (text: string) => {
    setAddress(text);
    if (text.length > 2) {
      const lowercaseInput = text.toLowerCase().replace(/\s+/g, '');
      const localMatches = addressData
        .filter((item) => {
          const normalizedJibun = item.법정동명
            .toLowerCase()
            .replace(/\s+/g, '');
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
        interface LocalMatch {
          법정동명: string;
        }

        interface ApiMatch {
          roadAddr: string;
        }

        interface AddressSuggestion {
          address: string;
          type: '지번' | '도로명';
        }

        const combinedSuggestions: AddressSuggestion[] = [
          ...localMatches.map((item: LocalMatch) => ({
            address: item.법정동명,
            type: '지번',
          })),
          ...apiMatches.map((item: ApiMatch) => ({
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
    onAddressSubmit(selectedAddress);
  };

  const clearInput = () => {
    setAddress('');
    setSuggestions([]);
  };

  return {
    address,
    suggestions,
    handleAddressChange,
    handleSuggestionSelect,
    clearInput,
  };
};

export default useAddressSearch;
