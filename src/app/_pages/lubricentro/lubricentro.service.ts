/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EgresoLubricentro } from '@app/_models/lubricentro/egresoLubricentro';
import { EgresoLubricentroCuota } from '@app/_models/lubricentro/egresoLubricentroCuota';
import { IngresosLubricentro } from '@app/_models/lubricentro/ingresoLubricentro';
import { environment } from '@environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LubricentroEgresosCuotasComponent } from '@app/_pages/lubricentro/lubricentro-egresos/lubricentro-egresos-list/lubricentro-egresos-cuotas/lubricentro-egresos-cuotas.component';
import { LubricentroEgresosCuotaDialogComponent } from '@app/_pages/lubricentro/lubricentro-egresos/lubricentro-egresos-list/lubricentro-egresos-cuotas/lubricentro-egresos-cuota-dialog/lubricentro-egresos-cuota-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

/* Imports Excel */
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
/* Fin Import Excel */

@Injectable({
  providedIn: 'root'
})
export class LubricentroService {
  public tiposIngresosList: Observable<string[]>;
  public tiposClientesList: Observable<string[]>;
  public referenciasList: Observable<string[]>;
  public tiposPagosList: Observable<string[]>;
  public estadosPagosList: Observable<string[]>;
  public tiposEgresosList: Observable<string[]>;
  public tiposVehiculosList: Observable<string[]>;
  // private values

  //ingresos values
  private tiposIngresosListSubject: BehaviorSubject<any[]>;
  private tiposClientesListSubject: BehaviorSubject<string[]>;
  private referenciasListSubject: BehaviorSubject<string[]>;
  private tiposPagosListSubject: BehaviorSubject<string[]>;
  private estadosPagosListSubject: BehaviorSubject<string[]>;
  private tiposVehiculosListSubject: BehaviorSubject<string[]>;
  //egresos values
  private tiposEgresosListSubject: BehaviorSubject<string[]>;

  // ! strict lists
  private tiposIngresos = ['Lavado', 'Reparacion', 'Mantencion', 'Venta de Insumos'];
  private tiposClientes = ['Particular', 'Empresa'];
  private referencias = ['Llamada', 'Booking', 'Correo', 'PaginaWeb', 'Facebook', 'Institucion Publica', 'otros...'];
  private tiposPagos = ['Efectivo', 'Debito', 'Credito', 'Transferencia', 'Cheque', 'Entidad Publica', 'pago 30 dias'];
  private estadosPagos = ['BOLETA', 'FACTURA'];

  private tiposEgresos = ['Gastos', 'Costos', 'Remuneraciones', 'Impuestos', 'Bancarios'];
  private empresa = 'Lubricentro';  
  private tiposVehiculos = ['Automóvil', 'Camioneta'];
  constructor(private http: HttpClient, private router: Router, public dialog:MatDialog, private snackBar: MatSnackBar) {
    //Init private Subjects;
    //ingresos;

    this.tiposIngresosListSubject = new BehaviorSubject<string[]>(
      JSON.parse(localStorage.getItem('tiposIngresos')!)
    );
    this.tiposClientesListSubject = new BehaviorSubject<string[]>(
      JSON.parse(localStorage.getItem('tipos_clientes')!)
    );
    this.referenciasListSubject = new BehaviorSubject<string[]>(
      JSON.parse(localStorage.getItem('referencias')!)
    );
    this.tiposPagosListSubject = new BehaviorSubject<string[]>(
      JSON.parse(localStorage.getItem('tipos_pagos')!)
    );
    this.estadosPagosListSubject = new BehaviorSubject<string[]>(
      JSON.parse(localStorage.getItem('estadosPagos')!)
    );
    //egresos;
    this.tiposEgresosListSubject = new BehaviorSubject<string[]>(
      JSON.parse(localStorage.getItem('tiposEgresos')!)
    );
    this.tiposVehiculosListSubject = new BehaviorSubject<string[]>(
      JSON.parse(localStorage.getItem('tiposVehiculos')!)
    );

    // public states:
    //ingresos;
    this.tiposIngresosList = this.tiposIngresosListSubject.asObservable();
    localStorage.setItem('tiposIngresos', JSON.stringify(this.tiposIngresos));

    this.tiposClientesList = this.tiposClientesListSubject.asObservable();
    localStorage.setItem('tipos_clientes', JSON.stringify(this.tiposClientes));

    this.referenciasList = this.referenciasListSubject.asObservable();
    localStorage.setItem('referencias', JSON.stringify(this.referencias));

    this.tiposPagosList = this.tiposPagosListSubject.asObservable();
    localStorage.setItem('tipos_pagos', JSON.stringify(this.tiposPagos));

    this.estadosPagosList = this.estadosPagosListSubject.asObservable();
    localStorage.setItem('estadosPagos', JSON.stringify(this.estadosPagos));

    this.tiposVehiculosList = this.tiposVehiculosListSubject.asObservable();
    localStorage.setItem('tiposVehiculos', JSON.stringify(this.tiposVehiculos));


    //egresos;
    this.tiposEgresosList = this.tiposEgresosListSubject.asObservable();
    localStorage.setItem('tiposEgresos', JSON.stringify(this.tiposEgresos));


  }

  //ingresos values get methods:
  public get tiposIngresosListValue(): string[] {
    return this.tiposIngresosListSubject.value;
  }
  public get tiposClientesListValue(): string[] {
    return this.tiposClientesListSubject.value;
  }
  public get referenciasListValue(): string[] {
    return this.referenciasListSubject.value;
  }
  public get tiposPagosListValue(): string[] {
    return this.tiposPagosListSubject.value;
  }
  public get estadosPagosListValue(): string[] {
    return this.estadosPagosListSubject.value;
  }
  //egresos values get methods:
  public get tiposEgresosListValue(): string[] {
    return this.tiposEgresosListSubject.value;
  }
  public get tiposVehiculosListValue(): string[] {
    return this.tiposVehiculosListSubject.value;
  }

  /* ingresos */
  ingresoRegistrar(ingresos: IngresosLubricentro) {
    return this.http.post(
      `${environment.apiUrl}/ingreso${this.empresa}/conRespaldo`,
      ingresos
    );
  }
  ingresoGetAll(): any {
    return this.http.get<IngresosLubricentro[]>(`${environment.apiUrl}/ingreso${this.empresa}`);
  }
  ingresoGetFiles(fileName: string) {
    const extencion = fileName.split('.');
    const extend = extencion[1];
    return this.http
      .get(`${environment.apiUrl}/ingreso${this.empresa}/download/${fileName}`, {
        responseType: 'blob',
      })
      .subscribe((res) => {
        window.open(window.URL.createObjectURL(res));
      });
  }

  buscarImagen(url: string) {    
    const extencion = url.split('.');
    const extend = extencion[1];    
    return this.http
    .get(`${environment.apiUrl}/ingreso${this.empresa}/download/${url}`, {
        responseType: 'blob',
      })      
  }

  ingresoGetAllWithUsuario() {
    return this.http.get<[]>(
      `${environment.apiUrl}/ingreso${this.empresa}/conUsuario`
    );
  }
  ingresoGetById(id: string) {
    return this.http.get(
      `${environment.apiUrl}/ingreso${this.empresa}/${id}`
    );
  }
  /* /ingresos */

  /* egresos */
  egresoRegistrar(egreso: EgresoLubricentro): any {
    return this.http.post(
      `${environment.apiUrl}/egreso${this.empresa}/conRespaldo`,
      egreso
    );
  }
  egresoGetAll(): any {
    return this.http.get<EgresoLubricentro[]>(`${environment.apiUrl}/egreso${this.empresa}`);
  }

  buscarCuotas(): any {
    return this.http.get<EgresoLubricentroCuota>(
      `${environment.apiUrl}/egresoLubricentroCuota/`
    );
  }

  egresoGetFiles(fileName: string): any {
    return this.http
      .get(`${environment.apiUrl}/egreso${this.empresa}/download/${fileName}`, {
        responseType: 'blob',
      })
      .subscribe((res) => {
        window.open(window.URL.createObjectURL(res));
      });
  }
  buscarImagenEgreso(url: string) {    
    const extencion = url.split('.');
    const extend = extencion[1];    
    return this.http
    .get(`${environment.apiUrl}/egreso${this.empresa}/download/${url}`, {
        responseType: 'blob',
      })      
  }
  
  getById(id: string): any {
    return this.http.get<EgresoLubricentro>(
      `${environment.apiUrl}/egreso${this.empresa}/${id}`
    );
  }

  /* Egresos Por cuotas */
  getCuotas(id: any) {    
    return this.http.get<EgresoLubricentroCuota>(
      `${environment.apiUrl}/egresoLubricentroCuota/${id}`
    );
  }

  buscarImagenCuota(url: string) {    
    const extencion = url.split('.');
    const extend = extencion[1];    
    return this.http
    .get(`${environment.apiUrl}/egresoLubricentroCuota/download/${url}`, {
        responseType: 'blob',
      })      
  }
  
  agregarRespaldos(arrayRespaldos: any): any {
    return this.http.post(
      `${environment.apiUrl}/egresoLubricentroCuota/agregarRespaldos/`,
      arrayRespaldos
    );
  }
  buscarImagenC(id: any): any {
    return this.http.get<EgresoLubricentroCuota>(
      `${environment.apiUrl}/respaldoEgresoLubricentroCuota/${id}`
    );
  }

  // Metodo que permite abrir un Dialog (Modal)
  openDialogCuota():void{
    const dialogRef = this.dialog.open(LubricentroEgresosCuotaDialogComponent, {})
    dialogRef.afterClosed().subscribe((res) => {})
  }

  updateMonto(id: any, body: any[]) {    
    return this.http.put(`${environment.apiUrl}/egresoLubricentroCuota/${id}`, body);                
  }

  // Metodo que permite abrir un Dialog (Modal)
  openDialogRegistrarPago(idEgreso: any):void{    
    //Si el cliente selecciono un contrato se habre el modal    
    if(idEgreso != null){
      const dialogRef = this.dialog.open(LubricentroEgresosCuotasComponent,{});
      dialogRef.afterClosed().subscribe(res =>{
        console.log(res);
      });
    }else{
      //Si no, se muestra un error
      this.snackBar.open('Por favor seleccione un egreso con cuotas sin pagar', 'cerrar', {
        duration: 2000,
        verticalPosition: 'top',
      });
    } 
  }

  /* Metodo Excel */
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  closeDialogModal(){
    this.dialog.closeAll();
    localStorage.removeItem("idEgresoPago");
  }

}
