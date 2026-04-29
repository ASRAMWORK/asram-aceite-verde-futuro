-- Eliminar la política permisiva que dejaba leer a cualquier autenticado
DROP POLICY IF EXISTS "Authenticated users can view solicitudes" ON public.solicitudes_convocatoria;

-- Asegurar RLS habilitado
ALTER TABLE public.solicitudes_convocatoria ENABLE ROW LEVEL SECURITY;

-- Mantener INSERT público (formulario abierto)
-- (la política "Anyone can submit solicitudes" ya existe y se conserva)

-- Bloquear explícitamente SELECT/UPDATE/DELETE para anon y authenticated.
-- Solo service_role (usado por edge functions y herramientas internas) podrá acceder.
CREATE POLICY "No public select on solicitudes"
ON public.solicitudes_convocatoria
FOR SELECT
TO anon, authenticated
USING (false);

CREATE POLICY "No public update on solicitudes"
ON public.solicitudes_convocatoria
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "No public delete on solicitudes"
ON public.solicitudes_convocatoria
FOR DELETE
TO anon, authenticated
USING (false);