import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IngresosInmobiliaria } from '@app/_models/inmobiliaria/ingresoInmobiliaria';
import { EgresosInmobiliaria } from '@app/_models/inmobiliaria/egresoInmobiliaria';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { EgresoInmobiliariaCuota } from '@app/_models/inmobiliaria/egresoInmobiliariaCuota';
import { MatDialog } from '@angular/material/dialog';
import { InmobiliariaEgresosCuotaDialogComponent } from '@app/_pages/inmobiliaria/inmobiliaria-egresos/inmobiliaria-egresos-list/inmobiliaria-egresos-cuotas/inmobiliaria-egresos-cuota-dialog/inmobiliaria-egresos-cuota-dialog.component';
import { InmobiliariaEgresosCuotasComponent } from '@app/_pages/inmobiliaria/inmobiliaria-egresos/inmobiliaria-egresos-list/inmobiliaria-egresos-cuotas/inmobiliaria-egresos-cuotas.component';
import { MatSnackBar } from '@angular/material/snack-bar';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


/* Fin Import Excel */

@Injectable({
  providedIn: 'root'
})
export class InmobiliariaService {
  private ingresosInmobiliariaSubject!: BehaviorSubject<IngresosInmobiliaria>;
  private egresosInmobiliariaSubject!: BehaviorSubject<EgresosInmobiliaria>;

  //Crear listas
  public tiposIngresosList!: Observable<string[]>;
  public tiposEgresosList!: Observable<string[]>;

  //ingresos values
  private tiposIngresosListSubject!: BehaviorSubject<any[]>;
  private tiposEgresosListSubject!: BehaviorSubject<any[]>;

   // ! strict lists
   private tiposIngresosInmobiliaria = ['Venta', 'Arriendo', 'Leaseback', 'Hipoteca', 'Otro'];
   private tiposEgresosInmobiliaria = ['Gastos', 'Costos', 'Remuneraciones', 'Bancarios', 'Impuestos', 'Inversiones'];
   private empresa = 'Inmobiliaria';

  constructor(
    private http: HttpClient, 
    private router: Router,
    public dialog:MatDialog,
    private snackBar: MatSnackBar) {
    //Init private Subjects;
    //ingresos;
    this.tiposIngresosListSubject = new BehaviorSubject<string[]>(
      JSON.parse(localStorage.getItem('tiposIngresosInmobiliaria')!)
    );

    //Egresos
    this.tiposEgresosListSubject = new BehaviorSubject<string[]>(
      JSON.parse(localStorage.getItem('tiposEgresosInmobiliaria')!)
    );

    // public states:
    //ingresos;
    this.tiposIngresosList = this.tiposIngresosListSubject.asObservable();
    localStorage.setItem('tiposIngresosInmobiliaria', JSON.stringify(this.tiposIngresosInmobiliaria));
    //egresos;
    this.tiposEgresosList = this.tiposEgresosListSubject.asObservable();
    localStorage.setItem('tiposEgresosInmobiliaria', JSON.stringify(this.tiposEgresosInmobiliaria));
  }

  //*********** Inicio Metodos Ingresos ************/
  //ingresos values get methods:
  public get tiposIngresosListValue(): string[] {
    return this.tiposIngresosListSubject.value;
  }

  public get ingresosInmobiliariaValue(): IngresosInmobiliaria {
    return this.ingresosInmobiliariaSubject.value;
  }

  create(ingresosInmobiliaria: IngresosInmobiliaria) {
    console.log(ingresosInmobiliaria);
    return this.http.post(
      `${environment.apiUrl}/ingresoInmobiliaria/conRespaldo`,
      ingresosInmobiliaria
    );
  }

  getAll() {
    return this.http.get<[]>(`${environment.apiUrl}/ingresoInmobiliaria`);
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

  getAllWithUsuario() {
    return this.http.get<IngresosInmobiliaria[]>(
      `${environment.apiUrl}/ingresoInmobiliaria/conUsuario`
    );
  }

  getById(id: string) {
    return this.http.get<IngresosInmobiliaria>(
      `${environment.apiUrl}/ingresoInmobiliaria/${id}`
    );
  }

  update(id:any, params:any) {
    return this.http.put(`${environment.apiUrl}/ingresoInmobiliaria/${id}`, params);
  }
  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/ingresoInmobiliaria/${id}`);
  }

  //*********** Fin Metodos Ingresos ************/

  //*********** Inicio Metodos Egresos ************/
  //ingresos values get methods:
  public get tiposEgresosListValue(): string[] {
    return this.tiposEgresosListSubject.value;
  }

  public get egresosInmobiliariaValue(): EgresosInmobiliaria {
    return this.egresosInmobiliariaSubject.value;
  }

  getAllEgresos() {
    return this.http.get<[]>(`${environment.apiUrl}/egresoInmobiliaria`);
  }

  buscarCuotas(): any {
    return this.http.get<EgresoInmobiliariaCuota>(
      `${environment.apiUrl}/egresoInmobiliariaCuota/`
    );
  }

  createEgresos(ingresosInmobiliaria: IngresosInmobiliaria) {
    console.log(ingresosInmobiliaria);
    return this.http.post(
      `${environment.apiUrl}/egresoInmobiliaria/conRespaldo`,
      ingresosInmobiliaria
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

  /* Egresos Por cuotas */
  getCuotas(id: any) {        
    return this.http.get<EgresoInmobiliariaCuota>(
      `${environment.apiUrl}/egresoInmobiliariaCuota/${id}`
    );
  }

  agregarRespaldos(arrayRespaldos: any): any {
    return this.http.post(
      `${environment.apiUrl}/egresoInmobiliariaCuota/agregarRespaldos/`,
      arrayRespaldos
    );
  }

  closeDialogModal(){
    this.dialog.closeAll();
    localStorage.removeItem("idEgresoPago");
  }

  buscarImagenC(id: any): any {
    return this.http.get<EgresoInmobiliariaCuota>(
      `${environment.apiUrl}/respaldoEgresoInmobiliariaCuota/${id}`
    );
  }

  buscarImagenCuota(url: string) {    
    const extencion = url.split('.');
    const extend = extencion[1];    
    return this.http
    .get(`${environment.apiUrl}/egresoInmobiliariaCuota/download/${url}`, {
        responseType: 'blob',
      })      
  }

  // Metodo que permite abrir un Dialog (Modal)
  openDialogCuota():void{
    const dialogRef = this.dialog.open(InmobiliariaEgresosCuotaDialogComponent, {})
    dialogRef.afterClosed().subscribe((res) => {})
  }
  
  // Metodo que permite abrir un Dialog (Modal)
  openDialogRegistrarPago(idEgreso: any):void{
    //Si el cliente selecciono un contrato se habre el modal    
    if(idEgreso != null){
      const dialogRef = this.dialog.open(InmobiliariaEgresosCuotasComponent,{});
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
  
  updateMonto(id: any, body: any[]) {    
    return this.http.put(`${environment.apiUrl}/egresoInmobiliariaCuota/${id}`, body);                
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
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }
  //*********** Fin Metodos Egresos ************/
}
