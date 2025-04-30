
import React from 'react';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CalendarDayProps {
  day: number;
  isWeekend: boolean;
  hasRecogida: boolean;
  recogidaDetails?: {
    distrito: string;
    barrio?: string;
    hora: string;
  } | null;
}

const CalendarDay = ({ 
  day, 
  isWeekend, 
  hasRecogida, 
  recogidaDetails 
}: CalendarDayProps) => {
  if (!day) {
    return <div className="h-16" />;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "h-16 p-2 border rounded-md transition-colors relative overflow-hidden",
              isWeekend ? "bg-gray-50" : "bg-white",
              hasRecogida ? "border-[#ee970d] shadow-sm" : "border-gray-200",
              "hover:shadow-md cursor-pointer"
            )}
          >
            {hasRecogida && (
              <div className="absolute inset-0 w-1.5 bg-[#ee970d] left-0"></div>
            )}
            <div className="flex flex-col h-full">
              <span className={cn(
                "text-sm font-medium",
                isWeekend ? "text-gray-400" : "text-gray-700",
                hasRecogida && "font-bold text-[#ee970d]"
              )}>
                {day}
              </span>
              {hasRecogida && (
                <Badge 
                  variant="secondary" 
                  className="mt-auto text-xs bg-amber-50 text-[#ee970d] border-[#ee970d] border overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  {recogidaDetails?.distrito || 'Recogida'}
                </Badge>
              )}
            </div>
          </div>
        </TooltipTrigger>
        {hasRecogida && recogidaDetails && (
          <TooltipContent className="bg-white border-[#ee970d] shadow-lg p-3 max-w-xs">
            <div className="text-sm">
              <p className="font-medium text-[#ee970d]">{recogidaDetails.distrito}</p>
              {recogidaDetails.barrio && (
                <p className="text-gray-600">{recogidaDetails.barrio}</p>
              )}
              <p className="text-gray-600">Hora: {recogidaDetails.hora}</p>
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default CalendarDay;
