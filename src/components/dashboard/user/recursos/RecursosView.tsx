
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, Video, FileText, Link, Search, Bookmark, CheckCircle, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

const recursos = [
  {
    id: 1,
    titulo: 'Guía de Reciclaje de Aceite',
    descripcion: 'Aprende los fundamentos del reciclaje de aceite usado y su impacto en el medio ambiente.',
    tipo: 'guia',
    nivel: 'Principiante',
    url: '#',
    popular: true
  },
  {
    id: 2,
    titulo: 'Taller Virtual: Del Aceite al Biodiesel',
    descripcion: 'Proceso paso a paso para convertir aceite usado en biodiesel.',
    tipo: 'video',
    nivel: 'Intermedio',
    url: '#',
    duracion: '45 min'
  },
  {
    id: 3,
    titulo: 'Informe: Impacto Ambiental del Aceite',
    descripcion: 'Estudio detallado sobre la contaminación causada por el aceite y las soluciones disponibles.',
    tipo: 'informe',
    nivel: 'Avanzado',
    url: '#',
  },
  {
    id: 4,
    titulo: 'Taller para Comunidades',
    descripcion: 'Cómo implementar un sistema eficiente de recogida en tu comunidad de vecinos.',
    tipo: 'guia',
    nivel: 'Intermedio',
    url: '#',
    popular: true
  },
  {
    id: 5,
    titulo: 'Economía Circular: Reutilización del Aceite',
    descripcion: 'Descubre los diferentes usos que se le puede dar al aceite usado.',
    tipo: 'video',
    nivel: 'Principiante',
    url: '#',
    duracion: '30 min'
  },
  {
    id: 6,
    titulo: 'Estadísticas de Reciclaje en Madrid',
    descripcion: 'Datos actualizados sobre la recogida de aceite en los diferentes distritos de Madrid.',
    tipo: 'informe',
    nivel: 'Intermedio',
    url: '#',
  }
];

const getIconForType = (tipo: string) => {
  switch (tipo) {
    case 'guia':
      return <Book className="h-10 w-10 text-emerald-500" />;
    case 'video':
      return <Video className="h-10 w-10 text-blue-500" />;
    case 'informe':
      return <FileText className="h-10 w-10 text-amber-500" />;
    default:
      return <Link className="h-10 w-10 text-gray-500" />;
  }
};

const getBadgeColor = (nivel: string) => {
  switch (nivel) {
    case 'Principiante':
      return "bg-green-100 text-green-800 border-green-200";
    case 'Intermedio':
      return "bg-blue-100 text-blue-800 border-blue-200";
    case 'Avanzado':
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const RecursosView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tipoFilter, setTipoFilter] = useState('todos');
  const [nivelFilter, setNivelFilter] = useState('todos');
  const [guardados, setGuardados] = useState<number[]>([]);
  const [completados, setCompletados] = useState<number[]>([]);
  
  const toggleGuardado = (id: number) => {
    if (guardados.includes(id)) {
      setGuardados(guardados.filter(itemId => itemId !== id));
    } else {
      setGuardados([...guardados, id]);
    }
  };
  
  const toggleCompletado = (id: number) => {
    if (completados.includes(id)) {
      setCompletados(completados.filter(itemId => itemId !== id));
    } else {
      setCompletados([...completados, id]);
    }
  };

  const filteredRecursos = recursos.filter(recurso => {
    const matchesSearch = recurso.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         recurso.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTipo = tipoFilter === 'todos' || recurso.tipo === tipoFilter;
    const matchesNivel = nivelFilter === 'todos' || recurso.nivel === nivelFilter;
    
    return matchesSearch && matchesTipo && matchesNivel;
  });

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="md:flex md:justify-between md:items-center gap-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Recursos y Formaciones</h3>
            <p className="text-gray-600">
              Guías y materiales formativos gratuitos para mejorar tus conocimientos sobre reciclaje de aceite
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-2">
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <Book className="h-3 w-3 mr-1" />
              Guías: {recursos.filter(r => r.tipo === 'guia').length}
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              <Video className="h-3 w-3 mr-1" />
              Videos: {recursos.filter(r => r.tipo === 'video').length}
            </Badge>
            <Badge className="bg-amber-100 text-amber-800 border-amber-200">
              <FileText className="h-3 w-3 mr-1" />
              Informes: {recursos.filter(r => r.tipo === 'informe').length}
            </Badge>
          </div>
        </div>
      </motion.div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="md:flex gap-4">
          <div className="relative flex-grow mb-4 md:mb-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Buscar recursos..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Tabs defaultValue="todos" value={tipoFilter} onValueChange={setTipoFilter} className="w-[180px]">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="todos">Todos</TabsTrigger>
                <TabsTrigger value="guia">Guías</TabsTrigger>
                <TabsTrigger value="video">Videos</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button variant="outline" size="icon" className="flex md:hidden">
              <Filter className="h-4 w-4" />
            </Button>
            
            <select 
              value={nivelFilter} 
              onChange={(e) => setNivelFilter(e.target.value)}
              className="hidden md:block bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
            >
              <option value="todos">Todos los niveles</option>
              <option value="Principiante">Principiante</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
          </div>
        </div>
      </div>
      
      {filteredRecursos.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-10 text-center border border-gray-200">
          <Search className="h-10 w-10 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No se encontraron resultados</h3>
          <p className="text-gray-500 mb-4">Prueba con otros términos de búsqueda o filtros</p>
          <Button variant="outline" onClick={() => {setSearchQuery(''); setTipoFilter('todos'); setNivelFilter('todos');}}>
            Limpiar filtros
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecursos.map((recurso, index) => (
            <motion.div 
              key={recurso.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-transparent hover:border-t-[#ee970d]">
                <CardHeader className="pb-4 relative">
                  <div className="absolute top-4 right-4 flex space-x-2">
                    {recurso.popular && (
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        Popular
                      </Badge>
                    )}
                    <Badge className={getBadgeColor(recurso.nivel)}>
                      {recurso.nivel}
                    </Badge>
                  </div>
                  
                  <div className="mb-6 mt-2">
                    {getIconForType(recurso.tipo)}
                  </div>
                  
                  <CardTitle className="text-xl">{recurso.titulo}</CardTitle>
                  <CardDescription className="mt-2 line-clamp-2">{recurso.descripcion}</CardDescription>
                  
                  <div className="mt-4 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {recurso.tipo === 'guia' ? 'Guía' : 
                      recurso.tipo === 'video' ? 'Video' : 'Informe'}
                    </Badge>
                    
                    {recurso.duracion && (
                      <Badge variant="outline" className="text-xs">
                        {recurso.duracion}
                      </Badge>
                    )}
                    
                    {completados.includes(recurso.id) && (
                      <Badge className="bg-green-100 text-green-800 border-green-200 ml-auto text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completado
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardFooter className="pt-2 pb-4 flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => toggleGuardado(recurso.id)}>
                    {guardados.includes(recurso.id) ? (
                      <>
                        <Bookmark className="h-4 w-4 mr-1 fill-current" />
                        Guardado
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-4 w-4 mr-1" />
                        Guardar
                      </>
                    )}
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-[#ee970d] hover:bg-[#ee970d]/90" asChild>
                      <a href={recurso.url} target="_blank" rel="noopener noreferrer">
                        Acceder
                      </a>
                    </Button>
                    
                    <Button variant="ghost" size="sm" onClick={() => toggleCompletado(recurso.id)}>
                      {completados.includes(recurso.id) ? "Marcar incompleto" : "Marcar completo"}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
      
      <Card className="bg-gradient-to-r from-[#ee970d]/5 to-white border-dashed">
        <CardHeader>
          <CardTitle>¿Necesitas formación específica?</CardTitle>
          <CardDescription>
            Podemos crear contenidos adaptados a tus necesidades específicas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Input placeholder="Indica el tipo de formación que necesitas..." className="max-w-md" />
            <Button variant="outline">Solicitar formación personalizada</Button>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium mb-2 text-gray-800">Para comunidades</h4>
              <p className="text-sm text-gray-600">Formaciones para vecinos y administradores de fincas</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium mb-2 text-gray-800">Para empresas</h4>
              <p className="text-sm text-gray-600">Soluciones para negocios hosteleros y restauración</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium mb-2 text-gray-800">Para educación</h4>
              <p className="text-sm text-gray-600">Contenidos didácticos para colegios e institutos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecursosView;
