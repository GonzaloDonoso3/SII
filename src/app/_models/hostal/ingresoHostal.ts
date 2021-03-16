import { Sucursal } from '../shared/sucursal';
import { Usuario } from '../shared/usuario';

export class IngresosHostal {
    id!: string;
    fecha!: Date;
    monto!: number;
    idSucursal!: number;
    idUsuario!: number;
    estadoPago!: string;
    tipoPago!: string;
    tipoCliente!: string;
    cliente!: string;
    referenciaCliente!: string;
    tipoIngreso!: string;
    nDocumento!: string;
    descripcionIngreso!: string;
    nAutorizacion!: string;
    banco!: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Sucursal!: Sucursal;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Usuario!: Usuario;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    RespaldoIngresos!: any[];
    usuario!: string;
    sucursal!: string;
    fechaf!: string;
}
