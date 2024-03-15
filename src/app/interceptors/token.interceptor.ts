import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let interceptorRequest = request
    let token = sessionStorage.getItem('token')

    if (token != null) {
      interceptorRequest = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + token)
      })
    }
    return next.handle(interceptorRequest);
  }
}
