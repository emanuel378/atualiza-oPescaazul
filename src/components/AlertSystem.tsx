import React, { useState, useEffect } from 'react';

// Tipos
interface WeatherData {
  temperature: number;
  windSpeed: number;
  windDirection: number;
  waveHeight: number;
  wavePeriod: number;
  visibility: number;
  pressure: number;
}

interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
  isRead: boolean;
}

// Serviço de Alertas
class AlertGenerator {
  static generateAlerts(weather: WeatherData): Alert[] {
    const alerts: Alert[] = [];
    const now = new Date().toISOString();

    // Regras de alerta
    if (weather.waveHeight > 3.0) {
      alerts.push({
        id: `wave_${now}`,
        title: '⚠️ Ondas Altas',
        message: `Altura das ondas: ${weather.waveHeight}m - Cuidado com embarcações pequenas`,
        type: 'warning',
        priority: 'high',
        timestamp: now,
        isRead: false
      });
    }

    if (weather.waveHeight > 4.0) {
      alerts.push({
        id: `high_wave_${now}`,
        title: '🚨 Ondas Muito Altas',
        message: `Altura das ondas: ${weather.waveHeight}m - Condições perigosas!`,
        type: 'danger',
        priority: 'high',
        timestamp: now,
        isRead: false
      });
    }

    if (weather.windSpeed > 8.0) {
      alerts.push({
        id: `wind_${now}`,
        title: '💨 Ventos Fortes',
        message: `Velocidade do vento: ${weather.windSpeed}m/s - Atenção à navegação`,
        type: 'warning',
        priority: 'medium',
        timestamp: now,
        isRead: false
      });
    }

    if (weather.visibility < 5.0) {
      alerts.push({
        id: `vis_${now}`,
        title: '🌫️ Baixa Visibilidade',
        message: `Visibilidade: ${weather.visibility}km - Cuidado ao navegar`,
        type: 'warning',
        priority: 'medium',
        timestamp: now,
        isRead: false
      });
    }

    if (weather.waveHeight < 1.0 && weather.windSpeed < 5.0) {
      alerts.push({
        id: `good_${now}`,
        title: '✅ Condições Ideais',
        message: 'Mar calmo e ventos fracos - Excelente para pesca!',
        type: 'success',
        priority: 'low',
        timestamp: now,
        isRead: false
      });
    }

    if (weather.pressure < 1000) {
      alerts.push({
        id: `pressure_${now}`,
        title: '📉 Pressão Baixa',
        message: 'Queda na pressão - Possível mudança no tempo',
        type: 'info',
        priority: 'medium',
        timestamp: now,
        isRead: false
      });
    }

    return alerts;
  }

  static getFishingAdvice(weather: WeatherData): string {
    if (weather.waveHeight > 3.0 || weather.windSpeed > 10.0) {
      return '⚠️ Condições desfavoráveis - Recomenda-se adiar a pesca';
    }
    if (weather.waveHeight < 1.5 && weather.windSpeed < 5.0) {
      return '✅ Condições excelentes para pesca!';
    }
    return '🔸 Condições moderadas - Fique atento às mudanças';
  }
}

// Componente Principal
const AlertSystem: React.FC<{ weatherData: WeatherData }> = ({ weatherData }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (weatherData) {
      const newAlerts = AlertGenerator.generateAlerts(weatherData);
      setAlerts(prev => {
        // Evitar duplicatas
        const existingIds = new Set(prev.map(a => a.id.split('_')[0]));
        const uniqueNewAlerts = newAlerts.filter(alert => 
          !existingIds.has(alert.id.split('_')[0])
        );
        return [...uniqueNewAlerts, ...prev].slice(0, 10); // Limitar a 10 alertas
      });
    }
  }, [weatherData]);

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, isRead: true } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
  };

  const unreadAlerts = alerts.filter(alert => !alert.isRead);
  const highPriorityAlerts = alerts.filter(alert => alert.priority === 'high');
  const displayedAlerts = showAll ? alerts : alerts.slice(0, 3);

  const getAlertStyle = (type: string) => {
    const styles = {
      danger: 'bg-red-50 border-red-300 text-red-800',
      warning: 'bg-yellow-50 border-yellow-300 text-yellow-800',
      info: 'bg-blue-50 border-blue-300 text-blue-800',
      success: 'bg-green-50 border-green-300 text-green-800'
    };
    return styles[type as keyof typeof styles] || 'bg-gray-50';
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Cabeçalho com Estatísticas */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Sistema de Alertas</h1>
            <p className="text-gray-600">Alertas baseados nas condições do mar</p>
          </div>
          <div className="flex gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{unreadAlerts.length}</div>
              <div className="text-sm text-gray-600">Não lidos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{highPriorityAlerts.length}</div>
              <div className="text-sm text-gray-600">Críticos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{alerts.length}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
        </div>

        {/* Recomendação */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Recomendação para Pesca:</h3>
          <p className="text-blue-700">{AlertGenerator.getFishingAdvice(weatherData)}</p>
        </div>
      </div>

      {/* Lista de Alertas */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Alertas Recentes</h2>
          <div className="flex gap-2">
            {unreadAlerts.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Marcar todos como lidos
              </button>
            )}
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              {showAll ? 'Ver menos' : 'Ver todos'}
            </button>
          </div>
        </div>

        <div className="divide-y">
          {displayedAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 border-l-4 cursor-pointer transition-all ${
                getAlertStyle(alert.type)
              } ${!alert.isRead ? 'opacity-100' : 'opacity-70'}`}
              onClick={() => !alert.isRead && markAsRead(alert.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{alert.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {formatTime(alert.timestamp)}
                  </span>
                  {!alert.isRead && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </div>
              </div>
              <p className="text-sm">{alert.message}</p>
              <div className="flex justify-between items-center mt-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                  alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {alert.priority === 'high' ? 'Alta' : 
                   alert.priority === 'medium' ? 'Média' : 'Baixa'} prioridade
                </span>
                {alert.isRead && (
                  <span className="text-xs text-gray-500">Lido</span>
                )}
              </div>
            </div>
          ))}

          {alerts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum alerta no momento</p>
              <p className="text-sm">As condições estão estáveis</p>
            </div>
          )}
        </div>
      </div>

      {/* Resumo das Condições Atuais */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Condições Atuais</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Ondas:</span>
            <span className="ml-2 font-semibold">{weatherData.waveHeight}m</span>
          </div>
          <div>
            <span className="text-gray-600">Vento:</span>
            <span className="ml-2 font-semibold">{weatherData.windSpeed}m/s</span>
          </div>
          <div>
            <span className="text-gray-600">Visibilidade:</span>
            <span className="ml-2 font-semibold">{weatherData.visibility}km</span>
          </div>
          <div>
            <span className="text-gray-600">Pressão:</span>
            <span className="ml-2 font-semibold">{weatherData.pressure}hPa</span>
          </div>
          <div>
            <span className="text-gray-600">Temperatura:</span>
            <span className="ml-2 font-semibold">{weatherData.temperature}°C</span>
          </div>
          <div>
            <span className="text-gray-600">Período das ondas:</span>
            <span className="ml-2 font-semibold">{weatherData.wavePeriod}s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertSystem;