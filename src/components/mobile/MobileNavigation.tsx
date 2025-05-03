
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useLocation, Link } from 'react-router-dom';

interface MenuItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface MobileNavigationProps {
  items: MenuItem[];
  title?: string;
  logoComponent?: React.ReactNode;
}

export const MobileNavigation = ({ items, title = "ASRAM", logoComponent }: MobileNavigationProps) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  
  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[80%] max-w-[300px] p-0">
          <div className="flex flex-col h-full">
            <div className="border-b p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {logoComponent || (
                  <div className="rounded-full bg-[#ee970d] w-8 h-8 flex items-center justify-center text-white font-bold text-xs">
                    {title.charAt(0)}
                  </div>
                )}
                <h3 className="font-medium text-lg">{title}</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <nav className="flex-1 overflow-auto py-4">
              <ul className="space-y-1 px-2">
                {items.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.href}
                      className={`flex items-center gap-3 px-3 py-3 rounded-md text-sm ${
                        location.pathname === item.href
                          ? "bg-[#ee970d] text-white"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="border-t p-4 text-xs text-gray-500">
              © {new Date().getFullYear()} ASRAM
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
