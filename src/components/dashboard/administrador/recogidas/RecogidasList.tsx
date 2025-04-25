
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { format } from 'date-fns';
import { CalendarDays, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const dummyRecogidas = [
  {
    id: '1',
    fecha: new Date('2023-11-15'),
    comunidad: 'Comunidad Las Rosas',
    direccion: 'Calle Rosa 23',
    litros: 15,
    estado: 'completada'
  },
  {
    id: '2',
    fecha: new Date('2023-11-20'),
    comunidad: 'Comunidad Los Pinos',
    direccion: 'Av. Principal 45',
    litros: 12,
    estado: 'completada'
  },
  {
    id: '3',
    fecha: new Date('2023-12-05'),
    comunidad: 'Comunidad El Bosque',
    direccion: 'Calle Encina 34',
    litros: 20,
    estado: 'pendiente'
  },
  {
    id: '4',
    fecha: new Date('2023-12-08'),
    comunidad: 'Comunidad Las Palomas',
    direccion: 'Plaza Mayor 12',
    litros: 8,
    estado: 'completada'
  },
];

const RecogidasList = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  
  // Filter recogidas based on date, searchTerm and status
  const filteredRecogidas = dummyRecogidas.filter(recogida => {
    const matchesDate = date ? 
      recogida.fecha.toDateString() === date.toDateString() : 
      true;
    
    const matchesSearch = 
      recogida.comunidad.toLowerCase().includes(searchTerm.toLowerCase()) || 
      recogida.direccion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || 
      recogida.estado === statusFilter;
    
    return matchesDate && matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por comunidad..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pendiente">Pendientes</SelectItem>
              <SelectItem value="completada">Completadas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarDays className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : 'Filtrar por fecha'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <Table>
        <TableCaption>Listado de recogidas registradas</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Comunidad</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead className="text-right">Litros</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRecogidas.map((recogida) => (
            <TableRow key={recogida.id}>
              <TableCell>{format(recogida.fecha, 'dd/MM/yyyy')}</TableCell>
              <TableCell>{recogida.comunidad}</TableCell>
              <TableCell>{recogida.direccion}</TableCell>
              <TableCell className="text-right">{recogida.litros}</TableCell>
              <TableCell>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  recogida.estado === 'completada' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {recogida.estado === 'completada' ? 'Completada' : 'Pendiente'}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecogidasList;
