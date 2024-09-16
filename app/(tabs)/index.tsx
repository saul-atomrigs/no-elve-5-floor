import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBuildingInfo } from '../../hooks/useBuildingInfo';

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

  const handleAddressSubmit = () => {
    // TODO: Implement address parsing logic here
    // For now, we'll use a dummy implementation
    const dummyParse = (address: string) => {
      // This is a placeholder. In a real implementation, you'd parse the address
      // and return the correct parameters.
      return {
        sigunguCd: '11710',
        bjdongCd: '10600',
        platGbCd: '0',
        bun: '0171',
        ji: '0016',
      };
    };

    const params = dummyParse(address);
    setBuildingParams(params);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="건물 주소 입력 또는 음성으로 검색"
          value={address}
          onChangeText={setAddress}
          onSubmitEditing={handleAddressSubmit}
        />
        <TouchableOpacity style={styles.micButton}>
          <Ionicons name="mic" size={24} color="black" />
        </TouchableOpacity>
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
            <Text style={styles.warningText}>
              엘리베이터: {buildingInfo.rideUseElvtCnt > 0 ? '있음' : '없음'} 
              {buildingInfo.rideUseElvtCnt === 0 && <Ionicons name="warning" size={16} color="red" />}
            </Text>
          </View>
        ) : (
          <Text>No building information available</Text>
        )}
      </View>

      {/* 지도 보기 버튼 */}
      <TouchableOpacity style={styles.mapButton}>
        <Text style={styles.mapButtonText}>지도에서 보기</Text>
      </TouchableOpacity>
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
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
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
