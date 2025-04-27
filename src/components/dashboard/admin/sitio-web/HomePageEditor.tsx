
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import ImageUploader from '@/components/common/ImageUploader';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';

interface HeroSection {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  showHero: boolean;
}

interface BenefitsSection {
  title: string;
  subtitle: string;
  benefits: {
    id: string;
    title: string;
    description: string;
    iconUrl: string;
  }[];
  showBenefits: boolean;
}

interface StatsSection {
  title: string;
  subtitle: string;
  stats: {
    id: string;
    value: string;
    label: string;
  }[];
  showStats: boolean;
}

interface HomePageData {
  hero: HeroSection;
  benefits: BenefitsSection;
  stats: StatsSection;
}

const defaultData: HomePageData = {
  hero: {
    title: "Juntos por un Madrid más sostenible",
    subtitle: "Recogiendo aceites usados para un futuro más limpio",
    buttonText: "Colabora con nosotros",
    buttonLink: "/contacto",
    imageUrl: "https://images.unsplash.com/photo-1574169208507-84376144848b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmVjeWNsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
    showHero: true
  },
  benefits: {
    title: "¿Por qué reciclar aceite?",
    subtitle: "Beneficios de nuestro servicio",
    benefits: [
      {
        id: "1",
        title: "Protege el medio ambiente",
        description: "Evita la contaminación del agua y el suelo",
        iconUrl: "https://cdn-icons-png.flaticon.com/512/2839/2839020.png"
      },
      {
        id: "2",
        title: "Ahorra recursos",
        description: "Contribuye a la economía circular",
        iconUrl: "https://cdn-icons-png.flaticon.com/512/3600/3600601.png"
      },
      {
        id: "3",
        title: "Fácil y cómodo",
        description: "Servicio de recogida a domicilio",
        iconUrl: "https://cdn-icons-png.flaticon.com/512/102/102058.png"
      }
    ],
    showBenefits: true
  },
  stats: {
    title: "Nuestro impacto",
    subtitle: "Juntos hacemos la diferencia",
    stats: [
      {
        id: "1",
        value: "10,000+",
        label: "Litros recogidos"
      },
      {
        id: "2",
        value: "500+",
        label: "Comunidades servidas"
      },
      {
        id: "3",
        value: "5,000+",
        label: "Toneladas de CO2 evitadas"
      }
    ],
    showStats: true
  }
};

const HomePageEditor = () => {
  const [data, setData] = useState<HomePageData>(defaultData);
  const [activeTab, setActiveTab] = useState('hero');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "website", "home-page");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setData(docSnap.data() as HomePageData);
        }
      } catch (error) {
        console.error("Error fetching home page data:", error);
        toast.error("Error al cargar los datos de la página de inicio");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "website", "home-page"), data);
      toast.success("Cambios guardados correctamente");
    } catch (error) {
      console.error("Error saving home page data:", error);
      toast.error("Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  const handleHeroChange = (field: keyof HeroSection, value: string | boolean) => {
    setData(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value
      }
    }));
  };

  const handleBenefitsChange = (field: keyof BenefitsSection, value: string | boolean) => {
    if (field !== 'benefits') {
      setData(prev => ({
        ...prev,
        benefits: {
          ...prev.benefits,
          [field]: value
        }
      }));
    }
  };

  const handleBenefitItemChange = (id: string, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      benefits: {
        ...prev.benefits,
        benefits: prev.benefits.benefits.map(benefit => 
          benefit.id === id ? { ...benefit, [field]: value } : benefit
        )
      }
    }));
  };

  const handleStatsChange = (field: keyof StatsSection, value: string | boolean) => {
    if (field !== 'stats') {
      setData(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          [field]: value
        }
      }));
    }
  };

  const handleStatItemChange = (id: string, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        stats: prev.stats.stats.map(stat => 
          stat.id === id ? { ...stat, [field]: value } : stat
        )
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#ee970d]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Editor de Página de Inicio</h2>
        <Button 
          onClick={handleSave} 
          className="bg-[#ee970d] hover:bg-[#ee970d]/90 text-white"
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Guardar Cambios
            </>
          )}
        </Button>
      </div>
      
      <Tabs defaultValue="hero" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="hero">Sección Hero</TabsTrigger>
          <TabsTrigger value="benefits">Beneficios</TabsTrigger>
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Sección Hero</CardTitle>
                  <CardDescription>
                    La primera sección que ven los visitantes al entrar en la web
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="hero-active" 
                    checked={data.hero.showHero}
                    onCheckedChange={(checked) => handleHeroChange('showHero', checked)} 
                  />
                  <Label htmlFor="hero-active">Mostrar</Label>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="hero-title">Título</Label>
                  <Input 
                    id="hero-title" 
                    value={data.hero.title} 
                    onChange={(e) => handleHeroChange('title', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="hero-subtitle">Subtítulo</Label>
                  <Textarea 
                    id="hero-subtitle" 
                    value={data.hero.subtitle} 
                    onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="button-text">Texto del botón</Label>
                    <Input 
                      id="button-text" 
                      value={data.hero.buttonText} 
                      onChange={(e) => handleHeroChange('buttonText', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="button-link">Enlace del botón</Label>
                    <Input 
                      id="button-link" 
                      value={data.hero.buttonLink} 
                      onChange={(e) => handleHeroChange('buttonLink', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Imagen de fondo</Label>
                  <div className="mt-2">
                    <ImageUploader 
                      onImageSelected={(url) => handleHeroChange('imageUrl', url)}
                      folder="website/home"
                      label="Imagen de fondo (recomendado: 1920x1080px)"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="benefits">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Sección de Beneficios</CardTitle>
                  <CardDescription>
                    Destacar los principales beneficios de tu servicio
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="benefits-active" 
                    checked={data.benefits.showBenefits}
                    onCheckedChange={(checked) => handleBenefitsChange('showBenefits', checked)} 
                  />
                  <Label htmlFor="benefits-active">Mostrar</Label>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="benefits-title">Título de la sección</Label>
                  <Input 
                    id="benefits-title" 
                    value={data.benefits.title} 
                    onChange={(e) => handleBenefitsChange('title', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="benefits-subtitle">Subtítulo</Label>
                  <Input 
                    id="benefits-subtitle" 
                    value={data.benefits.subtitle} 
                    onChange={(e) => handleBenefitsChange('subtitle', e.target.value)}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-8">
                {data.benefits.benefits.map((benefit, index) => (
                  <div key={benefit.id} className="space-y-4 pb-4 border-b border-gray-200 last:border-b-0">
                    <h3 className="text-lg font-medium">Beneficio {index + 1}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`benefit-title-${benefit.id}`}>Título</Label>
                        <Input 
                          id={`benefit-title-${benefit.id}`} 
                          value={benefit.title} 
                          onChange={(e) => handleBenefitItemChange(benefit.id, 'title', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`benefit-desc-${benefit.id}`}>Descripción</Label>
                        <Input 
                          id={`benefit-desc-${benefit.id}`} 
                          value={benefit.description} 
                          onChange={(e) => handleBenefitItemChange(benefit.id, 'description', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Icono</Label>
                      <div className="mt-2">
                        <ImageUploader 
                          onImageSelected={(url) => handleBenefitItemChange(benefit.id, 'iconUrl', url)}
                          folder="website/icons"
                          label="Icono (preferiblemente PNG con fondo transparente)"
                          previewSize="small"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Sección de Estadísticas</CardTitle>
                  <CardDescription>
                    Muestra el impacto de tu organización con datos clave
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="stats-active" 
                    checked={data.stats.showStats}
                    onCheckedChange={(checked) => handleStatsChange('showStats', checked)} 
                  />
                  <Label htmlFor="stats-active">Mostrar</Label>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stats-title">Título de la sección</Label>
                  <Input 
                    id="stats-title" 
                    value={data.stats.title} 
                    onChange={(e) => handleStatsChange('title', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="stats-subtitle">Subtítulo</Label>
                  <Input 
                    id="stats-subtitle" 
                    value={data.stats.subtitle} 
                    onChange={(e) => handleStatsChange('subtitle', e.target.value)}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-8">
                {data.stats.stats.map((stat, index) => (
                  <div key={stat.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-gray-200 last:border-b-0">
                    <div>
                      <Label htmlFor={`stat-value-${stat.id}`}>Valor estadístico</Label>
                      <Input 
                        id={`stat-value-${stat.id}`} 
                        value={stat.value} 
                        onChange={(e) => handleStatItemChange(stat.id, 'value', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`stat-label-${stat.id}`}>Etiqueta</Label>
                      <Input 
                        id={`stat-label-${stat.id}`} 
                        value={stat.label} 
                        onChange={(e) => handleStatItemChange(stat.id, 'label', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomePageEditor;
