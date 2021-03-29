import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthSharedService } from '@app/_pages/shared/shared-services/auth-shared.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private _auth: AuthSharedService) { }
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = localStorage.getItem('usertoken');
    const userName = this._auth.usuario.nombre;
    if (token && userName) {
      request = request.clone({
        setHeaders: {
          "authorization": token, "userat": userName
        },
      })
    }
    return next.handle(request);
  }
}
