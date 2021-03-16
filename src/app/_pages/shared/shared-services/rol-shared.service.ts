import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Rol } from '@app/_models/shared/rol';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '@environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RolSharedService {
  private rolSubject: BehaviorSubject<Rol>;
  public rol: Observable<Rol>;

  constructor(private router: Router, private http: HttpClient) {
    this.rolSubject = new BehaviorSubject<Rol>(
      JSON.parse(localStorage.getItem('Rol')!)
    );
    this.rol = this.rolSubject.asObservable();
  }
  public get rolValue(): Rol {
    return this.rolSubject.value;
  }
  create(rol: Rol) {
    return this.http.post(`${environment.apiUrl}/rol`, rol);
  }
  getAll() {
    return this.http.get<[]>(`${environment.apiUrl}/rol`);
  }
  getById(id: string) {
    return this.http.get<Rol>(`${environment.apiUrl}/rol/${id}`);
  }
  update(id: string, params: any[]) {
    return this.http.put(`${environment.apiUrl}/rol/${id}`, params);
  }
  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/rol/${id}`);
  }
}
