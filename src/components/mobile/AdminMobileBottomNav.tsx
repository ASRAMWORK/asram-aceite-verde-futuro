
import React from 'react';
import { Activity, Users, CalendarIcon, Settings, Menu } from 'lucide-react';
import { MobileBottomNav } from './MobileBottomNav';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useNavigate, useLocation } from 'react-router-dom';

export const AdminMobileBottomNav = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  
  const getActiveTab = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('tab') || 'panel-control';
  };
  
  const handleTabChange = (tab?: string) => {
    if (!tab) {
      navigate('/admin/dashboard');
    } else {
      navigate(`/admin/dashboard?tab=${tab}`);
    }
  };
  
  const navigationItems = [
    {
      label: "Panel",
      href: "/admin/dashboard",
      icon: <Activity />,
      active: getActiveTab() === 'panel-control' || !location.search,
      onClick: () => handleTabChange()
    },
    {
      label: "Clientes",
      href: "/admin/dashboard?tab=gestion-clientes",
      icon: <Users />,
      active: getActiveTab() === 'gestion-clientes',
      onClick: () => handleTabChange('gestion-clientes')
    },
    {
      label: "Recogidas",
      href: "/admin/dashboard?tab=gestion-recogidas",
      icon: <CalendarIcon />,
      active: getActiveTab() === 'gestion-recogidas',
      onClick: () => handleTabChange('gestion-recogidas')
    },
    {
      label: "Ajustes",
      href: "/admin/dashboard?tab=settings",
      icon: <Settings />,
      active: getActiveTab() === 'settings',
      onClick: () => handleTabChange('settings')
    },
    {
      label: "Más",
      href: "#",
      icon: <Menu />,
      active: false,
      onClick: () => {
        // Trigger mobile menu button click
        const mobileNavButton = document.querySelector('[aria-label="Toggle mobile menu"]');
        if (mobileNavButton instanceof HTMLButtonElement) {
          mobileNavButton.click();
        }
      }
    }
  ];
  
  if (!isMobile) {
    return null;
  }
  
  return null; // We're not using bottom nav anymore, but keeping component for backward compatibility
};
