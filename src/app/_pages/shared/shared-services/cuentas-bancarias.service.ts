import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { cuentaRegistrada } from '@app/_models/agroFirma/cuentaRegistrada';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CuentasBancariasService {

  constructor(private router: Router, private http: HttpClient) { }

  obtenerCuentas() {
    return this.http.get<any[]>(`${environment.apiUrl}/cuentasRegistradas/obtenerCuentas`);
  }

  obtenerCuentasPorProyecto(idProyecto: number) {
    return this.http.get<cuentaRegistrada[]>(
      `${environment.apiUrl}/banco/obtenerCuentasByEntity/${idProyecto}`
    );
  }

}

