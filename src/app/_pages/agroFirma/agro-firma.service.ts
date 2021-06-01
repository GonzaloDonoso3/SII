import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ProyectoAgrofirma } from '@app/_models/agroFirma/proyectoAgroFirma';
import { EgresoAgroFirma } from '@app/_models/agroFirma/egresoAgroFirma';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AgroFirmaService {

  private proyecto = 'obtenerProyecto';

  //egresos values
  public tiposEgresosList: Observable<string[]>;
  
  //egresos values
  private tiposEgresosListSubject: BehaviorSubject<string[]>;

  private tiposEgresos = ['Gastos', 'Costos', 'Remuneraciones', 'Impuestos', 'Bancarios', 'Prestamos Bancarios', 'Prestamos Automotriz'];
  private empresa = 'agroFirma';

  constructor(
    private http: HttpClient,
    ) { 
      //egresos;
      this.tiposEgresosListSubject = new BehaviorSubject<string[]>(
      JSON.parse(localStorage.getItem('tiposEgresos')!)
      );

      //egresos;
    this.tiposEgresosList = this.tiposEgresosListSubject.asObservable();
    localStorage.setItem('tiposEgresos', JSON.stringify(this.tiposEgresos));
    }

    //egresos values get methods:
    public get tiposEgresosListValue(): string[] {
    return this.tiposEgresosListSubject.value;
    }

    egresoGetAll(): any {    
      return this.http.get<[]>(`${environment.apiUrl}/obtenerEgresos/:idProyecto`);
    }

    egresoRegistrar(egreso: EgresoAgroFirma): any {    
      return this.http.post(      
        `${environment.apiUrl}/egreso${this.empresa}/registrarEgreso`,
        egreso      
      );
    }

  GetAllProyectos(): any {                  
    return this.http.get<[]>(`${environment.apiUrl}/proyectoAgrofirma/obtenerProyectos`);    
  }

  getById(id: string): any {    
    return this.http.get<any>(
      `${environment.apiUrl}/egreso${this.proyecto}/${id}`
    );
  }

  getAll(id: any): any {
    return this.http.get<[]>(
      `${environment.apiUrl}/egresoAgrofirma/obtenerEgresos/${id}`
    );
  }
}
