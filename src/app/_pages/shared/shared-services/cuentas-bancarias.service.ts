import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CuentasBancariasService {

  constructor(private router: Router, private http: HttpClient) { }
  obtenerCuentas() {
    return this.http.get<any[]>(`${environment.apiUrl}/cuentasRegistradas/obtenerCuentas`);
  }
}

