import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Cliente } from '@models/shared/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteSharedService {

  constructor(private http: HttpClient, private router: Router) {}

  crearSinoExiste(rut: string, cliente: Cliente): any {
    return this.http.post<[]>(`${environment.apiUrl}/cliente/${rut}`, cliente);
  }
  guardarCliente(rut: string, cliente: Cliente): any {
    return this.http.put(`${environment.apiUrl}/cliente/${rut}`, cliente);
  }
  obtenerClientes(): any {
    return this.http.get<[]>(`${environment.apiUrl}/cliente/getCLientes`);
  }
}
