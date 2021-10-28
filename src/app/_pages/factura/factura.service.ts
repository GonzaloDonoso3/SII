import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private empresa = 'Factura';

  constructor(private http: HttpClient) { }

  getEmpresas() {      
    return this.http.get<[]>(`${environment.apiUrl}/Prestamos/empresas/`);
  }
}
