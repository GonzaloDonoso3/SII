import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IngresosImportadora } from '@app/_models/importadora/ingresoImportadora';
import { EgresosFijoImportadora } from '@app//_models/importadora/egresoFijoImportadora';
import { environment } from '@environments/environment';

/* Imports Excel */
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
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
    private router: Router
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

  //*********** Inicio Metodos Egresos ************/
 
  getAllEgresosFijo() {
    return this.http.get<[]>(`${environment.apiUrl}/egresoFijoImportadora`);
  }

  createEgresosFijo(egresoFijoImportadora: EgresosFijoImportadora) {
    console.log(egresoFijoImportadora);
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
  //*********** Fin Metodos Egresos ************/

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
}
