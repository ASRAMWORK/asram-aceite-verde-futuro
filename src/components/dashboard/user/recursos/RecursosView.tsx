
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, Video, FileText, Link } from 'lucide-react';

const recursos = [
  {
    id: 1,
    titulo: 'Guía de Reciclaje de Aceite',
    descripcion: 'Aprende los fundamentos del reciclaje de aceite usado y su impacto en el medio ambiente.',
    tipo: 'guia',
    url: '#',
  },
  {
    id: 2,
    titulo: 'Taller Virtual: Del Aceite al Biodiesel',
    descripcion: 'Proceso paso a paso para convertir aceite usado en biodiesel.',
    tipo: 'video',
    url: '#',
  },
  {
    id: 3,
    titulo: 'Informe: Impacto Ambiental del Aceite',
    descripcion: 'Estudio detallado sobre la contaminación causada por el aceite y las soluciones disponibles.',
    tipo: 'informe',
    url: '#',
  },
  {
    id: 4,
    titulo: 'Taller para Comunidades',
    descripcion: 'Cómo implementar un sistema eficiente de recogida en tu comunidad de vecinos.',
    tipo: 'guia',
    url: '#',
  },
  {
    id: 5,
    titulo: 'Economía Circular: Reutilización del Aceite',
    descripcion: 'Descubre los diferentes usos que se le puede dar al aceite usado.',
    tipo: 'video',
    url: '#',
  },
  {
    id: 6,
    titulo: 'Estadísticas de Reciclaje en Madrid',
    descripcion: 'Datos actualizados sobre la recogida de aceite en los diferentes distritos de Madrid.',
    tipo: 'informe',
    url: '#',
  }
];

const getIconForType = (tipo: string) => {
  switch (tipo) {
    case 'guia':
      return <Book className="h-10 w-10 text-asram" />;
    case 'video':
      return <Video className="h-10 w-10 text-asram" />;
    case 'informe':
      return <FileText className="h-10 w-10 text-asram" />;
    default:
      return <Link className="h-10 w-10 text-asram" />;
  }
};

const RecursosView = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold">Recursos y Formaciones</h3>
        <p className="text-muted-foreground">
          Guías y materiales formativos gratuitos para mejorar tus conocimientos sobre reciclaje de aceite
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recursos.map(recurso => (
          <Card key={recurso.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                {getIconForType(recurso.tipo)}
                <div className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                  {recurso.tipo === 'guia' ? 'Guía' : 
                   recurso.tipo === 'video' ? 'Video' : 'Informe'}
                </div>
              </div>
              <CardTitle className="mt-4">{recurso.titulo}</CardTitle>
              <CardDescription>{recurso.descripcion}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="w-full bg-asram hover:bg-asram-700" asChild>
                <a href={recurso.url} target="_blank" rel="noopener noreferrer">
                  Acceder
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <Card className="bg-gray-50 border-dashed">
        <CardHeader>
          <CardTitle>¿Necesitas formación específica?</CardTitle>
          <CardDescription>
            Podemos crear contenidos adaptados a tus necesidades específicas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">Solicitar formación personalizada</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecursosView;
