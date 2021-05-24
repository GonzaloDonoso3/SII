import { Sucursal } from '../shared/sucursal'
import { Usuario } from '../shared/usuario'

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

  sucursal!: string;
  usuario!: number;
  Sucursal!: Sucursal;
  Usuario!: Usuario;
  neumatico!: any[];
  RespaldoEgresoContainerImportadora!: any[];
  
}