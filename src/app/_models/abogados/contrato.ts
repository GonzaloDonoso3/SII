import { Sucursal } from '../shared/sucursal';
import { Usuario } from '../shared/usuario';
import { Cliente } from '../shared/cliente';

export class Contrato {
    id!: string;
    nContrato!: number;
    estadoPago!: string;
    montoContrato!: number;
    saldoPendiente!: number;
    idCliente!: number;
    idSucursal!: number;
    idUsuario!: number;
    fechaContrato!: string;
    sucursal !: string;
    usuario !: string;
    cliente !: string;
    rut !: string;

    Sucursal !: Sucursal;
    Usuario !: Usuario;
    Cliente !: Cliente;
  }