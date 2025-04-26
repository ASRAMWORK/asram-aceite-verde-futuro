
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { School, Leaf, Lightbulb, Users, Award } from "lucide-react";

const AlianzaVerde = () => {
  return (
    <PageLayout 
      title="Alianza Verde Escolar" 
      subtitle="Laboratorios vivos de sostenibilidad en centros educativos"
    >
      <div className="max-w-4xl mx-auto space-y-12">
        <Card className="bg-white/70 backdrop-blur-sm shadow-md">
          <CardContent className="p-6">
            <p className="text-lg leading-relaxed">
              Alianza Verde Escolar es nuestro programa educativo que transforma los centros escolares en 
              laboratorios vivos de sostenibilidad, donde alumnos, profesores y familias participan activamente 
              en la creación de un futuro más verde y sostenible.
            </p>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-2xl font-bold text-asram-800 mb-6">Actividades del programa</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-asram/20 flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-asram" />
                </div>
                <CardTitle>Talleres de Reciclaje Creativo</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Sesiones prácticas donde los alumnos aprenden a transformar residuos en objetos útiles o decorativos, fomentando la creatividad y conciencia ambiental.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-asram/20 flex items-center justify-center">
                  <School className="w-6 h-6 text-asram" />
                </div>
                <CardTitle>Mini Huertos Escolares</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Creación y mantenimiento de pequeños huertos dentro del centro educativo, donde los estudiantes aprenden sobre agricultura sostenible y alimentación saludable.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-asram/20 flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-asram" />
                </div>
                <CardTitle>Energías Renovables</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Experimentos prácticos y demostraciones sobre energía solar, eólica y otras fuentes renovables, con construcción de pequeños modelos funcionales.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-asram/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-asram" />
                </div>
                <CardTitle>Formación de Embajadores Verdes</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Capacitación de alumnos como líderes ambientales que promueven buenas prácticas entre sus compañeros y en sus hogares, creando una red de jóvenes comprometidos.</p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-asram-800 mb-6">Cómo participar</h2>
          
          <Card className="bg-white/50 backdrop-blur-sm shadow-md">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-asram flex items-center justify-center text-white font-bold">1</div>
                <p className="flex-1"><strong>Contacta con ASRAM:</strong> Escribe a <a href="mailto:alianzaverde@asramadrid.com" className="text-asram hover:underline">alianzaverde@asramadrid.com</a> o llama al +34 695 83 17 84.</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-asram flex items-center justify-center text-white font-bold">2</div>
                <p className="flex-1"><strong>Reunión inicial:</strong> Un representante de ASRAM visitará tu centro para presentar el programa y adaptarlo a vuestras necesidades.</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-asram flex items-center justify-center text-white font-bold">3</div>
                <p className="flex-1"><strong>Firma del convenio:</strong> Estableceremos un acuerdo de colaboración detallando las actividades y compromisos.</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-asram flex items-center justify-center text-white font-bold">4</div>
                <p className="flex-1"><strong>¡Comienza la transformación verde!</strong> Implementación del programa con seguimiento continuo de nuestro equipo.</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-asram-800 mb-6">Reconocimientos</h2>
          <Card className="bg-white/50 backdrop-blur-sm shadow-md">
            <CardHeader className="flex flex-row items-center gap-4">
              <Award className="w-8 h-8 text-asram" />
              <CardTitle>Certificación de Centro Verde</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Los centros participantes reciben una certificación oficial como "Centro Verde" de ASRAM, reconociendo su compromiso con la sostenibilidad y la educación ambiental. Esta certificación incluye una placa para el centro y materiales digitales para su comunicación institucional.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default AlianzaVerde;
