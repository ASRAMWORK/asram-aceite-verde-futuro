
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import HomePageEditor from './HomePageEditor';
import AboutPageEditor from './AboutPageEditor';
import ServicesPageEditor from './ServicesPageEditor';
import ProgramsPageEditor from './ProgramsPageEditor';
import ContactPageEditor from './ContactPageEditor';

const MiSitioWeb = () => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Mi Sitio Web</h2>
        <p className="text-muted-foreground">
          Gestiona el contenido de tu sitio web
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Editor de contenido</CardTitle>
          <CardDescription>
            Modifica el contenido de cada sección de tu sitio web
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="home" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex w-full border-b rounded-none px-6">
              <TabsTrigger value="home" className="data-[state=active]:border-b-2 data-[state=active]:border-[#ee970d]">
                Inicio
              </TabsTrigger>
              <TabsTrigger value="about" className="data-[state=active]:border-b-2 data-[state=active]:border-[#ee970d]">
                Sobre nosotros
              </TabsTrigger>
              <TabsTrigger value="services" className="data-[state=active]:border-b-2 data-[state=active]:border-[#ee970d]">
                Servicios
              </TabsTrigger>
              <TabsTrigger value="programs" className="data-[state=active]:border-b-2 data-[state=active]:border-[#ee970d]">
                Programas
              </TabsTrigger>
              <TabsTrigger value="contact" className="data-[state=active]:border-b-2 data-[state=active]:border-[#ee970d]">
                Contacto
              </TabsTrigger>
            </TabsList>
            
            <div className="p-6">
              <TabsContent value="home">
                <HomePageEditor />
              </TabsContent>
              
              <TabsContent value="about">
                <AboutPageEditor />
              </TabsContent>
              
              <TabsContent value="services">
                <ServicesPageEditor />
              </TabsContent>
              
              <TabsContent value="programs">
                <ProgramsPageEditor />
              </TabsContent>
              
              <TabsContent value="contact">
                <ContactPageEditor />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MiSitioWeb;
