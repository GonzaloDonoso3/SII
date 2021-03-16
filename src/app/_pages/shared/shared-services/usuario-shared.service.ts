import { HttpClient } from '@angular/common/http';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { Usuario } from '@models/shared/usuario';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioSharedService {
  private usuarioSubject: BehaviorSubject<Usuario>;
  public usuario: Observable<Usuario>;

  constructor(private router: Router, private http: HttpClient) {
    this.usuarioSubject = new BehaviorSubject<Usuario>(
      JSON.parse(localStorage.getItem('usuario')!)
    );
    this.usuario = this.usuarioSubject.asObservable();
  }

  public get userValue(): Usuario {
    return this.usuarioSubject.value;
  }

  // eslint-disable-next-line
  login(nombreUsuario: string, hash: string) {
    return this.http
      .post<Usuario>(`${environment.apiUrl}/usuarios/login`, {
        nombreUsuario,
        hash,
      })
      .pipe(
        map((usuario) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('usuario', JSON.stringify(usuario));
          this.usuarioSubject.next(usuario);
          return usuario;
        })
      );
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('usuario');
    this.usuarioSubject.next(null!);
    this.router.navigate(['/account/login']);
  }

  register(user: Usuario) {
    return this.http.post(`${environment.apiUrl}/usuarios`, user);
  }

  getAll() {
    return this.http.get<[]>(`${environment.apiUrl}/usuarios`);
  }

  getById(id: string) {
    return this.http.get<Usuario>(`${environment.apiUrl}/usuarios/${id}`);
  }

  update(id: string, params: any[]) {
    return this.http.put(`${environment.apiUrl}/usuarios/${id}`, params).pipe(
      map((x) => {
        // update stored user if the logged in user updated their own record
        if (id === this.userValue.id) {
          // update local storage
          const user = { ...this.userValue, ...params };
          localStorage.setItem('user', JSON.stringify(user));

          // publish updated user to subscribers
          this.usuarioSubject.next(user);
        }

        return x;
      })
    );
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/usuarios/${id}`).pipe(
      map((x) => {
        // auto logout if the logged in user deleted their own record
        if (id == this.userValue.id) {
          this.logout();
        }
        return x;
      })
    );
  }
}
