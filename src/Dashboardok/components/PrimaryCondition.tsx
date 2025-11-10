import React from 'react';

type StatusType = 'Regular' | 'Bom' | 'Ruim';

interface PrimaryConditionProps {
  icon?: React.ReactNode;
  title: string;
  recommendation: string;
  status: StatusType;
}

const statusClasses: Record<StatusType, string> = {
  Regular: 'bg-blue-500',
  Bom: 'bg-green-500',
  Ruim: 'bg-red-500',
};

const PrimaryCondition: React.FC<PrimaryConditionProps> = ({ icon, title, recommendation, status }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center justify-center bg-blue-100 rounded-full h-12 w-12 text-blue-500">{icon}</div>
      <div className="flex-grow">
        <h4 className="font-semibold text-gray-800">{title}</h4>
        <p className="text-sm text-gray-500">{recommendation}</p>
      </div>
      <div><span className={`px-3 py-1 text-xs font-bold text-white rounded-full ${statusClasses[status]}`}>{status}</span></div>
    </div>
  );
};

export default PrimaryCondition;