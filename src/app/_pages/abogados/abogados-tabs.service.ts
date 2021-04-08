import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cliente } from '../../_models/abogados/cliente';


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
      `${environment.apiUrl}/cuotasContrato/registrarPago/`,
      idCuota
    );
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
}
