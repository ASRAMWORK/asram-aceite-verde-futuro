import PageLayout from "@/components/layout/PageLayout";
import Footer from "@/components/home/Footer";
import { FileCheck, ShoppingCart, CreditCard, RotateCcw, ShieldAlert, Clock, Receipt, UserCheck } from "lucide-react";

const TerminosContratacion = () => {
  return (
    <>
      <PageLayout
        title="Términos y Condiciones de Contratación"
        subtitle="Condiciones que regulan la relación contractual entre ASRAM y sus socios, donantes y compradores."
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-asram-100/50 rounded-xl p-4 mb-8 flex items-center gap-3">
            <Clock className="w-5 h-5 text-asram-600" />
            <p className="text-gray-600">
              <strong>Última actualización:</strong> 29 de abril de 2026
            </p>
          </div>

          {/* A. Objeto y aceptación */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-asram-100 rounded-lg">
                <FileCheck className="w-6 h-6 text-asram-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">A. Objeto y aceptación</h2>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3 text-gray-600">
              <p>
                Las presentes Condiciones Generales de Contratación (en adelante, "T&C") regulan la
                relación contractual entre la <strong>Asociación ASRAM</strong> (en adelante, "la Asociación")
                y cualquier persona física o jurídica (en adelante, "el Usuario") que realice a través de
                este sitio web alguna de las siguientes operaciones:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Alta como socio o pago de cuotas periódicas.</li>
                <li>Realización de donaciones puntuales o recurrentes.</li>
                <li>Compra de productos, merchandising o entradas a eventos.</li>
                <li>Contratación de servicios de recogida de aceite vegetal usado.</li>
              </ul>
              <p>
                Al confirmar cualquier transacción, el Usuario declara haber leído, entendido y aceptado
                expresamente estas condiciones, así como la Política de Privacidad y el Aviso Legal del sitio.
              </p>
            </div>
          </section>

          {/* B. Proceso de alta o compra */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-asram-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-asram-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">B. Proceso de alta o compra</h2>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 text-gray-600">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">B.1. Pasos para contratar</h3>
                <ol className="list-decimal pl-6 space-y-1">
                  <li>Selección del producto, servicio, cuota o donación deseada.</li>
                  <li>Cumplimentación del formulario con los datos personales y fiscales necesarios.</li>
                  <li>Aceptación expresa de las presentes T&C y de la Política de Privacidad.</li>
                  <li>Selección del método de pago y confirmación de la operación.</li>
                  <li>Recepción del justificante o confirmación por correo electrónico.</li>
                </ol>
              </div>
              <div className="p-4 bg-asram-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-asram-600" /> B.2. Precios e impuestos
                </h3>
                <p>
                  Los precios mostrados en el sitio web están expresados en euros (€). Las cuotas de
                  socio y las donaciones a la Asociación están <strong>exentas de IVA</strong> conforme
                  al artículo 20.Uno.12 de la Ley 37/1992 del IVA. En el caso de productos sujetos a IVA,
                  el impuesto aparecerá desglosado antes de la confirmación de la compra. Los gastos de
                  envío, cuando proceda, se indicarán claramente antes de finalizar el pedido.
                </p>
              </div>
            </div>
          </section>

          {/* C. Formas de pago */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-asram-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-asram-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">C. Formas de pago</h2>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3 text-gray-600">
              <p>La Asociación pone a disposición del Usuario los siguientes medios de pago:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Tarjeta bancaria</strong> (Visa, Mastercard, American Express) a través de pasarela segura.</li>
                <li><strong>PayPal</strong>, mediante redirección a su entorno seguro.</li>
                <li><strong>Transferencia bancaria</strong> a la cuenta indicada en la confirmación.</li>
                <li><strong>Domiciliación bancaria (SEPA)</strong> para cuotas periódicas de socios.</li>
              </ul>
              <p>
                Todas las pasarelas de pago utilizadas cumplen con el estándar <strong>PCI-DSS</strong> y
                emplean cifrado <strong>SSL/TLS</strong>. La Asociación <strong>no almacena</strong> los
                datos de tarjeta del Usuario, que son tratados directamente por la entidad financiera o
                el proveedor de pago.
              </p>
            </div>
          </section>

          {/* D. Cancelación y desistimiento */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-asram-100 rounded-lg">
                <RotateCcw className="w-6 h-6 text-asram-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">D. Política de cancelación y desistimiento</h2>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 text-gray-600">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">D.1. Derecho de desistimiento</h3>
                <p>
                  Conforme al Real Decreto Legislativo 1/2007, el Usuario consumidor dispone de un plazo
                  de <strong>14 días naturales</strong> desde la recepción del producto o la contratación
                  del servicio para desistir, sin necesidad de justificación. Para ejercerlo, deberá
                  comunicarlo por escrito a <strong>info@asramadrid.com</strong>.
                </p>
                <p className="mt-2">
                  Quedan <strong>excluidos del derecho de desistimiento</strong>: las entradas a eventos
                  con fecha determinada, los productos personalizados y las donaciones realizadas
                  voluntariamente a la Asociación.
                </p>
              </div>
              <div className="p-4 bg-asram-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-asram-600" /> D.2. Cuotas de socio
                </h3>
                <p>
                  La baja como socio puede solicitarse en cualquier momento mediante comunicación
                  escrita. La baja surtirá efecto desde su comunicación, <strong>sin que proceda la
                  devolución proporcional de la cuota</strong> ya satisfecha, al tener naturaleza de
                  aportación a fondo perdido para el sostenimiento de los fines de la Asociación.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">D.3. Donaciones</h3>
                <p>
                  Las donaciones tienen carácter voluntario, irrevocable y sin contraprestación. No
                  obstante, en caso de error material en el importe podrá solicitarse su revisión en
                  un plazo máximo de 14 días naturales.
                </p>
              </div>
            </div>
          </section>

          {/* E. Responsabilidades */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-asram-100 rounded-lg">
                <ShieldAlert className="w-6 h-6 text-asram-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">E. Responsabilidades</h2>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3 text-gray-600">
              <p>
                La Asociación no se hace responsable de los daños o perjuicios derivados de:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Errores técnicos imputables al Usuario, a su equipo o a su conexión a internet.</li>
                <li>Uso indebido o fraudulento de los servicios y productos contratados.</li>
                <li>Introducción de datos incorrectos o incompletos por parte del Usuario.</li>
                <li>Interrupciones temporales del servicio por causas de fuerza mayor o mantenimiento.</li>
                <li>Acciones de terceros ajenas al control de la Asociación.</li>
              </ul>
              <p>
                La Asociación responderá únicamente de los daños directos efectivamente probados que
                sean imputables a su actuación dolosa o gravemente negligente, con el límite del importe
                efectivamente abonado por el Usuario en la transacción afectada.
              </p>
            </div>
          </section>

          {/* Legislación */}
          <section className="mb-10">
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-gray-600">
              <h3 className="font-semibold text-gray-800 mb-2">F. Legislación aplicable y jurisdicción</h3>
              <p>
                Las presentes Condiciones se rigen por la legislación española. Para cualquier
                controversia, las partes se someten a los Juzgados y Tribunales de Madrid, sin
                perjuicio del fuero que por ley corresponda al consumidor.
              </p>
              <p className="mt-3 text-sm">
                Para cualquier consulta puede contactar con nosotros en{" "}
                <a href="mailto:info@asramadrid.com" className="text-asram-600 underline">
                  info@asramadrid.com
                </a>.
              </p>
            </div>
          </section>
        </div>
      </PageLayout>
      <Footer />
    </>
  );
};

export default TerminosContratacion;