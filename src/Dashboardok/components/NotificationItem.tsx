// src/components/NotificationItem.tsx

import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react'; // Ícones de exemplo

// Definimos os tipos de notificação para controlar o estilo
type NotificationType = 'success' | 'warning';

interface NotificationItemProps {
  type: NotificationType;
  title: string;
  text: string;
  tag: string;
}

// Mapeamento de tipos para classes de estilo do Tailwind
const typeStyles = {
  success: {
    bg: 'bg-green-100',
    iconBg: 'bg-green-200',
    iconColor: 'text-green-600',
    tagBg: 'bg-green-500',
  },
  warning: {
    bg: 'bg-orange-100',
    iconBg: 'bg-orange-200',
    iconColor: 'text-orange-600',
    tagBg: 'bg-orange-500',
  },
};

const NotificationItem: React.FC<NotificationItemProps> = ({ type, title, text, tag }) => {
  const styles = typeStyles[type];
  const Icon = type === 'success' ? CheckCircle : AlertTriangle;

  return (
    <div className={`flex items-center p-4 rounded-lg ${styles.bg}`}>
      <div className={`flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full ${styles.iconBg} ${styles.iconColor}`}>
        <Icon size={18} />
      </div>
      <div className="ml-4 flex-grow">
        <p className="font-semibold text-gray-800">{title}</p>
        <p className="text-sm text-gray-600">{text}</p>
      </div>
      <div className="ml-4">
        <span className={`px-3 py-1 text-xs font-bold text-white rounded-full ${styles.tagBg}`}>
          {tag}
        </span>
      </div>
    </div>
  );
};

export default NotificationItem;