
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

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
  
  if (items.length === 0) return null;
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <nav className="flex justify-around items-center h-16">
        {items.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            onClick={(e) => {
              if (item.onClick) {
                e.preventDefault();
                item.onClick();
              }
            }}
            className={`flex flex-col items-center justify-center w-full h-full text-xs ${
              item.active || location.pathname === item.href
                ? "text-[#ee970d]"
                : "text-gray-600"
            } touch-target`}
          >
            {React.cloneElement(item.icon as React.ReactElement, { 
              className: `h-5 w-5 ${item.active || location.pathname === item.href ? "text-[#ee970d]" : "text-gray-600"}` 
            })}
            <span className="mt-1">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};
