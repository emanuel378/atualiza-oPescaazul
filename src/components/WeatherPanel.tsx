import React from 'react';

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

interface WeatherPanelProps {
  weatherData: WeatherData | null;
  clickedLocation: ClickedLocation | null;
  loading: boolean;
}

// Função para identificar a região brasileira baseada nas coordenadas
const getBrazilianRegion = (lat: number, lng: number): { region: string; state: string } => {
  if (lat > 4.0) return { region: 'Norte', state: 'Amapá' };
  if (lat > 1.0) return { region: 'Norte', state: 'Pará' };
  if (lat > -2.5) return { region: 'Nordeste', state: 'Maranhão' };
  if (lat > -5.0) return { region: 'Nordeste', state: 'Piauí/Ceará' };
  if (lat > -7.5) return { region: 'Nordeste', state: 'Rio Grande do Norte' };
  if (lat > -8.5) return { region: 'Nordeste', state: 'Paraíba' };
  if (lat > -9.5) return { region: 'Nordeste', state: 'Pernambuco' };
  if (lat > -10.5) return { region: 'Nordeste', state: 'Alagoas' };
  if (lat > -12.0) return { region: 'Nordeste', state: 'Sergipe' };
  if (lat > -16.0) return { region: 'Nordeste', state: 'Bahia' };
  if (lat > -19.0) return { region: 'Sudeste', state: 'Espírito Santo' };
  if (lat > -21.5) return { region: 'Sudeste', state: 'Rio de Janeiro' };
  if (lat > -24.5) return { region: 'Sudeste', state: 'São Paulo' };
  if (lat > -26.0) return { region: 'Sul', state: 'Paraná' };
  if (lat > -28.5) return { region: 'Sul', state: 'Santa Catarina' };
  return { region: 'Sul', state: 'Rio Grande do Sul' };
};

// Função para obter emoji da região
const getRegionEmoji = (region: string): string => {
  const emojis: { [key: string]: string } = {
    'Norte': '🌴',
    'Nordeste': '☀️',
    'Sudeste': '🏙️',
    'Sul': '🥶'
  };
  return emojis[region] || '🌊';
};

// Função para obter recomendação de pesca baseada em múltiplos fatores - CORRIGIDA
const getFishingRecommendation = (weatherData: WeatherData) => {
  const windSpeed = weatherData.wind.speed;
  const waveHeight = weatherData.waves?.height ? parseFloat(weatherData.waves.height.toString()) : 1.0;
  const visibility = weatherData.visibility / 1000; // em km
  
  if (windSpeed > 12 || waveHeight > 3.0) {
    return {
      level: 'danger',
      message: '⚠️ Condições perigosas - EVITE pescar hoje',
      color: 'from-red-500 to-red-600'
    };
  } else if (windSpeed > 8 || waveHeight > 2.0 || visibility < 5) {
    return {
      level: 'warning',
      message: '🔶 Condições moderadas - Cuidado com vento e ondas',
      color: 'from-yellow-500 to-orange-500'
    };
  } else if (windSpeed < 5 && waveHeight < 1.5 && visibility > 10) {
    return {
      level: 'excellent',
      message: '✅ Condições excelentes para pesca!',
      color: 'from-green-500 to-green-600'
    };
  } else {
    return {
      level: 'good',
      message: '👍 Condições boas para pesca',
      color: 'from-blue-500 to-blue-600'
    };
  }
};

const WeatherPanel: React.FC<WeatherPanelProps> = ({ weatherData, clickedLocation, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">🌊 Analisando Área</h3>
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Buscando dados meteorológicos...</span>
        </div>
      </div>
    );
  }

  if (!weatherData || !clickedLocation) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Condições do Mar</h3>
        <div className="text-center text-gray-500 py-8">
          <div className="text-4xl mb-3">🌎</div>
          <p className="text-sm">Clique em qualquer área marítima do litoral brasileiro</p>
          <p className="text-xs mt-2">para ver as condições meteorológicas em tempo real</p>
        </div>
      </div>
    );
  }

  const tempCelsius = Math.round(weatherData.main.temp - 273.15);
  const windDirection = (deg: number) => {
    const directions = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO'];
    return directions[Math.round(deg / 45) % 8];
  };

  const { region, state } = getBrazilianRegion(clickedLocation.lat, clickedLocation.lng);
  const regionEmoji = getRegionEmoji(region);
  const recommendation = getFishingRecommendation(weatherData);

  // Verificação segura para dados das ondas
  const waveHeight = weatherData.waves?.height ? parseFloat(weatherData.waves.height.toString()) : null;
  const wavePeriod = weatherData.waves?.period;
  const waveDirection = weatherData.waves?.direction;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        🌊 Condições Marítimas
      </h3>
      
      {/* Localização e Região */}
      <div className="mb-4 space-y-2">
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-600 font-semibold">📍 {clickedLocation.name}</p>
          <p className="text-xs text-blue-500">
            Lat: {clickedLocation.lat.toFixed(4)}, Lng: {clickedLocation.lng.toFixed(4)}
          </p>
        </div>
        <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
          <p className="text-sm font-semibold text-gray-700">
            {regionEmoji} {region} - {state}
          </p>
        </div>
      </div>

      {/* Dados Principais */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-600 font-medium">🌡️ Temperatura</p>
          <p className="text-xl font-bold text-blue-700">{tempCelsius}°C</p>
          <p className="text-xs text-blue-500 mt-1">
            {tempCelsius > 28 ? 'Quente' : tempCelsius > 22 ? 'Agradável' : 'Fresco'}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
          <p className="text-xs text-green-600 font-medium">☁️ Condição</p>
          <p className="text-lg font-bold text-green-700 capitalize">{weatherData.weather[0].description}</p>
        </div>
      </div>

      {/* Dados do Vento */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
          💨 Vento
          <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
            weatherData.wind.speed < 5 ? 'bg-green-100 text-green-800' :
            weatherData.wind.speed < 10 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {weatherData.wind.speed < 5 ? 'Calmo' : 
             weatherData.wind.speed < 10 ? 'Moderado' : 'Forte'}
          </span>
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 p-3 rounded-lg border">
            <p className="text-xs text-gray-600">Velocidade</p>
            <p className="text-lg font-bold text-gray-800">{weatherData.wind.speed} m/s</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border">
            <p className="text-xs text-gray-600">Direção</p>
            <p className="text-lg font-bold text-gray-800">
              {windDirection(weatherData.wind.deg)} 
              <span className="text-sm text-gray-600 ml-1">({weatherData.wind.deg}°)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Dados das Ondas - COM VERIFICAÇÃO SEGURA */}
      {weatherData.waves && (
        <div className="mb-4">    
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
            🌊 Ondas
            <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
              waveHeight && waveHeight < 1.0 ? 'bg-green-100 text-green-800' :
              waveHeight && waveHeight < 2.0 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {waveHeight && waveHeight < 1.0 ? 'Calmas' : 
               waveHeight && waveHeight < 2.0 ? 'Moderadas' : 'Altas'}
            </span>
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
              <p className="text-xs text-blue-600">Altura</p>
              <p className="text-lg font-bold text-blue-700">
                {waveHeight ? `${waveHeight}m` : 'N/A'}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center">
              <p className="text-xs text-green-600">Período</p>
              <p className="text-lg font-bold text-green-700">
                {wavePeriod ? `${wavePeriod}s` : 'N/A'}
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 text-center">
              <p className="text-xs text-purple-600">Direção</p>
              <p className="text-lg font-bold text-purple-700">
                {waveDirection ? `${waveDirection}°` : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Outros Dados */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-700 mb-3">📊 Dados Adicionais</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <p className="text-xs text-yellow-600">Pressão Atmosférica</p>
            <p className="text-lg font-bold text-yellow-700">{weatherData.main.pressure} hPa</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
            <p className="text-xs text-purple-600">Umidade</p>
            <p className="text-lg font-bold text-purple-700">{weatherData.main.humidity}%</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border col-span-2">
            <p className="text-xs text-gray-600">Visibilidade</p>
            <p className="text-lg font-bold text-gray-800">{(weatherData.visibility / 1000).toFixed(1)} km</p>
            <p className="text-xs text-gray-500 mt-1">
              {weatherData.visibility > 10000 ? 'Excelente' : 
               weatherData.visibility > 5000 ? 'Boa' : 'Limitada'}
            </p>
          </div>
        </div>
      </div>

      {/* Recomendação de Pesca */}
      <div className={`mt-4 p-4 bg-gradient-to-r ${recommendation.color} text-white rounded-lg shadow-md`}>
        <h4 className="font-semibold mb-2 text-lg">🎣 Recomendação para Pesca</h4>
        <p className="text-sm mb-2">{recommendation.message}</p>
        <div className="text-xs opacity-90">
          {recommendation.level === 'excellent' && '• Vento calmo • Mar tranquilo • Boa visibilidade'}
          {recommendation.level === 'good' && '• Condições estáveis • Observar mudanças'}
          {recommendation.level === 'warning' && '• Cuidado com vento • Ondas moderadas'}
          {recommendation.level === 'danger' && '• Vento forte • Mar agitado • Evitar saída'}
        </div>
      </div>

      {/* Dica de Pesca Regional */}
      <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
        <p className="text-xs text-orange-700 font-medium">💡 Dica Regional</p>
        <p className="text-xs text-orange-600">
          {region === 'Norte' && 'Águas ricas em espécies como tucunaré e pirarucu.'}
          {region === 'Nordeste' && 'Ideal para pesca oceânica de atuns e cavalas.'}
          {region === 'Sudeste' && 'Grande diversidade de espécies costeiras.'}
          {region === 'Sul' && 'Águas frias ricas em pescada e corvina.'}
        </p>
      </div>
    </div>
  );
};

export default WeatherPanel;