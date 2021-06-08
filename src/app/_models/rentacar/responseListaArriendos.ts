
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
    fechaDespacho: Date;
    fechaRecepcion: Date;
    sucursalResponsable: SucursalResponsable;
    diasTotales: number;
    usuario: Usuario;
}

export interface Contrato {
    numero: number;
    fecha: Date;
    url: string;
}

export enum InfoArriendoEstado {
    Activo = "ACTIVO",
    Confirmado = "CONFIRMADO",
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

export enum Usuario {
    CarolinaGrupoFirma = "CAROLINA GRUPO FIRMA",
    ContactoRancagua = "CONTACTO RANCAGUA",
    DiegoAntonioRiosRojas = "DIEGO ANTONIO RIOS ROJAS",
    IndiraGrupoFirma = "INDIRA GRUPO FIRMA",
    KarlaBarreto = "KARLA BARRETO",
    RitaAravenaVasquez = "RITA ARAVENA VASQUEZ",
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
    updatedAt: Date;
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
    estado?: PagoEstado;
    updatedAt: Date;
}

export interface InfoVehiculo {
    patente: string;
    marca: Marca;
    modelo: string;
    año: number;
    kilomentrosEnDespacho: number;
    kilomentrosEnRecepcion: number | null;
}

export enum Marca {
    Chevrolet = "CHEVROLET",
    Fiat = "FIAT ",
    Hyundai = "HYUNDAI",
    Kia = "KIA ",
    MarcaCHEVROLET = "CHEVROLET ",
    MarcaKIA = "KIA",
    MarcaNISSAN = "NISSAN",
    MarcaRENAULT = "RENAULT",
    MarcaSSANYONG = "SSANYONG",
    MarcaVOLKSWAGEN = "VOLKSWAGEN ",
    Mitsubichi = "MITSUBICHI ",
    Mitsubishi = "MITSUBISHI ",
    Nissan = "NISSAN ",
    Renault = "RENAULT ",
    Ssanyong = "SSANYONG ",
    Volkswagen = "VOLKSWAGEN",
}
