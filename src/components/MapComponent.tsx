import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para ícones do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Ícone personalizado para localização clicada
const clickedIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiMzODg0RkYiIHN0cm9rZT0iIzI1NjNEQiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjQiIGZpbGw9IiNGRkZGRkYiLz4KPC9zdmc+',
  iconSize: [25, 25],
  iconAnchor: [12, 12],
});

// Ícone personalizado para tanques (locais favoritos)
const tankIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNGRjcxMTEiIHN0cm9rZT0iI0JGNTAwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik05IDEySDZNMTIgN1YxN00xOCAxMkgxNSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjwvc3ZnPg==',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

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

interface FishingTank {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
  species: string[];
  created: Date;
}

interface MapComponentProps {
  weatherData: WeatherData | null;
  onMapClick: (lat: number, lng: number) => void;
  clickedLocation: ClickedLocation | null;
}

// Componente para detectar cliques no mapa
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onMapClick(lat, lng);
    },
  });
  return null;
}

const MapComponent: React.FC<MapComponentProps> = ({ weatherData, onMapClick, clickedLocation }) => {
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([-23.9608, -46.3332]);
  const [fishingTanks, setFishingTanks] = useState<FishingTank[]>([]);

  const fishingZones = [
    {
      id: '1',
      name: 'Zona Norte - Santos',
      type: 'safe',
      coordinates: [[-23.92, -46.30], [-23.92, -46.25], [-23.97, -46.25], [-23.97, -46.30]],
      schedule: 'Segunda a Domingo: 05:00-19:00',
      status: 'Liberada'
    },
    {
      id: '2',
      name: 'Zona Central - Litoral',
      type: 'attention',
      coordinates: [[-24.00, -46.40], [-24.00, -46.35], [-24.05, -46.35], [-24.05, -46.40]],
      schedule: 'Segunda a Sexta: 05:00-15:00',
      status: 'Cuidado - Correntes fortes'
    },
    {
      id: '3',
      name: 'Zona de Preservação - Ilha',
      type: 'prohibited',
      coordinates: [[-23.82, -45.35], [-23.82, -45.30], [-23.87, -45.30], [-23.87, -45.35]],
      schedule: 'Proibida permanentemente',
      status: 'Área de preservação ambiental'
    }
  ];

  const getZoneStyle = (type: string) => {
    const colors = {
      safe: 'green',
      attention: 'yellow',
      prohibited: 'red'
    };
    
    const color = colors[type as keyof typeof colors] || 'blue';
    
    return {
      fillColor: color,
      color: color,
      weight: 2,
      opacity: 0.7,
      fillOpacity: 0.15
    };
  };

  // Função para adicionar tanque
  const addFishingTank = (lat: number, lng: number) => {
    const tankName = prompt('Nome do seu local de pesca favorito:');
    if (tankName) {
      const description = prompt('Descrição (opcional):') || '';
      const newTank: FishingTank = {
        id: Date.now().toString(),
        name: tankName,
        lat,
        lng,
        description,
        species: getSpeciesByRegion(getBrazilianRegion(lat).region),
        created: new Date()
      };
      setFishingTanks(prev => [...prev, newTank]);
      alert(`🎣 Tanque "${tankName}" adicionado com sucesso!`);
    }
  };

  // Função para determinar região brasileira
  const getBrazilianRegion = (lat: number) => {
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

  // Função para espécies por região
  const getSpeciesByRegion = (region: string) => {
    const speciesMap: { [key: string]: string[] } = {
      'Norte': ['Tucunaré', 'Pirarucu', 'Tambaqui', 'Piranha', 'Dourada'],
      'Nordeste': ['Robalo', 'Cioba', 'Cavala', 'Atum', 'Serra', 'Garoupa', 'Vermelho'],
      'Sudeste': ['Corvina', 'Pescada', 'Garoupa', 'Enchova', 'Robalo', 'Badejo', 'Sardinha'],
      'Sul': ['Pescada', 'Corvina', 'Linguado', 'Merluza', 'Garoupa', 'Anchova', 'Tainha']
    };
    return speciesMap[region] || ['Robalo', 'Pescada', 'Corvina', 'Garoupa'];
  };
  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
        }
      );
    }
  }, []);

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={currentLocation}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapClickHandler onMapClick={onMapClick} />
        
        {/* Marcador da localização atual do usuário */}
        <Marker position={currentLocation}>
          <Popup>
            <div className="text-center">
              <strong>📍 Sua Localização Atual</strong>
            </div>
          </Popup>
        </Marker>

        {/* Marcador da localização clicada */}
        {clickedLocation && (
          <Marker position={[clickedLocation.lat, clickedLocation.lng]} icon={clickedIcon}>
            <Popup>
              <div className="text-center">
                <strong>🎯 Local Selecionado</strong>
                <br />
                {clickedLocation.name}
                <br />
                <button 
                  onClick={() => addFishingTank(clickedLocation.lat, clickedLocation.lng)}
                  className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                >
                  ➕ Adicionar como Tanque
                </button>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Tanques do usuário */}
        {fishingTanks.map((tank) => (
          <Marker key={tank.id} position={[tank.lat, tank.lng]} icon={tankIcon}>
            <Popup>
              <div className="text-center min-w-[200px]">
                <strong>🎣 {tank.name}</strong>
                <br />
                <em className="text-sm text-gray-600">{tank.description}</em>
                <br />
                <div className="mt-2">
                  <strong>Espécies comuns:</strong>
                  <br />
                  {tank.species.join(', ')}
                </div>
                <button 
                  onClick={() => setFishingTanks(prev => prev.filter(t => t.id !== tank.id))}
                  className="mt-2 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                >
                  🗑️ Remover
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Zonas de pesca */}
        {fishingZones.map((zone) => (
          <Polygon
            key={zone.id}
            positions={zone.coordinates as L.LatLngExpression[]}
            pathOptions={getZoneStyle(zone.type)}
          >
            <Popup>
              <div className="text-sm max-w-xs">
                <strong className={`text-${
                  zone.type === 'safe' ? 'green' : 
                  zone.type === 'attention' ? 'yellow' : 'red'
                }-600`}>
                  {zone.name}
                </strong>
                <br />
                <span className="font-medium">Status:</span> {zone.status}
                <br />
                <span className="font-medium">Horário:</span> {zone.schedule}
              </div>
            </Popup>
          </Polygon>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;