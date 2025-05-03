
import React from 'react';
import { Activity, Users, Calendar, Menu, Settings } from 'lucide-react';
import { MobileBottomNav } from './MobileBottomNav';
import { useIsMobile } from '@/hooks/useIsMobile';

export const AdminMobileBottomNav = () => {
  const isMobile = useIsMobile();
  
  const navigationItems = [
    {
      label: "Panel",
      href: "/admin/dashboard",
      icon: <Activity />
    },
    {
      label: "Clientes",
      href: "/admin/dashboard?tab=gestion-clientes",
      icon: <Users />
    },
    {
      label: "Recogidas",
      href: "/admin/dashboard?tab=gestion-recogidas",
      icon: <Calendar />
    },
    {
      label: "Ajustes",
      href: "/admin/dashboard?tab=settings",
      icon: <Settings />
    },
    {
      label: "Más",
      href: "#",
      icon: <Menu />
    }
  ];
  
  if (!isMobile) {
    return null;
  }
  
  return <MobileBottomNav items={navigationItems} />;
};
