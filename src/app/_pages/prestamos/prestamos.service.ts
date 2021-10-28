import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

/* Imports Excel */
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Prestamos } from '@app/_models/prestamos/prestamos';
import { DialogDetalleEmpresaComponent } from './prestamos-ingresos-egresos/prestamos-list/dialog-detalle-empresa/dialog-detalle-empresa.component';
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
/* Fin Import Excel */

@Injectable({
  providedIn: 'root'
})
export class PrestamosService {

    private empresa = 'Prestamos';

    constructor(private http: HttpClient,
        public dialog: MatDialog,
        private snackBar: MatSnackBar){}

    //Ingresos y egresos 

    prestamosGetAll(): any {        
        return this.http.get<[]>(`${environment.apiUrl}/${this.empresa}`);
    }
      
    buscarPrestamos(prestamos: Prestamos) {        
        return this.http.post(
      ` ${environment.apiUrl}/${this.empresa}/conRespaldo`,
        prestamos
        );
    }

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

      buscarImagen(url: string) {            
        const extencion = url.split('.');
        const extend = extencion[1];    
        return this.http
        .get(`${environment.apiUrl}/${this.empresa}/download/${url}`, {
            responseType: 'blob',
          })      
      }

    /* Obteniendo detalle de cada empresa */
    getPrestamos(id: any) {    
        return this.http.get<Prestamos>(
      `${environment.apiUrl}/${this.empresa}/${id}`
        );
    }

    getBancos() {
      return this.http.get<Prestamos>(
        `${environment.apiUrl}/banco/obtenerBancos/`
      );
    }

    getEmpresas() {      
      return this.http.get<[]>(`${environment.apiUrl}/${this.empresa}/empresas/`);
    }

    // Metodo que permite abrir un Dialog (Modal)
    openDialogDetalleEmpresa(idPrestamo: any):void{        
        //Si el cliente selecciono un contrato se habre el modal            
            const dialogRef = this.dialog.open(DialogDetalleEmpresaComponent,{});
            dialogRef.afterClosed().subscribe(res =>{
            console.log(res);
        });        
  }

    closeDialogModal(){
        this.dialog.closeAll();
        localStorage.removeItem("idPrestamoEmpresa");
        localStorage.removeItem("nombreEmpresa");
      }
}