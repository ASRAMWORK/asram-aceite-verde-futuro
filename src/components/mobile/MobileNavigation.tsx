
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useLocation, Link } from 'react-router-dom';
import { useMobileStyles } from '@/utils/mobileStyles';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MenuItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}

interface MobileNavigationProps {
  items: MenuItem[];
  title?: string;
  logoComponent?: React.ReactNode;
}

export const MobileNavigation = ({ items, title = "ASRAM", logoComponent }: MobileNavigationProps) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { touchTarget } = useMobileStyles();
  
  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className={`h-12 w-12 ${touchTarget}`} aria-label="Toggle mobile menu">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[85%] max-w-[320px] p-0 overflow-hidden">
          <div className="flex flex-col h-full">
            <div className="border-b p-4 flex items-center justify-between bg-[#ee970d]/10">
              <div className="flex items-center gap-3">
                {logoComponent || (
                  <div className="rounded-full bg-[#ee970d] w-10 h-10 flex items-center justify-center text-white font-bold text-lg">
                    {title.charAt(0)}
                  </div>
                )}
                <h3 className="font-medium text-xl text-[#ee970d]">{title}</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className={touchTarget}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            
            <ScrollArea className="flex-1 h-full">
              <nav className="py-2">
                <div className="space-y-0.5">
                  {items.map((item, index) => {
                    // Check if the item is active based on the URL or the active prop
                    const isActive = item.active || location.pathname === item.href || 
                                    (item.href.includes("?") && location.search.includes(item.href.split("?")[1]));
                    
                    return (
                      <div key={index} className="px-2">
                        <Link
                          to={item.href}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm ${touchTarget} ${
                            isActive
                              ? "bg-[#ee970d] text-white font-medium"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={(e) => {
                            if (item.onClick) {
                              e.preventDefault();
                              item.onClick();
                            }
                            setOpen(false);
                          }}
                        >
                          {item.icon && (
                            <span className={`${isActive ? "text-white" : "text-[#ee970d]"}`}>
                              {item.icon}
                            </span>
                          )}
                          <span>{item.label}</span>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </nav>
            </ScrollArea>
            
            <div className="border-t p-3 bg-gray-50">
              <div className="text-xs text-gray-500 text-center">
                © {new Date().getFullYear()} ASRAM Admin Panel
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
