import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil, tap } from "rxjs/operators";
import { ApiService } from '../app/services/api-service.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'yyyy-MM-dd',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})

export class AppComponent implements OnInit {
  private searchClicked = new Subject<string>();

  title = 'fhir-app-test';
  displayedColumns: string[] = ['id', 'name', 'dob'];
  dataSource = new MatTableDataSource<any>();
  counter: number;
  constructor(
    private apiService: ApiService,
    private datePipe: DatePipe
  ) { 
    const buttonClickedDebounced = this.searchClicked.pipe(debounceTime(500));
    buttonClickedDebounced.subscribe(() =>
    {
       this.fetchSearchData();
    }
 );
  }

  ngOnInit() {
    const startTimestamp = new Date().getTime();
    this.apiService.getPatientsBirthDataBetweenYear(1960,1965).pipe(tap(()=> {
      const endTimestamp: number = new Date().getTime();
      this.counter = endTimestamp - startTimestamp;
    }),takeUntil(this.onDestroy)).subscribe(
      (data: any) => {
        this.dataSource.data = data.entry;
        console.log(data);
      }
    )
  }

  search() {
    this.searchClicked.next();
  }
  
  fetchSearchData() {
    const startTimestamp = new Date().getTime();
    const name = this.patientForm.value.name;
    const dateOfBirth = this.datePipe.transform(this.patientForm.value.dob, 'yyyy-MM-dd'); // TODO this should not be needed
    console.log(name);
    console.log(dateOfBirth);
    this.apiService.getPatientsByNameAndBirthDate(name,dateOfBirth).pipe(tap(()=> {
      const endTimestamp: number = new Date().getTime();
      this.counter = endTimestamp - startTimestamp;
    }),takeUntil(this.onDestroy)).subscribe(
      (data: any) => {
        this.dataSource.data = data.entry;
        console.log(data);
      }
    )
  }

  public patientForm = new FormGroup({
    name: new FormControl(null, [Validators.required,Validators.pattern('^[a-zA-Z ]*$')]),
    dob: new FormControl(null,[Validators.required])
  });
  
  public onDestroy: Subject<void> = new Subject<void>();

  ngOnDestroy() {
    this.onDestroy.next();	
  }
}


