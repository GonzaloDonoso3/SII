import { Rol } from '../shared/rol';

export class Usuario {

    id!: number;
    nombreUsuario!: string;
    hash!: string;
    nombre!: string;
    apellido!: string;
    rol!: string;
    
    // eslint-disable-next-line @typescript-eslint/naming-convention
    RolID!: number;
    token!: string;

    ROL!: Rol;


}
