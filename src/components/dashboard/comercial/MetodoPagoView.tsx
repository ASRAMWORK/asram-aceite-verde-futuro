
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useComisiones } from "@/hooks/useComisiones";
import { useComerciales } from "@/hooks/useComerciales";
import { MetodoPago } from "@/types/comercial";
import { toast } from "sonner";

const MetodoPagoView = () => {
  const { profile } = useUserProfile();
  const { getComisionesPendientesByComercialId, comisiones, loading: loadingComisiones } = useComisiones();
  const { updateComercial, loading: loadingComercial } = useComerciales();
  
  const [metodoPago, setMetodoPago] = useState<string>('banco');
  const [titular, setTitular] = useState<string>('');
  const [iban, setIban] = useState<string>('');
  const [swift, setSwift] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [telefono, setTelefono] = useState<string>('');
  const [guardando, setGuardando] = useState<boolean>(false);
  
  const comisionesPendientes = profile?.id 
    ? getComisionesPendientesByComercialId(profile.id) 
    : 0;
  
  const loading = loadingComisiones || loadingComercial;
  
  useEffect(() => {
    if (profile?.metodoPago) {
      setMetodoPago(profile.metodoPago.tipo);
      
      // Cargar datos según el método de pago
      if (profile.metodoPago.tipo === 'banco' && profile.metodoPago.datos.banco) {
        setTitular(profile.metodoPago.datos.banco.titular || '');
        setIban(profile.metodoPago.datos.banco.iban || '');
        setSwift(profile.metodoPago.datos.banco.swift || '');
      } else if (profile.metodoPago.tipo === 'paypal' && profile.metodoPago.datos.paypal) {
        setEmail(profile.metodoPago.datos.paypal.email || '');
      } else if (profile.metodoPago.tipo === 'bizum' && profile.metodoPago.datos.bizum) {
        setTelefono(profile.metodoPago.datos.bizum.telefono || '');
      }
    } else if (profile?.telefono) {
      setTelefono(profile.telefono);
    }
  }, [profile]);
  
  const guardarMetodoPago = async () => {
    if (!profile?.id) return;
    
    let metodoData: MetodoPago = { 
      tipo: metodoPago as 'banco' | 'paypal' | 'bizum', 
      datos: {} 
    };
    
    // Validar campos según el método seleccionado
    if (metodoPago === 'banco') {
      if (!titular.trim()) {
        toast.error("Debes introducir el nombre del titular");
        return;
      }
      if (!iban.trim()) {
        toast.error("Debes introducir el IBAN");
        return;
      }
      metodoData.datos.banco = { titular, iban, swift };
    } else if (metodoPago === 'paypal') {
      if (!email.trim()) {
        toast.error("Debes introducir tu email de PayPal");
        return;
      }
      metodoData.datos.paypal = { email };
    } else if (metodoPago === 'bizum') {
      if (!telefono.trim()) {
        toast.error("Debes introducir tu número de teléfono para Bizum");
        return;
      }
      metodoData.datos.bizum = { telefono };
    }
    
    try {
      setGuardando(true);
      await updateComercial(profile.id, {
        metodoPago: metodoData
      });
      toast.success("Método de pago guardado correctamente");
    } catch (error) {
      console.error("Error al guardar método de pago:", error);
      toast.error("Error al guardar método de pago");
    } finally {
      setGuardando(false);
    }
  };
  
  const solicitarCobro = () => {
    if (comisionesPendientes <= 0) {
      toast.error("No tienes comisiones pendientes para cobrar");
      return;
    }
    
    if (!profile?.metodoPago) {
      toast.error("Debes configurar un método de pago antes de solicitar el cobro");
      return;
    }
    
    toast.success("Solicitud de cobro enviada correctamente");
    // Aquí se implementaría la lógica para crear una solicitud de cobro
  };
  
  const pagosMockeados = [
    { id: '1', fecha: new Date(2023, 10, 15), importe: 240.50, referencia: 'PAGO-2023-11' },
    { id: '2', fecha: new Date(2023, 9, 10), importe: 176.25, referencia: 'PAGO-2023-10' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-asram rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Configurar método de cobro</CardTitle>
          <CardDescription>
            Elige cómo quieres recibir tus comisiones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={metodoPago} onValueChange={setMetodoPago} className="space-y-6">
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="banco" id="banco" className="mt-1" />
              <div className="grid gap-1.5 w-full">
                <Label htmlFor="banco" className="font-medium">Transferencia bancaria</Label>
                {metodoPago === 'banco' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="space-y-2">
                      <Label htmlFor="titular">Nombre del titular</Label>
                      <Input 
                        id="titular" 
                        value={titular} 
                        onChange={(e) => setTitular(e.target.value)} 
                        placeholder="Nombre completo del titular" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="iban">IBAN</Label>
                      <Input 
                        id="iban" 
                        value={iban} 
                        onChange={(e) => setIban(e.target.value.toUpperCase())} 
                        placeholder="ES91 2100 0418 4502 0005 1332" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="swift">SWIFT/BIC (opcional)</Label>
                      <Input 
                        id="swift" 
                        value={swift} 
                        onChange={(e) => setSwift(e.target.value)} 
                        placeholder="CAIXESBBXXX" 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="paypal" id="paypal" className="mt-1" />
              <div className="grid gap-1.5 w-full">
                <Label htmlFor="paypal" className="font-medium">PayPal</Label>
                {metodoPago === 'paypal' && (
                  <div className="space-y-2 mt-2">
                    <Label htmlFor="email">Email de PayPal</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="tucorreo@ejemplo.com" 
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="bizum" id="bizum" className="mt-1" />
              <div className="grid gap-1.5 w-full">
                <Label htmlFor="bizum" className="font-medium">Bizum</Label>
                {metodoPago === 'bizum' && (
                  <div className="space-y-2 mt-2">
                    <Label htmlFor="telefono">Número de teléfono</Label>
                    <Input 
                      id="telefono" 
                      value={telefono} 
                      onChange={(e) => setTelefono(e.target.value)} 
                      placeholder="600123456" 
                    />
                  </div>
                )}
              </div>
            </div>
          </RadioGroup>
          
          <div className="flex justify-end mt-6">
            <Button 
              onClick={guardarMetodoPago} 
              disabled={guardando}
            >
              {guardando ? "Guardando..." : "Guardar método de pago"}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Solicitar pago</CardTitle>
          <CardDescription>
            Solicita el pago de tus comisiones pendientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm">Comisiones pendientes:</span>
                <span className="text-lg font-bold">{comisionesPendientes.toFixed(2)} €</span>
              </div>
            </div>
            
            <Button 
              onClick={solicitarCobro} 
              className="w-full"
              disabled={comisionesPendientes <= 0 || !profile?.metodoPago}
            >
              Solicitar cobro
            </Button>
            
            {!profile?.metodoPago && (
              <p className="text-sm text-amber-600 text-center">
                Configura tu método de pago antes de solicitar el cobro
              </p>
            )}
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium mb-3">Historial de pagos</h4>
            {pagosMockeados.length > 0 ? (
              <div className="space-y-3">
                {pagosMockeados.map(pago => (
                  <div key={pago.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{pago.importe.toFixed(2)} €</p>
                      <p className="text-xs text-gray-500">{pago.fecha.toLocaleDateString()}</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Abonado
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center">No hay pagos realizados aún</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-gray-500">
            Los pagos se procesan entre el 1 y el 10 de cada mes
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MetodoPagoView;
