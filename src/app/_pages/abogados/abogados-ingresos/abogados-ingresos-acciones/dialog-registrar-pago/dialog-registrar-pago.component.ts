import { Component, OnInit, ViewChildren, QueryList, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbogadosTabsService } from '../../../abogados-tabs.service';
import { AbogadosService } from '../../../abogados.service';
import { MatPaginator } from '@angular/material/paginator';
import { Cuota } from '../../../../../_models/abogados/cuota';
import { Contrato } from '../../../../../_models/abogados/contrato';
import { SelectionModel } from '@angular/cdk/collections';


@Component({
  selector: 'app-dialog-registrar-pago',
  templateUrl: './dialog-registrar-pago.component.html',
  styleUrls: ['./dialog-registrar-pago.component.scss']
})
export class DialogRegistrarPagoComponent implements OnInit {

    // ? childrens
    @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

    // ? table definitions.
    displayedColumns: string[] = [
      'select',
      'id',
      'fecha',
      'monto',
      'estadoPago'
    ];
    dataSource: MatTableDataSource<Contrato> = new MatTableDataSource();
    dataContrato: Contrato[] = [];

    idContrato = localStorage.getItem("idContratoPago");
    
  
    formFilter = new FormGroup({
      start: new FormControl(),
      end: new FormControl(),
      estadoPago: new FormControl(),
    })
  
    selection = new SelectionModel<any>(true, []);
    totalSeleccion = 0;
    selectedRows!: any[];

  constructor(
    private abogadosTabsService: AbogadosTabsService,
    private abogadosService: AbogadosService
  ) { }

  ngOnInit(): void {
    this.getContratosCliente();
  }


  getContratosCliente(){
    //Carga Tabla 
    this.abogadosTabsService
    .obtenerContratoNumero(this.idContrato)
    .pipe()
    .subscribe((x: any) => {
     this.dataSource = new MatTableDataSource(x.CuotasContratos);
     this.dataSource.paginator = this.paginator.toArray()[0];
     console.log(x);
   });
  }


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  
  masterToggle() {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.filteredData.forEach(row => {
        this.selection.select(row);
  
      });
    console.log(this.selection.selected);
  }

}
