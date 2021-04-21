import { ResponseListaArriendos } from './../../_models/rentacar/responseListaArriendos';
import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

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
export class RentacarService {

  headers: HttpHeaders = new HttpHeaders({
    'usertoken': '9580af34ca299aa979a151280f6ef856bdee8b4dc9c17641d15df2cf54a5c7c876d369bc1b66715fa483c100755014f4'
  })

  constructor(private http: HttpClient) { }

  getListaPagosArriendos(): Observable<ResponseListaArriendos> {
    return this.http.get<ResponseListaArriendos>(`https://www.imlchile.cl:3010/rentacar/api/v2/mostrarArriendoFinanzas`, { headers: this.headers });
  }

  // Inicio Rentacar Egresos

  createEgresos(egreso: any): any {
    return this.http.post(`${environment.apiUrl}/egresoRentacar/conRespaldo`, egreso);
  }

  getAllEgresos(): any {
    return this.http.get<[]>(`${environment.apiUrl}/egresoRentacar/getEgresos`);
  }

  egresoGetFiles(fileName: string): any {
    return this.http
      .get(`${environment.apiUrl}/egresoRentacar/download/${fileName}`, {
        responseType: 'blob',
      })
      .subscribe((res) => {
        window.open(window.URL.createObjectURL(res));
      });
  }


  public downloadEgresos(fileName: string): void {
    this.http
      .get('/files/${fileName}', { responseType: 'blob' })
      .subscribe((res) => {
        window.open(window.URL.createObjectURL(res));
      });
  }

  /* api/egresoRentacar/getDetalle/8 */
  getDetalleEgreso(idEgreso: any): any {
    return this.http.get(
      `${environment.apiUrl}/egresoRentacar/getDetalle/${idEgreso}`
    );
  }

  getEgresosById(id: string): any {
    return this.http.get(
      `${environment.apiUrl}/egresoRentacar/getEgreso/${id}`
    );
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
