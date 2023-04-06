import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


@NgModule({
  declarations: [
    AdminComponent,
    UsersComponent,
    RolesComponent,
    PermissionsComponent,
  ],
  imports: [
    CommonModule,
    NgxDatatableModule
  ]
})
export class AdminModule { }
