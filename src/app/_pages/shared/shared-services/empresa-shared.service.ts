import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Empresa } from '@models/shared/empresa';

@Injectable({
  providedIn: 'root'
})
export class EmpresaSharedService {

  constructor(private http: HttpClient) { }
  /*  public get empresaValue(): Empresa {
     return this.empresaSubject.value;
   } */
  create(empresa: Empresa) {
    return this.http.post(`${environment.apiUrl}/empresa`, empresa);
  }
  getAll() {
    return this.http.get<Empresa[]>(`${environment.apiUrl}/empresa`);
  }
  getById(id: number) {
    return this.http.get<Empresa>(`${environment.apiUrl}/empresa/${id}`);
  }
  getByIdWithSucursales(id: number) {
    return this.http.get<Empresa>(
      `${environment.apiUrl}/empresa/empresaSucursales/${id}`
    );
  }
  update(id: number, params: any[]) {
    return this.http.put(`${environment.apiUrl}/empresa/${id}`, params);
  }
  delete(id: number) {
    return this.http.delete(`${environment.apiUrl}/empresa/${id}`);
  }
}
