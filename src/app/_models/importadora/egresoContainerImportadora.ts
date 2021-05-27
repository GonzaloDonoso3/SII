import { Sucursal } from '../shared/sucursal';
import { Usuario } from '../shared/usuario';

export class EgresosContainerImportadora {
  id!: number;
  nContainer!: number;
  costoNeumatico!: number;
  costoComision!: number;
  costoInterior!: number;
  costoMaritimo!: number;
  impuestoProntuario!: number;
  montoTotal!: number;
  fecha!: Date;
  seguros!:number;

  idSucursal!: string;
  idUsuario!: number;
  sucursal!: string;
  usuario!: string;
  Sucursal!: Sucursal;
  Usuario!: Usuario;
  idContainer!: any[];
  RespaldoEgresoContainerImportadoras!: any[];
}