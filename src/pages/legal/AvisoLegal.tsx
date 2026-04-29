import PageLayout from "@/components/layout/PageLayout";
import Footer from "@/components/home/Footer";
import { Building2, FileText, MapPin, Mail, Phone, Briefcase, Clock, Scale, Globe } from "lucide-react";

const AvisoLegal = () => {
  return (
    <>
      <PageLayout
        title="Aviso Legal"
        subtitle="Información legal e identificativa de ASRAM conforme a la LSSI-CE."
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-asram-100/50 rounded-xl p-4 mb-8 flex items-center gap-3">
            <Clock className="w-5 h-5 text-asram-600" />
            <p className="text-gray-600">
              <strong>Última actualización:</strong> 29 de abril de 2026
            </p>
          </div>

          {/* Identificación */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-asram-100 rounded-lg">
                <Building2 className="w-6 h-6 text-asram-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">1. Identificación del titular</h2>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
              <p className="text-gray-600">
                En cumplimiento de lo establecido en el artículo 10 de la Ley 34/2002, de 11 de julio,
                de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se
                informa a los usuarios de los siguientes datos identificativos del titular de este sitio web:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Razón social:</strong> Asociación ASRAM (Asociación de Servicios de Recogida de Aceite de Madrid)</li>
                <li><strong>NIF / CIF:</strong> G70725312</li>
                <li><strong>Domicilio social:</strong> C/ Genciana 6, 28039 Madrid (España)</li>
                <li><strong>Datos de inscripción:</strong> Inscrita en el Registro Nacional de Asociaciones con número nacional 41.636</li>
                <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-asram-600" /> <strong>Email:</strong> info@asramadrid.com</li>
                <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-asram-600" /> <strong>Teléfono:</strong> +34 600 000 000</li>
                <li className="flex items-center gap-2"><Globe className="w-4 h-4 text-asram-600" /> <strong>Sitio web:</strong> https://asramadrid.com</li>
              </ul>
              <div className="mt-4 p-4 bg-asram-50 rounded-lg text-sm text-gray-600">
                <strong>Nota:</strong> Los datos fiscales y registrales aquí indicados deben coincidir con
                los recogidos en los estatutos de la asociación y en el certificado del Registro de
                Asociaciones correspondiente.
              </div>
            </div>
          </section>

          {/* Finalidad de la web */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-asram-100 rounded-lg">
                <Briefcase className="w-6 h-6 text-asram-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">2. Finalidad del sitio web</h2>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
              <p className="text-gray-600">
                Este sitio web tiene por objeto:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-600">
                <li>Informar sobre las actividades, programas y misión de ASRAM.</li>
                <li>Facilitar la captación de socios, voluntarios y colaboradores.</li>
                <li>Gestionar la recogida de aceite vegetal usado en hogares, comunidades y empresas.</li>
                <li>Recibir donaciones y aportaciones económicas para financiar la actividad medioambiental.</li>
                <li>Comercializar productos y merchandising vinculado a los proyectos de la asociación.</li>
              </ul>
              <p className="text-gray-600">
                Al realizar actividades económicas (cuotas de socio, donaciones online y venta de productos),
                la publicación de los datos identificativos anteriores constituye una obligación legal
                conforme a la normativa vigente.
              </p>
            </div>
          </section>

          {/* Condiciones de uso */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-asram-100 rounded-lg">
                <FileText className="w-6 h-6 text-asram-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">3. Condiciones de uso</h2>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3 text-gray-600">
              <p>
                El acceso a este sitio web atribuye la condición de usuario, e implica la aceptación
                plena y sin reservas de las disposiciones contenidas en el presente Aviso Legal.
              </p>
              <p>
                El usuario se compromete a hacer un uso adecuado y lícito del sitio web, absteniéndose
                de utilizarlo para realizar actividades ilícitas o constitutivas de delito, contrarias
                a la buena fe o al orden público.
              </p>
            </div>
          </section>

          {/* Propiedad intelectual */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-asram-100 rounded-lg">
                <Scale className="w-6 h-6 text-asram-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">4. Propiedad intelectual e industrial</h2>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-gray-600">
              <p>
                Todos los contenidos del sitio web (textos, imágenes, logotipos, diseños y código fuente)
                son titularidad de ASRAM o de terceros que han autorizado su uso. Queda prohibida su
                reproducción, distribución, comunicación pública o transformación sin autorización expresa.
              </p>
            </div>
          </section>

          {/* Responsabilidad */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-asram-100 rounded-lg">
                <MapPin className="w-6 h-6 text-asram-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">5. Legislación aplicable</h2>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-gray-600">
              <p>
                El presente Aviso Legal se rige por la legislación española. Para la resolución de
                cualquier controversia, las partes se someten a los Juzgados y Tribunales de Madrid,
                salvo que la normativa aplicable disponga otro fuero.
              </p>
            </div>
          </section>
        </div>
      </PageLayout>
      <Footer />
    </>
  );
};

export default AvisoLegal;