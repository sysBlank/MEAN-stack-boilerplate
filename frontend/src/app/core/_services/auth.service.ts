import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LOGIN_API, REGISTER_API, CONFIRM_EMAIL_API, RESEND_CONFIRMATION_EMAIL_API, RESET_PASSWORD_API, FORGOT_PASSWORD_API, AUTH_API } from '../_helpers/urls';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true,
  observe: 'response' as 'response'
};


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(
      LOGIN_API,
      {
        email,
        password,
      },
      httpOptions
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(
      REGISTER_API,
      {
        username,
        email,
        password,
      },
      httpOptions
    );
  }

  confirmEmail(token: string): Observable<any> {
    return this.http.post(
      CONFIRM_EMAIL_API,
      {
        token,
      },
      httpOptions
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(
      FORGOT_PASSWORD_API,
      {
        email,
      },
      httpOptions
    );
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post(
      RESET_PASSWORD_API,
      {
        token,
        password,
      },
      httpOptions
    );
  }

  resendConfirmationEmail(token: string): Observable<any> {
    return this.http.post(
      RESEND_CONFIRMATION_EMAIL_API,
      {
        token,
      },
      httpOptions
    );
  }


  logout(): Observable<any> {
    return this.http.post(AUTH_API + 'logout', { }, httpOptions);
  }
}
