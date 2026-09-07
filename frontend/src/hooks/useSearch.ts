import { useMemo } from 'react';
import { STATIONS } from '@/utils/mockData';

export function useSearch() {
  const searchStations = useMemo(
    () => (query: string) => {
      if (!query) return STATIONS;
      const q = query.toLowerCase();
      return STATIONS.filter(
        (s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.city.toLowerCase().includes(q)
      );
    },
    []
  );

  const getStationByCode = useMemo(
    () => (code: string) => STATIONS.find((s) => s.code === code),
    []
  );

  return { searchStations, getStationByCode };
}