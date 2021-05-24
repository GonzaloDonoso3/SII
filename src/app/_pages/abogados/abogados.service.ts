import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RegistroEgresoFirma } from '@app/_models/abogados/egresosFirma';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class AbogadosService {
  
  // PUBLIC VALUES
  public tiposIngresosList: Observable<string[]>;
  public tiposClientesList: Observable<string[]>;
  public referenciasList: Observable<string[]>;
  public tiposPagosList: Observable<string[]>;
  public estadosPagosList: Observable<string[]>;
  //EGRESOS VALUES
  public tiposEgresosList: Observable<string[]>;


  // PRIVATE VALUES

  //INGRESOS VALUES
  private tiposIngresosListSubject: BehaviorSubject<any[]>;
  private tiposClientesListSubject: BehaviorSubject<string[]>;
  private referenciasListSubject: BehaviorSubject<string[]>;
  private tiposPagosListSubject: BehaviorSubject<string[]>;
  private estadosPagosListSubject: BehaviorSubject<string[]>;
  //EGRESOS VALUES
  private tiposEgresosListSubject: BehaviorSubject<string[]>;

  // STRICT LISTS
  private tiposIngresos = ['Alojamiento', 'Desayuno', 'Almuerzo', 'Cena', ' Consumo Bebidas', 'Consumo Varios'];
  private tiposClientes = ['Particular', 'Empresa'];
  private referencias = ['Llamada', 'Booking', 'Correo', 'PaginaWeb', 'Facebook'];
  private tiposPagos = ['Efectivo', 'Debito', 'Credito', 'Transferencia', 'Cheque'];
  private estadosPagos = ['PENDIENTE', 'PAGADO'];

  private tiposEgresos = ['Gastos', 'Costos', 'Remuneraciones', 'Impuestos', 'Bancarios'];
  private empresa = 'FirmaAbogado';
  constructor(private http: HttpClient, private router: Router) {
    
    //INGRESOS

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
    //EGRESOS
    this.tiposEgresosListSubject = new BehaviorSubject<string[]>(
      JSON.parse(localStorage.getItem('tiposEgresos')!)
    );

    // PUBLIC STATES:
    //INGRESOS
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
    //EGRESOS
    this.tiposEgresosList = this.tiposEgresosListSubject.asObservable();
    localStorage.setItem('tiposEgresos', JSON.stringify(this.tiposEgresos));
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

  //INGRESOS VALUES GET METHODS:
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
  //EGRESOS VALUES GET METHODS:
  public get tiposEgresosListValue(): string[] {
    return this.tiposEgresosListSubject.value;
  }

  /* EGRESOS */
  egresoRegistrar(egresosFirma: RegistroEgresoFirma) {        
    return this.http.post(
      `${environment.apiUrl}/egresoFirma/conRespaldo`,
      egresosFirma
    );
  }
  egresoGetAll(): any {            
    return this.http.get<[]>(`${environment.apiUrl}/egresoFirma`);    
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

  } 
