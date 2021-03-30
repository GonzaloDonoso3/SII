import { ResponseListaArriendos } from './../../_models/rentacar/responseListaArriendos';
import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

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



}
