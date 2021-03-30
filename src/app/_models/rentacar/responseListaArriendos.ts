export interface ResponseListaArriendos {
    success: boolean;
    data: Arriendo[];
}

export interface Arriendo {
    infoArriendo: InfoArriendo;
    infoCliente: InfoCliente;
    infoVehiculo: InfoVehiculo;
    infoConductores: InfoConductore[];
    infoPagos: InfoPagos;
}

export interface InfoArriendo {
    contratos: Contrato[];
    numeroArriendo: number;
    estado: InfoArriendoEstado;
    tipo: InfoArriendoTipo;
    fechaDespacho: string;
    fechaRecepcion: string;
    sucursalResponsable: SucursalResponsable;
    diasTotales: number;
}

export interface Contrato {
    numero: number;
    fecha: string;
    url: string;
}

export enum InfoArriendoEstado {
    Activo = "ACTIVO",
    EConfirmado = "E-CONFIRMADO",
    Finalizado = "FINALIZADO",
    Firmado = "FIRMADO",
    Pendiente = "PENDIENTE",
    Recepcionado = "RECEPCIONADO",
}

export enum SucursalResponsable {
    Curico = "CURICO",
    Linares = "LINARES",
    Rancagua = "RANCAGUA",
    Talca = "TALCA",
}

export enum InfoArriendoTipo {
    Empresa = "EMPRESA",
    Particular = "PARTICULAR",
    Reemplazo = "REEMPLAZO",
}

export interface InfoCliente {
    nombre: string;
    rut: string;
}

export interface InfoConductore {
    rut: string;
}

export interface InfoPagos {
    ingresoTotal: number;
    diasTotales: number;
    arrayPagosCliente: ArrayPagosClienteClass;
    arrayPagosReemplazo: ArrayPagosClienteClass;
    arrayPagosDanio: ArrayPagosDanioClass;
    arrayPagosExtras: ArrayPagosDanioClass;
}

export interface ArrayPagosClienteClass {
    montoTotal: number;
    comprobantes: Comprobante[];
    pagos: ArrayPagosClientePago[];
}

export interface Comprobante {
    abono: number;
    tipo: ComprobanteTipo;
    folio: number;
    metodoPago: MetodoPago;
    url: string;
}

export enum MetodoPago {
    Cheque = "CHEQUE",
    Efectivo = "EFECTIVO",
    TarjetaDebitoCredito = "TARJETA DEBITO/CREDITO",
    TransferenciaElectronica = "TRANSFERENCIA ELECTRONICA",
}

export enum ComprobanteTipo {
    Boleta = "BOLETA",
    Factura = "FACTURA",
}

export interface ArrayPagosClientePago {
    dias: number;
    monto: number;
    deudor: string;
    estado: PagoEstado;
    updatedAt: string;
    descripcion?: string;
}

export enum PagoEstado {
    Pagado = "PAGADO",
    Pendiente = "PENDIENTE",
    Vigente = "VIGENTE",
}

export interface ArrayPagosDanioClass {
    montoTotal: number;
    comprobantes: Comprobante[];
    pagos: ArrayPagosDanioPago[];
}

export interface ArrayPagosDanioPago {
    monto: number;
    detalle: string;
    updatedAt: string;
    estado?: PagoEstado;
}

export interface InfoVehiculo {
    patente: string;
    marca: string;
    modelo: string;
    año: number;
    kilomentrosEnDespacho: number;
    kilomentrosEnRecepcion: number | null;
}
