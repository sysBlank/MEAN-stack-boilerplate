import { Component, OnInit, ViewChild } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Observable, debounceTime, distinctUntilChanged, map, of, tap } from 'rxjs';
import { UsersService } from 'src/app/core/_admin/users.service';
@Component({
  selector: 'app-permissions',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})


export class UsersComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows: Observable<any>;

  pagingInfo = {
    pageLimit: 10,
    totalItems: 0,
    offset: 0,
    sortColumn: 'id',
    sortDirection: 'asc',
    search: ''
  };


  columns = [{ name: 'ID' }, { name: 'Username' }, { name: 'Email' }];

  ColumnMode = ColumnMode;
  constructor(private usersService: UsersService) {
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
  }

  ngOnInit(): void {

  }

  updateFilter(event: any) {
    // wait for users to finish typing before updating the value
    // check if timer var exists and is a timer and clear it if its true

      const val = event.target.value.toLowerCase();
      this.pagingInfo.search = val;
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

  onPageChange(event: any) {
    console.log(event);
    this.pagingInfo.offset = event.offset;
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
}
