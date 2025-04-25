
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AlianzaVerdeView from '@/components/dashboard/user/alianza/AlianzaVerdeView';
import ApadrinaCalleView from '@/components/dashboard/user/apadrina/ApadrinaCalleView';
import HomeView from '@/components/dashboard/user/home/HomeView';

// Placeholder component for RecogidaAceiteView until it's implemented
const RecogidaAceiteView = () => (
  <div className="p-4 bg-gray-100 rounded-lg">
    <h2 className="text-xl font-semibold mb-4">Recogida de Aceite</h2>
    <p className="text-gray-600">
      Esta sección estará disponible próximamente. Aquí podrás solicitar y gestionar recogidas de aceite usado.
    </p>
  </div>
);

// Placeholder component for ReunionView until it's implemented
const ReunionView = () => (
  <div className="p-4 bg-gray-100 rounded-lg">
    <h2 className="text-xl font-semibold mb-4">Solicitud de Reuniones</h2>
    <p className="text-gray-600">
      Esta sección estará disponible próximamente. Aquí podrás solicitar reuniones con el equipo de ASRAM.
    </p>
  </div>
);

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">
        Bienvenido, {user.email}
      </h1>

      <div className="mb-4">
        <button
          className={`mr-4 px-4 py-2 rounded ${activeTab === 'home' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleTabChange('home')}
        >
          Inicio
        </button>
        <button
          className={`mr-4 px-4 py-2 rounded ${activeTab === 'alianza' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleTabChange('alianza')}
        >
          Alianza Verde
        </button>
        <button
          className={`mr-4 px-4 py-2 rounded ${activeTab === 'apadrina' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleTabChange('apadrina')}
        >
          Apadrina Calle
        </button>
        <button
          className={`mr-4 px-4 py-2 rounded ${activeTab === 'recogida' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleTabChange('recogida')}
        >
          Recogida de Aceite
        </button>
        <button
          className={`mr-4 px-4 py-2 rounded ${activeTab === 'reunion' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleTabChange('reunion')}
        >
          Solicitar Reunión
        </button>
        <button
          className="px-4 py-2 rounded bg-red-500 text-white"
          onClick={logout}
        >
          Cerrar sesión
        </button>
      </div>

      {activeTab === 'home' && <HomeView />}
      {activeTab === 'alianza' && <AlianzaVerdeView />}
      {activeTab === 'apadrina' && <ApadrinaCalleView />}
      {activeTab === 'recogida' && <RecogidaAceiteView />}
      {activeTab === 'reunion' && <ReunionView />}
    </div>
  );
};

export default Dashboard;
