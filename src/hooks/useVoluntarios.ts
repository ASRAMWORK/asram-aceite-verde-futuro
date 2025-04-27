import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Voluntario } from '@/types';
import { useToast } from '@/components/ui/use-toast';

export const useVoluntarios = () => {
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadVoluntariosData = async () => {
    setLoading(true);
    try {
      const storedData = localStorage.getItem('voluntarios');
      if (storedData) {
        setVoluntarios(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Error loading voluntarios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVoluntariosData();
  }, []);

  useEffect(() => {
    localStorage.setItem('voluntarios', JSON.stringify(voluntarios));
  }, [voluntarios]);

  const addVoluntario = async (data: Omit<Voluntario, 'id'>) => {
    const id = uuidv4();
    try {
      const nuevoVoluntario: Voluntario = {
        id,
        email: data.email || '',
        nombre: data.nombre || '',
        apellido: data.apellido || '', // Changed from apellidos to apellido
        telefono: data.telefono || '',
        direccion: data.direccion || '',
        ciudad: data.ciudad || '',
        provincia: data.provincia || '',
        codigoPostal: data.codigoPostal || '',
        pais: data.pais || 'España',
        activo: data.activo !== undefined ? data.activo : true,
        dni: data.dni || '',
        fechaNacimiento: data.fechaNacimiento || null,
        diasDisponibles: data.diasDisponibles || [],
        horasDisponibles: data.horasDisponibles || '',
        habilidades: data.habilidades || [],
        experiencia: data.experiencia || '',
        createdAt: data.createdAt || new Date(),
        updatedAt: data.updatedAt || new Date()
      };
      
      setVoluntarios(prev => [...prev, nuevoVoluntario]);
      
      toast({
        title: "Éxito",
        description: "Voluntario añadido correctamente."
      });
      
      return nuevoVoluntario;
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al añadir el voluntario."
      });
      throw error;
    }
  };

  const updateVoluntario = async (id: string, data: Partial<Voluntario>): Promise<boolean> => {
    try {
      setVoluntarios(voluntarios.map(voluntario =>
        voluntario.id === id ? { ...voluntario, ...data, updatedAt: new Date() } : voluntario
      ));

      toast({
        title: "Éxito",
        description: "Voluntario actualizado correctamente.",
      });

      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar el voluntario.",
      });
      return false;
    }
  };

  const deleteVoluntario = async (id: string): Promise<boolean> => {
    try {
      setVoluntarios(voluntarios.filter(voluntario => voluntario.id !== id));

      toast({
        title: "Éxito",
        description: "Voluntario eliminado correctamente.",
      });

      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al eliminar el voluntario.",
      });
      return false;
    }
  };

  const getVoluntario = async (id: string): Promise<Voluntario | null> => {
    const voluntario = voluntarios.find(v => v.id === id);
    return voluntario || null;
  };

  return {
    voluntarios,
    loading,
    loadVoluntariosData,
    addVoluntario,
    updateVoluntario,
    deleteVoluntario,
    getVoluntario
  };
};
