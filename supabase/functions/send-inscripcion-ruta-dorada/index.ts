import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EstablecimientoData {
  tipo: 'establecimiento';
  nombreEstablecimiento: string;
  tipoNegocio: string;
  nombreContacto: string;
  email: string;
  telefono: string;
  direccion: string;
  codigoPostal: string;
  barrio?: string;
  descripcion?: string;
  colaboraASRAM: boolean;
}

interface PersonaData {
  tipo: 'persona';
  nombre: string;
  apellidos: string;
  email: string;
  telefono?: string;
  codigoPostal?: string;
  comoConociste?: string;
}

type InscripcionData = EstablecimientoData | PersonaData;

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request to send-inscripcion-ruta-dorada");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: InscripcionData = await req.json();
    console.log("Processing Ruta Dorada inscription:", data.tipo);

    const fechaActual = new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    if (data.tipo === 'establecimiento') {
      const establecimiento = data as EstablecimientoData;
      
      // Email to admin
      await resend.emails.send({
        from: "ASRAM Madrid <onboarding@resend.dev>",
        to: ["tonoone9607@gmail.com"],
        subject: `🏪 Nueva Inscripción Ruta Dorada - ${establecimiento.nombreEstablecimiento}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Nueva Inscripción Ruta Dorada - Establecimiento</title>
          </head>
          <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🏪 Nueva Inscripción - Establecimiento</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Ruta Dorada - Mayo 2026</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <p style="color: #666; margin-bottom: 20px;">Recibida el ${fechaActual}</p>
              
              <h2 style="color: #f59e0b; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">Datos del Establecimiento</h2>
              
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 40%;">Nombre:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${establecimiento.nombreEstablecimiento}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Tipo de negocio:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${establecimiento.tipoNegocio}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Contacto:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${establecimiento.nombreContacto}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${establecimiento.email}" style="color: #f59e0b;">${establecimiento.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Teléfono:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="tel:${establecimiento.telefono}" style="color: #f59e0b;">${establecimiento.telefono}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Dirección:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${establecimiento.direccion}, ${establecimiento.codigoPostal}${establecimiento.barrio ? ` (${establecimiento.barrio})` : ''}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Colabora con ASRAM:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${establecimiento.colaboraASRAM ? '✅ Sí' : '❌ No (todavía)'}</td>
                </tr>
              </table>

              ${establecimiento.descripcion ? `
              <h3 style="color: #f59e0b;">Descripción:</h3>
              <p style="background: #fef3c7; padding: 15px; border-radius: 8px;">${establecimiento.descripcion}</p>
              ` : ''}

              <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin-top: 20px;">
                <p style="margin: 0; font-weight: bold;">⚡ Acción requerida</p>
                <p style="margin: 10px 0 0 0;">Contactar con el establecimiento para confirmar participación.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      // Confirmation email to establishment
      await resend.emails.send({
        from: "ASRAM Madrid <onboarding@resend.dev>",
        to: [establecimiento.email],
        subject: "🎉 Inscripción recibida - Ruta Dorada ASRAM",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Inscripción Ruta Dorada Confirmada</title>
          </head>
          <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🎉 ¡Inscripción Recibida!</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Ruta Dorada - Mayo 2026</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <p style="font-size: 18px;">Hola <strong>${establecimiento.nombreContacto}</strong>,</p>
              
              <p>Hemos recibido la inscripción de <strong>${establecimiento.nombreEstablecimiento}</strong> para participar en la Ruta Dorada 2026.</p>
              
              <div style="background: #fef3c7; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <h3 style="color: #d97706; margin-top: 0;">¿Qué sigue ahora?</h3>
                <ol style="margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 10px;">Revisaremos tu solicitud en los próximos días.</li>
                  <li style="margin-bottom: 10px;">Te contactaremos para confirmar los detalles.</li>
                  <li style="margin-bottom: 10px;">Recibirás toda la información sobre el evento.</li>
                </ol>
              </div>

              <p>¡Gracias por querer formar parte de esta iniciativa que apoya al comercio local y al medio ambiente!</p>
              
              <p style="margin-top: 30px;">
                Un saludo,<br>
                <strong style="color: #f59e0b;">El equipo de ASRAM Madrid</strong>
              </p>
            </div>

            <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
              <p><strong>ASRAM Madrid</strong> - Ruta Dorada 2026</p>
              <p>🏪 Apoyando al comercio local sostenible</p>
            </div>
          </body>
          </html>
        `,
      });

    } else {
      const persona = data as PersonaData;
      
      // Email to admin
      await resend.emails.send({
        from: "ASRAM Madrid <onboarding@resend.dev>",
        to: ["tonoone9607@gmail.com"],
        subject: `👤 Nueva Inscripción Ruta Dorada - Participante`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Nueva Inscripción Ruta Dorada - Participante</title>
          </head>
          <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">👤 Nuevo Participante Inscrito</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Ruta Dorada - Mayo 2026</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <p style="color: #666; margin-bottom: 20px;">Recibida el ${fechaActual}</p>
              
              <h2 style="color: #f59e0b; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">Datos del Participante</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 40%;">Nombre:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${persona.nombre} ${persona.apellidos}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${persona.email}" style="color: #f59e0b;">${persona.email}</a></td>
                </tr>
                ${persona.telefono ? `
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Teléfono:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${persona.telefono}</td>
                </tr>
                ` : ''}
                ${persona.codigoPostal ? `
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Código Postal:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${persona.codigoPostal}</td>
                </tr>
                ` : ''}
                ${persona.comoConociste ? `
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Cómo nos conoció:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${persona.comoConociste}</td>
                </tr>
                ` : ''}
              </table>
            </div>
          </body>
          </html>
        `,
      });

      // Confirmation email to person
      await resend.emails.send({
        from: "ASRAM Madrid <onboarding@resend.dev>",
        to: [persona.email],
        subject: "🎉 ¡Estás inscrito en la Ruta Dorada!",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Inscripción Ruta Dorada Confirmada</title>
          </head>
          <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🎉 ¡Estás inscrito!</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Ruta Dorada - Mayo 2026</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <p style="font-size: 18px;">Hola <strong>${persona.nombre}</strong>,</p>
              
              <p>¡Gracias por inscribirte en la Ruta Dorada 2026! Te mantendremos informado sobre todos los detalles del evento.</p>
              
              <div style="background: #fef3c7; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <h3 style="color: #d97706; margin-top: 0;">🗓️ Marca tu calendario</h3>
                <p style="margin: 0;">La Ruta Dorada se celebrará en <strong>mayo de 2026</strong> en Madrid. Pronto recibirás más información sobre:</p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                  <li>Fechas exactas del evento</li>
                  <li>Mapa de establecimientos participantes</li>
                  <li>Ofertas y promociones especiales</li>
                </ul>
              </div>

              <p>¡Prepárate para descubrir los mejores comercios locales de Madrid!</p>
              
              <p style="margin-top: 30px;">
                Un saludo,<br>
                <strong style="color: #f59e0b;">El equipo de ASRAM Madrid</strong>
              </p>
            </div>

            <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
              <p><strong>ASRAM Madrid</strong> - Ruta Dorada 2026</p>
              <p>🏪 Descubre el comercio local sostenible</p>
            </div>
          </body>
          </html>
        `,
      });
    }

    console.log("Emails sent successfully for Ruta Dorada inscription");

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-inscripcion-ruta-dorada function:", error);
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
