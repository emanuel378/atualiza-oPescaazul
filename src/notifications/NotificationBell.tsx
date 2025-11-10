// src/notifications/NotificationBell.tsx
import React, { useState } from 'react';
import { Bell, X } from 'lucide-react';

// Interface dentro do mesmo arquivo
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  location: string;
  isRead: boolean;
  timestamp: string;
}

// Hook dentro do mesmo arquivo
const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (title: string, message: string, type: Notification['type'], location: string) => {
    const newNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      type,
      location,
      isRead: false,
      timestamp: new Date().toISOString()
    };
    
    setNotifications(prev => [newNotification, ...prev].slice(0, 10));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead
  };
};

// Componente do Item de Notificação
const NotificationItem: React.FC<{ 
  notification: Notification; 
  onMarkAsRead: (id: string) => void; 
}> = ({ notification, onMarkAsRead }) => {
  const getIcon = (type: string) => {
    const icons = { danger: '🔴', warning: '🟡', info: '🔵', success: '🟢' };
    return icons[type as keyof typeof icons] || '⚪';
  };

  return (
    <div
      className={`p-3 border-b cursor-pointer ${!notification.isRead ? 'bg-blue-50' : 'bg-white'}`}
      onClick={() => !notification.isRead && onMarkAsRead(notification.id)}
    >
      <div className="flex gap-2">
        <span>{getIcon(notification.type)}</span>
        <div className="flex-1">
          <div className="flex justify-between">
            <p className="font-medium text-sm">{notification.title}</p>
            {!notification.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
          </div>
          <p className="text-xs text-gray-600">{notification.message}</p>
          <p className="text-xs text-blue-600 mt-1">📍 {notification.location}</p>
        </div>
      </div>
    </div>
  );
};

// Componente Principal
const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="relative">
      {/* Botão do Sino */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 rounded-lg"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Panel de Notificações */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-72 bg-white rounded-lg shadow-lg border z-50">
          {/* Header */}
          <div className="flex justify-between items-center p-3 border-b">
            <h3 className="font-bold">Notificações</h3>
            <button onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Lista */}
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-gray-500 text-sm">Nenhuma notificação</p>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                />
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-2 border-t">
              <button 
                onClick={markAllAsRead}
                className="w-full text-center text-blue-600 hover:text-blue-800 text-sm py-1"
              >
                Marcar todas como lidas
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;