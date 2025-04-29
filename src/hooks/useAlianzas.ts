
import { useState, useEffect } from 'react';
import { AlianzaVerde } from '@/types';

export function useAlianzas() {
  const [alianzas, setAlianzas] = useState<AlianzaVerde[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for alianzas
    const mockAlianzas: AlianzaVerde[] = [
      {
        id: '1',
        nombre: 'Colegio San Patricio',
        tipo: 'colegio',
        direccion: 'Calle Principal 123',
        ciudad: 'Madrid',
        provincia: 'Madrid',
        codigoPostal: '28001',
        telefono: '915556677',
        email: 'info@sanpatricio.edu',
        contacto: 'María González',
        numAlumnos: 450,
        numContenedores: 5,
        litrosRecogidos: 120,
        activo: true,
        fechaInicio: new Date('2023-01-15'),
        createdAt: new Date('2023-01-10'),
        updatedAt: new Date('2023-04-20'),
        distrito: 'Centro',
        barrio: 'Sol',
        numEstudiantes: 450,
        talleresRealizados: 3,
        certificaciones: [1, 2],
        numParticipantes: 200,
        estado: 'activo'
      },
      {
        id: '2',
        nombre: 'Instituto Lope de Vega',
        tipo: 'instituto',
        direccion: 'Avenida de la Educación 45',
        ciudad: 'Madrid',
        provincia: 'Madrid',
        codigoPostal: '28015',
        telefono: '914445566',
        email: 'secretaria@lopedevega.edu',
        contacto: 'Carlos Martínez',
        numAlumnos: 780,
        numContenedores: 8,
        litrosRecogidos: 230,
        activo: true,
        fechaInicio: new Date('2023-02-10'),
        createdAt: new Date('2023-02-05'),
        updatedAt: new Date('2023-05-15'),
        distrito: 'Chamberí',
        barrio: 'Arapiles',
        numEstudiantes: 780,
        talleresRealizados: 5,
        certificaciones: [1],
        numParticipantes: 350,
        estado: 'activo'
      }
    ];

    setAlianzas(mockAlianzas);
    setLoading(false);
  }, []);

  const addAlianza = async (alianzaData: Partial<AlianzaVerde>) => {
    const newAlianza: AlianzaVerde = {
      id: Date.now().toString(),
      nombre: alianzaData.nombre || '',
      tipo: alianzaData.tipo || '',
      direccion: alianzaData.direccion || '',
      ciudad: alianzaData.ciudad || '',
      provincia: alianzaData.provincia || '',
      codigoPostal: alianzaData.codigoPostal || '',
      telefono: alianzaData.telefono || '',
      email: alianzaData.email || '',
      contacto: alianzaData.contacto || '',
      numAlumnos: alianzaData.numAlumnos || 0,
      numContenedores: alianzaData.numContenedores || 0,
      litrosRecogidos: alianzaData.litrosRecogidos || 0,
      activo: alianzaData.activo ?? true,
      fechaInicio: alianzaData.fechaInicio || new Date(),
      fechaFin: alianzaData.fechaFin,
      createdAt: new Date(),
      updatedAt: new Date(),
      distrito: alianzaData.distrito || '',
      barrio: alianzaData.barrio || '',
      numEstudiantes: alianzaData.numEstudiantes || 0,
      talleresRealizados: alianzaData.talleresRealizados || 0,
      certificaciones: alianzaData.certificaciones || [],
      numParticipantes: alianzaData.numParticipantes || 0,
      estado: alianzaData.estado || 'activo'
    };

    setAlianzas([...alianzas, newAlianza]);
    return newAlianza;
  };

  const updateAlianza = async (id: string, alianzaData: Partial<AlianzaVerde>) => {
    const updatedAlianzas = alianzas.map(alianza => {
      if (alianza.id === id) {
        return { ...alianza, ...alianzaData, updatedAt: new Date() };
      }
      return alianza;
    });

    setAlianzas(updatedAlianzas);
  };

  const deleteAlianza = async (id: string) => {
    const filteredAlianzas = alianzas.filter(alianza => alianza.id !== id);
    setAlianzas(filteredAlianzas);
  };

  return {
    alianzas,
    loading,
    addAlianza,
    updateAlianza,
    deleteAlianza
  };
}
