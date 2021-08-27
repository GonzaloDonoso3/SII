import { Sucursal } from '../shared/sucursal'
import { Usuario } from '../shared/usuario'

export class EgresosFijoImportadora {
  id!: number;
  tipoEgreso!: string;
  fecha!: Date
  monto!: number;
  descripcion!: string;

  sucursal!: string;
  usuario!: string;
  Sucursal!: Sucursal;
  Usuario!: Usuario;
  numeroCuota!: string;
  RespaldoEgresoFijoImportadoras!: any[];
}
