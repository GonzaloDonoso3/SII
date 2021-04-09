import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, Input, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { AbogadosTabsService } from '../../../abogados-tabs.service';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { Sucursal } from '@app/_models/shared/sucursal';
import { DialogDownloadsComponent } from '@app/_components/dialogs/dialog-downloads/dialog-downloads.component';

@Component({
  selector: 'app-abogados-ingresos-tabs-contratos',
  templateUrl: './abogados-ingresos-tabs-contratos.component.html',
  styleUrls: ['./abogados-ingresos-tabs-contratos.component.scss']
})
export class AbogadosIngresosTabsContratosComponent implements OnInit {

  // ? childrens
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  // ? Inputs & Outputs
  @Input()
  refrescar = '';

  // ? table definitions.
  displayedColumns: string[] = [
    'select',
    'id',
    'rut',
    'cliente',
    'fecha',
    'monto',
    'estadoPago',
    'sucursal',
    'usuario'
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  dataContrato: any;


  changelog: string[] = [];

  rutFilter = new FormGroup({
    rut: new FormControl(),
  });
  
  clienteFilter = new FormGroup({
    cliente: new FormControl(),
  });

  estadoPagoFilter = new FormGroup({
    estadoPago: new FormControl(),
  });

  sucursalFilter = new FormGroup({
    sucursal: new FormControl(),
  });


  usuarioFilter = new FormGroup({
    usuario: new FormControl(),
  });

  rangoFecha = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  sucursales: Sucursal[] = [];
  selection = new SelectionModel<any>(true, []);
  tiposIngresos: string[] = [];
  estadosPagos: string[] = [];
  totalSeleccion = 0;
  cuentasRegistradas: any[] = [];


  constructor(
    private abogadosTabsService: AbogadosTabsService,
    public dialog: MatDialog,
  ) { 
    
  }

  ngOnInit(): void {
    this.getContratos();

    this.rutFilter.valueChanges.subscribe(res => {
      this.applyRutFilter(res.rut);
    });

    this.clienteFilter.valueChanges.subscribe(res => {
      this.applyClienteFilter(res.cliente);
    });

    this.estadoPagoFilter.valueChanges.subscribe(res => {
      this.applyEstadoPagoFilter(res.estadoPago);
    });

    this.sucursalFilter.valueChanges.subscribe(res => {
      this.applySucursalFilter(res.sucursal);
    });

    this.rangoFecha.valueChanges.subscribe(res => {
      if (res.start != null && res.end != null) {
        const rango = this.rangoFecha.value;
        this.applyDateFilter(rango.start,
          rango.end);
      }
    });

    this.usuarioFilter.valueChanges.subscribe(res => {
      this.applyUsuarioFilter(res.usuario);
    });

  }

  getContratos(){
       //Carga Tabla 
       this.abogadosTabsService.obtenerContratos().subscribe((Contrato: any) => {
        this.dataContrato = Contrato.map((Contrato: any) => {
          return Contrato;
        });
        this.dataSource = new MatTableDataSource(this.dataContrato);
        this.dataSource.paginator = this.paginator.toArray()[0];
      });
  }

   // ? selection rows
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
    this.dataSource = new MatTableDataSource(this.dataContrato);
    this.dataSource.paginator = this.paginator.toArray()[0];
  }

  applyRutFilter(_filter: string) {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      if (!data.clienteRut === null) {
        return data.clienteRut.startsWith(filter);
      } else {
        return data.clienteRut === filter;
      }
    };
    this.dataSource.filter = _filter;
    this.dataSource.paginator = this.paginator.toArray()[0];
  }

  applyClienteFilter(_filter: string) {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      if (!data.cliente === null) {
        return data.cliente.startsWith(filter);
      } else {
        return data.cliente === filter;
      }
    };
    this.dataSource.filter = _filter;
    this.dataSource.paginator = this.paginator.toArray()[0];
  }

  applyEstadoPagoFilter(_filter: string) {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      if (!data.estadoPago === null) {
        return data.estadoPago.startsWith(filter);
      } else {
        return data.estadoPago === filter;
      }
    };
    this.dataSource.filter = _filter;
    this.dataSource.paginator = this.paginator.toArray()[0];
  }

  applyDateFilter(start: Date, end: Date) {
    if (!this.clienteFilter.value.fixed) {
      const datafiltered = this.dataContrato.map((data: any) => {
        data.fechaContrato = new Date(data.fechaContrato);
        return data;
      }).filter((comp: { fechaContrato: Date; }) => comp.fechaContrato >= start && comp.fechaContrato <= end);

      this.dataSource = new MatTableDataSource(datafiltered);

      this.dataSource.paginator = this.paginator.toArray()[0];
    } else {
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const compare = new Date(data.fechaContrato);
        const filterValue = filter.split(' ');
        const startValue = new Date(Number(filterValue[0]));
        const endValue = new Date(Number(filterValue[1]));
        return compare >= startValue && compare <= endValue;
      };
      const filteredDate = `${start.getTime()} ${end.getTime()}`;
      this.dataSource.filter = filteredDate;
      this.dataSource.paginator = this.paginator.toArray()[0];
    }

  }

  applySucursalFilter(_filter: string) {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      if (!data.sucursal === null) {
        return data.sucursal.startsWith(filter);
      } else {
        return data.sucursal === filter;
      }
    };
    this.dataSource.filter = _filter;
    this.dataSource.paginator = this.paginator.toArray()[0];
  }

  applyUsuarioFilter(_filter: string) {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      if (!data.usuario === null) {
        return data.usuario.startsWith(filter);
      } else {
        return data.usuario === filter;
      }
    };
    this.dataSource.filter = _filter;
    this.dataSource.paginator = this.paginator.toArray()[0];
  }
  

  recuperarArchivos(listArchivos: any) {
    this.dialog.open(DialogDownloadsComponent, {

      data: { archivos: listArchivos, servicio: 'inmobiliaria-ingreso' },

    });
  }

}
