import PageLayout from "@/components/layout/PageLayout";
import Footer from "@/components/home/Footer";
import { Shield, Lock, Eye, FileText, Users, Mail } from "lucide-react";

const PoliticaPrivacidad = () => {
  return (
    <>
      <PageLayout 
        title="Política de Privacidad" 
        subtitle="Tu privacidad es importante para nosotros. Conoce cómo protegemos tus datos."
      >
        <div className="max-w-4xl mx-auto">
          {/* Última actualización */}
          <div className="bg-asram-100/50 rounded-xl p-4 mb-8 flex items-center gap-3">
            <FileText className="w-5 h-5 text-asram-600" />
            <p className="text-gray-600">
              <strong>Última actualización:</strong> 4 de enero de 2026
            </p>
          </div>

          {/* Introducción */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-asram-100 rounded-lg">
                <Shield className="w-6 h-6 text-asram-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">1. Introducción</h2>
            </div>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed">
                En ASRAM Madrid (en adelante, "ASRAM", "nosotros" o "la Asociación"), nos comprometemos a proteger 
                la privacidad de nuestros usuarios, colaboradores y beneficiarios. Esta Política de Privacidad 
                describe cómo recopilamos, utilizamos, almacenamos y protegemos su información personal cuando 
                utiliza nuestros servicios de recogida de aceite usado, participa en nuestros programas o 
                interactúa con nuestra plataforma web.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                Al utilizar nuestros servicios o acceder a nuestra página web, usted acepta las prácticas 
                descritas en esta política. Le recomendamos leer detenidamente este documento.
              </p>
            </div>
          </section>

          {/* Responsable del tratamiento */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-asram-100 rounded-lg">
                <Users className="w-6 h-6 text-asram-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">2. Responsable del Tratamiento</h2>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <ul className="space-y-3 text-gray-600">
                <li><strong>Denominación:</strong> Asociación Social para el Reciclaje de Aceite de Madrid (ASRAM)</li>
                <li><strong>CIF:</strong> G-XXXXXXXX</li>
                <li><strong>Domicilio:</strong> Madrid, España</li>
                <li><strong>Email de contacto:</strong> privacidad@asram.es</li>
                <li><strong>Teléfono:</strong> +34 XXX XXX XXX</li>
              </ul>
            </div>
          </section>

          {/* Datos que recopilamos */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-asram-100 rounded-lg">
                <Eye className="w-6 h-6 text-asram-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">3. Datos que Recopilamos</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-800 mb-3">3.1 Datos proporcionados por el usuario</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Nombre y apellidos</li>
                  <li>Dirección de correo electrónico</li>
                  <li>Número de teléfono</li>
                  <li>Dirección postal (para servicios de recogida)</li>
                  <li>Datos de la comunidad de vecinos o establecimiento</li>
                  <li>CIF/NIF (en caso de empresas o administradores de fincas)</li>
                </ul>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-800 mb-3">3.2 Datos recopilados automáticamente</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Dirección IP</li>
                  <li>Tipo de navegador y dispositivo</li>
                  <li>Páginas visitadas y tiempo de navegación</li>
                  <li>Cookies y tecnologías similares</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Finalidad del tratamiento */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-asram-100 rounded-lg">
                <FileText className="w-6 h-6 text-asram-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">4. Finalidad del Tratamiento</h2>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-gray-600 mb-4">Utilizamos sus datos personales para:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Gestionar el servicio de recogida de aceite usado</li>
                <li>Coordinar rutas y horarios de recogida</li>
                <li>Enviar comunicaciones relacionadas con nuestros servicios</li>
                <li>Emitir certificados de donación y reciclaje</li>
                <li>Elaborar estadísticas de impacto ambiental</li>
                <li>Gestionar programas como Alianza Verde y ASRAM Kids</li>
                <li>Atender consultas y solicitudes de información</li>
                <li>Cumplir con obligaciones legales y fiscales</li>
                <li>Mejorar nuestros servicios y experiencia de usuario</li>
              </ul>
            </div>
          </section>

          {/* Base legal */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Base Legal del Tratamiento</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <ul className="space-y-4 text-gray-600">
                <li>
                  <strong>Consentimiento:</strong> Cuando nos proporciona sus datos a través de formularios 
                  o solicitudes de servicio.
                </li>
                <li>
                  <strong>Ejecución de un contrato:</strong> Para prestar el servicio de recogida solicitado.
                </li>
                <li>
                  <strong>Interés legítimo:</strong> Para mejorar nuestros servicios y comunicar información 
                  relevante sobre reciclaje.
                </li>
                <li>
                  <strong>Obligación legal:</strong> Para cumplir con normativas medioambientales y fiscales.
                </li>
              </ul>
            </div>
          </section>

          {/* Conservación de datos */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Conservación de Datos</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-gray-600 leading-relaxed">
                Conservamos sus datos personales durante el tiempo necesario para cumplir con la finalidad 
                para la que fueron recabados y para cumplir con las obligaciones legales. En general:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 mt-4">
                <li>Datos de usuarios activos: mientras mantenga relación con ASRAM</li>
                <li>Datos fiscales y de donaciones: 5 años (obligación legal)</li>
                <li>Datos de contacto para comunicaciones: hasta que retire su consentimiento</li>
              </ul>
            </div>
          </section>

          {/* Derechos */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-asram-100 rounded-lg">
                <Lock className="w-6 h-6 text-asram-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">7. Sus Derechos</h2>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-gray-600 mb-4">
                De acuerdo con el RGPD, usted tiene derecho a:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-asram-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800">Acceso</h4>
                  <p className="text-sm text-gray-600">Conocer qué datos tenemos sobre usted</p>
                </div>
                <div className="p-4 bg-asram-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800">Rectificación</h4>
                  <p className="text-sm text-gray-600">Corregir datos inexactos o incompletos</p>
                </div>
                <div className="p-4 bg-asram-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800">Supresión</h4>
                  <p className="text-sm text-gray-600">Solicitar la eliminación de sus datos</p>
                </div>
                <div className="p-4 bg-asram-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800">Oposición</h4>
                  <p className="text-sm text-gray-600">Oponerse al tratamiento de sus datos</p>
                </div>
                <div className="p-4 bg-asram-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800">Portabilidad</h4>
                  <p className="text-sm text-gray-600">Recibir sus datos en formato estructurado</p>
                </div>
                <div className="p-4 bg-asram-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800">Limitación</h4>
                  <p className="text-sm text-gray-600">Limitar el tratamiento de sus datos</p>
                </div>
              </div>
              <p className="text-gray-600 mt-4">
                Para ejercer estos derechos, contacte con nosotros en <strong>privacidad@asram.es</strong>
              </p>
            </div>
          </section>

          {/* Seguridad */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Seguridad de los Datos</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-gray-600 leading-relaxed">
                Implementamos medidas técnicas y organizativas apropiadas para proteger sus datos personales 
                contra acceso no autorizado, pérdida, alteración o divulgación. Estas medidas incluyen:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 mt-4">
                <li>Cifrado de datos en tránsito y en reposo</li>
                <li>Acceso restringido a personal autorizado</li>
                <li>Copias de seguridad periódicas</li>
                <li>Monitorización de seguridad continua</li>
              </ul>
            </div>
          </section>

          {/* Cookies */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Política de Cookies</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-gray-600 leading-relaxed">
                Utilizamos cookies propias y de terceros para mejorar la experiencia de navegación y 
                analizar el uso del sitio. Puede configurar su navegador para rechazar cookies, aunque 
                esto puede afectar a algunas funcionalidades del sitio.
              </p>
            </div>
          </section>

          {/* Menores */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Protección de Menores</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-gray-600 leading-relaxed">
                No recopilamos intencionalmente datos de menores de 14 años sin el consentimiento de 
                sus padres o tutores legales. En el caso de programas educativos como ASRAM Kids, 
                los datos son gestionados a través de los centros educativos correspondientes.
              </p>
            </div>
          </section>

          {/* Modificaciones */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Modificaciones de la Política</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-gray-600 leading-relaxed">
                Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento. 
                Los cambios serán publicados en esta página con la fecha de actualización. Le recomendamos 
                revisar periódicamente esta política.
              </p>
            </div>
          </section>

          {/* Contacto */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-asram-100 rounded-lg">
                <Mail className="w-6 h-6 text-asram-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">12. Contacto</h2>
            </div>
            <div className="bg-gradient-to-r from-asram-600 to-asram-700 rounded-xl p-6 text-white">
              <p className="mb-4">
                Si tiene preguntas sobre esta Política de Privacidad o desea ejercer sus derechos, 
                puede contactarnos:
              </p>
              <ul className="space-y-2">
                <li><strong>Email:</strong> privacidad@asram.es</li>
                <li><strong>Teléfono:</strong> +34 XXX XXX XXX</li>
                <li><strong>Dirección:</strong> Madrid, España</li>
              </ul>
              <p className="mt-4 text-sm opacity-90">
                También puede presentar una reclamación ante la Agencia Española de Protección de Datos 
                (AEPD) si considera que sus derechos no han sido respetados.
              </p>
            </div>
          </section>
        </div>
      </PageLayout>
      <Footer />
    </>
  );
};

export default PoliticaPrivacidad;
