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

  constructor(
    private http: HttpClient,
    ) { }

  GetAllProyectos(): any {              
    //console.log("en el servicio", this.http.get<[]>(`${environment.apiUrl}/obtenerProyectos`))
    return this.http.get<[]>(`${environment.apiUrl}/obtenerProyectos`);    
  }

  getById(id: string): any {    
    return this.http.get<any>(
      `${environment.apiUrl}/egreso${this.proyecto}/${id}`
    );
  }

}
