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
import {MatDialog} from '@angular/material/dialog';
import { HostalEgresosCuotasComponent } from './hostal-egresos/hostal-egresos-list/hostal-egresos-cuotas/hostal-egresos-cuotas.component';
import { HostalEgresosCuotaDialogComponent } from './hostal-egresos/hostal-egresos-list/hostal-egresos-cuotas/hostal-egresos-cuota-dialog/hostal-egresos-cuota-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EgresoHostalCuota } from '@app/_models/hostal/egresoHostalCuota';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

/* Fin Import Excel */
@Injectable({
  providedIn: 'root'
})
export class HostalService {  
  // private value  

  private empresa = 'Hostal';
  constructor(private http: HttpClient, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar) { }
  
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
  egresoRegistrar(egreso: EgresoHostal): any {    
    return this.http.post(      
      `${environment.apiUrl}/egreso${this.empresa}/conRespaldo`,
      egreso      
    );
  }
  egresoGetAll(): any {    
    return this.http.get<[]>(`${environment.apiUrl}/egresoHostal`);
  }

  buscarCuotas(): any {
    return this.http.get<EgresoHostalCuota>(
      `${environment.apiUrl}/egresoHostalCuota/`
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
  egresosBuscarImagen(url: string) {    
    const extencion = url.split('.');
    const extend = extencion[1];    
    return this.http
    .get(`${environment.apiUrl}/egreso${this.empresa}/download/${url}`, {
        responseType: 'blob',
      })      
  }
  getById(id: string): any {    
    return this.http.get<any>(
      `${environment.apiUrl}/egreso${this.empresa}/${id}`
    );
  }
  closeDialogModal(){
    this.dialog.closeAll();
    localStorage.removeItem("idEgresoPago");
  }
  
  /* /egresos */


  /* CONSOLIDADOS */  
  buscarConsolidado(consolidado: ConsolidadosHostal): any {        
    return this.http.post(      
      `${environment.apiUrl}/ingreso${this.empresa}/ingresosEgresos`,
      consolidado      
    );
  }

  /* Egresos Por cuotas */
  getCuotas(id: any) {    
    return this.http.get<HostalEgresosCuotasComponent>(
      `${environment.apiUrl}/egresoHostalCuota/${id}`
    );
  }

  buscarImagenCuota(url: string) {    
    const extencion = url.split('.');
    const extend = extencion[1];    
    return this.http
    .get(`${environment.apiUrl}/egresoHostalCuota/download/${url}`, {
        responseType: 'blob',
      })      
  }
  
  agregarRespaldos(arrayRespaldos: any): any {
    return this.http.post(
      `${environment.apiUrl}/egresoHostalCuota/agregarRespaldos/`,
      arrayRespaldos
    );
  }
  buscarImagenC(id: any): any {
    return this.http.get<HostalEgresosCuotasComponent>(
      `${environment.apiUrl}/respaldoEgresoHostalCuota/${id}`
    );
  }

  // Metodo que permite abrir un Dialog (Modal)
  openDialogCuota():void{
    const dialogRef = this.dialog.open(HostalEgresosCuotaDialogComponent, {})
    dialogRef.afterClosed().subscribe((res) => {})
  }

  updateMonto(id: any, body: any[]) {    
    return this.http.put(`${environment.apiUrl}/egresoHostalCuota/${id}`, body);                
  }

  // Metodo que permite abrir un Dialog (Modal)
  openDialogRegistrarPago(idEgreso: any):void{
    //Si el cliente selecciono un contrato se habre el modal    
    if(idEgreso != null){
      const dialogRef = this.dialog.open(HostalEgresosCuotasComponent,{});
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
