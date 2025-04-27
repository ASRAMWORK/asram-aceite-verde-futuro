
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { distritos, getBarriosByDistrito } from "@/data/madridDistritos";
import { MapPin } from "lucide-react";

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
    <div className="grid gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-100">
      <div className="space-y-2">
        <label htmlFor="distrito" className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <MapPin className="h-4 w-4 text-[#ee970d]" />
          <span>Distrito</span>
        </label>
        <Select value={selectedDistrito} onValueChange={onDistritoChange}>
          <SelectTrigger className="border-[#ee970d]/30 focus:ring-[#ee970d]/20">
            <SelectValue placeholder="Selecciona un distrito" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos los distritos</SelectItem>
            {distritos.map((distrito) => (
              <SelectItem key={distrito} value={distrito}>
                {distrito}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedDistrito && (
        <div className="space-y-2">
          <label htmlFor="barrio" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <MapPin className="h-4 w-4 text-[#ee970d]" />
            <span>Barrio</span>
          </label>
          <Select value={selectedBarrio} onValueChange={onBarrioChange}>
            <SelectTrigger className="border-[#ee970d]/30 focus:ring-[#ee970d]/20">
              <SelectValue placeholder="Selecciona un barrio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos los barrios</SelectItem>
              {barrios.map((barrio) => (
                <SelectItem key={barrio} value={barrio}>
                  {barrio}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default DistritoBarrioFilter;
