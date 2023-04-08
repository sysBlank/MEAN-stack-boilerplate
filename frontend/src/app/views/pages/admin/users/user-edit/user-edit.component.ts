import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { User } from 'src/app/core/_interface/user';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UsersService } from 'src/app/core/_admin/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common'; // Import formatDate from @angular/common
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  @ViewChild('picker') picker: any;
  Roles: any[] = [];
  statusItems: any = [
    { label: 'true', value: 1 },
    { label: 'false', value: 0 },
  ];

  User: Observable<User>;
  newUser: User;
  selectedStatus: any = null;
  selectedRoles: any = null;
  constructor(private httpClient: HttpClient, private userService: UsersService, private route: ActivatedRoute,private router: Router, private toastr: ToastrService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params.id;
    this.User = this.userService.editUser(id).pipe(
      map(data => {
        console.log(data);
        const user = data.body.data as User;
        // Format dates to dd/mm/yyyy hh:mm
        user.email_verified_at = (user.email_verified_at ? formatDate(user.email_verified_at, 'dd/MM/yyyy HH:mm', 'en-US') : '');
        user.created_at = (user.created_at ? formatDate(user.created_at, 'dd/MM/yyyy HH:mm', 'en-US') : '');
        user.updated_at = (user.updated_at ? formatDate(user.updated_at, 'dd/MM/yyyy HH:mm', 'en-US') : '');
        user.deleted_at = (user.deleted_at ? formatDate(user.deleted_at, '', 'dd/MM/yyyy HH:mm', 'en-US') : '');
        user.roles = user.roles.map(role => ({ label: role.name, value: role.id }));
        console.log(user);
        return user;
      })
    );

    this.User.subscribe(user => {
      this.selectedStatus = { label: user.active ? 'true' : 'false', value: user.active };
      if(user.allRoles) {
        this.Roles = user.allRoles.map(role => ({ label: role.name, value: role.id }));
      }
      this.newUser = user;
      // Access other user data properties as needed
      return user;
    });
  }

  updateUser() {
    console.log('newUser:', this.newUser);
      // Format the newUser dates to date object
      this.userService.updateUser(this.newUser).subscribe({
        next: data => {
          console.log(data);
          this.toastr.success(data.body.message, 'Success!');
          this.router.navigate(['/admin/users']);
        },
        error: err => {
          console.log(err);
          if(err.error.validationErrors) {
            this.toastr.error(err.error.validationErrors[0].msg ?? err.error.validationErrors[0].message, 'Unexpected error!');
            return;
          }
          this.toastr.error(err.error.message, 'Unexpected error!');
        }
      });
  }

}
