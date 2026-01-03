import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { distritos, getBarriosByDistrito } from "@/data/madridDistritos";
import { MapPin, Building2 } from "lucide-react";
import { getScheduleByDistrito, diasSemana } from "@/data/recogidaSchedule";
import { Badge } from "@/components/ui/badge";

interface DistritoBarrioFilterProps {
  selectedDistrito: string;
  selectedBarrio: string;
  onDistritoChange: (distrito: string) => void;
  onBarrioChange: (barrio: string) => void;
}

const DistritoBarrioFilter = ({
  selectedDistrito,
  selectedBarrio,
  onDistritoChange,
  onBarrioChange,
}: DistritoBarrioFilterProps) => {
  const barrios = selectedDistrito ? getBarriosByDistrito(selectedDistrito) : [];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="distrito" className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <MapPin className="h-4 w-4 text-[#ee970d]" />
          <span>Distrito</span>
        </label>
        <Select value={selectedDistrito} onValueChange={onDistritoChange}>
          <SelectTrigger className="border-[#ee970d]/30 focus:ring-[#ee970d]/20 bg-white h-11">
            <SelectValue placeholder="Selecciona un distrito" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <SelectItem value="">
              <span className="text-gray-500">Todos los distritos</span>
            </SelectItem>
            {distritos.map((distrito) => {
              const schedule = getScheduleByDistrito(distrito);
              return (
                <SelectItem key={distrito} value={distrito}>
                  <div className="flex items-center justify-between w-full gap-3">
                    <span>{distrito}</span>
                    {schedule && (
                      <Badge variant="outline" className="text-xs border-[#ee970d]/50 text-[#ee970d]">
                        {diasSemana[schedule.diaSemana]}
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {selectedDistrito && (
        <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
          <label htmlFor="barrio" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Building2 className="h-4 w-4 text-[#ee970d]" />
            <span>Barrio</span>
          </label>
          <Select value={selectedBarrio} onValueChange={onBarrioChange}>
            <SelectTrigger className="border-[#ee970d]/30 focus:ring-[#ee970d]/20 bg-white h-11">
              <SelectValue placeholder="Selecciona un barrio" />
            </SelectTrigger>
            <SelectContent className="max-h-[250px]">
              <SelectItem value="">
                <span className="text-gray-500">Todos los barrios</span>
              </SelectItem>
              {barrios.map((barrio) => (
                <SelectItem key={barrio} value={barrio}>
                  {barrio}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-2">
            Todos los barrios del distrito comparten el mismo día de recogida
          </p>
        </div>
      )}
    </div>
  );
};

export default DistritoBarrioFilter;
