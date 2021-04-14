import { RequestResponse } from './../../_models/rentacar/requestResponse';
import { ResponseListaArriendos } from './../../_models/rentacar/responseListaArriendos';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RentacarService {

  headers: HttpHeaders = new HttpHeaders({
    'usertoken': '9580af34ca299aa979a151280f6ef856bdee8b4dc9c17641d15df2cf54a5c7c876d369bc1b66715fa483c100755014f4'
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


  getIngresosLicitacion(): Observable<RequestResponse> {
    return this.http.get<RequestResponse>(`${environment.apiRentacarUrl}licitacion/cargarIngresos`, { headers: this.headers });
  }

}
