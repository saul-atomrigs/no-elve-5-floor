import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const fetchBuildingInfo = async (
  sigunguCd: string,
  bjdongCd: string,
  platGbCd: string,
  bun: string,
  ji: string
) => {
  const { data } = await axios.get(
    `https://apis.data.go.kr/1613000/BldRgstService_v2/getBrTitleInfo`, 
    {
      params: {
        sigunguCd,
        bjdongCd,
        platGbCd,
        bun,
        ji,
        numOfRows: 1,
        pageNo: 1,
        _type: 'json',
        serviceKey: process.env.EXPO_PUBLIC_BUILDING_INFO_API_KEY
      },
      data: undefined
    }
  );

  if (data.response.body.totalCount === 0 || !data.response.body.items.item) {
    throw new Error('아무 주소도 찾지 못했습니다. 다시 입력해주세요.');
  }

  console.log('data.response.body.items.item', data.response.body.items.item);
  return data.response.body.items.item;
};

const useBuildingInfo = (
  sigunguCd: string,
  bjdongCd: string,
  platGbCd: string,
  bun: string,
  ji: string
) => {
  return useQuery({
    queryKey: ['buildingInfo', sigunguCd, bjdongCd, platGbCd, bun, ji],
    queryFn: () => fetchBuildingInfo(sigunguCd, bjdongCd, platGbCd, bun, ji),
    enabled: !!sigunguCd && !!bjdongCd && !!platGbCd && !!bun && !!ji,
  });
};

export default useBuildingInfo;