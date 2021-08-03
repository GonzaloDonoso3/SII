import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {  } from '@app/_models/agroFirma/Banco';
import { CuentaRegistrada } from '@app/_models/agroFirma/CuentaRegistrada';
import { Observable } from 'rxjs';
import { AgroFirmaService } from '../../agro-firma.service';

@Component({
  selector: 'app-bank-account-list',
  templateUrl: './bank-account-list.component.html',
  styleUrls: ['./bank-account-list.component.scss']
})
export class BankAccountListComponent implements OnInit {

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChild(MatSort) sort = null;

  // Input Decorator para obtener el id del proyecto seleccionado desde el componente padre
  @Input() projectId!: Observable<number>
  @Input() updateTime!: number

  bankAccountForm!: FormGroup
  bankAccounts: CuentaRegistrada[] = []
  selection = new SelectionModel<CuentaRegistrada>(true, []);
  displayedColumns: string[] = [
    'id',
    'nombreInstitucion',
    'tipoCuenta',
    'numeroCuenta'
  ]

  formFilter = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
    fecha: new FormControl()
  })

  dataSource: MatTableDataSource<CuentaRegistrada> = new MatTableDataSource();
  

  constructor(private fb: FormBuilder,
    private agroFirmaService: AgroFirmaService) { }

  ngOnInit(): void {

    this.aplicarfiltros()
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.projectId !== undefined) {
      if(!changes.projectId.firstChange) {
        this.updateTable()
      }
    }
    if(changes.updateTime !== undefined) {
      if(!changes.updateTime.firstChange) {
        this.updateTable()
      }
    }

  }

  aplicarfiltros() {
  
    this.formFilter.valueChanges.subscribe(res => {

     let dataFiltered = this.bankAccounts;      

     this.dataSource = new MatTableDataSource(dataFiltered);
     this.dataSource.paginator = this.paginator.toArray()[0];
     this.dataSource.sort = this.sort;
     this.selection.clear();
   }) 

 }

 updateTable(){
   this.agroFirmaService.getBankAccountsById(Number(this.projectId)).subscribe((data: CuentaRegistrada[]) => {
     this.bankAccounts = data;
     this.dataSource = new MatTableDataSource(data);        
     this.dataSource.paginator = this.paginator.toArray()[0];
     this.dataSource.sort = this.sort;
   });
}

}
