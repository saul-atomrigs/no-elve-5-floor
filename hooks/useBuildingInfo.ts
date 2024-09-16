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
        serviceKey: '60nrUJ6d8patgnInsKZYZVg+cszwYk4rTghKElOIhAfSJeWSy9rLVO8gjvmpHWJmCtAqxtzQoNF8QuSSNgzqXA=='
      }
    }
  );
  return data.response.body.items.item;
};

export const useBuildingInfo = (
  sigunguCd: string,
  bjdongCd: string,
  platGbCd: string,
  bun: string,
  ji: string
) => {
  return useQuery({
    queryKey: ['buildingInfo', sigunguCd, bjdongCd, platGbCd, bun, ji],
    queryFn: () => fetchBuildingInfo(sigunguCd, bjdongCd, platGbCd, bun, ji),
  });
};
