"use client";

import { useState, useEffect, useCallback } from "react";

type GeolocationState = {
  lat: number | null;
  lon: number | null;
  error: string | null;
  isLoading: boolean;
};

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lon: null,
    error: null,
    isLoading: true,
  });

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "브라우저가 위치 정보를 지원하지 않습니다",
        isLoading: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          error: null,
          isLoading: false,
        });
      },
      (error) => {
        let errorMessage = "위치 정보를 가져올 수 없습니다";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "위치 정보 접근이 거부되었습니다";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "위치 정보를 사용할 수 없습니다";
            break;
          case error.TIMEOUT:
            errorMessage = "위치 정보 요청 시간이 초과되었습니다";
            break;
        }

        setState({
          lat: null,
          lon: null,
          error: errorMessage,
          isLoading: false,
        });
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 600000,
      }
    );
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return { ...state, retry: getLocation };
};
