import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IngresosImportadora } from '@app/_models/importadora/ingresoImportadora';
import { EgresosFijoImportadora } from '@app/_models/importadora/egresoFijoImportadora';
import { EgresoFijoImportadoraCuota } from '@app/_models/importadora/egresoFijoImportadoraCuota';
import { EgresosContainerImportadora } from '../../_models/importadora/egresoContainerImportadora';
import { environment } from '@environments/environment';
import { DialogNeumaticosComponent } from './importadora-egresos/importadora-egresos-tab-gasto-neumaticos/dialog-neumaticos/dialog-neumaticos.component';
import { DialogNeumaticosEditComponent } from './importadora-egresos/importadora-egresos-tab-gasto-neumaticos/dialog-neumaticos/dialog-neumaticos-edit/dialog-neumaticos-edit/dialog-neumaticos-edit.component';

/* Imports Excel */
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImportadoraEgresosTabCuotasComponent } from './importadora-egresos/importadora-egresos-tab-gasto-fijo/importadora-egresos-tab-gasto-fijo-list/importadora-egresos-tab-cuotas/importadora-egresos-tab-cuotas.component';
import { ImportadoraEgresosTabCuotaDialogComponent } from './importadora-egresos/importadora-egresos-tab-gasto-fijo/importadora-egresos-tab-gasto-fijo-list/importadora-egresos-tab-cuotas/importadora-egresos-tab-cuota-dialog/importadora-egresos-tab-cuota-dialog.component';
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
const EXCEL_EXTENSION = '.xlsx'
/* Fin Import Excel */

@Injectable({
  providedIn: 'root'
})
export class ImportadoraService {

  private empresa = 'Importadora';

  constructor(
    private http: HttpClient, 
    private router: Router,
    public dialog:MatDialog,
    private snackBar: MatSnackBar,
  ) { }

    //*********** Inicio Metodos Ingresos ************/

  create(ingresosImportadora: IngresosImportadora) {
    return this.http.post(
      `${environment.apiUrl}/ingresoImportadora/conRespaldo`,
      ingresosImportadora
    );
  }

  getAll() {
    return this.http.get<[]>(`${environment.apiUrl}/ingresoImportadora`);
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
    return this.http.get<IngresosImportadora[]>(
      `${environment.apiUrl}/ingresosImportadora/conUsuario`
    );
  }

  getById(id: string) {
    return this.http.get<IngresosImportadora>(
      `${environment.apiUrl}/ingresosImportadora/${id}`
    );
  }

  update(id:any, params:any) {
    return this.http.put(`${environment.apiUrl}/ingresosImportadora/${id}`, params);
  }
  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/ingresosImportadora/${id}`);
  }

  //*********** Fin Metodos Ingresos ************/

  //*********** Inicio Metodos Egresos Fijos ************/
 
  getAllEgresosFijo() {
    return this.http.get<[]>(`${environment.apiUrl}/egresoFijoImportadora`);
  }

  createEgresosFijo(egresoFijoImportadora: EgresosFijoImportadora) {
    return this.http.post(
      `${environment.apiUrl}/egresoFijoImportadora/conRespaldo`,
      egresoFijoImportadora
    );
  }

  egresoFijoGetFiles(fileName: string): any {
    return this.http
      .get(`${environment.apiUrl}/egresoFijo${this.empresa}/download/${fileName}`, {
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
    .get(`${environment.apiUrl}/egresoFijo${this.empresa}/download/${url}`, {
        responseType: 'blob',
      })      
  }
 //*********** Fin Metodos Egresos Fijos ************/

 //*********** Inicio Metodos Egresos Conteiner ************/
  createEgresosConteiner(egresoConteinerImportadora: EgresosContainerImportadora) {
    
    return this.http.post(
      `${environment.apiUrl}/EgresoContainerImportadora/conRespaldo`,
      egresoConteinerImportadora
    );
  }
 
//*********** Inicio Metodos Egresos Neumaticos ************/
  guardarNeumaticos(neumaticos: any): any {
    return this.http.post<[]>(`${environment.apiUrl}/EgresoNeumaticoImportadora/neumaticos`, neumaticos);
  }
  
  updateNeumaticos(id: any, body: any[]) {
    return this.http.put(`${environment.apiUrl}/EgresoNeumaticoImportadora/${id}`, body);                
  }


  getAllNeumaticos() {    
    return this.http.get<[]>(`${environment.apiUrl}/EgresoNeumaticoImportadora`);    
  }

  getNeumaticosById(id: number) {
    return this.http.get<[]>(`${environment.apiUrl}/EgresoNeumaticoImportadora/conteinerNumero/${'1'}`);
  }
  
  // Cerrar dialog Repactar Cuota y Registrar Pago
  closeDialogModal() {
    this.dialog.closeAll()    
  }

//*********** fin Metodos Egresos Neumaticos ************/

  egresoConteinerGetFiles(fileName: string): any {
    return this.http
      .get(`${environment.apiUrl}/egresoContainer${this.empresa}/download/${fileName}`, {
        responseType: 'blob',
      })
      .subscribe((res) => {
        window.open(window.URL.createObjectURL(res));
      });
  }
  buscarImagenEgresoC(url: string) {    
    const extencion = url.split('.');
    const extend = extencion[1];    
    return this.http
    .get(`${environment.apiUrl}/egresoContainer${this.empresa}/download/${url}`, {
        responseType: 'blob',
      })      
  }

  getAllEgresosConteiner() {
    return this.http.get<[]>(`${environment.apiUrl}/EgresoContainerImportadora`);
  }

  getConteinerById(id: number) {
    return this.http.get<[]>(`${environment.apiUrl}/EgresoContainerImportadora/conteinerNumero/${id}`);
  }

  getConteinerByIdN(id: number) {
    return this.http.get<EgresosContainerImportadora>(`${environment.apiUrl}/EgresoContainerImportadora/conteinerNumero/${id}`);
  }
  
  // Metodo que permite abrir un Dialog (Modal)
  openDialogNeumatico(idContrato: any):void{
   //Si el cliente selecciono un contrato se habre el modal
   if(idContrato != null){
     const dialogRef = this.dialog.open(DialogNeumaticosComponent,{});
     dialogRef.afterClosed().subscribe(res =>{
       console.log(res);
     });
   }else{
     //Si no, se muestra un error
     this.snackBar.open('Por favor seleccione un conteiner', 'cerrar', {
       duration: 2000,
       verticalPosition: 'top',
     });
   } 
 }
//***************** Egresos por cuotas ********************//

getCuotas(id: any) {    
  return this.http.get<EgresoFijoImportadoraCuota>(
    `${environment.apiUrl}/egresoFijoImportadoraCuota/${id}`
  );
}

buscarImagenCuota(url: string) {    
  const extencion = url.split('.');
  const extend = extencion[1];    
  return this.http
  .get(`${environment.apiUrl}/egresoFijoImportadoraCuota/download/${url}`, {
      responseType: 'blob',
    })      
}

agregarRespaldos(arrayRespaldos: any): any {
  return this.http.post(
    `${environment.apiUrl}/egresoFijoImportadoraCuota/agregarRespaldos/`,
    arrayRespaldos
  );
}
buscarImagenC(id: any): any {
  return this.http.get<EgresoFijoImportadoraCuota>(
    `${environment.apiUrl}/respaldoEgresoFijoImportadoraCuota/${id}`
  );
}

openDialogCuota():void{
  const dialogRef = this.dialog.open(ImportadoraEgresosTabCuotaDialogComponent, {})
  dialogRef.afterClosed().subscribe((res) => {})
}

updateMonto(id: any, body: any[]) {    
  return this.http.put(`${environment.apiUrl}/egresoFijoImportadoraCuota/${id}`, body);                
}

 openDialogRegistrarPago(idEgreso: any):void{
  //Si el cliente selecciono un contrato se habre el modal    
  if(idEgreso != null){
    const dialogRef = this.dialog.open(ImportadoraEgresosTabCuotasComponent,{});
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

 //*********** Fin Metodos Egresos Conteiner ************/

  /* Metodo Excel */
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json)
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data']
    }
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    })
    this.saveAsExcelFile(excelBuffer, excelFileName)
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE })
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    )
  }

  // Metodo que permite abrir un Dialog (Modal)
  openDialogEditContainer(): void {
    const dialogRef = this.dialog.open(DialogNeumaticosEditComponent, {})
    dialogRef.afterClosed().subscribe((res) => {})
  }
  
  // Metodo que permite abrir un Dialog (Modal)
  openDialogEditContainerN(idContrato: any):void{
    //Si el cliente selecciono un contrato se habre el modal
    if(idContrato != null){
      const dialogRef = this.dialog.open(DialogNeumaticosEditComponent,{});
      dialogRef.afterClosed().subscribe(res =>{
        console.log(res);
      });
    }else{
      //Si no, se muestra un error
      this.snackBar.open('Por favor seleccione un conteiner', 'cerrar', {
        duration: 2000,
        verticalPosition: 'top',
      });
    } 
  }

  //Metodos del Home
  buscarCuotas(): any {
    return this.http.get<EgresoFijoImportadoraCuota>(
      `${environment.apiUrl}/egresoFijoImportadoraCuota/`
    );
  }
}
