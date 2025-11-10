import React, { useState } from 'react';
import { Map, TrendingUp, Thermometer, Wind, Eye, Waves, Gauge, AlertTriangle, Navigation, Fish, Anchor, Compass } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

// --- Dados de Exemplo para Notificações ---
const mockNotifications = [
  { id: 1, type: 'success', title: 'Área Liberada', text: 'Zona Norte está liberada para pesca hoje', tag: 'Novo' },
  { id: 2, type: 'warning', title: 'Atenção ao Limite', text: 'Você atingiu 70% do limite mensal de robalos', tag: 'Importante' },
];

// --- Sistema de Alertas Integrado ---
interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
  isRead: boolean;
}

const AlertSystem: React.FC<{ weatherData: any }> = ({ weatherData }) => {
  const [alerts, setAlerts] = React.useState<Alert[]>([]);

  const generateAlerts = (weather: any): Alert[] => {
    if (!weather) return [];
    
    const newAlerts: Alert[] = [];
    const now = new Date().toISOString();
    const tempCelsius = Math.round(weather.main.temp - 273.15);
    const windSpeed = weather.wind.speed;
    const waveHeight = weather.waves?.height ? parseFloat(weather.waves.height) : 1.0;
    const visibility = weather.visibility / 1000;
    const pressure = weather.main.pressure;

    // Regras de alerta
    if (waveHeight > 3.0) {
        newAlerts.push({ id: `wave_high_${now}`, title: '⚠️ Ondas Altas', message: `Altura das ondas: ${waveHeight}m - Cuidado com embarcações pequenas`, type: 'warning', priority: 'high', timestamp: now, isRead: false });
    }
    if (windSpeed > 12.0) {
        newAlerts.push({ id: `wind_strong_${now}`, title: '🌪️ Ventos Muito Fortes', message: `Velocidade do vento: ${windSpeed}m/s - EVITE sair ao mar`, type: 'danger', priority: 'high', timestamp: now, isRead: false });
    }
    if (visibility < 5.0) {
        newAlerts.push({ id: `vis_low_${now}`, title: '🌫️ Baixa Visibilidade', message: `Visibilidade: ${visibility}km - Cuidado ao navegar`, type: 'warning', priority: 'medium', timestamp: now, isRead: false });
    }
    if (pressure < 1000) {
        newAlerts.push({ id: `pressure_low_${now}`, title: '📉 Pressão Baixa', message: 'Queda na pressão - Possível mudança no tempo', type: 'info', priority: 'medium', timestamp: now, isRead: false });
    }
    if (waveHeight < 1.0 && windSpeed < 5.0) {
        newAlerts.push({ id: `good_conditions_${now}`, title: '✅ Condições Ideais', message: 'Mar calmo e ventos fracos - Excelente para pesca!', type: 'success', priority: 'low', timestamp: now, isRead: false });
    }
    if (tempCelsius < 18) {
        newAlerts.push({ id: `cold_water_${now}`, title: '❄️ Água Fria', message: `Temperatura: ${tempCelsius}°C - Espécies podem estar em profundidade`, type: 'info', priority: 'low', timestamp: now, isRead: false });
    }

    return newAlerts;
  };

  React.useEffect(() => {
    if (weatherData) {
      const newAlerts = generateAlerts(weatherData);
      setAlerts(prev => [...newAlerts.filter(a => !prev.some(p => p.title === a.title)), ...prev].slice(0, 5));
    }
  }, [weatherData]);

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(alert => alert.id === id ? { ...alert, isRead: true } : alert));
  };

  const unreadAlerts = alerts.filter(alert => !alert.isRead);
  const highPriorityAlerts = alerts.filter(alert => alert.priority === 'high');

  const getAlertStyle = (type: string) => ({
    danger: 'bg-red-500/10 border-l-4 border-l-red-500 text-red-800',
    warning: 'bg-orange-500/10 border-l-4 border-l-orange-500 text-orange-800',
    info: 'bg-blue-500/10 border-l-4 border-l-blue-500 text-blue-800',
    success: 'bg-green-500/10 border-l-4 border-l-green-500 text-green-800',
  }[type] || 'bg-gray-50');

  if (alerts.length === 0) return null;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/10 rounded-lg"><AlertTriangle className="text-orange-500" size={24} /></div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Alertas do Sistema</h3>
            <p className="text-sm text-gray-600">Condições em tempo real</p>
          </div>
        </div>
        <div className="flex gap-3">
          {unreadAlerts.length > 0 && <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">{unreadAlerts.length} não lidos</span>}
          {highPriorityAlerts.length > 0 && <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">{highPriorityAlerts.length} críticos</span>}
        </div>
      </div>
      <div className="space-y-3">
        {alerts.slice(0, 3).map((alert) => (
          <div key={alert.id} className={`p-4 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${getAlertStyle(alert.type)} ${!alert.isRead ? 'opacity-100 shadow-sm' : 'opacity-60'}`} onClick={() => !alert.isRead && markAsRead(alert.id)}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold mb-1 text-sm">{alert.title}</h4>
                <p className="text-sm opacity-90">{alert.message}</p>
              </div>
              {!alert.isRead && <span className="w-3 h-3 bg-blue-500 rounded-full ml-2 mt-1 flex-shrink-0 animate-pulse"></span>}
            </div>
          </div>
        ))}
      </div>
      {alerts.length > 3 && <button className="w-full mt-4 text-center text-blue-600 hover:text-blue-800 text-sm font-medium py-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">Ver todos os {alerts.length} alertas</button>}
    </div>
  );
};

const WelcomeMessage: React.FC<{ userName: string }> = ({ userName }) => (
  <div className="mb-8">
    <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Bem-vindo, {userName}!</h2>
    <p className="text-gray-500 mt-2 text-lg">Acompanhe as condições e suas estatísticas de pesca</p>
  </div>
);

// --- COMPONENTE PARA ESTATÍSTICAS EDITÁVEIS ---
interface EditableStatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputType?: string;
}

const EditableStatCard: React.FC<EditableStatCardProps> = ({ icon, title, value, description, onChange, inputType = 'text' }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-gray-100 rounded-lg">{icon}</div>
          <h4 className="text-lg font-bold text-gray-800">{title}</h4>
        </div>
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          className="text-4xl font-bold text-blue-600 bg-transparent border-none focus:ring-0 w-full p-0 m-0"
          aria-label={`Valor para ${title}`}
        />
      </div>
      <p className="text-sm text-gray-500 mt-2">{description}</p>
    </div>
  );
};

// --- COMPONENTE SIMPLES PARA NOTIFICAÇÕES ---
const NotificationsCard = ({ notifications }: { notifications: any[] }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100">
    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
      <AlertTriangle className="text-orange-500" size={24} /> Notificações
    </h3>
    <div className="space-y-3">
      {notifications.map((notification) => (
        <div key={notification.id} className={`p-4 rounded-xl border-l-4 ${
          notification.type === 'success' ? 'border-l-green-500 bg-green-50' :
          notification.type === 'warning' ? 'border-l-orange-500 bg-orange-50' :
          'border-l-blue-500 bg-blue-50'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-gray-800">{notification.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{notification.text}</p>
            </div>
            {notification.tag && (
              <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {notification.tag}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Funções de ajuda
const getFishingRecommendation = (weatherData: any) => {
    if (!weatherData) return { level: 'unknown', message: 'Clique no mapa para ver condições', color: 'from-gray-500 to-gray-600', icon: '🗺️' };
    const windSpeed = weatherData.wind.speed;
    const waveHeight = weatherData.waves?.height ? parseFloat(weatherData.waves.height) : 1.0;
    const visibility = weatherData.visibility / 1000;
    if (windSpeed > 12 || waveHeight > 3.0) return { level: 'danger', message: '⚠️ Condições perigosas - EVITE pescar hoje', color: 'from-red-500 to-rose-600', icon: '🚫' };
    if (windSpeed > 8 || waveHeight > 2.0 || visibility < 5) return { level: 'warning', message: '🔶 Condições moderadas - Cuidado com vento e ondas', color: 'from-amber-500 to-orange-500', icon: '⚠️' };
    if (windSpeed < 5 && waveHeight < 1.5 && visibility > 10) return { level: 'excellent', message: '✅ Condições excelentes para pesca!', color: 'from-emerald-500 to-green-600', icon: '🌟' };
    return { level: 'good', message: '👍 Condições boas para pesca', color: 'from-blue-500 to-cyan-600', icon: '👍' };
};

const getWindDirection = (deg: number) => {
    const directions = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO'];
    return directions[Math.round(deg / 45) % 8];
};

// --- COMPONENTE PRINCIPAL DO DASHBOARD ---
const Dashboard: React.FC = () => { // REMOVE DashboardProps
  const navigate = useNavigate(); // ADICIONE ESTE HOOK
  const { weatherData, clickedLocation, loading } = useAppContext();

  // --- ESTADO PARA ARMAZENAR OS DADOS EDITÁVEIS DO USUÁRIO ---
  const [fishCount, setFishCount] = useState('28');
  const [kmNavigated, setKmNavigated] = useState('156');
  const [areasVisited, setAreasVisited] = useState('12');

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados meteorológicos...</p>
        </div>
      </div>
    );
  }

  const recommendation = getFishingRecommendation(weatherData);

  const MetricCard = ({ icon, value, label, subtitle, color }: any) => (
    <div className={`bg-gradient-to-br ${color} p-4 rounded-2xl text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
      <div className="text-white mb-2 flex justify-center">{icon}</div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-white/90 text-sm font-medium">{label}</p>
      {subtitle && <p className="text-white/80 text-xs mt-1">{subtitle}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                <img src="pesca_azul.svg" alt="pesca_azul_logo"className='w-10 h-10 lg:w-12 lg:h-12 object-contain' />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Pesca Azul
                </h1>
                <p className="text-gray-600 text-sm">Monitoramento inteligente</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/map')} // MUDE PARA navigate
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
              >
                <Map size={20} /> Explorar Mapa
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto space-y-8">
        <WelcomeMessage userName="Pescador" />
        
        <AlertSystem weatherData={weatherData} />
        
        {weatherData && clickedLocation ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">🌊 Condições Atuais</h3>
                <p className="text-gray-600 text-lg">
                  <Compass className="inline mr-2" size={18} /> 
                  {clickedLocation.name || `Local (${clickedLocation.lat.toFixed(4)}, ${clickedLocation.lng.toFixed(4)})`} 
                </p>
              </div>
              <div className={`px-6 py-3 rounded-full text-white font-bold bg-gradient-to-r ${recommendation.color} shadow-lg flex items-center gap-2`}>
                <span className="text-lg">{recommendation.icon}</span>
                {recommendation.level === 'excellent' && '🌟 Ótimo para Pesca'}
                {recommendation.level === 'good' && '👍 Bom para Pesca'}
                {recommendation.level === 'warning' && '⚠️ Cuidado'}
                {recommendation.level === 'danger' && '🚫 Evitar Pesca'}
                {recommendation.level === 'unknown' && '🗺️ Selecione no Mapa'}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <MetricCard 
                icon={<Thermometer size={28} />} 
                value={`${Math.round(weatherData.main.temp - 273.15)}°C`} 
                label="Temperatura" 
                color="from-blue-500 to-cyan-500" 
              />
              <MetricCard 
                icon={<Wind size={28} />} 
                value={`${weatherData.wind.speed} m/s`} 
                label="Vento" 
                subtitle={getWindDirection(weatherData.wind.deg)} 
                color="from-green-500 to-emerald-500" 
              />
              <MetricCard 
                icon={<Waves size={28} />} 
                value={`${weatherData.waves?.height || '1.0'}m`} 
                label="Ondas" 
                color="from-purple-500 to-violet-500" 
              />
              <MetricCard 
                icon={<Gauge size={28} />} 
                value={`${weatherData.waves?.period || '6'}s`} 
                label="Período" 
                color="from-amber-500 to-orange-500" 
              />
              <MetricCard 
                icon={<Eye size={28} />} 
                value={`${(weatherData.visibility / 1000).toFixed(1)}km`} 
                label="Visibilidade" 
                color="from-indigo-500 to-blue-500" 
              />
              <MetricCard 
                icon={<Gauge size={28} />} 
                value={`${weatherData.main.pressure}hPa`} 
                label="Pressão" 
                color="from-rose-500 to-pink-500" 
              />
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center border border-gray-100">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Map className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Nenhuma Localização Selecionada</h3>
            <p className="text-gray-600 mb-6 text-lg">Clique no mapa para selecionar uma área e ver as condições em tempo real</p>
            <button 
              onClick={() => navigate('/map')} // MUDE PARA navigate
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Map className="inline mr-2" size={20} /> Abrir Mapa Interativo
            </button>
          </div>
        )}

        {/* --- SEÇÃO DE ESTATÍSTICAS PESSOAIS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <EditableStatCard
            title="Peixes Este Mês"
            value={fishCount}
            onChange={(e) => setFishCount(e.target.value)}
            description="Total de peixes capturados"
            icon={<Fish className="text-blue-500" size={24} />}
            inputType="number"
          />
          <EditableStatCard
            title="Km Navegados"
            value={kmNavigated}
            onChange={(e) => setKmNavigated(e.target.value)}
            description="Distância total este mês"
            icon={<Navigation className="text-green-500" size={24} />}
            inputType="number"
          />
          <EditableStatCard
            title="Áreas Visitadas"
            value={areasVisited}
            onChange={(e) => setAreasVisited(e.target.value)}
            description="Diferentes zonas de pesca"
            icon={<Compass className="text-purple-500" size={24} />}
            inputType="number"
          />
        </div>

        {/* --- Notificações e Cards Adicionais --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <NotificationsCard notifications={mockNotifications} />
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="text-blue-500" size={24} /> Suas Estatísticas
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                <span className="text-gray-600 font-medium">Melhor Dia de Pesca:</span>
                <span className="font-semibold text-gray-800">Sábado</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <span className="text-gray-600 font-medium">Espécie Mais Capturada:</span>
                <span className="font-semibold text-gray-800">Robalo</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                <span className="text-gray-600 font-medium">Horário de Pico:</span>
                <span className="font-semibold text-gray-800">05:00 - 07:00</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl">
                <span className="text-gray-600 font-medium">Zona Preferida:</span>
                <span className="font-semibold text-gray-800">Zona Norte</span>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => navigate('/map')} // MUDE PARA navigate
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-5 px-6 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 text-lg"
        >
          <Map size={24} /> Explorar Mapa de Zonas e Condições
        </button>
      </main>
    </div>
  );
};

export default Dashboard;