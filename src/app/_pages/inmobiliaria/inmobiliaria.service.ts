import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IngresosInmobiliaria } from '@app/_models/inmobiliaria/ingresoInmobiliaria';
import { EgresosInmobiliaria } from '@app/_models/inmobiliaria/egresoInmobiliaria';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class InmobiliariaService {
  private ingresosInmobiliariaSubject!: BehaviorSubject<IngresosInmobiliaria>;
  private egresosInmobiliariaSubject!: BehaviorSubject<EgresosInmobiliaria>;

  //Crear listas
  public tiposIngresosList!: Observable<string[]>;
  public tiposEgresosList!: Observable<string[]>;

  //ingresos values
  private tiposIngresosListSubject!: BehaviorSubject<any[]>;
  private tiposEgresosListSubject!: BehaviorSubject<any[]>;

   // ! strict lists
   private tiposIngresosInmobiliaria = ['Venta', 'Arriendo', 'Leaseback', 'Hipoteca', 'Otro'];
   private tiposEgresosInmobiliaria = ['Gastos', 'Costos', 'Remuneraciones', 'Bancarios', 'Impuestos', 'Inversiones'];
   private empresa = 'Inmobiliaria';

  constructor(private http: HttpClient, private router: Router) {
    //Init private Subjects;
    //ingresos;
    this.tiposIngresosListSubject = new BehaviorSubject<string[]>(
      JSON.parse(localStorage.getItem('tiposIngresosInmobiliaria')!)
    );

    //Egresos
    this.tiposEgresosListSubject = new BehaviorSubject<string[]>(
      JSON.parse(localStorage.getItem('tiposEgresosInmobiliaria')!)
    );

    // public states:
    //ingresos;
    this.tiposIngresosList = this.tiposIngresosListSubject.asObservable();
    localStorage.setItem('tiposIngresosInmobiliaria', JSON.stringify(this.tiposIngresosInmobiliaria));
    //egresos;
    this.tiposEgresosList = this.tiposEgresosListSubject.asObservable();
    localStorage.setItem('tiposEgresosInmobiliaria', JSON.stringify(this.tiposEgresosInmobiliaria));
  }

  //*********** Inicio Metodos Ingresos ************/
  //ingresos values get methods:
  public get tiposIngresosListValue(): string[] {
    return this.tiposIngresosListSubject.value;
  }

  public get ingresosInmobiliariaValue(): IngresosInmobiliaria {
    return this.ingresosInmobiliariaSubject.value;
  }

  create(ingresosInmobiliaria: IngresosInmobiliaria) {
    console.log(ingresosInmobiliaria);
    return this.http.post(
      `${environment.apiUrl}/ingresoInmobiliaria/conRespaldo`,
      ingresosInmobiliaria
    );
  }

  getAll() {
    return this.http.get<[]>(`${environment.apiUrl}/ingresoInmobiliaria`);
  }

  ingresoGetFiles(fileName: string) {
    const extencion = fileName.split('.');
    const extend = extencion[1];
    return this.http
      .get(`${environment.apiUrl}/ingreso${this.empresa}/download/${fileName}`, {
        responseType: 'blob',
      })
      .subscribe((res) => {
        window.open(window.URL.createObjectURL(res));
      });
  }

  getAllWithUsuario() {
    return this.http.get<IngresosInmobiliaria[]>(
      `${environment.apiUrl}/ingresoInmobiliaria/conUsuario`
    );
  }

  getById(id: string) {
    return this.http.get<IngresosInmobiliaria>(
      `${environment.apiUrl}/ingresoInmobiliaria/${id}`
    );
  }

  update(id:any, params:any) {
    return this.http.put(`${environment.apiUrl}/ingresoInmobiliaria/${id}`, params);
  }
  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/ingresoInmobiliaria/${id}`);
  }

  //*********** Fin Metodos Ingresos ************/

  //*********** Inicio Metodos Egresos ************/
  //ingresos values get methods:
  public get tiposEgresosListValue(): string[] {
    return this.tiposEgresosListSubject.value;
  }

  public get egresosInmobiliariaValue(): EgresosInmobiliaria {
    return this.egresosInmobiliariaSubject.value;
  }

  getAllEgresos() {
    return this.http.get<[]>(`${environment.apiUrl}/egresoInmobiliaria`);
  }

  createEgresos(ingresosInmobiliaria: IngresosInmobiliaria) {
    console.log(ingresosInmobiliaria);
    return this.http.post(
      `${environment.apiUrl}/egresoInmobiliaria/conRespaldo`,
      ingresosInmobiliaria
    );
  }

  egresoGetFiles(fileName: string): any {
    return this.http
      .get(`${environment.apiUrl}/egreso${this.empresa}/download/${fileName}`, {
        responseType: 'blob',
      })
      .subscribe((res) => {
        window.open(window.URL.createObjectURL(res));
      });
  }
  //*********** Fin Metodos Egresos ************/
}
