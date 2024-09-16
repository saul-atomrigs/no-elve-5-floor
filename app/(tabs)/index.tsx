import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBuildingInfo } from '../../hooks/useBuildingInfo';
import addressData from '../../assets/addressData.json';
import axios from 'axios';

export default function HomeScreen() {
  const [address, setAddress] = useState('');
  const [buildingParams, setBuildingParams] = useState({
    sigunguCd: '',
    bjdongCd: '',
    platGbCd: '',
    bun: '',
    ji: '',
  });

  const { data: buildingInfo, isLoading, error } = useBuildingInfo(
    buildingParams.sigunguCd,
    buildingParams.bjdongCd,
    buildingParams.platGbCd,
    buildingParams.bun,
    buildingParams.ji
  );

  const handleAddressSubmit = async () => {
    try {
      const parsedAddress = await parseAddress(address);
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
    const jibunRegex = /^(.+동)\s*(\d+)(-(\d+))?$/;
    const jibunMatch = address.match(jibunRegex);
    
    if (jibunMatch) {
      console.log('jibunMatch', jibunMatch);
      return {
        dongName: jibunMatch[1],
        bun: jibunMatch[2],
        ji: jibunMatch[4] || '0'
      };
    } else {
      // 도로명주소 처리
      const response = await axios.get('https://business.juso.go.kr/addrlink/addrLinkApi.do', {
        params: {
          confmKey: 'U01TX0FVVEgyMDI0MDkxNjIxMTE0MDExNTA4ODc=',
          currentPage: 1,
          countPerPage: 1,
          keyword: address,
          resultType: 'json'
        }
      });

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
            ji
          };
        }
      }
    }
    return null;
  };

  const convertToApiParams = (parsedAddress: { 
    sigunguCd?: string; 
    bjdongCd?: string; 
    dongName: string; 
    bun: string; 
    ji: string 
  }) => {
    if (parsedAddress.sigunguCd && parsedAddress.bjdongCd) {
      // 도로명주소의 경우 (API 응답에서 이미 코드를 받아옴)
      return {
        sigunguCd: parsedAddress.sigunguCd,
        bjdongCd: parsedAddress.bjdongCd,
        platGbCd: '0', // 일반 지번
        bun: parsedAddress.bun.padStart(4, '0'),
        ji: parsedAddress.ji.padStart(4, '0')
      };
    } else {
      // 지번주소의 경우 (기존 로직)
      const dongInfo = addressData.find(item => 
        item.법정동명.includes(parsedAddress.dongName) && item.폐지여부 === "존재"
      );

      if (dongInfo) {
        const code = dongInfo.법정동코드.toString();
        return {
          sigunguCd: code.slice(0, 5),
          bjdongCd: code.slice(5, 10),
          platGbCd: '0', // 일반 지번
          bun: parsedAddress.bun.padStart(4, '0'),
          ji: parsedAddress.ji.padStart(4, '0')
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="송파동 123-45, 신림로 67"
          value={address}
          onChangeText={setAddress}
          onSubmitEditing={handleAddressSubmit}
        />
        {address.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearInput}>
            <Ionicons name="close-circle" size={20} color="gray" />
          </TouchableOpacity>
        )}
      </View>

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
            <Text style={[
              styles.warningText,
              buildingInfo.rideUseElvtCnt > 0 ? styles.blueText : null
            ]}>
              엘리베이터: {buildingInfo.rideUseElvtCnt > 0 ? '있음' : '없음'} 
              {buildingInfo.rideUseElvtCnt === 0 && <Ionicons name="warning" size={16} color="red" />}
            </Text>
          </View>
        ) : (
          <Text>위 검색창에서 주소를 입력해주세요</Text>
        )}
      </View>

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
});
