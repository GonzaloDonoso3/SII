import { Sucursal } from '../shared/sucursal';
import { Usuario } from '../shared/usuario';
import { ProyectoAgrofirma } from '../agroFirma/proyectoAgroFirma';

export class EgresoAgroFirma {
  id!: string;
  fecha!: Date;
  monto!: number;
  idSucursal!: number;
  idUsuario!: number;
  tipoEgreso!: string;
  descripcion!: string;
  Sucursal!: Sucursal;
  Usuario!: Usuario;
  ProyectoAgrofirma!: ProyectoAgrofirma;
  proyecto!: string;
  RespaldoEgresos!: any[];
  responsable!: string;
  usuario!: string;
  sucursal!: string;
  fechaf!: string;
  numeroCuota!: string;
  idProyecto!: number;
  }
  