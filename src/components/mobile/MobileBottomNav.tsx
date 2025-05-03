import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMobileStyles } from '@/utils/mobileStyles';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

interface MobileBottomNavProps {
  items: NavItem[];
}

export const MobileBottomNav = ({ items }: MobileBottomNavProps) => {
  const location = useLocation();
  const { touchTarget } = useMobileStyles();
  
  if (items.length === 0) return null;
  
  // This component is no longer used in the application
  // but keeping it for backwards compatibility
  return null;
};
