
import React from 'react';
import { Activity, Users, CalendarIcon, Settings, Menu } from 'lucide-react';
import { MobileBottomNav } from './MobileBottomNav';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useLocation } from 'react-router-dom';

export const AdminMobileBottomNav = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Determinar qué tab está activo basado en el query param
  const getActiveTab = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('tab') || 'panel-control';
  };
  
  const navigationItems = [
    {
      label: "Panel",
      href: "/admin/dashboard",
      icon: <Activity />,
      active: getActiveTab() === 'panel-control' || !location.search
    },
    {
      label: "Clientes",
      href: "/admin/dashboard?tab=gestion-clientes",
      icon: <Users />,
      active: getActiveTab() === 'gestion-clientes'
    },
    {
      label: "Recogidas",
      href: "/admin/dashboard?tab=gestion-recogidas",
      icon: <CalendarIcon />,
      active: getActiveTab() === 'gestion-recogidas'
    },
    {
      label: "Ajustes",
      href: "/admin/dashboard?tab=settings",
      icon: <Settings />,
      active: getActiveTab() === 'settings'
    },
    {
      label: "Más",
      href: "#",
      icon: <Menu />,
      active: false
    }
  ];
  
  if (!isMobile) {
    return null;
  }
  
  return <MobileBottomNav items={navigationItems} />;
};
