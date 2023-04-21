import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Observable, map, tap } from 'rxjs';
import { RolesService } from 'src/app/core/_admin/roles.service';
import { ModalComponent } from '../../ui-components/modal/modal.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { PermissionsService } from 'src/app/core/_admin/permissions.service';
import { Permission } from 'src/app/core/_interface/permission';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('actionTemplate') actionTemplate!: TemplateRef<any>;
  @ViewChild('editModal') editModal!: TemplateRef<any>;
  @ViewChild('createModal') createModal!: TemplateRef<any>;
  rows: any[];
  columns: any[];

  Permission: Permission = {
    name: '',
    created_at: '',
    updated_at: '',
    deleted_at: ''
  };
  ColumnMode = ColumnMode;
  constructor(private permissionsService: PermissionsService, private _datePipe: DatePipe, private cdr: ChangeDetectorRef, private modalService: NgbModal,private toastr: ToastrService) {
  this.permissionsService.getPermissions().subscribe(res => {
    console.log(res);
      this.rows = res.body.data;
    })
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.columns = [ // Must be here or else roles won't show up correctly for some reason connected to TemplateRef
      { name: 'ID', prop: 'id'},
      { name: 'Name', prop: 'name', resizeable: true},
      { name: 'created_at', prop: 'created_at', pipe: this.datePipe()},
      { name: 'updated_at', prop: 'updated_at', pipe: this.datePipe()},
      { name: 'Actions', prop: 'id', sortable: false, cellTemplate: this.actionTemplate, minWidth: 160,}
  ];
  this.cdr.detectChanges(); // detect changes or else ng100 error
}
datePipe() {
  return {transform: (value: any) => this._datePipe.transform(value, 'MM/dd/yyyy hh:mm')};
}


  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.rows.filter(function (d: any) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  editPermission(permission_id: number): void {
    this.permissionsService.editPermission(permission_id).subscribe(res => {
      this.Permission = res.body.data;
      this.modalService.open(this.editModal, {ariaLabelledBy: 'modal-basic-title', size: 'lg', scrollable: true});
    });
  }

  updatePermission(): void {
    this.permissionsService.updatePermission(this.Permission).subscribe({
      next: data => {
        console.log(data);
        this.toastr.success(data.body.message, 'Success!');
        this.modalService.dismissAll();
        // Reload page
        window.location.reload();
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

  addPermission(): void {
    this.Permission = {
      name: '',
      created_at: '',
      updated_at: '',
      deleted_at: ''
    };
    this.modalService.open(this.createModal, {ariaLabelledBy: 'modal-basic-title', size: 'lg', scrollable: true});
  }

  createPermission(): void {
    this.permissionsService.createPermission(this.Permission).subscribe({
      next: data => {
        console.log(data);
        this.toastr.success(data.body.message, 'Success!');
        this.modalService.dismissAll();
        window.location.reload();
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



  deletePermission(permission_id: number): void {
    if(!confirm('Are you sure you want to delete this permission?')) {
      return;
    }
    this.permissionsService.deletePermission(permission_id).subscribe({
      next: data => {
        this.toastr.success(data.body.message, 'Success!');
        window.location.reload();
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
