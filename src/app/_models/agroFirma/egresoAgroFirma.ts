import { Sucursal } from '../shared/sucursal';
import { Usuario } from '../shared/usuario';

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
  RespaldoEgresos!: any[];
  responsable!: string;
  usuario!: string;
  sucursal!: string;
  fechaf!: string;
  numeroCuota!: string;
  }
  