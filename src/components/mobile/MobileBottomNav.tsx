
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
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <nav className="flex justify-around items-center h-16">
        {items.map((item, index) => {
          const isActive = item.active || location.pathname === item.href || 
                           (item.href.includes("?") && location.search.includes(item.href.split("?")[1]));
          
          return (
            <Link
              key={index}
              to={item.href}
              onClick={(e) => {
                if (item.onClick) {
                  e.preventDefault();
                  item.onClick();
                }
              }}
              className={`flex flex-col items-center justify-center w-full h-full ${touchTarget} text-xs ${
                isActive ? "text-[#ee970d]" : "text-gray-600"
              }`}
            >
              {React.cloneElement(item.icon as React.ReactElement, { 
                className: `h-5 w-5 ${isActive ? "text-[#ee970d]" : "text-gray-600"}` 
              })}
              <span className="mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
