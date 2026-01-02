import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SolicitudConvocatoriaRequest {
  convocatoria_nombre: string;
  nombre_comunidad: string;
  cif: string;
  direccion: string;
  codigo_postal: string;
  ciudad: string;
  provincia: string;
  nombre_contacto: string;
  email: string;
  telefono: string;
  numero_viviendas?: number;
  participa_programa: boolean;
  programa_participacion?: string;
  observaciones?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: SolicitudConvocatoriaRequest = await req.json();

    console.log("Processing solicitud convocatoria from:", data.email);
    console.log("Convocatoria:", data.convocatoria_nombre);
    console.log("Comunidad:", data.nombre_comunidad);

    // Send notification to ASRAM (temporalmente usando email de prueba)
    const notificationResponse = await resend.emails.send({
      from: "ASRAM Convocatorias <onboarding@resend.dev>",
      to: ["tonoone9607@gmail.com"],
      subject: `Nueva solicitud de ayuda: ${data.convocatoria_nombre}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Nueva Solicitud de Ayuda</h1>
          </div>
          
          <div style="padding: 20px; background: #f9fafb;">
            <div style="background: #dcfce7; border-left: 4px solid #10b981; padding: 15px; margin-bottom: 20px;">
              <h2 style="margin: 0 0 5px 0; color: #166534;">${data.convocatoria_nombre}</h2>
              <p style="margin: 0; color: #15803d;">Solicitud recibida el ${new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>

            <h3 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Datos de la Comunidad</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 40%;">Nombre:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.nombre_comunidad}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">CIF:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.cif}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Dirección:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.direccion}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Localidad:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.codigo_postal} ${data.ciudad}, ${data.provincia}</td>
              </tr>
              ${data.numero_viviendas ? `
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Nº Viviendas:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.numero_viviendas}</td>
              </tr>
              ` : ''}
            </table>

            <h3 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Datos de Contacto</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 40%;">Persona de contacto:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.nombre_contacto}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Email:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${data.email}">${data.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Teléfono:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><a href="tel:${data.telefono}">${data.telefono}</a></td>
              </tr>
            </table>

            <h3 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Participación en Programas</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 40%;">Participa en programa:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.participa_programa ? 'Sí' : 'No'}</td>
              </tr>
              ${data.programa_participacion ? `
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Programa:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.programa_participacion}</td>
              </tr>
              ` : ''}
            </table>

            ${data.observaciones ? `
            <h3 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Observaciones</h3>
            <p style="background: #fff; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">${data.observaciones.replace(/\n/g, '<br>')}</p>
            ` : ''}

            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-top: 20px;">
              <p style="margin: 0; color: #92400e;"><strong>Acción requerida:</strong> Revisar la solicitud y contactar con la comunidad para solicitar la documentación necesaria.</p>
            </div>
          </div>
          
          <div style="background: #374151; padding: 15px; text-align: center;">
            <p style="color: #9ca3af; margin: 0; font-size: 12px;">Este email ha sido generado automáticamente por el sistema de ASRAM</p>
          </div>
        </div>
      `,
    });

    console.log("Notification email sent to ASRAM:", notificationResponse);

    // Send confirmation to user
    const confirmationResponse = await resend.emails.send({
      from: "ASRAM Convocatorias <onboarding@resend.dev>",
      to: [data.email],
      subject: `Solicitud recibida: ${data.convocatoria_nombre} - ASRAM`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">ASRAM</h1>
            <p style="color: #d1fae5; margin: 10px 0 0 0;">Asociación de Reciclaje de Aceite de Madrid</p>
          </div>
          
          <div style="padding: 30px; background: #ffffff;">
            <h2 style="color: #166534;">¡Hemos recibido tu solicitud!</h2>
            
            <p>Estimado/a ${data.nombre_contacto},</p>
            
            <p>Gracias por presentar una solicitud para la convocatoria <strong>"${data.convocatoria_nombre}"</strong> en nombre de <strong>${data.nombre_comunidad}</strong>.</p>
            
            <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #166534;">Próximos pasos:</h3>
              <ol style="color: #374151; padding-left: 20px;">
                <li style="margin-bottom: 10px;">Nuestro equipo revisará la información proporcionada.</li>
                <li style="margin-bottom: 10px;">Nos pondremos en contacto contigo para solicitar la documentación requerida.</li>
                <li style="margin-bottom: 10px;">Una vez validada la documentación, te informaremos sobre la resolución.</li>
              </ol>
            </div>
            
            <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #374151;">Resumen de tu solicitud:</h3>
              <p><strong>Convocatoria:</strong> ${data.convocatoria_nombre}</p>
              <p><strong>Comunidad:</strong> ${data.nombre_comunidad}</p>
              <p><strong>CIF:</strong> ${data.cif}</p>
              <p><strong>Dirección:</strong> ${data.direccion}, ${data.codigo_postal} ${data.ciudad}</p>
            </div>
            
            <p>Si tienes alguna duda, no dudes en contactarnos respondiendo a este email o llamando a nuestro teléfono de atención.</p>
            
            <p>Atentamente,<br><strong>El equipo de ASRAM</strong></p>
          </div>
          
          <div style="background: #374151; padding: 20px; text-align: center;">
            <p style="color: #d1d5db; margin: 0 0 10px 0;">ASRAM - Asociación de Reciclaje de Aceite de Madrid</p>
            <p style="color: #9ca3af; margin: 0; font-size: 12px;">www.asramadrid.com</p>
          </div>
        </div>
      `,
    });

    console.log("Confirmation email sent to user:", confirmationResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-solicitud-convocatoria function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
