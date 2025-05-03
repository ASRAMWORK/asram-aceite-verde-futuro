
import React from 'react';
import ClientesRankingView from './ClientesRankingView';
import { useUserProfile } from '@/hooks/useUserProfile';

const ClienteRankingWrapper: React.FC = () => {
  const { profile } = useUserProfile();
  const adminId = profile?.id || '';

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ClientesRankingView adminId={adminId} />
    </div>
  );
};

export default ClienteRankingWrapper;
