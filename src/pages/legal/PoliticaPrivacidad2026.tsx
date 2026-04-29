import { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, ShieldCheck, FileText, Lock, Mail, Users, AlertTriangle, Calendar } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const STORAGE_KEY = "asram_privacy_2026_accepted";

const sections = [
  {
    icon: ShieldCheck,
    title: "1. Responsable del tratamiento",
    content: (
      <>
        <p>
          <strong>ASRAM (Asociación para la Sostenibilidad y Reciclaje del Aceite de Madrid)</strong>, con domicilio en Madrid, España,
          es la entidad responsable del tratamiento de los datos personales recogidos a través de este sitio web y servicios asociados.
        </p>
        <p className="mt-3">
          Contacto del responsable: <a href="mailto:info@asramadrid.com" className="text-asram underline">info@asramadrid.com</a>
        </p>
      </>
    ),
  },
  {
    icon: FileText,
    title: "2. Datos que recopilamos",
    content: (
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Datos de identificación:</strong> nombre, apellidos, DNI/CIF cuando proceda.</li>
        <li><strong>Datos de contacto:</strong> email, teléfono, dirección postal.</li>
        <li><strong>Datos de la comunidad / negocio:</strong> nombre, dirección, número de viviendas, tipo de establecimiento.</li>
        <li><strong>Datos de navegación:</strong> dirección IP, tipo de dispositivo, páginas visitadas (ver Política de Cookies).</li>
        <li><strong>Datos de recogida:</strong> fechas, cantidades de aceite donado, ubicación del punto de recogida.</li>
      </ul>
    ),
  },
  {
    icon: Users,
    title: "3. Finalidades del tratamiento",
    content: (
      <ul className="list-disc pl-6 space-y-2">
        <li>Gestionar las solicitudes de recogida de aceite usado.</li>
        <li>Tramitar inscripciones en programas (Alianza Verde, ASRAM Kids, Apadrina una Calle, etc.).</li>
        <li>Emitir certificados de donación a empresas y grandes productores.</li>
        <li>Enviar comunicaciones informativas sobre actividades, convocatorias y resultados de impacto.</li>
        <li>Cumplir obligaciones legales medioambientales y fiscales.</li>
        <li>Mejorar la experiencia de usuario en la web mediante análisis estadístico.</li>
      </ul>
    ),
  },
  {
    icon: Lock,
    title: "4. Base legal (RGPD y LOPDGDD)",
    content: (
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Consentimiento</strong> del interesado al rellenar formularios o aceptar esta política.</li>
        <li><strong>Ejecución de un contrato</strong> o relación de colaboración (recogidas, donaciones, voluntariado).</li>
        <li><strong>Interés legítimo</strong> de ASRAM en gestionar su actividad asociativa y enviar comunicaciones relacionadas.</li>
        <li><strong>Cumplimiento de obligaciones legales</strong> aplicables a entidades sin ánimo de lucro y gestión de residuos.</li>
      </ul>
    ),
  },
  {
    icon: Calendar,
    title: "5. Plazo de conservación",
    content: (
      <p>
        Los datos se conservarán durante el tiempo necesario para cumplir con la finalidad para la que fueron recogidos
        y, posteriormente, durante los plazos legales aplicables (mínimo 5 años para datos fiscales y de gestión de residuos
        conforme a la normativa vigente en 2026). Una vez transcurridos, los datos se eliminarán de forma segura o se anonimizarán.
      </p>
    ),
  },
  {
    icon: ShieldCheck,
    title: "6. Destinatarios y transferencias",
    content: (
      <>
        <p>
          ASRAM no cede datos a terceros salvo obligación legal. Pueden tener acceso a los datos, en calidad de encargados
          del tratamiento, los siguientes proveedores con los que se mantienen los correspondientes contratos conforme al art. 28 RGPD:
        </p>
        <ul className="list-disc pl-6 mt-3 space-y-2">
          <li>Proveedores de hosting y servicios cloud (en la UE o con garantías adecuadas).</li>
          <li>Plataforma de envío de emails transaccionales.</li>
          <li>Gestoría y asesoría fiscal/laboral.</li>
          <li>Empresas autorizadas para la gestión y valorización del aceite recogido.</li>
        </ul>
        <p className="mt-3">No se realizan transferencias internacionales fuera del EEE sin las garantías adecuadas.</p>
      </>
    ),
  },
  {
    icon: CheckCircle2,
    title: "7. Tus derechos",
    content: (
      <>
        <p>Puedes ejercer en cualquier momento los siguientes derechos:</p>
        <ul className="list-disc pl-6 mt-3 space-y-2">
          <li><strong>Acceso</strong> a tus datos personales.</li>
          <li><strong>Rectificación</strong> de datos inexactos o incompletos.</li>
          <li><strong>Supresión</strong> ("derecho al olvido") cuando ya no sean necesarios.</li>
          <li><strong>Limitación</strong> u <strong>oposición</strong> al tratamiento.</li>
          <li><strong>Portabilidad</strong> de los datos.</li>
          <li><strong>Retirar el consentimiento</strong> prestado en cualquier momento.</li>
          <li>Presentar una reclamación ante la <strong>Agencia Española de Protección de Datos</strong> (www.aepd.es).</li>
        </ul>
        <p className="mt-3">
          Para ejercerlos, escríbenos a <a href="mailto:info@asramadrid.com" className="text-asram underline">info@asramadrid.com</a> indicando el derecho que deseas ejercer.
        </p>
      </>
    ),
  },
  {
    icon: Lock,
    title: "8. Seguridad de los datos",
    content: (
      <p>
        ASRAM aplica medidas técnicas y organizativas apropiadas para garantizar un nivel de seguridad adecuado al riesgo,
        incluyendo cifrado en tránsito (HTTPS/TLS), control de accesos, copias de seguridad cifradas y registros de actividad.
        En caso de brecha de seguridad que afecte a tus datos, te lo notificaremos en un plazo máximo de 72 horas conforme al RGPD.
      </p>
    ),
  },
  {
    icon: AlertTriangle,
    title: "9. Menores de edad",
    content: (
      <p>
        Para los programas dirigidos a menores (ASRAM Kids), se requiere el consentimiento expreso de los padres o tutores legales.
        No recopilamos conscientemente datos de menores de 14 años sin esa autorización previa.
      </p>
    ),
  },
  {
    icon: FileText,
    title: "10. Inteligencia artificial y decisiones automatizadas",
    content: (
      <p>
        Conforme al Reglamento Europeo de IA (AI Act, en aplicación durante 2026), ASRAM no realiza decisiones individuales
        automatizadas con efectos jurídicos sobre los usuarios. En caso de utilizar herramientas de IA para mejorar el servicio
        (estadísticas, optimización de rutas), se aplicarán siempre con supervisión humana y respeto a los principios del RGPD.
      </p>
    ),
  },
  {
    icon: Calendar,
    title: "11. Modificaciones de la política",
    content: (
      <p>
        Esta política puede actualizarse para adaptarse a cambios normativos o de funcionamiento. La versión vigente es siempre
        la publicada en este sitio web, indicando la fecha de última actualización. <strong>Última actualización: enero de 2026.</strong>
      </p>
    ),
  },
  {
    icon: Mail,
    title: "12. Contacto",
    content: (
      <p>
        Para cualquier duda relativa a esta política o al tratamiento de tus datos, contáctanos en{" "}
        <a href="mailto:info@asramadrid.com" className="text-asram underline">info@asramadrid.com</a>.
      </p>
    ),
  },
];

const PoliticaPrivacidad2026 = () => {
  const [accepted, setAccepted] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setAccepted(localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  const handleAccept = () => {
    if (!checked) {
      toast.error("Debes marcar la casilla para aceptar la política.");
      return;
    }
    localStorage.setItem(STORAGE_KEY, "true");
    localStorage.setItem(`${STORAGE_KEY}_date`, new Date().toISOString());
    setAccepted(true);
    toast.success("Has aceptado la Política de Privacidad 2026.");
  };

  const handleRevoke = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(`${STORAGE_KEY}_date`);
    setAccepted(false);
    setChecked(false);
    toast("Has revocado tu aceptación.");
  };

  return (
    <PageLayout
      title="Política de Privacidad 2026"
      subtitle="Información actualizada sobre cómo ASRAM trata tus datos personales conforme al RGPD, la LOPDGDD y la normativa europea vigente en 2026."
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {accepted && (
          <Card className="p-4 bg-green-50 border-green-200 flex items-start gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-green-800">Has aceptado la Política de Privacidad 2026.</p>
              <p className="text-sm text-green-700 mt-1">
                Gracias por tu confianza. Puedes revocar tu aceptación en cualquier momento.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleRevoke}>
              Revocar
            </Button>
          </Card>
        )}

        <Card className="p-6 bg-asram-50/50 border-asram-200">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-8 w-8 text-asram flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-asram-800">Versión 2026</h2>
              <p className="text-sm text-gray-700 mt-1">
                Esta política refleja los últimos cambios normativos en materia de protección de datos, incluyendo
                el AI Act europeo y las actualizaciones de la AEPD vigentes a fecha de enero de 2026.
              </p>
            </div>
          </div>
        </Card>

        {sections.map(({ icon: Icon, title, content }, idx) => (
          <Card key={idx} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-asram-100 rounded-lg">
                <Icon className="h-5 w-5 text-asram" />
              </div>
              <h2 className="text-xl font-bold text-asram-800 pt-1">{title}</h2>
            </div>
            <div className="text-gray-700 leading-relaxed pl-12">{content}</div>
          </Card>
        ))}

        {!accepted && (
          <Card className="p-6 bg-white border-2 border-asram sticky bottom-4 shadow-xl">
            <h3 className="text-lg font-bold text-asram-800 mb-3">Aceptación de la política</h3>
            <div className="flex items-start gap-3 mb-4">
              <Checkbox
                id="accept-privacy"
                checked={checked}
                onCheckedChange={(v) => setChecked(v === true)}
                className="mt-1"
              />
              <label htmlFor="accept-privacy" className="text-sm text-gray-700 cursor-pointer">
                He leído y acepto la <strong>Política de Privacidad 2026</strong> de ASRAM, así como el tratamiento
                de mis datos personales conforme a las finalidades descritas. También he revisado la{" "}
                <Link to="/politica-cookies" className="text-asram underline">Política de Cookies</Link>.
              </label>
            </div>
            <Button onClick={handleAccept} className="w-full sm:w-auto bg-asram hover:bg-asram-700">
              Aceptar Política de Privacidad
            </Button>
          </Card>
        )}
      </div>
    </PageLayout>
  );
};

export default PoliticaPrivacidad2026;