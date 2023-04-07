import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { User } from 'src/app/core/_interface/user';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UsersService } from 'src/app/core/_admin/users.service';
import { ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common'; // Import formatDate from @angular/common

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  @ViewChild('picker') picker: any;
  Roles: any[] = [];
  statusItems: any = [
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 },
  ];

  User: Observable<User>;

  selectedRoles: any = null;

  selectedStatus: any = null;

  constructor(private httpClient: HttpClient, private userService: UsersService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params.id;
    this.User = this.userService.editUser(id).pipe(
      map(data => {
        const user = data.body.data as User;
        // Format dates to dd/mm/yyyy hh:mm
        user.email_verified_at = (user.email_verified_at ? formatDate(user.email_verified_at, 'dd/MM/yyyy HH:mm', 'en-US') : '');
        user.created_at = (user.created_at ? formatDate(user.created_at, 'dd/MM/yyyy HH:mm', 'en-US') : '');
        user.updated_at = (user.updated_at ? formatDate(user.updated_at, 'dd/MM/yyyy HH:mm', 'en-US') : '');
        user.deleted_at = (user.deleted_at ? formatDate(user.deleted_at, '', 'dd/MM/yyyy HH:mm', 'en-US') : '');
        return user;
      })
    );

    this.User.subscribe(user => {
      this.selectedStatus = { label: user.active ? 'Active' : 'Inactive', value: user.active };
      console.log(user);
      if(user.allRoles) {
        this.Roles = user.allRoles.map(role => ({ label: role.name, value: role.id }));
      }
      this.selectedRoles = user.roles.map(role => ({ label: role.name, value: role.id }));
      // Access other user data properties as needed
    });
  }

}
