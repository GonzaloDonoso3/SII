import { Sucursal } from '../shared/sucursal';
import { Usuario } from '../shared/usuario';

export class EgresosRentacar {
    id!: number;
    tipoEgreso!: string;
    fecha!: string;
    monto!: number;
    responsable!: string;
    descripcion!: string;
    idSucursal!: number;
    idUsuario!: number;
    RespaldoEgresos!: any[];
    idArriendo!: number;
    sucursal!: string;
    usuario!: string;
    
    Sucursal!: Sucursal;
    Usuario!: Usuario;
  }