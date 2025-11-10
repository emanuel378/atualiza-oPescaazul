export interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  visibility: number;
}

export interface FishingZone {
  id: string;
  name: string;
  type: 'safe' | 'attention' | 'prohibited';
  coordinates: [number, number][];
  schedule: string;
  status: string;
}