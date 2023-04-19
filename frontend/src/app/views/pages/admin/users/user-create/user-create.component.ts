import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { User } from 'src/app/core/_interface/user';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UsersService } from 'src/app/core/_admin/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common'; // Import formatDate from @angular/common
import { ToastrService } from 'ngx-toastr';
import { RolesService } from 'src/app/core/_admin/roles.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {

  @ViewChild('picker') picker: any;
  Roles: any[] = [];
  statusItems: any = [
    { label: 'true', value: 1 },
    { label: 'false', value: 0 },
  ];

  User: Observable<User>;
  newUser: User = {
    username: '',
    email: '',
    password: '',
    active: false,
    id: '',
    roles: [],
    email_verified_at: '',
    created_at: '',
    updated_at: '',
    deleted_at: ''
  };

  selectedStatus: any = null;
  selectedRoles: any = null;
  constructor(private userService: UsersService, private roleService: RolesService,private router: Router, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.roleService.getRoles().subscribe({
      next: data => {
        console.log(data);
        this.Roles = data.body.data.map((role: { name: any; id: any; }) => ({ label: role.name, value: role.id }));
      }
    });
  }

  createUser() {
    console.log('newUser:', this.newUser);
      this.userService.createUser(this.newUser).subscribe({
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
