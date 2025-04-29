
import React, { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import RutasDistritosList from './rutas/RutasDistritos';
import RutasPersonalizadas from './rutas/RutasPersonalizadas';

const RutasDistritos = () => {
  const [activeTab, setActiveTab] = useState<string>("distrito");
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="distrito" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="distrito" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            Rutas por Distrito
          </TabsTrigger>
          <TabsTrigger value="personalizada" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            Rutas Personalizadas
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="distrito" className="mt-0">
          <RutasDistritosList />
        </TabsContent>
        
        <TabsContent value="personalizada" className="mt-0">
          <RutasPersonalizadas />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RutasDistritos;
