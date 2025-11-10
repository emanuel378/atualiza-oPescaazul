import React from 'react';
import { ArrowLeft, MapPin, Navigation, Compass, Anchor } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import WeatherPanel from '../components/WeatherPanel';
import EmergencyButton from '../components/EmergencyButton';
import Legend from '../components/Legend';
import { useAppContext } from '../context/AppContext';
import NotificationBell from '../notifications/NotificationBell';
import { useNavigate } from 'react-router-dom';

const MapScreen: React.FC = () => {
  const navigate = useNavigate();
  const { weatherData, clickedLocation, loading, fetchWeatherData } = useAppContext();

  // FUNÇÃO SIMPLIFICADA E CORRIGIDA
  const handleMapClick = (lat: number, lng: number) => {
    // Agora, simplesmente chamamos a função para buscar os dados.
    // A lógica de alerta foi removida.
    fetchWeatherData(lat, lng);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                        <Anchor className="text-white" size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            Pesca Azul
                        </h1>
                        <p className="text-gray-600 text-sm">Navegue por todo o litoral brasileiro</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <NotificationBell />
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
                    >
                        <ArrowLeft size={20} />
                        Voltar ao Dashboard
                    </button>
                </div>
            </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Banner e Localização */}
        {!clickedLocation && (
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-2xl mb-6 text-center shadow-lg">
              <div className="flex items-center justify-center gap-3">
                  <Compass size={24} />
                  <p className="text-lg font-medium">🌊 Clique em qualquer ponto do litoral brasileiro para ver as condições da área</p>
              </div>
          </div>
        )}

        {clickedLocation && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-2xl mb-6 shadow-lg">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg"><MapPin size={20} /></div>
                    <div>
                        <p className="font-bold text-lg">📍 Visualizando dados para: {clickedLocation.name}</p>
                        <p className="text-sm opacity-90 font-medium">
                            <Navigation className="inline mr-1" size={14} />
                            Coordenadas: {clickedLocation.lat.toFixed(4)}, {clickedLocation.lng.toFixed(4)}
                        </p>
                    </div>
                </div>
                <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">Local Selecionado</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <WeatherPanel weatherData={weatherData} clickedLocation={clickedLocation} loading={loading} />
            <EmergencyButton />
            <Legend />
          </div>

          {/* Área do Mapa */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <MapPin className="text-blue-500" size={24} />
                    Mapa Interativo
                </h2>
                <p className="text-gray-600 mt-1">Clique em uma área para ver as condições de pesca.</p>
            </div>
            <div className="h-[600px] rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
              <MapComponent
                weatherData={weatherData}
                onMapClick={handleMapClick}
                clickedLocation={clickedLocation}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapScreen;