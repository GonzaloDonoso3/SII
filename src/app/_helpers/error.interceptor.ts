import { AlertHelper } from './alert.helper';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthSharedService } from '@app/_pages/shared/shared-services/auth-shared.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private _auth: AuthSharedService, private alert: AlertHelper) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError((err) => {
      if (err.status === 320) {
        //errores del token
        this.alert.errorAlert('Reiniciando session...');
        this._auth.cerrarSesion();
      }

      if (err.status === 404) {
        this.alert.errorAlert(err.error.message + " contacte con informatica");
      }

      const error = err.error.message || err.status;
      return throwError(error);
    }))
  }
}
