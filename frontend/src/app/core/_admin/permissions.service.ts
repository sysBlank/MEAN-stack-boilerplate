import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Permission } from '../_interface/permission';
import { GET_PERMISSIONS_API, EDIT_PERMISSION_API, CREATE_PERMISSION_API, UPDATE_PERMISSION_API, DELETE_PERMISSION_API} from '../_helpers/urls';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true,
  observe: 'response' as 'response'
};

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor(private http: HttpClient) { }

  getPermissions(): Observable<any> {
    return this.http.get(
      GET_PERMISSIONS_API,
      httpOptions
    );
  }

  editPermission(permission: number): Observable<any> {
    return this.http.post(
      EDIT_PERMISSION_API,
      {
      permission
      },
      httpOptions
    );
  }

  createPermission(permission: Permission): Observable<any> {
    return this.http.post(
      CREATE_PERMISSION_API,
      {
        permission
        },
      httpOptions
    );
  }

  updatePermission(permission: Permission): Observable<any> {
    return this.http.post(
      UPDATE_PERMISSION_API,
      {
        permission
        },
      httpOptions
    );
  }

  deletePermission(permission: number): Observable<any> {
    return this.http.post(
      DELETE_PERMISSION_API,
      {
        permission
        },
      httpOptions
    );
  }

}
