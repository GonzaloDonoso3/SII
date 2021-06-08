import { Empresa } from './empresa';

export class Sucursal extends Empresa {
  idEmpresa!: number;
  nombreEmpresa!: string;
  Empresa!: Empresa;
}
