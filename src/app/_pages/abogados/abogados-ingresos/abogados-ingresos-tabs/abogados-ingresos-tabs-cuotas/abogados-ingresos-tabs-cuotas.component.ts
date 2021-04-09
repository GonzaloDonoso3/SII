import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, Input, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { AbogadosTabsService } from '../../../abogados-tabs.service';
import { Cliente } from '../../../../../_models/abogados/cliente';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { Sucursal } from '@app/_models/shared/sucursal';
import { DialogDownloadsComponent } from '@app/_components/dialogs/dialog-downloads/dialog-downloads.component';




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
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  dataCuotas: any;

  changelog: string[] = [];

  rangoFechaCompromiso = new FormGroup({
    fechaCompromiso: new FormControl(),
  });

  rangoFechaRegistro = new FormGroup({
    startRegistro: new FormControl(),
    endRegistro: new FormControl(),
  });

  rangoFechaActualizacion = new FormGroup({
    startActualizacion: new FormControl(),
    endActualizacion: new FormControl(),
  });

  estadoPagoFilter = new FormGroup({
    estadoPago: new FormControl(),
  });
  
  numeroContratoFilter = new FormGroup({
    numeroContrato: new FormControl(),
  });

  selection = new SelectionModel<any>(true, []);


  constructor(
    private abogadosTabsService: AbogadosTabsService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getCuotas();


    this.estadoPagoFilter.valueChanges.subscribe(res => {
      this.applyEstadoPagoFilter(res.estadoPago);
    });

    this.rangoFechaCompromiso.valueChanges.subscribe(res => {
      this.applyDateCompromisoFilter(res.fechaCompromiso);
    });

    this.numeroContratoFilter.valueChanges.subscribe(res => {
      this.applyNumeroContratoFilter(res.numeroContrato);
    });

    this.rangoFechaRegistro.valueChanges.subscribe(res => {
      if (res.startRegistro != null && res.endRegistro != null) {
        const rango = this.rangoFechaRegistro.value;
        this.applyDateRegistroFilter(rango.startRegistro, rango.endRegistro);
      }
    });

    this.rangoFechaActualizacion.valueChanges.subscribe(res => {
      if (res.startActualizacion != null && res.endActualizacion != null) {
        const rango = this.rangoFechaActualizacion.value;
        this.applyDateActualizacionFilter(rango.startActualizacion, rango.endActualizacion);
      }
    });
  }

  getCuotas(){
    //Carga Tabla 
    this.abogadosTabsService.obtenerCuotas().subscribe((Cuotas: any) => {
     this.dataCuotas = Cuotas.map((Cuotas: any) => {
       return Cuotas;
     });
     console.log(this.dataCuotas);
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
limpiarFiltros() {
  this.dataSource = new MatTableDataSource(this.dataCuotas);
  this.dataSource.paginator = this.paginator.toArray()[0];
}

applyEstadoPagoFilter(_filter: string) {
  this.dataSource.filterPredicate = (data: any, filter: string) => {
    if (!data.estado === null) {
      return data.estado.startsWith(filter);
    } else {
      return data.estado === filter;
    }
  };
  this.dataSource.filter = _filter;
  this.dataSource.paginator = this.paginator.toArray()[0];
}

applyDateCompromisoFilter(_filter: string) {
  this.dataSource.filterPredicate = (data: any, filter: string) => {
    if (!data.fechaPago === null) {
      return data.fechaPago.startsWith(filter);
    } else {
      return data.fechaPago === filter;
    }
  };
  this.dataSource.filter = _filter;
  this.dataSource.paginator = this.paginator.toArray()[0];
}

applyNumeroContratoFilter(_filter: string) {
  this.dataSource.filterPredicate = (data: any, filter: string) => {
    if (!data.idContrato === null) {
      return data.idContrato.startsWith(filter);
    } else {
      return data.idContrato === filter;
    }
  };
  this.dataSource.filter = _filter;
  this.dataSource.paginator = this.paginator.toArray()[0];
}

applyDateRegistroFilter(startRegistro: Date, endRegistro: Date) {
    const datafiltered = this.dataCuotas.map((data: any) => {
      data.createdAt = new Date(data.createdAt);
      return data;
    }).filter((comp: { createdAt: Date; }) => comp.createdAt.toLocaleDateString() >= startRegistro.toLocaleDateString() && comp.createdAt.toLocaleDateString() <= endRegistro.toLocaleDateString());
    this.dataSource = new MatTableDataSource(datafiltered);
    this.dataSource.paginator = this.paginator.toArray()[0];
}

applyDateActualizacionFilter(startActualizacion: Date, endActualizacion: Date) {
  const datafiltered = this.dataCuotas.map((data: any) => {
    data.updatedAt = new Date(data.updatedAt);
    return data;
  }).filter((comp: { updatedAt: Date; }) => comp.updatedAt.toLocaleDateString() >= startActualizacion.toLocaleDateString() && comp.updatedAt.toLocaleDateString() <= endActualizacion.toLocaleDateString());
  this.dataSource = new MatTableDataSource(datafiltered);
  this.dataSource.paginator = this.paginator.toArray()[0];
}
}
