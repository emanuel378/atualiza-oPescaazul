import React from 'react';

const EmergencyButton: React.FC = () => {
  const handleSOS = () => {
    if (window.confirm('Tem certeza que deseja acionar o SOS? Sua localização será compartilhada com as autoridades.')) {
      // Aqui você implementaria a lógica real do SOS
      alert('SOS acionado! Sua localização foi compartilhada com as autoridades.');
      
      // Simular chamada de emergência
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          console.log('Localização enviada:', position.coords);
        });
      }
    }
  };

  return (
    <div className="bg-red-600 hover:bg-red-700 text-white rounded-lg p-4 text-center cursor-pointer transition-colors">
      <button onClick={handleSOS} className="w-full h-full font-bold text-lg">
        BOTÃO SOS
      </button>
      <p className="text-sm mt-2">Em caso de emergência, acione o botão SOS. Sua localização será compartilhada imediatamente com as autoridades.</p>
    </div>
  );
};

export default EmergencyButton;