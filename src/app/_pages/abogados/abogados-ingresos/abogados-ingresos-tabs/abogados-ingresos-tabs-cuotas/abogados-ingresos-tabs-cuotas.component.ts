import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, Input, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { AbogadosTabsService } from '../../../abogados-tabs.service';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { Cuota } from '../../../../../_models/abogados/cuota';
import { DialogDownloadsComponent } from '@app/_components/dialogs/dialog-downloads/dialog-downloads.component';
import { Contrato } from '../../../../../_models/abogados/contrato';




@Component({
  selector: 'app-abogados-ingresos-tabs-cuotas',
  templateUrl: './abogados-ingresos-tabs-cuotas.component.html',
  styleUrls: ['./abogados-ingresos-tabs-cuotas.component.scss']
})
export class AbogadosIngresosTabsCuotasComponent implements OnInit {

  // ? childrens
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  // ? Inputs & Outputs
  @Input()
  refrescar = '';

  // ? table definitions.
  displayedColumns: string[] = [
    'select',
    'id',
    'fechaCompromiso',
    'monto',
    'estadoPago',
    'numeroContrato',
    'fechaRegistro',
    'fechaActualizacion',
  ];
  dataSource: MatTableDataSource<Cuota> = new MatTableDataSource();
  dataCuotas: Cuota[] = [];

  formFilter = new FormGroup({
    fechaCompromiso: new FormControl(),
    startRegistro: new FormControl(),
    endRegistro: new FormControl(),
    startActualizacion: new FormControl(),
    endActualizacion: new FormControl(),
    estadoPago: new FormControl(),
    numeroContrato: new FormControl(),
  })

  selection = new SelectionModel<any>(true, []);
  totalSeleccion = 0;
  selectedRows!: any[];


  constructor(
    private abogadosTabsService: AbogadosTabsService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getCuotas();
    this.aplicarfiltros();
  }

  getCuotas(){
    //Carga Tabla 
    this.abogadosTabsService.obtenerCuotas().subscribe((Cuotas: Cuota[]) => {
     this.dataCuotas = Cuotas.map(Cuotas => {
       return Cuotas;
     });
     this.dataSource = new MatTableDataSource(this.dataCuotas);
     this.dataSource.paginator = this.paginator.toArray()[0];
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


// Filtros
aplicarfiltros() {
  this.formFilter.valueChanges.subscribe(res => {

    let dataFiltered = this.dataCuotas;

    //Filtro Estado
    if (res.estadoPago) {
      dataFiltered = dataFiltered.filter((data: Cuota) => data.estado == res.estadoPago);
    }

    //Filtro Numero Contrato
    if (res.numeroContrato) {
      dataFiltered = dataFiltered.filter((data: Cuota) => data.idContrato == res.numeroContrato);
    }

    //Filtro Fecha Compromiso
    if (res.fechaCompromiso) {
      dataFiltered = dataFiltered.filter((data: Cuota) => data.fechaPago == res.fechaCompromiso);
    }
    
    //Filtro Fecha Registro Falta
    if (res.startRegistro && res.endRegistro) {
      dataFiltered = this.dataCuotas.map((data: any) => {
        data.createdAt = new Date(data.createdAt);
        return data;
      }).filter((comp: { createdAt: Date; }) => comp.createdAt >= res.startRegistro && comp.createdAt <= res.endRegistro);
      
    }

    //Filtro Fecha Actualización Falta
    if (res.startActualizacion && res.endActualizacion) {
      dataFiltered = dataFiltered.filter((data: Cuota) => new Date(data.updateAt) >= res.startActualizacion && new Date(data.updateAt) <= res.endActualizacion);
    }
    

    this.dataSource = new MatTableDataSource(dataFiltered);
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.totalSeleccion = 0;
    this.selection.clear();
  })
}

limpiarFiltros() {
  this.formFilter.patchValue({ estadoPago: null, numeroContrato: null, fechaCompromiso: null, startRegistro: null, endRegistro: null, startActualizacion: null, endActualizacion: null })
  this.dataSource = new MatTableDataSource(this.dataCuotas);
  this.dataSource.paginator = this.paginator.toArray()[0];
  this.selection.clear()
  this.totalSeleccion = 0;
}

//Metodo exportar excel
exportAsXLSX(): void {
  this.selectedRows = [];
  this.selection.selected.forEach((x) => this.selectedRows.push(x));
  this.abogadosTabsService.exportAsExcelFile(this.selectedRows, 'Lista-Cuotas');
}
}
