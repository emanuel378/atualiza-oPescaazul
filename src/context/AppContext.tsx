import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface WeatherData {
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
  coord: {
    lat: number;
    lon: number;
  };
  waves?: {
    height: number;
    period: number;
    direction: number;
  };
}

interface ClickedLocation {
  lat: number;
  lng: number;
  name?: string;
}

interface AppContextType {
  weatherData: WeatherData | null;
  clickedLocation: ClickedLocation | null;
  loading: boolean;
  setWeatherData: (data: WeatherData | null) => void;
  setClickedLocation: (location: ClickedLocation | null) => void;
  setLoading: (loading: boolean) => void;
  fetchWeatherData: (lat: number, lng: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [clickedLocation, setClickedLocation] = useState<ClickedLocation | null>(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = '41898cad7ded832c1c9bd21a3bf9c7a5';

  const generateMockWeatherData = (lat: number, lng: number): WeatherData => {
    let baseTemp = 25;
    let baseWind = 3;
    let weatherCondition = 'Clear';
    
    if (lat < -20) {
      baseTemp = 18 + Math.random() * 8;
      baseWind = 4 + Math.random() * 6;
      weatherCondition = Math.random() > 0.7 ? 'Clouds' : 'Clear';
    } else if (lat < -10) {
      baseTemp = 22 + Math.random() * 6;
      baseWind = 3 + Math.random() * 4;
      weatherCondition = Math.random() > 0.6 ? 'Clouds' : 'Clear';
    } else if (lat < 0) {
      baseTemp = 26 + Math.random() * 4;
      baseWind = 2 + Math.random() * 3;
      weatherCondition = Math.random() > 0.8 ? 'Clouds' : 'Clear';
    } else {
      baseTemp = 28 + Math.random() * 3;
      baseWind = 1 + Math.random() * 2;
      weatherCondition = Math.random() > 0.9 ? 'Rain' : 'Clear';
    }

    const waveData = {
      height: parseFloat((Math.random() * 2.5 + 0.5).toFixed(1)),
      period: parseFloat((Math.random() * 8 + 4).toFixed(1)),
      direction: Math.floor(Math.random() * 360)
    };

    return {
      name: `Área Oceânica ${lat.toFixed(2)}°S ${Math.abs(lng).toFixed(2)}°W`,
      main: {
        temp: baseTemp + 273.15,
        humidity: 60 + Math.floor(Math.random() * 30),
        pressure: 1010 + Math.floor(Math.random() * 20)
      },
      weather: [{
        main: weatherCondition,
        description: weatherCondition === 'Clear' ? 'céu limpo' : 
                    weatherCondition === 'Clouds' ? 'nublado' : 'chuva leve',
        icon: '01d'
      }],
      wind: {
        speed: baseWind + Math.random() * 2,
        deg: Math.floor(Math.random() * 360)
      },
      visibility: 10000 + Math.floor(Math.random() * 15000),
      coord: {
        lat: lat,
        lon: lng
      },
      waves: waveData
    };
  };

  const fetchWeatherData = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&lang=pt_br`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        const waveData = {
          height: parseFloat((Math.random() * 2.5 + 0.5).toFixed(1)),
          period: parseFloat((Math.random() * 8 + 4).toFixed(1)),
          direction: Math.floor(Math.random() * 360)
        };
        
        setWeatherData({
          ...data,
          waves: waveData
        });
        
        setClickedLocation({
          lat: lat,
          lng: lng,
          name: data.name || `Local (${lat.toFixed(4)}, ${lng.toFixed(4)})`
        });
      } else {
        const mockData = generateMockWeatherData(lat, lng);
        setWeatherData(mockData);
        setClickedLocation({
          lat: lat,
          lng: lng,
          name: mockData.name
        });
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      const mockData = generateMockWeatherData(lat, lng);
      setWeatherData(mockData);
      setClickedLocation({
        lat: lat,
        lng: lng,
        name: mockData.name
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    // Carrega dados iniciais para Salvador, BA
    fetchWeatherData(-12.9714, -38.5014);
  }, []);

  const value: AppContextType = {
    weatherData,
    clickedLocation,
    loading,
    setWeatherData,
    setClickedLocation,
    setLoading,
    fetchWeatherData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};