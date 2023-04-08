import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_interface/user';

const AUTH_API = 'http://localhost:3000/api/admin/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true,
  observe: 'response' as 'response'
};

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) { }

  getUsers(pageInfo: any): Observable<any> {
    return this.http.post(
      AUTH_API + 'users/get',
      {
        pageInfo,
      },
      httpOptions
    );
  }
  editUser(user: number): Observable<any> {
    return this.http.post(
      AUTH_API + 'users/edit',
      {
        user,
      },
      httpOptions
    );
  }
  updateUser(user: User): Observable<any> {
    return this.http.post(
      AUTH_API + 'users/update',
      {
        user,
      },
      httpOptions
    );
  }
}
