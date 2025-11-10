// src/components/StatCard.tsx

import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  // Usamos React.ReactNode para poder passar texto simples ou JSX com ícones
  description: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full">
      <h4 className="text-gray-500 font-semibold">{title}</h4>
      <p className="text-5xl font-bold text-gray-800 my-2">{value}</p>
      <div className="text-sm text-gray-500">
        {description}
      </div>
    </div>
  );
};

export default StatCard;