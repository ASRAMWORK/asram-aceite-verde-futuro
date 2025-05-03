
import React from 'react';
import ClientesRankingView from './ClientesRankingView';
import { useUserProfile } from '@/hooks/useUserProfile';

interface ClienteRankingWrapperProps {
  adminId?: string;
}

const ClienteRankingWrapper: React.FC<ClienteRankingWrapperProps> = ({ adminId: propAdminId }) => {
  const { profile } = useUserProfile();
  // Use the adminId from props if provided, otherwise use it from the profile
  const adminId = propAdminId || profile?.id || '';

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ClientesRankingView adminId={adminId} />
    </div>
  );
};

export default ClienteRankingWrapper;
