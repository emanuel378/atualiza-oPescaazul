import React from 'react';

interface InfoItemProps {
  icon?: React.ReactNode;
  value: string;
  label: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ value, label }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="text-blue-500">{value}</div>
      <div className="flex flex-col">
        <span className="font-bold text-gray-800">{label}</span>
        <span className="text-sm text-gray-500">{value}</span>
      </div>
    </div>
  );
};

export default InfoItem;