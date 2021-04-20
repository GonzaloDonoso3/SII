import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cliente } from '../../_models/shared/cliente';

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
export class AbogadosTabsService {

  constructor(private http: HttpClient, private router: Router) {}

  /* Servicios Cliente */
  
  crearSinoExiste(rut: string, cliente: Cliente): any {
    return this.http.post<[]>(`${environment.apiUrl}/cliente/${rut}`, cliente);
  }
  guardarCliente(rut: string, cliente: Cliente): any {
    return this.http.put(`${environment.apiUrl}/cliente/${rut}`, cliente);
  }
  obtenerClientes(): any {
    return this.http.get<[]>(`${environment.apiUrl}/cliente/getCLientes`);
  }

  /*********  Servicios Contrato **********/
  obtenerContratos(): any {
    return this.http.get<[]>(
      `${environment.apiUrl}/contratoCienteAbogado/getContratos/`
    );
  }
  obtenerContratosCliente(idCliente: any): any {
    return this.http.get<[]>(
      `${environment.apiUrl}/contratoCienteAbogado/contratosCliente/${idCliente}`
    );
  }
  calcularCuotas(data: any): any {
    return this.http.post<[]>(
      `${environment.apiUrl}/cuotasContrato/calcularCuotas`,
      data
    );
  }
  crearSinoExisteContrato(contrato: any): any {
    return this.http.post<[]>(
      `${environment.apiUrl}/contratoCienteAbogado/`,
      contrato
    );
  }
  guardarCuotas(cuotas: any): any {
    return this.http.post<[]>(`${environment.apiUrl}/cuotasContrato/`, cuotas);
  }
  obtenerContratoNumero(nContrato: any): any {
    return this.http.get<[]>(
      `${environment.apiUrl}/contratoCienteAbogado/contratosNumero/${nContrato}`
    );
  }
  registrarPago(idCuota: any): any {
    return this.http.post<[]>(
      `${environment.apiUrl}/cuotasContrato/registrarPago/`, idCuota);
  }
  
  repactarContrato(excuotas: any, newcuotas: any): any {
    return this.http.post<[]>(
      `${environment.apiUrl}/cuotasContrato/repactarContrato/`,
      { excuotas: excuotas, newcuotas: newcuotas }
    );
  }
  obtenerCuotas(): any {
    return this.http.get<[]>(
      `${environment.apiUrl}/cuotasContrato/obtenerCuotas/`
    );
  }
  agregarRespaldos(arrayRespaldos: any): any {
    return this.http.post(
      `${environment.apiUrl}/cuotasContrato/agregarRespaldos/`,
      arrayRespaldos
    );
  }
  obtenerRespaldos(id: any): any {
    return this.http.get(
      `${environment.apiUrl}/cuotasContrato/obtenerRespaldos/${id}`
    );
  }
  getFiles(fileName: string): any {
    return this.http
      .get(`${environment.apiUrl}/cuotasContrato/download/${fileName}`, {
        responseType: 'blob',
      })
      .subscribe((res) => {
        window.open(window.URL.createObjectURL(res));
      });
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
