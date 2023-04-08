import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminComponent } from './admin.component';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from '../../layout/base/base.component';
import { AuthGuard } from 'src/app/core/guard/auth.guard';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';
import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'users/edit/:id',
        component: UserEditComponent,
      },
      {
        path: 'roles',
        component: RolesComponent,
      },
      {
        path: 'permissions',
        component: PermissionsComponent,
      },
    ]
  },
]
@NgModule({
  declarations: [
    AdminComponent,
    UsersComponent,
    RolesComponent,
    PermissionsComponent,
    UserEditComponent,
  ],
  imports: [
    CommonModule,
    NgxDatatableModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxMaskModule.forRoot({ validation: true}), // Ngx-mask
    RouterModule.forChild(routes),
  ],
  providers: [
    DatePipe,
  ]
})
export class AdminModule { }
