import { Sucursal } from '../shared/sucursal';
import { Usuario } from '../shared/usuario';

export class IngresosInmobiliaria {
  id!: number;
  propiedad !: string;
  fecha !: Date;
  monto !: number;
  sucursal!: string;
  usuario!: string;
  tipoIngreso !: string;
  descripcionIngreso !: string;
  Sucursal!: Sucursal;
  Usuario!: Usuario;
  RespaldoIngresoInmobiliaria!: any[];
}