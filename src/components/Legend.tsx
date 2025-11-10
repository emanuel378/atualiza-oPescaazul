import React from 'react';

const Legend: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h4 className="font-semibold mb-3">Legenda do Mapa</h4>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm">
            <strong>Zona Verde - Segura</strong>: Pesca liberada com todos os recursos
          </span>
        </div>
        
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
          <span className="text-sm">
            <strong>Zona Amarela - Atenção</strong>: Rever cuidado, considerar análises
          </span>
        </div>
        
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
          <span className="text-sm">
            <strong>Zona Vermelha - Proibida</strong>: Área de preservação ambiental
          </span>
        </div>
      </div>
    </div>
  );
};

export default Legend;