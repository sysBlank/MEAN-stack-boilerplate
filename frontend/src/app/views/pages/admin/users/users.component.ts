import { DatePipe } from '@angular/common';
import { Component, ChangeDetectorRef, OnInit, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, debounceTime, distinctUntilChanged, map, of, tap } from 'rxjs';
import { UsersService } from 'src/app/core/_admin/users.service';
@Component({
  selector: 'app-permissions',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UsersComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('roleTemplate') roleTemplate!: TemplateRef<any>;
  @ViewChild('actionTemplate') actionTemplate!: TemplateRef<any>;
  rows: Observable<any>;

  pagingInfo = {
    pageLimit: 10,
    totalItems: 0,
    offset: 0,
    sortColumn: 'id',
    sortDirection: 'asc',
    search: ''
  };

  tableFilterUpdate = new Subject<any>();

  columns: any[];

  ColumnMode = ColumnMode;
  constructor(private usersService: UsersService, private _datePipe: DatePipe, private cdr: ChangeDetectorRef,  private toastr: ToastrService) {
    this.rows = this.usersService.getUsers(this.pagingInfo)
    .pipe(
      tap(res => {
        // Update rows with new data from response
        console.log(res);
        this.table.count = res.body.total;
        this.table.offset = 0;

      }),
      map(res => res.body.data)
    );

    this.tableFilterUpdate.pipe(
      debounceTime(400),
      distinctUntilChanged())
      .subscribe(value => {
        this.updateFilter(value);
      });

  }

  ngAfterViewInit(): void {
    this.columns = [ // Must be here or else roles won't show up correctly for some reason connected to TemplateRef
      { name: 'ID', prop: 'id'},
      { name: 'Username', prop: 'username', resizeable: true},
      { name: 'Email', prop: 'email', minWidth: 200},
      { name: 'Roles', prop: 'roles', cellTemplate: this.roleTemplate, sortable: false},
      { name: 'Active', prop: 'active'},
      { name: 'email_verified_at', prop: 'email_verified_at', pipe: this.datePipe()},
      { name: 'created_at', prop: 'created_at', pipe: this.datePipe()},
      { name: 'updated_at', prop: 'updated_at', pipe: this.datePipe()},
      { name: 'deleted_at', prop: 'deleted_at', pipe: this.datePipe()},
      { name: 'Actions', prop: 'id', sortable: false, cellTemplate: this.actionTemplate, minWidth: 160,}
  ];
  this.cdr.detectChanges(); // detect changes or else ng100 error
}

  ngOnInit(): void {

  }


  updateFilter(searchText: string) {
    // wait for users to finish typing before updating the value
    // check if timer var exists and is a timer and clear it if its true
    console.log(searchText)
      const val = searchText.toLowerCase();
      this.pagingInfo.search = val;
      this.usersService.getUsers(this.pagingInfo)
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        map(res => res))
      .subscribe((data) => {
        // Update the rows data with the fetched data
        console.log(data);
        this.rows = of(data.body.data);
        this.table.count = data.body.total;
        this.table.offset = data.body.offset;

      });
  }

  onPageChange(event: any) {
    console.log(event);
    this.pagingInfo.offset = event.offset;
    this.usersService.getUsers(this.pagingInfo)
    .pipe(map(res => res))
    .subscribe((data) => {
      // Update the rows data with the fetched data
      this.rows = of(data.body.data);
      this.table.count = data.body.total;
      this.table.offset = data.body.offset;

    });
  }
  onSort(event: any) {
    this.pagingInfo.sortColumn = event.column.prop;
    this.pagingInfo.sortDirection = event.newValue;
    this.usersService.getUsers(this.pagingInfo)
    .pipe(map(res => res))
    .subscribe((data) => {
      // Update the rows data with the fetched data
      console.log(data);
      this.rows = of(data.body.data);
      this.table.count = data.body.total;
      this.table.offset = data.body.offset;
    });
  }
  onReorder(event: any) {
    console.log(event);
  }

  datePipe () {
    return {transform: (value: any) => this._datePipe.transform(value, 'MM/dd/yyyy hh:mm')};
  }

  deleteUser(id: number) {
     if(!confirm('Are you sure you want to delete this user?')) {
      return;
    }
    this.usersService.deleteUser(id)
    .pipe(map(res => res))
    .subscribe((data) => {
      // Update the rows data with the fetched data
      console.log(data);
      this.toastr.success('User deleted successfully', 'Success!');
      this.usersService.getUsers(this.pagingInfo)
      .pipe(map(res => res))
      .subscribe((data) => {
        // Update the rows data with the fetched data
        console.log(data);
        this.rows = of(data.body.data);
        this.table.count = data.body.total;
        this.table.offset = data.body.offset;
      });
    });
  }

}
