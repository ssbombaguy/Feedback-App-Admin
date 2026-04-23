import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '../api/api';

export const usePupils = () => {
  return useQuery({
    queryKey: ['pupils'],
    queryFn: adminAPI.getPupils,
    staleTime: 5 * 60 * 1000, 
    refetchOnWindowFocus: true,
  });
};