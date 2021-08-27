import { Banco } from "./Banco"

export class CuentaRegistrada {
    id!: number
    tipoCuenta!: string
    numeroCuenta!: number
    Banco!: Banco
    idProyecto!: number
}