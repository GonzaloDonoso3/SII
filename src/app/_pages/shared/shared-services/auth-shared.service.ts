import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Usuario } from './../../../_models/shared/usuario';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthSharedService {

  userToken: string = '';
  usuario: Usuario = new Usuario();


  constructor(private http: HttpClient) {
    this.usuario.nombre = 'cargando...';
  }

  public loginToken(TOKEN: string): Observable<Usuario> {
    localStorage.removeItem('usertoken');
    localStorage.removeItem('usuario');
    const headers = new HttpHeaders({ usertoken: TOKEN });
    return this.http.get<any>(`${environment.apiUrl}/usuarios/validarUsuario/${TOKEN}`, { headers })
      .pipe(map((response: any) => {
        if (response.success) {
          this.usuario = response.data;
          this.guardarSesion(TOKEN, this.usuario);
        } else {
          this.cerrarSesion();
        }
        return this.usuario;
      }));
  }

  public cerrarSesion(): void {
    localStorage.removeItem('usertoken');
    localStorage.removeItem('usuario');
    window.location.href = `${environment.indexUrl}`;
  }


  private guardarSesion(TOKEN: string, USUARIO: Usuario): void {
    this.userToken = TOKEN;
    localStorage.setItem('usuario', JSON.stringify(USUARIO));
    localStorage.setItem('usertoken', TOKEN);
  }

  public estadoSesion(): boolean {
    if (localStorage.getItem('usertoken') && localStorage.getItem('usuario')) {
      this.usuario = JSON.parse(localStorage.getItem('usuario') + '');
      this.userToken = localStorage.getItem('usertoken') + '';
      return true;
    } else {
      this.userToken = '';
      return false;
    }
  }



}
