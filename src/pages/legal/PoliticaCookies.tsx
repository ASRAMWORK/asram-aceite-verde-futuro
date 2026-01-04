import PageLayout from "@/components/layout/PageLayout";
import Footer from "@/components/home/Footer";
import { Cookie, Settings, BarChart3, Shield, Clock, Monitor, Smartphone, Globe, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const PoliticaCookies = () => {
  return (
    <>
      <PageLayout 
        title="Política de Cookies" 
        subtitle="Información sobre el uso de cookies en nuestra web y cómo gestionarlas."
      >
        <div className="max-w-4xl mx-auto">
          {/* Última actualización */}
          <div className="bg-asram-100/50 rounded-xl p-4 mb-8 flex items-center gap-3">
            <Clock className="w-5 h-5 text-asram-600" />
            <p className="text-gray-600">
              <strong>Última actualización:</strong> 4 de enero de 2026
            </p>
          </div>

          {/* ¿Qué son las cookies? */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-asram-100 rounded-lg">
                <Cookie className="w-6 h-6 text-asram-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">1. ¿Qué son las cookies?</h2>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-gray-600 leading-relaxed">
                Las cookies son pequeños archivos de texto que los sitios web almacenan en su dispositivo 
                (ordenador, tablet o móvil) cuando los visita. Estas cookies permiten que el sitio web 
                recuerde sus acciones y preferencias (como idioma, tamaño de fuente y otras preferencias 
                de visualización) durante un período de tiempo, para que no tenga que volver a introducirlas 
                cada vez que regrese al sitio o navegue de una página a otra.
              </p>
              <div className="mt-4 p-4 bg-asram-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Importante:</strong> Las cookies no pueden dañar su dispositivo ni acceder a 
                  información personal almacenada en él.
                </p>
              </div>
            </div>
          </section>

          {/* Tipos de cookies */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-asram-100 rounded-lg">
                <Settings className="w-6 h-6 text-asram-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">2. Tipos de Cookies que Utilizamos</h2>
            </div>
            
            <div className="space-y-4">
              {/* Cookies técnicas */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-green-100 rounded-lg shrink-0">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Cookies Técnicas (Esenciales)</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Son imprescindibles para el funcionamiento del sitio web. Permiten la navegación 
                      y el uso de funciones básicas.
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left p-2 font-medium">Cookie</th>
                            <th className="text-left p-2 font-medium">Finalidad</th>
                            <th className="text-left p-2 font-medium">Duración</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          <tr>
                            <td className="p-2 text-gray-600">session_id</td>
                            <td className="p-2 text-gray-600">Mantener la sesión del usuario</td>
                            <td className="p-2 text-gray-600">Sesión</td>
                          </tr>
                          <tr>
                            <td className="p-2 text-gray-600">auth_token</td>
                            <td className="p-2 text-gray-600">Autenticación de usuarios</td>
                            <td className="p-2 text-gray-600">30 días</td>
                          </tr>
                          <tr>
                            <td className="p-2 text-gray-600">cookie_consent</td>
                            <td className="p-2 text-gray-600">Recordar preferencias de cookies</td>
                            <td className="p-2 text-gray-600">1 año</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cookies de preferencias */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                    <Monitor className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Cookies de Preferencias</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Permiten recordar información que cambia la forma en que se comporta o ve el sitio web, 
                      como su idioma preferido o la región en la que se encuentra.
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left p-2 font-medium">Cookie</th>
                            <th className="text-left p-2 font-medium">Finalidad</th>
                            <th className="text-left p-2 font-medium">Duración</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          <tr>
                            <td className="p-2 text-gray-600">lang</td>
                            <td className="p-2 text-gray-600">Preferencia de idioma</td>
                            <td className="p-2 text-gray-600">1 año</td>
                          </tr>
                          <tr>
                            <td className="p-2 text-gray-600">theme</td>
                            <td className="p-2 text-gray-600">Modo claro/oscuro</td>
                            <td className="p-2 text-gray-600">1 año</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cookies analíticas */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-purple-100 rounded-lg shrink-0">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Cookies Analíticas</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Nos permiten reconocer y contar el número de visitantes y ver cómo se mueven por 
                      el sitio web. Esto nos ayuda a mejorar la forma en que funciona el sitio web.
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left p-2 font-medium">Cookie</th>
                            <th className="text-left p-2 font-medium">Proveedor</th>
                            <th className="text-left p-2 font-medium">Finalidad</th>
                            <th className="text-left p-2 font-medium">Duración</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          <tr>
                            <td className="p-2 text-gray-600">_ga</td>
                            <td className="p-2 text-gray-600">Google Analytics</td>
                            <td className="p-2 text-gray-600">Distinguir usuarios</td>
                            <td className="p-2 text-gray-600">2 años</td>
                          </tr>
                          <tr>
                            <td className="p-2 text-gray-600">_ga_*</td>
                            <td className="p-2 text-gray-600">Google Analytics</td>
                            <td className="p-2 text-gray-600">Mantener estado de sesión</td>
                            <td className="p-2 text-gray-600">2 años</td>
                          </tr>
                          <tr>
                            <td className="p-2 text-gray-600">_gid</td>
                            <td className="p-2 text-gray-600">Google Analytics</td>
                            <td className="p-2 text-gray-600">Distinguir usuarios</td>
                            <td className="p-2 text-gray-600">24 horas</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cookies de terceros */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-orange-100 rounded-lg shrink-0">
                    <Globe className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Cookies de Terceros</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Algunas páginas pueden incluir contenido de otros sitios (como vídeos de YouTube 
                      o mapas de Google Maps), que pueden establecer sus propias cookies.
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left p-2 font-medium">Servicio</th>
                            <th className="text-left p-2 font-medium">Finalidad</th>
                            <th className="text-left p-2 font-medium">Más información</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          <tr>
                            <td className="p-2 text-gray-600">Google Maps</td>
                            <td className="p-2 text-gray-600">Mostrar mapas interactivos</td>
                            <td className="p-2">
                              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-asram-600 hover:underline">
                                Política de Google
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-2 text-gray-600">YouTube</td>
                            <td className="p-2 text-gray-600">Reproducir vídeos</td>
                            <td className="p-2">
                              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-asram-600 hover:underline">
                                Política de Google
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cómo gestionar las cookies */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-asram-100 rounded-lg">
                <Smartphone className="w-6 h-6 text-asram-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">3. Cómo Gestionar las Cookies</h2>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
              <p className="text-gray-600 leading-relaxed mb-4">
                Puede configurar su navegador para rechazar cookies o para que le avise cuando se 
                envía una cookie. A continuación, le indicamos cómo hacerlo en los navegadores más comunes:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <a 
                  href="https://support.google.com/chrome/answer/95647" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-4 border border-gray-200 rounded-lg hover:border-asram-300 hover:bg-asram-50 transition-colors"
                >
                  <h4 className="font-semibold text-gray-800 mb-1">Google Chrome</h4>
                  <p className="text-sm text-gray-600">Configurar cookies en Chrome →</p>
                </a>
                <a 
                  href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-4 border border-gray-200 rounded-lg hover:border-asram-300 hover:bg-asram-50 transition-colors"
                >
                  <h4 className="font-semibold text-gray-800 mb-1">Mozilla Firefox</h4>
                  <p className="text-sm text-gray-600">Configurar cookies en Firefox →</p>
                </a>
                <a 
                  href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-4 border border-gray-200 rounded-lg hover:border-asram-300 hover:bg-asram-50 transition-colors"
                >
                  <h4 className="font-semibold text-gray-800 mb-1">Safari</h4>
                  <p className="text-sm text-gray-600">Configurar cookies en Safari →</p>
                </a>
                <a 
                  href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-4 border border-gray-200 rounded-lg hover:border-asram-300 hover:bg-asram-50 transition-colors"
                >
                  <h4 className="font-semibold text-gray-800 mb-1">Microsoft Edge</h4>
                  <p className="text-sm text-gray-600">Configurar cookies en Edge →</p>
                </a>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  <strong>Nota:</strong> Si desactiva las cookies, es posible que algunas funciones 
                  del sitio web no funcionen correctamente. Las cookies técnicas son necesarias para 
                  el funcionamiento básico del sitio.
                </p>
              </div>
            </div>
          </section>

          {/* Consentimiento */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Su Consentimiento</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-gray-600 leading-relaxed mb-4">
                Al navegar por nuestra web, aceptará el uso de cookies de acuerdo con esta política. 
                No obstante, puede cambiar su configuración de cookies en cualquier momento.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Las cookies técnicas son siempre necesarias y no requieren consentimiento</li>
                <li>Las cookies analíticas requieren su consentimiento previo</li>
                <li>Puede retirar su consentimiento en cualquier momento</li>
              </ul>
            </div>
          </section>

          {/* Actualizaciones */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Actualizaciones de esta Política</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-gray-600 leading-relaxed">
                Podemos actualizar esta Política de Cookies periódicamente para reflejar cambios en 
                las cookies que utilizamos o por otros motivos operativos, legales o regulatorios. 
                Le recomendamos que revise esta página regularmente para estar informado sobre el 
                uso de cookies.
              </p>
            </div>
          </section>

          {/* Contacto */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Contacto</h2>
            <div className="bg-gradient-to-r from-asram-600 to-asram-700 rounded-xl p-6 text-white">
              <p className="mb-4">
                Si tiene preguntas sobre nuestra Política de Cookies, puede contactarnos:
              </p>
              <ul className="space-y-2">
                <li><strong>Email:</strong> privacidad@asram.es</li>
                <li><strong>Teléfono:</strong> +34 XXX XXX XXX</li>
              </ul>
            </div>
          </section>

          {/* Botón de configuración */}
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <h3 className="font-semibold text-gray-800 mb-2">¿Desea cambiar sus preferencias de cookies?</h3>
            <p className="text-gray-600 text-sm mb-4">
              Puede actualizar sus preferencias de cookies en cualquier momento.
            </p>
            <Button className="bg-asram hover:bg-asram-700">
              <Settings className="w-4 h-4 mr-2" />
              Configurar Cookies
            </Button>
          </div>
        </div>
      </PageLayout>
      <Footer />
    </>
  );
};

export default PoliticaCookies;
