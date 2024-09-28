import React from 'react';
import { render } from '@testing-library/react-native';
import BuildingInfoCard from '../BuildingInfoCard';

describe('BuildingInfoCard', () => {
  const mockBuildingInfo = {
    newPlatPlc: 'New Place',
    platPlc: 'Old Place',
    grndFlrCnt: 5,
    rideUseElvtCnt: 1,
  };

  const mockError = { message: 'Something went wrong' };

  it('renders loading state correctly', () => {
    const { getByText } = render(
      <BuildingInfoCard buildingInfo={null} isLoading={true} error={null} />
    );

    expect(getByText('Loading...')).toBeTruthy();
  });

  it('renders error state correctly', () => {
    const { getByText } = render(
      <BuildingInfoCard buildingInfo={null} isLoading={false} error={mockError} />
    );

    expect(getByText(`Error: ${mockError.message}`)).toBeTruthy();
  });

  it('renders building info correctly', () => {
    const { getByText, getByTestId } = render(
      <BuildingInfoCard buildingInfo={mockBuildingInfo} isLoading={false} error={null} />
    );

    expect(getByText(mockBuildingInfo.newPlatPlc)).toBeTruthy();
    expect(getByText(mockBuildingInfo.platPlc)).toBeTruthy();
    expect(getByText(`층수: ${mockBuildingInfo.grndFlrCnt}층`)).toBeTruthy();
    expect(getByText('엘리베이터: 있음')).toBeTruthy();
    expect(getByTestId('building-image')).toBeTruthy();
  });

  it('renders no elevator warning correctly', () => {
    const noElevatorInfo = { ...mockBuildingInfo, rideUseElvtCnt: 0 };
    const { getByText, getByTestId } = render(
      <BuildingInfoCard buildingInfo={noElevatorInfo} isLoading={false} error={null} />
    );

    expect(getByText('엘리베이터: 없음')).toBeTruthy();
    expect(getByTestId('building-image')).toBeTruthy();
  });

  it('renders prompt to enter address when no building info is provided', () => {
    const { getByText } = render(
      <BuildingInfoCard buildingInfo={null} isLoading={false} error={null} />
    );

    expect(getByText('위 검색창에서 주소를 입력해주세요 (서울 지역 서비스)')).toBeTruthy();
  });
});