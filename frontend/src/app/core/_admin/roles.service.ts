import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../_interface/role';
import { GET_ROLES_API, UPDATE_ROLE_API, EDIT_ROLE_API, CREATE_ROLE_API, DELETE_ROLE_API} from '../_helpers/urls';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true,
  observe: 'response' as 'response'
};

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  constructor(private http: HttpClient) { }

  getRoles(): Observable<any> {
    return this.http.get(
      GET_ROLES_API,
      httpOptions
    );
  }
  editRole(role: number): Observable<any> {
    return this.http.post(
      EDIT_ROLE_API,
      {
        role,
      },
      httpOptions
    );
  }
  updateRole(role: Role): Observable<any> {
    return this.http.post(
      UPDATE_ROLE_API,
      {
        role,
      },
      httpOptions
    );
  }
  createRole(role: Role): Observable<any> {
    return this.http.post(
      CREATE_ROLE_API,
      {
        role,
      },
      httpOptions
    );
  }

  deleteRole(role: number): Observable<any> {
    return this.http.post(
      DELETE_ROLE_API,
      {
        role,
      },
      httpOptions
    );
  }
}
