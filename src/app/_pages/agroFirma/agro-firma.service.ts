import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ProyectoAgrofirma } from '@app/_models/agroFirma/proyectoAgroFirma';
import { EgresoAgroFirma } from '@app/_models/agroFirma/egresoAgroFirma';
import { BehaviorSubject, Observable } from 'rxjs';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { IngresoAgroFirma } from '@app/_models/agroFirma/ingresoAgroFirma';


const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class AgroFirmaService {


  private proyecto = 'obtenerProyecto';

  //egresos values
  public tiposEgresosList: Observable<string[]>;
  
  //egresos values
  private tiposEgresosListSubject: BehaviorSubject<string[]>;
  //proyectos values
  private proyectosListSubject: BehaviorSubject<ProyectoAgrofirma[]>;

  public proyectosList: Observable<ProyectoAgrofirma[]>;
  
  private tiposEgresos = ['Gastos', 'Costos', 'Remuneraciones', 'Impuestos', 'Bancarios', 'Prestamos Bancarios', 'Prestamos Automotriz'];
  private empresa = 'agroFirma';

  constructor( private http: HttpClient ) {
    //egresos;
    this.tiposEgresosListSubject = new BehaviorSubject<string[]>(
      JSON.parse(localStorage.getItem('tiposEgresos')!)
    );

    this.proyectosListSubject = new BehaviorSubject<ProyectoAgrofirma[]>(
      JSON.parse(localStorage.getItem('proyectos')!)
    );

    //egresos;
    this.tiposEgresosList = this.tiposEgresosListSubject.asObservable();
    this.proyectosList = this.proyectosListSubject.asObservable();
    localStorage.setItem('tiposEgresos', JSON.stringify(this.tiposEgresos));
  }
  
  //egresos values get methods:
  public get tiposEgresosListValue(): string[] {
  return this.tiposEgresosListSubject.value;
  }

  //proyectos values methods:
  public get proyectosListValue(): ProyectoAgrofirma[] {
    return this.proyectosListSubject.value;
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

  //----------Metodos Egresos------------

  egresoGetAll(): any {    
    return this.http.get<[]>(`${environment.apiUrl}/obtenerEgresos/:idProyecto`);
  }

  egresoRegistrar(egreso: EgresoAgroFirma): any {    
    return this.http.post(      
      `${environment.apiUrl}/egreso${this.empresa}/registrarEgreso`,
      egreso      
    );
  }

  GetAllProyectos(): any {                  
    return this.http.get<[]>(`${environment.apiUrl}/proyectoAgrofirma/obtenerProyectos`);    
  }

  getById(id: string): any {    
    return this.http.get<any>(
      `${environment.apiUrl}/egreso${this.proyecto}/${id}`
    );
  }

  getAll(id: any): any {
    return this.http.get<[]>(
      `${environment.apiUrl}/egresoAgrofirma/obtenerEgresos/${id}`
    );
  }

  //-----------Metodos Ingresos---------------//

  registrarIngreso(ingreso: IngresoAgroFirma): any {
    return this.http.post(`${environment.apiUrl}/ingresoAgrofirma/registrarIngreso`, ingreso);
  }

  obtenerIngresos(): any {
    return this.http.get(`${environment.apiUrl}/ingresoAgrofirma/obtenerIngresos`);
  }

  obtenerIngresosPorProyecto(idProyecto: number): any {
    return this.http.get(`${environment.apiUrl}/ingresoAgrofirma/obtenerIngresosByProyecto/${idProyecto}`)
  }
}
