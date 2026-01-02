-- Create table for convocatorias (ayudas/grants)
CREATE TABLE public.convocatorias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  categoria TEXT NOT NULL,
  bonificacion_maxima INTEGER NOT NULL DEFAULT 50,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  estado TEXT NOT NULL DEFAULT 'cerrada',
  requisitos TEXT[],
  documentos_requeridos TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for solicitudes de convocatorias
CREATE TABLE public.solicitudes_convocatoria (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  convocatoria_id UUID REFERENCES public.convocatorias(id) ON DELETE CASCADE,
  nombre_comunidad TEXT NOT NULL,
  cif TEXT NOT NULL,
  direccion TEXT NOT NULL,
  codigo_postal TEXT NOT NULL,
  ciudad TEXT NOT NULL,
  provincia TEXT NOT NULL,
  nombre_contacto TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,
  numero_viviendas INTEGER,
  participa_programa BOOLEAN DEFAULT false,
  programa_participacion TEXT,
  observaciones TEXT,
  estado TEXT NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.convocatorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitudes_convocatoria ENABLE ROW LEVEL SECURITY;

-- Public can view open convocatorias
CREATE POLICY "Convocatorias are publicly viewable"
ON public.convocatorias
FOR SELECT
USING (true);

-- Anyone can submit a solicitud (public form)
CREATE POLICY "Anyone can submit solicitudes"
ON public.solicitudes_convocatoria
FOR INSERT
WITH CHECK (true);

-- Solicitudes can only be viewed by authenticated users (for admin)
CREATE POLICY "Authenticated users can view solicitudes"
ON public.solicitudes_convocatoria
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Insert initial convocatoria de jardinería (abierta)
INSERT INTO public.convocatorias (nombre, descripcion, categoria, bonificacion_maxima, fecha_inicio, fecha_fin, estado, requisitos, documentos_requeridos)
VALUES (
  'Servicios de Jardinería Comunitaria 2025',
  'Bonificación de hasta el 50% en servicios de jardinería para comunidades de propietarios participantes en programas ASRAM. Incluye mantenimiento de zonas verdes, poda, plantación y asesoramiento técnico.',
  'jardineria',
  50,
  '2025-01-01',
  '2025-06-30',
  'abierta',
  ARRAY['Ser participante activo de algún programa ASRAM', 'Comunidad de propietarios legalmente constituida', 'Estar al corriente de obligaciones fiscales'],
  ARRAY['CIF de la comunidad', 'Acta de la junta aprobando la solicitud', 'Presupuesto del servicio de jardinería']
);

-- Insert convocatorias cerradas/próximas
INSERT INTO public.convocatorias (nombre, descripcion, categoria, bonificacion_maxima, fecha_inicio, fecha_fin, estado, requisitos, documentos_requeridos)
VALUES 
(
  'Servicios de Limpieza Comunitaria 2025',
  'Bonificación de hasta el 40% en servicios de limpieza para zonas comunes. Incluye limpieza de portales, escaleras, garajes y zonas de tránsito.',
  'limpieza',
  40,
  '2025-03-01',
  '2025-09-30',
  'proxima',
  ARRAY['Ser participante activo de algún programa ASRAM', 'Comunidad de propietarios legalmente constituida'],
  ARRAY['CIF de la comunidad', 'Acta de la junta aprobando la solicitud']
),
(
  'Servicios de Portería 2025',
  'Bonificación de hasta el 35% en servicios de conserjería y portería. Incluye servicio de recepción, control de accesos y gestión de paquetería.',
  'porteria',
  35,
  '2025-04-01',
  '2025-12-31',
  'proxima',
  ARRAY['Ser participante activo de algún programa ASRAM', 'Comunidad con más de 20 viviendas'],
  ARRAY['CIF de la comunidad', 'Certificado de número de viviendas']
),
(
  'Optimización de Consumo Eléctrico 2025',
  'Asesoramiento y bonificación de hasta el 45% en servicios de auditoría energética y optimización del consumo eléctrico en zonas comunes.',
  'electricidad',
  45,
  '2025-05-01',
  '2025-11-30',
  'proxima',
  ARRAY['Ser participante activo de algún programa ASRAM', 'Disponer de contador comunitario'],
  ARRAY['CIF de la comunidad', 'Última factura eléctrica de zonas comunes']
),
(
  'Actividades Infantiles Comunitarias 2025',
  'Bonificación de hasta el 50% en talleres y actividades infantiles para los niños de la comunidad. Incluye talleres de reciclaje, huerto urbano y educación ambiental.',
  'infantil',
  50,
  '2025-06-01',
  '2025-12-31',
  'proxima',
  ARRAY['Ser participante activo de algún programa ASRAM', 'Mínimo 10 niños inscritos'],
  ARRAY['CIF de la comunidad', 'Listado de niños participantes']
);