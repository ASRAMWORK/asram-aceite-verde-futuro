
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const ContactPageEditor = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Editor de Página de Contacto</h3>
        <p className="text-muted-foreground">
          Utiliza esta sección para editar el contenido de la página de contacto.
          Implementa funcionalidades similares a las del HomePageEditor.
        </p>
      </CardContent>
    </Card>
  );
};

export default ContactPageEditor;
