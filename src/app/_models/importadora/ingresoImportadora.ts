import { Sucursal } from '../shared/sucursal'
import { Usuario } from '../shared/usuario'

export class IngresosImportadora {
  id!: number
  vendedor!: string
  tipoIngreso!: string
  medioPago!: string
  codigoAutorizacion!: string
  descripcionIngreso!: string
  monto!: number
  fecha!: Date

  sucursal!: string
  usuario!: string
  Sucursal!: Sucursal
  Usuario!: Usuario
  RespaldoIngresoImportadora!: any[]
}
