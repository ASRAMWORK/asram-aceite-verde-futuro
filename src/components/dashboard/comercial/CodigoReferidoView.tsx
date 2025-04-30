
import React, { useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/hooks/useUserProfile";
import { toast } from "sonner";
import { Copy, Share2, Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react"; // Updated import

const CodigoReferidoView = () => {
  const { profile } = useUserProfile();
  const qrRef = useRef<HTMLDivElement>(null);
  
  const codigo = profile?.codigo || "CODIGO_NO_DISPONIBLE";
  const shareUrl = `https://asramadrid.com/registro?codigo=${codigo}`;
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(codigo);
    toast.success("Código de referido copiado al portapapeles");
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Enlace de referido copiado al portapapeles");
  };
  
  const handleShareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: "¡Únete a ASRAM con mi código de referido!",
        text: "Regístrate en ASRAM usando mi código de referido",
        url: shareUrl,
      })
      .then(() => toast.success("Enlace compartido correctamente"))
      .catch((error) => console.error("Error al compartir:", error));
    } else {
      handleCopyLink();
    }
  };
  
  const downloadQRCode = () => {
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector("canvas");
      if (canvas) {
        const url = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = url;
        link.download = `codigo-referido-asram-${codigo}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Código QR descargado");
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Tu Código de Referido</CardTitle>
          <CardDescription>
            Comparte este código con posibles clientes para ganar comisiones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-100 p-6 rounded-lg text-center">
            <h3 className="text-3xl font-bold tracking-wider">{codigo}</h3>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button className="flex-1" onClick={handleCopyCode}>
              <Copy className="w-4 h-4 mr-2" />
              Copiar código
            </Button>
            <Button className="flex-1" variant="outline" onClick={handleCopyLink}>
              Copiar enlace
            </Button>
            <Button className="flex-1" variant="secondary" onClick={handleShareLink}>
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </Button>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">
              Enlace de referido:
              <br />
              <span className="text-xs break-all">{shareUrl}</span>
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Código QR</CardTitle>
          <CardDescription>
            Escanea este código para acceder al formulario de registro con tu referido
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div ref={qrRef} className="bg-white p-4 rounded-lg inline-block mb-6">
            <QRCodeSVG value={shareUrl} size={200} />
          </div>
          <div>
            <Button onClick={downloadQRCode} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Descargar QR
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CodigoReferidoView;
