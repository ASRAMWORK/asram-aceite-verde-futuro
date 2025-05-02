
import React from 'react';
import ClientesRankingView from './ClientesRankingView';

interface ClienteRankingWrapperProps {
  adminId: string;
}

const ClienteRankingWrapper: React.FC<ClienteRankingWrapperProps> = ({ adminId }) => {
  return <ClientesRankingView adminId={adminId} />;
};

export default ClienteRankingWrapper;
