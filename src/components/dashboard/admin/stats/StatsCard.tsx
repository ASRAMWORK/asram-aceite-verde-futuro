
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  suffix?: string;
  prefix?: string;
  className?: string;
  valueColor?: string; // Added this prop to fix the type error
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  suffix,
  prefix,
  className,
  valueColor,
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-2">
          <Icon className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        </div>
        <div className="mt-2 flex items-baseline">
          <p className={cn("text-3xl font-semibold", valueColor)}>
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
