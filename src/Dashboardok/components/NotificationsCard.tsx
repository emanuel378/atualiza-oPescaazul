// src/components/NotificationsCard.tsx

import React from 'react';
import NotificationItem from './NotificationItem.tsx';
import { AlertTriangle } from 'lucide-react'; // Ícone para o título

// Definindo a "forma" dos dados de notificação que virão da API
export interface NotificationData {
  id: number;
  type: 'success' | 'warning';
  title: string;
  text: string;
  tag: string;
}

interface NotificationsCardProps {
  notifications: NotificationData[];
}

const NotificationsCard: React.FC<NotificationsCardProps> = ({ notifications }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full">
      <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2 mb-4">
        <AlertTriangle size={20} className="text-orange-500" />
        Notificações Recentes
      </h3>
      
      {/* Container para a lista de notificações com espaçamento entre elas */}
      <div className="space-y-3">
        {notifications.map((notif) => (
          <NotificationItem
            key={notif.id}
            type={notif.type}
            title={notif.title}
            text={notif.text}
            tag={notif.tag}
          />
        ))}
      </div>

      <div className="text-center mt-6">
        <a href="#" className="text-blue-600 font-semibold hover:underline">
          Ver todas as notificações
        </a>
      </div>
    </div>
  );
};

export default NotificationsCard;