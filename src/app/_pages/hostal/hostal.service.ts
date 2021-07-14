/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EgresoHostal } from '@app/_models/hostal/egresoHostal';
import { IngresosHostal } from '@app/_models/hostal/ingresoHostal';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConsolidadosHostal } from '@app/_models/hostal/consolidadosHostal';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class HostalService {
  // public values
  public tiposIngresosList: Observable<string[]>;
  public tiposClientesList: Observable<string[]>;
  public referenciasList: Observable<string[]>;
  public tiposPagosList: Observable<string[]>;
  public estadosPagosList: Observable<string[]>;
  //egresos values
  public tiposEgresosList: Observable<string[]>;

  // private values

  //ingresos values
  private tiposIngresosListSubject: BehaviorSubject<any[]>;
  private tiposClientesListSubject: BehaviorSubject<string[]>;
  private referenciasListSubject: BehaviorSubject<string[]>;
  private tiposPagosListSubject: BehaviorSubject<string[]>;
  private estadosPagosListSubject: BehaviorSubject<string[]>;
  //egresos values
  private tiposEgresosListSubject: BehaviorSubject<string[]>;

  // ! strict lists
  private tiposIngresos = ['Alojamiento', 'Desayuno', 'Almuerzo', 'Cena', ' Consumo Bebidas', 'Consumo Varios'];
  private tiposClientes = ['Particular', 'Empresa'];
  private referencias = ['Llamada', 'Booking', 'Correo', 'PaginaWeb', 'Facebook'];
  private tiposPagos = ['Efectivo', 'Debito', 'Credito', 'Transferencia', 'Cheque'];
  private estadosPagos = ['PENDIENTE', 'PAGADO'];

  private tiposEgresos = ['Gastos', 'Costos', 'Remuneraciones', 'Impuestos', 'Bancarios'];
  private empresa = 'Hostal';
  constructor(private http: HttpClient, private router: Router) {
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

  /* ingresos */
  ingresoRegistrar(ingresos: IngresosHostal) {
    console.log(ingresos);
    return this.http.post(
      `${environment.apiUrl}/ingreso${this.empresa}/conRespaldo`,
      ingresos
    );
  }
  ingresoGetAll(): any {
    return this.http.get<[]>(`${environment.apiUrl}/ingresoHostal`);
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
  egresoRegistrar(egreso: EgresoHostal): any {    
    return this.http.post(      
      `${environment.apiUrl}/egreso${this.empresa}/conRespaldo`,
      egreso      
    );
  }
  egresoGetAll(): any {    
    return this.http.get<[]>(`${environment.apiUrl}/egresoHostal`);
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
  getById(id: string): any {    
    return this.http.get<any>(
      `${environment.apiUrl}/egreso${this.empresa}/${id}`
    );
  }
  /* /egresos */


  /* CONSOLIDADOS */  
  buscarConsolidado(consolidado: ConsolidadosHostal): any { 
    //console.log("probando formulario", consolidado)   
    return this.http.post(      
      `${environment.apiUrl}/ingreso${this.empresa}/ingresosEgresos`,
      consolidado      
    );
  }

  // METODO PARA EXPORTAR EXCEL
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
      fileName + 'export' + new Date().getTime() + EXCEL_EXTENSION
    );
  }
  
}
