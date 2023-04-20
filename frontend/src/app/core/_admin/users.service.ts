import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_interface/user';
import { GET_USERS_API, UPDATE_USER_API, EDIT_USER_API, CREATE_USER_API, DELETE_USER_API} from '../_helpers/urls';

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
      GET_USERS_API,
      {
        pageInfo,
      },
      httpOptions
    );
  }

  createUser(user: User): Observable<any> {
    return this.http.post(
      CREATE_USER_API,
      {
        user,
      },
      httpOptions
    );
  }

  editUser(user: number): Observable<any> {
    return this.http.post(
      EDIT_USER_API,
      {
        user,
      },
      httpOptions
    );
  }
  updateUser(user: User): Observable<any> {
    return this.http.post(
      UPDATE_USER_API,
      {
        user,
      },
      httpOptions
    );
  }

  deleteUser(user: number): Observable<any> {
    return this.http.post(
      DELETE_USER_API,
      {
        user,
      },
      httpOptions
    );
  }
}
