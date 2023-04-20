
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { StorageService } from '../_services/storage.service';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpErrorResponse
} from '@angular/common/http';
import { EventBusService } from '../_shared/event-bus.service';
import { EventData } from '../_shared/event.class';
import { Router } from '@angular/router';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private storageService: StorageService, private eventBusService: EventBusService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      withCredentials: true,
    });

    return next.handle(req).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          !req.url.includes('auth/login') &&
          error.status === 401
        ) {
          // If access_token is missing from request, then clean the storage
          if (!req.headers.has('Authorization')) {
            this.storageService.clean();
            this.router.navigate(['/auth/login']);
          }
          // If error type is auth_failed, then clean the storage
          if (error.error.type === 'auth_failed') {
            this.storageService.clean();
            this.router.navigate(['/auth/login']);
          }
          return this.handle401Error(req, next);
        }

        if (error.error.type === 'auth_failed') {
          this.storageService.clean();
          this.router.navigate(['/auth/login']);
        }
        // if error status 403, then redirect to 404 page
        if (error.status === 403) {
          this.router.navigate(['/error/403']);
        }
        if (error.status == 0 || error.status > 500) {
          this.router.navigate(['/error/500']);
        }
        console.log('intercepted')
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      if (this.storageService.isLoggedIn()) {
        this.eventBusService.emit(new EventData('logout', null));
      }
    }

    return next.handle(request);
  }
}

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
];
