
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
  };
}

const CalendarDay = ({ 
  day, 
  isWeekend, 
  hasRecogida, 
  recogidaDetails 
}: CalendarDayProps) => {
  if (!day) {
    return <div className="h-14" />;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "h-14 p-2 border rounded-md transition-colors relative overflow-hidden",
              isWeekend ? "bg-gray-50" : "bg-white",
              hasRecogida ? "border-[#ee970d]" : "border-gray-200",
              "hover:shadow-md cursor-pointer"
            )}
          >
            {hasRecogida && (
              <div className="absolute inset-0 w-1 bg-[#ee970d] left-0"></div>
            )}
            <div className="flex flex-col h-full">
              <span className={cn(
                "text-sm",
                isWeekend ? "text-gray-400" : "text-gray-700",
                hasRecogida && "font-medium"
              )}>
                {day}
              </span>
              {hasRecogida && (
                <Badge 
                  variant="secondary" 
                  className="mt-auto text-xs bg-amber-100 text-amber-800 border-[#ee970d] border"
                >
                  Recogida
                </Badge>
              )}
            </div>
          </div>
        </TooltipTrigger>
        {hasRecogida && recogidaDetails && (
          <TooltipContent className="bg-white border-[#ee970d] shadow-lg">
            <div className="text-sm">
              <p className="font-medium text-[#ee970d]">{recogidaDetails.distrito}</p>
              {recogidaDetails.barrio && (
                <p className="text-gray-600">{recogidaDetails.barrio}</p>
              )}
              <p className="text-gray-600">{recogidaDetails.hora}</p>
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default CalendarDay;
