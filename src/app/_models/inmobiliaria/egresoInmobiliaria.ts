import { Sucursal } from '../shared/sucursal';
import { Usuario } from '../shared/usuario';

export class EgresosInmobiliaria {
  id!: number;
  propiedad!: string;
  tipoEgreso!: string;
  fecha!: Date;
  monto!: number;
  sucursal!: string;
  usuario!: string;
  responsable!: string;
  descripcion!: string;
  Sucursal!: Sucursal;
  Usuario!: Usuario;
  RespaldoEgresoInmobiliaria!: any[];
}