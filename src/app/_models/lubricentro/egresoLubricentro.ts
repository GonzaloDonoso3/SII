import { Sucursal } from '../shared/sucursal';
import { Usuario } from '../shared/usuario';

// TODO  agregar atributos de la entidad
export class EgresoLubricentro {
    id!: string;
    fecha!: Date;
    monto!: number;
    idSucursal!: number;
    idUsuario!: number;
    tipoEgreso!: string;
    descripcion!: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Sucursal!: Sucursal;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Usuario!: Usuario;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    RespaldoEgresoLubricentros!: any[];
    responsable!: string;
    usuario!: string;
    sucursal!: string;
    fechaf!: string;
    idIngreso!: string;


}
