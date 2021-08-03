import { ProyectoAgrofirma } from "./proyectoAgroFirma"

export class IngresoAgroFirma {
    id!: number
    fecha!: string
    monto!: number
    nDocumento!: string
    descripcionIngreso!: string
    tipoIngreso!: string
    estadoPago!: string
    nAutorizacion!: string
    proyecto!: ProyectoAgrofirma
}