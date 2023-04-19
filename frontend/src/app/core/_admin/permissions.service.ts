import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../_interface/role';
import { GET_PERMISSIONS_API} from '../_helpers/urls';

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
}
