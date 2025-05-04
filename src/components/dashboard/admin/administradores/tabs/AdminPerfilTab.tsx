
import React from 'react';
import { Usuario } from '@/types';

interface AdminPerfilTabProps {
  admin: Usuario;
}

const AdminPerfilTab: React.FC<AdminPerfilTabProps> = ({ admin }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Información personal</h3>
          <dl className="space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <dt className="font-medium text-gray-500">Nombre</dt>
              <dd className="col-span-2">{admin.nombre} {admin.apellidos || ''}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="font-medium text-gray-500">Email</dt>
              <dd className="col-span-2">{admin.email}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="font-medium text-gray-500">Teléfono</dt>
              <dd className="col-span-2">{admin.telefono || '—'}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="font-medium text-gray-500">Fecha de registro</dt>
              <dd className="col-span-2">
                {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : '—'}
              </dd>
            </div>
          </dl>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-4">Información de la administración</h3>
          <dl className="space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <dt className="font-medium text-gray-500">Nombre</dt>
              <dd className="col-span-2">{admin.nombreAdministracion || '—'}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="font-medium text-gray-500">CIF</dt>
              <dd className="col-span-2">{admin.cif || '—'}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="font-medium text-gray-500">Dirección</dt>
              <dd className="col-span-2">{admin.direccion || '—'}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="font-medium text-gray-500">Ciudad</dt>
              <dd className="col-span-2">{admin.ciudad || '—'}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="font-medium text-gray-500">Provincia</dt>
              <dd className="col-span-2">{admin.provincia || '—'}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="font-medium text-gray-500">Código postal</dt>
              <dd className="col-span-2">{admin.codigoPostal || '—'}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default AdminPerfilTab;
