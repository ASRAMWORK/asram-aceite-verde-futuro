
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { distritos, getBarriosByDistrito } from "@/data/madridDistritos";

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
    <div className="grid gap-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="space-y-2">
        <label htmlFor="distrito" className="text-sm font-medium text-gray-700">
          Distrito
        </label>
        <Select value={selectedDistrito} onValueChange={onDistritoChange}>
          <SelectTrigger>
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
          <label htmlFor="barrio" className="text-sm font-medium text-gray-700">
            Barrio
          </label>
          <Select value={selectedBarrio} onValueChange={onBarrioChange}>
            <SelectTrigger>
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
