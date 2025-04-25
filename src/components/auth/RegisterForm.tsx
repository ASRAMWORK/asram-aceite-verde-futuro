import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { toast } from "sonner";
import type { UserRole } from "@/types";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("comunidad");
  const [loading, setLoading] = useState(false);
  
  const [direccion, setDireccion] = useState("");
  const [distrito, setDistrito] = useState("");
  const [barrio, setBarrio] = useState("");
  const [telefono, setTelefono] = useState("");
  const [numViviendas, setNumViviendas] = useState("");
  const [numContenedores, setNumContenedores] = useState("");
  
  const [nombreRestaurante, setNombreRestaurante] = useState("");
  const [horarioApertura, setHorarioApertura] = useState("");
  const [litrosEstimados, setLitrosEstimados] = useState("");
  
  const [frecuenciaRecogida, setFrecuenciaRecogida] = useState("mensual");
  
  const navigate = useNavigate();

  const distritos = [
    "Centro",
    "Arganzuela",
    "Retiro",
    "Salamanca",
    "Chamartín",
    "Tetuán",
    "Chamberí",
    "Fuencarral-El Pardo",
    "Moncloa-Aravaca",
    "Latina",
    "Carabanchel",
    "Usera",
    "Puente de Vallecas",
    "Moratalaz",
    "Ciudad Lineal",
    "Hortaleza",
    "Villaverde",
    "Villa de Vallecas",
    "Vicálvaro",
    "San Blas-Canillejas",
    "Barajas",
  ];

  const barrios: { [key: string]: string[] } = {
    "Centro": ["Palacio", "Embajadores", "Cortes", "Justicia", "Universidad", "Sol"],
    "Arganzuela": ["Imperial", "Acacias", "Chopera", "Legazpi", "Delicias", "Palos de Moguer", "Atocha"],
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userData = {
        uid: user.uid,
        email: user.email,
        role,
        createdAt: serverTimestamp(),
      };
      
      let specificData = {};
      
      switch (role) {
        case "comunidad":
          specificData = {
            direccion,
            distrito,
            barrio,
            telefono,
            numViviendas: parseInt(numViviendas),
            numContenedores: parseInt(numContenedores),
            frecuenciaRecogida,
          };
          break;
        case "restaurante":
          specificData = {
            nombreRestaurante,
            direccion,
            distrito,
            barrio,
            telefono,
            horarioApertura,
            litrosEstimados: parseInt(litrosEstimados),
            frecuenciaRecogida,
          };
          break;
      }
      
      const profileData = { ...userData, ...specificData };
      
      await setDoc(doc(db, "users", user.uid), profileData);
      
      toast.success("Registro exitoso");
      navigate("/login");
    } catch (error: any) {
      console.error("Error al registrar:", error);
      toast.error("Error al registrar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="futuristic-card p-8 glow">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Crea tu cuenta 🌱
          </h2>
          <p className="text-gray-500">Únete a la comunidad ASRAM</p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="mb-6">
            <Label htmlFor="role">Tipo de usuario</Label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value as UserRole)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona el tipo de usuario" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comunidad">Comunidad de vecinos</SelectItem>
                <SelectItem value="restaurante">Bar o restaurante</SelectItem>
                <SelectItem value="hotel">Hotel</SelectItem>
                <SelectItem value="asociacion">Asociación o entidad</SelectItem>
                <SelectItem value="escolar">Centro escolar</SelectItem>
                <SelectItem value="usuario">Usuario particular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Tabs defaultValue="comunidad" value={role} className="mb-6">
            <TabsList className="grid grid-cols-3 md:grid-cols-6">
              <TabsTrigger value="comunidad">Comunidad</TabsTrigger>
              <TabsTrigger value="restaurante">Restaurante</TabsTrigger>
              <TabsTrigger value="hotel">Hotel</TabsTrigger>
              <TabsTrigger value="asociacion">Asociación</TabsTrigger>
              <TabsTrigger value="escolar">Escolar</TabsTrigger>
              <TabsTrigger value="usuario">Usuario</TabsTrigger>
            </TabsList>

            <TabsContent value="comunidad" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    type="text"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="distrito">Distrito</Label>
                  <Select
                    value={distrito}
                    onValueChange={setDistrito}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un distrito" />
                    </SelectTrigger>
                    <SelectContent>
                      {distritos.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="barrio">Barrio</Label>
                  <Select
                    value={barrio}
                    onValueChange={setBarrio}
                    disabled={!distrito}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un barrio" />
                    </SelectTrigger>
                    <SelectContent>
                      {distrito && barrios[distrito]?.map((b) => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="numViviendas">Número de viviendas</Label>
                  <Input
                    id="numViviendas"
                    type="number"
                    value={numViviendas}
                    onChange={(e) => setNumViviendas(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="numContenedores">Número de contenedores</Label>
                  <Input
                    id="numContenedores"
                    type="number"
                    value={numContenedores}
                    onChange={(e) => setNumContenedores(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="frecuenciaRecogida">Frecuencia de recogida</Label>
                  <Select
                    value={frecuenciaRecogida}
                    onValueChange={setFrecuenciaRecogida}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona frecuencia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="semanal">Semanal</SelectItem>
                      <SelectItem value="quincenal">Quincenal</SelectItem>
                      <SelectItem value="mensual">Mensual</SelectItem>
                      <SelectItem value="bajo-demanda">Bajo demanda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="restaurante" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="nombreRestaurante">Nombre del restaurante</Label>
                  <Input
                    id="nombreRestaurante"
                    type="text"
                    value={nombreRestaurante}
                    onChange={(e) => setNombreRestaurante(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    type="text"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="distrito">Distrito</Label>
                  <Select
                    value={distrito}
                    onValueChange={setDistrito}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un distrito" />
                    </SelectTrigger>
                    <SelectContent>
                      {distritos.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="barrio">Barrio</Label>
                  <Select
                    value={barrio}
                    onValueChange={setBarrio}
                    disabled={!distrito}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un barrio" />
                    </SelectTrigger>
                    <SelectContent>
                      {distrito && barrios[distrito]?.map((b) => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="horarioApertura">Horario de apertura</Label>
                  <Input
                    id="horarioApertura"
                    type="text"
                    value={horarioApertura}
                    onChange={(e) => setHorarioApertura(e.target.value)}
                    placeholder="ej. 10:00-23:00"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="litrosEstimados">Litros estimados de aceite mensual</Label>
                  <Input
                    id="litrosEstimados"
                    type="number"
                    value={litrosEstimados}
                    onChange={(e) => setLitrosEstimados(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="frecuenciaRecogida">Frecuencia de recogida</Label>
                  <Select
                    value={frecuenciaRecogida}
                    onValueChange={setFrecuenciaRecogida}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona frecuencia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="semanal">Semanal</SelectItem>
                      <SelectItem value="quincenal">Quincenal</SelectItem>
                      <SelectItem value="mensual">Mensual</SelectItem>
                      <SelectItem value="bajo-demanda">Bajo demanda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="hotel" className="pt-4">
              <p className="text-muted-foreground text-center">Complete sus datos como hotel</p>
            </TabsContent>
            
            <TabsContent value="asociacion" className="pt-4">
              <p className="text-muted-foreground text-center">Complete sus datos como asociación</p>
            </TabsContent>
            
            <TabsContent value="escolar" className="pt-4">
              <p className="text-muted-foreground text-center">Complete sus datos como centro escolar</p>
            </TabsContent>
            
            <TabsContent value="usuario" className="pt-4">
              <p className="text-muted-foreground text-center">Complete sus datos como usuario particular</p>
            </TabsContent>
          </Tabs>

          <Button
            type="submit"
            className="w-full bg-asram hover:bg-asram-700 text-white"
            disabled={loading}
          >
            {loading ? "Registrando..." : "Registrarse"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            ¿Ya tienes una cuenta?{" "}
            <a
              href="/login"
              className="text-asram hover:text-asram-700 font-medium"
            >
              Iniciar sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
