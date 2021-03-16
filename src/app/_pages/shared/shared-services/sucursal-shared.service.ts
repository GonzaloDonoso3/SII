import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Sucursal } from '@models/shared/sucursal';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SucursalSharedService {
  private sucursalSubject: BehaviorSubject<Sucursal>;
  private sucursalListSubject: BehaviorSubject<Sucursal[]>;

  public sucursal: Observable<Sucursal>;
  public sucursalList: Observable<Sucursal[]>;
  constructor(private http: HttpClient, private router: Router) {
    this.sucursalSubject = new BehaviorSubject<Sucursal>(
      JSON.parse(localStorage.getItem('sucursal')!)
    );
    this.sucursalListSubject = new BehaviorSubject<Sucursal[]>(
      JSON.parse(localStorage.getItem('sucursales')!)
    );
    this.sucursal = this.sucursalSubject.asObservable();
    this.sucursalList = this.sucursalListSubject.asObservable();
  }
  public get sucursalValue(): Sucursal {
    return this.sucursalSubject.value;
  }
  public get sucursalListValue(): Sucursal[] {
    return this.sucursalListSubject.value;
  }
  create(sucursal: Sucursal) {
    return this.http.post(`${environment.apiUrl}/sucursal`, sucursal);
  }
  getAll() {
    return this.http.get<Sucursal[]>(`${environment.apiUrl}/sucursal`);
  }
  getById(id: number) {
    return this.http.get<Sucursal>(`${environment.apiUrl}/sucursal/${id}`);
  }
  getByEmpresa(idEmpresa: number) {
    return this.http.get<Sucursal[]>(
      `${environment.apiUrl}/sucursal/sucursalesEmpresa/${idEmpresa}`
    ).pipe(
      map((sucursales) => {
        // store  details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.removeItem('sucursales');
        localStorage.setItem('sucursales', JSON.stringify(sucursales));
        this.sucursalListSubject.next(sucursales);
        return sucursales;
      })
    );
  }
  update(id: number, params: any[]) {
    return this.http.put(`${environment.apiUrl}/sucursal/${id}`, params);
  }
  delete(id: number) {
    return this.http.delete(`${environment.apiUrl}/sucursal/${id}`);
  }
}
