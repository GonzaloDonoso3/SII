import { RequestResponse } from './../../_models/rentacar/requestResponse';
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
    'usertoken': environment.usertoken
  })

  constructor(private http: HttpClient) { }

  getListaPagosArriendos(): Observable<ResponseListaArriendos> {
    return this.http.get<ResponseListaArriendos>(`${environment.apiRentacarUrl}api/v2/mostrarArriendoFinanzas`, { headers: this.headers });
  }

  getLicitaciones(): Observable<RequestResponse> {
    return this.http.get<RequestResponse>(`${environment.apiRentacarUrl}licitacion/cargarLicitaciones`, { headers: this.headers });
  }


  postIngresoLicitacion(ingresoLicitacion: any): Observable<RequestResponse> {
    return this.http.post<RequestResponse>(`${environment.apiRentacarUrl}licitacion/crearIngreso`, ingresoLicitacion, { headers: this.headers, });
  }

  postSubirImagenes() {
    //respaldo
    return this.http.post<RequestResponse>(`${environment.apiRentacarUrl}licitacion/subirRespaldo`, { headers: this.headers, });
  }

  getIngresosLicitacion(): Observable<RequestResponse> {
    return this.http.get<RequestResponse>(`${environment.apiRentacarUrl}licitacion/cargarIngresos`, { headers: this.headers });
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

    /* Metodos Excel */
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
