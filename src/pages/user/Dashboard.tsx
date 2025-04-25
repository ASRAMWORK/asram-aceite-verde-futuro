import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { AlianzaVerdeView } from '@/components/dashboard/user/alianza/AlianzaVerdeView';
import { ApadrinaCalleView } from '@/components/dashboard/user/apadrina/ApadrinaCalleView';
import { RecogidaAceiteView } from '@/components/dashboard/user/recogida/RecogidaAceiteView';
import { ReunionView } from '@/components/dashboard/user/reunion/ReunionView';
import { HomeView } from '@/components/dashboard/user/home/HomeView';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

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
