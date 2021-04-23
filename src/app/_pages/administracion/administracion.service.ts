import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogSucursalesEditarComponent } from './administracion-sucursales/administracion-sucursales-list/dialog-sucursales-editar/dialog-sucursales-editar.component';
import { DialogEmpresasEditarComponent } from './administracion-empresas/administracion-empresas-list/dialog-empresas-editar/dialog-empresas-editar.component';


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
export class AdministracionService {

  constructor(
    public dialog:MatDialog,
    private snackBar: MatSnackBar,
  ) { }


  // Metodo que permite abrir un Dialog (Modal)
  openDialogEditSucursal():void{
    const dialogRef = this.dialog.open(DialogSucursalesEditarComponent,{});
    dialogRef.afterClosed().subscribe(res =>{
      console.log(res);
    });
  }

   // Metodo que permite abrir un Dialog (Modal)
   openDialogEditEmpresa():void{
    const dialogRef = this.dialog.open(DialogEmpresasEditarComponent,{});
    dialogRef.afterClosed().subscribe(res =>{
      console.log(res);
    });
  }

   // Cerrar dialog Repactar Cuota y Registrar Pago
   closeDialogModal(){
    this.dialog.closeAll();
    //localStorage.removeItem("idContratoPago");
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
}
