import React from 'react';
import PrimaryCondition from './PrimaryCondition.tsx';
import InfoItem from './InfoItem.tsx';

const ConditionsCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full">
      <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2 mb-4">
        <span className="text-yellow-500">☀️</span>
        Condições Atuais
      </h3>
      <PrimaryCondition title="Horário para Pesca" recommendation="Aguarde o melhor horário" status="Regular" />
      <hr className="my-6 border-gray-200" />
      <div className="flex justify-around items-center">
        <InfoItem value="12 km/h" label="Vento" />
        <InfoItem value="20%" label="Chuva" />
        <InfoItem value="Crescente" label="Lua" />
      </div>
    </div>
  );
};

export default ConditionsCard;