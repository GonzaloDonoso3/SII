import { Sucursal } from '../shared/sucursal';
import { Usuario } from '../shared/usuario';

export class ProyectoAgrofirma {
    id!: string;
    nombre!: string;
    ubicacion!: string;
    geoLocation!: string;
    fechaIncio!: Date;
    estado!: boolean;
    totalInversion!: number;
    capitalInicial!: number;
    idSucursal!: number;
    idUsuario!: number;
    
    Sucursal!: Sucursal;    
    Usuario!: Usuario;    
    }
  