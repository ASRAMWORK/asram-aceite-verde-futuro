import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface VoluntarioRequest {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  direccion?: string;
  codigoPostal?: string;
  ciudad?: string;
  provincia?: string;
  disponibilidad: string[];
  experiencia?: string;
  motivacion: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request to send-solicitud-voluntario");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: VoluntarioRequest = await req.json();
    console.log("Processing volunteer request for:", data.nombre, data.apellidos);

    const disponibilidadList = data.disponibilidad.join(", ");
    const fechaActual = new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Send notification to admin
    const adminEmailResponse = await resend.emails.send({
      from: "ASRAM Madrid <onboarding@resend.dev>",
      to: ["tonoone9607@gmail.com"],
      subject: `Nueva Solicitud de Voluntariado - ${data.nombre} ${data.apellidos}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nueva Solicitud de Voluntariado</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background: linear-gradient(135deg, #4A7C59 0%, #2d5016 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🙋 Nueva Solicitud de Voluntariado</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Recibida el ${fechaActual}</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #4A7C59; border-bottom: 2px solid #4A7C59; padding-bottom: 10px; margin-top: 0;">Datos del Solicitante</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 40%;">Nombre completo:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.nombre} ${data.apellidos}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${data.email}" style="color: #4A7C59;">${data.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Teléfono:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="tel:${data.telefono}" style="color: #4A7C59;">${data.telefono}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Fecha de nacimiento:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.fechaNacimiento}</td>
              </tr>
              ${data.direccion ? `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Dirección:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.direccion}${data.codigoPostal ? `, ${data.codigoPostal}` : ''}${data.ciudad ? `, ${data.ciudad}` : ''}${data.provincia ? ` (${data.provincia})` : ''}</td>
              </tr>
              ` : ''}
            </table>

            <h2 style="color: #4A7C59; border-bottom: 2px solid #4A7C59; padding-bottom: 10px;">Disponibilidad</h2>
            <p style="background: #f0f7f2; padding: 15px; border-radius: 8px; margin-bottom: 20px;">${disponibilidadList}</p>

            ${data.experiencia ? `
            <h2 style="color: #4A7C59; border-bottom: 2px solid #4A7C59; padding-bottom: 10px;">Experiencia Previa</h2>
            <p style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">${data.experiencia}</p>
            ` : ''}

            <h2 style="color: #4A7C59; border-bottom: 2px solid #4A7C59; padding-bottom: 10px;">Motivación</h2>
            <p style="background: #f0f7f2; padding: 15px; border-radius: 8px; margin-bottom: 20px;">${data.motivacion}</p>

            <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <p style="margin: 0; font-weight: bold;">⚡ Acción requerida</p>
              <p style="margin: 10px 0 0 0;">Por favor, contacta con el solicitante para programar una entrevista.</p>
            </div>
          </div>

          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p>Este email fue enviado automáticamente desde el formulario de voluntariado de ASRAM Madrid.</p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Admin email sent:", adminEmailResponse);

    // Send confirmation to applicant
    const applicantEmailResponse = await resend.emails.send({
      from: "ASRAM Madrid <onboarding@resend.dev>",
      to: [data.email],
      subject: "Hemos recibido tu solicitud de voluntariado - ASRAM Madrid",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Solicitud de Voluntariado Recibida</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background: linear-gradient(135deg, #4A7C59 0%, #2d5016 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">💚 ¡Gracias por querer ser voluntario!</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <p style="font-size: 18px;">Hola <strong>${data.nombre}</strong>,</p>
            
            <p>Hemos recibido tu solicitud para formar parte del equipo de voluntarios de ASRAM Madrid. ¡Estamos encantados de tu interés!</p>
            
            <div style="background: #f0f7f2; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #4A7C59;">
              <h3 style="color: #4A7C59; margin-top: 0;">¿Qué sigue ahora?</h3>
              <ol style="margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 10px;">Revisaremos tu solicitud en los próximos días.</li>
                <li style="margin-bottom: 10px;">Te contactaremos por teléfono o email para una breve entrevista.</li>
                <li style="margin-bottom: 10px;">Te daremos toda la información sobre las próximas actividades.</li>
              </ol>
            </div>

            <h3 style="color: #4A7C59;">Resumen de tu solicitud:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Disponibilidad:</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${disponibilidadList}</td>
              </tr>
            </table>

            <p style="margin-top: 30px;">Si tienes alguna pregunta, no dudes en contactarnos respondiendo a este email o llamando al teléfono de la asociación.</p>
            
            <p>¡Estamos deseando conocerte!</p>
            
            <p style="margin-top: 30px;">
              Un saludo,<br>
              <strong style="color: #4A7C59;">El equipo de ASRAM Madrid</strong>
            </p>
          </div>

          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p><strong>ASRAM Madrid</strong> - Asociación para el Reciclaje de Aceite en Madrid</p>
            <p>🌿 Juntos construimos un Madrid más sostenible</p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Applicant confirmation email sent:", applicantEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        adminEmail: adminEmailResponse,
        applicantEmail: applicantEmailResponse 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-solicitud-voluntario function:", error);
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
