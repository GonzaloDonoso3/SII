import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, Input, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { InmobiliariaService } from '../../inmobiliaria.service';
import { IngresosInmobiliaria } from '@app/_models/inmobiliaria/ingresoInmobiliaria';
import { MatDialog } from '@angular/material/dialog';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Sucursal } from '@app/_models/shared/sucursal';
import { DialogDownloadsComponent } from '@app/_components/dialogs/dialog-downloads/dialog-downloads.component';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-inmobiliaria-ingresos-list',
  templateUrl: './inmobiliaria-ingresos-list.component.html',
  styleUrls: ['./inmobiliaria-ingresos-list.component.scss']
})
export class InmobiliariaIngresosListComponent implements OnInit {

  // ? childrens
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  // ? Inputs & Outputs
  @Input()
  refrescar = '';

  // ? table definitions.
  displayedColumns: string[] = [
    'select',
    'id',
    'propiedad',
    'respaldos',
    'fecha',
    'monto',
    'tipoIngreso',
    'descripcionIngreso',
    'sucursal',
    'usuario'
  ];
  dataSource: MatTableDataSource<IngresosInmobiliaria> = new MatTableDataSource();
  dataIngresos: IngresosInmobiliaria[] = [];

  changelog: string[] = [];


  formFilter = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
    idSucursal: new FormControl(),
    tipoIngreso: new FormControl(),
    descripcionIngreso: new FormControl(),
    Propiedad: new FormControl(),
  })


  /*   rangoFecha = new FormGroup({
      start: new FormControl(),
      end: new FormControl(),
  
    });
    sucursalFilter = new FormGroup({
      idSucursal: new FormControl(),
    });
    clienteFilter = new FormGroup({
      cliente: new FormControl(),
    });
    tipoIngresoFilter = new FormGroup({
      tipoIngreso: new FormControl(),
    });
    descripcionIngresoFilter = new FormGroup({
      descripcionIngreso: new FormControl(),
      fixed: new FormControl(),
    });
    propiedadFilter = new FormGroup({
      Propiedad: new FormControl(),
  
    }); */
  sucursales: Sucursal[] = [];
  selection = new SelectionModel<IngresosInmobiliaria>(true, []);
  tiposIngresos: string[] = [];
  estadosPagos: string[] = [];
  totalSeleccion = 0;
  cuentasRegistradas: any[] = [];
  constructor(
    private inmobiliariaService: InmobiliariaService,
    public dialog: MatDialog,
    private sucursalService: SucursalSharedService
  ) {

  }

  ngOnInit(): void {
    this.sucursales = this.sucursalService.sucursalListValue;
    this.tiposIngresos = this.inmobiliariaService.tiposIngresosListValue;
    this.aplicarfiltros();
    /*  this.rangoFecha.valueChanges.subscribe(res => {
       if (res.start != null && res.end != null) {
         const rango = this.rangoFecha.value;
         this.applyDateFilter(rango.start,
           rango.end);
       }
     });
     this.sucursalFilter.valueChanges.subscribe(res => {
       this.applySucursalFilter(res.idSucursal);
     });
 
     this.tipoIngresoFilter.valueChanges.subscribe(res => {
       this.applyTipoIngresoFilter(res.tipoIngreso);
     });
 
     this.propiedadFilter.valueChanges.subscribe(res => {
       this.applyPropiedadFilter(res.Propiedad);
     });
 
     this.descripcionIngresoFilter.valueChanges.subscribe(res => {
       this.applyDescripcionIngresoFilter(res.descripcionIngreso);
     });
  */
  }

  // ? refresh when form is ready.

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName of Object.keys(changes)) {
      const change = changes[propName];
      const to = JSON.stringify(change.currentValue);
      const from = JSON.stringify(change.previousValue);
      const changeLog = `${propName}: changed from ${from} to ${to} `;
      this.changelog.push(changeLog);
      //Carga Tabla 
      this.inmobiliariaService.getAll().subscribe((ingresos: IngresosInmobiliaria[]) => {
        this.dataIngresos = ingresos.map(ingresos => {
          ingresos.sucursal = ingresos.Sucursal.razonSocial;
          ingresos.usuario = ingresos.Usuario.nombreUsuario;
          return ingresos;
        });
        this.dataSource = new MatTableDataSource(this.dataIngresos);
        this.dataSource.paginator = this.paginator.toArray()[0];
      });
    }
  }

  recuperarArchivos(listArchivos: any) {
    this.dialog.open(DialogDownloadsComponent, {

      data: { archivos: listArchivos, servicio: 'inmobiliaria-ingreso' },

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

  revelarTotal() {
    this.totalSeleccion = 0;
    console.log(this.selection.selected.length);
    this.selection.selected.forEach(data => {
      this.totalSeleccion += data.monto;
    });
  }






  aplicarfiltros() {
    this.formFilter.valueChanges.subscribe(res => {

      let dataFiltered = this.dataIngresos;

      if (res.Propiedad) {
        dataFiltered = dataFiltered.filter((data: IngresosInmobiliaria) => data.propiedad.includes(res.Propiedad));
      }

      if (res.descripcionIngreso) {
        dataFiltered = dataFiltered.filter((data: IngresosInmobiliaria) => data.descripcionIngreso.includes(res.descripcionIngreso));
      }

      if (res.tipoIngreso) {
        dataFiltered = dataFiltered.filter((data: IngresosInmobiliaria) => data.tipoIngreso == res.tipoIngreso);
      }

      if (res.idSucursal) {
        dataFiltered = dataFiltered.filter((data: IngresosInmobiliaria) => data.sucursal == res.idSucursal);
      }

      if (res.start && res.end) {
        dataFiltered = dataFiltered.filter((data: IngresosInmobiliaria) => new Date(data.fecha) >= res.start && new Date(data.fecha) <= res.end);
      }

      this.dataSource = new MatTableDataSource(dataFiltered);
      this.dataSource.paginator = this.paginator.toArray()[0];
      this.totalSeleccion = 0;
      this.selection.clear();
    })
  }




  // Filtros
  limpiarFiltros() {
    this.formFilter.patchValue({ start: null, end: null, idSucursal: null, tipoIngreso: null, estadoPago: null, cliente: null, nDocumento: null })
    this.dataSource = new MatTableDataSource(this.dataIngresos);
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.selection.clear()
    this.totalSeleccion = 0;
  }

  /*  applySucursalFilter(filterValue: string) {
     this.dataSource.filterPredicate = (data: IngresosInmobiliaria, filter: string) => data.sucursal === filter;
     this.dataSource.filter = filterValue;
     this.dataSource.paginator = this.paginator.toArray()[0];
   }
   applyPropiedadFilter(_filter: string) {
     this.dataSource.filterPredicate = (data: IngresosInmobiliaria, filter: string) => {
       if (!data.propiedad === null) {
         return data.propiedad.startsWith(filter);
       } else {
         return data.propiedad === filter;
       }
     };
     this.dataSource.filter = _filter;
     this.dataSource.paginator = this.paginator.toArray()[0];
   }
 
   applyDescripcionIngresoFilter(_filter: string) {
     this.dataSource.filterPredicate = (data: IngresosInmobiliaria, filter: string) => {
       if (!data.descripcionIngreso === null) {
         return data.descripcionIngreso.startsWith(filter);
       } else {
         return data.descripcionIngreso === filter;
       }
     }
     this.dataSource.filter = _filter;
     this.dataSource.paginator = this.paginator.toArray()[0];
   }
 
   applyTipoIngresoFilter(filterValue: string) {
     this.dataSource.filterPredicate = (data: IngresosInmobiliaria, filter: string) => data.tipoIngreso.includes(filter);
     this.dataSource.filter = filterValue;
     this.dataSource.paginator = this.paginator.toArray()[0];
   }
 
   applyDateFilter(start: Date, end: Date) {
     if (!this.descripcionIngresoFilter.value.fixed) {
       const datafiltered = this.dataIngresos.map(data => {
         data.fecha = new Date(data.fecha);
         return data;
       }).filter(comp => comp.fecha >= start && comp.fecha <= end);
 
       this.dataSource = new MatTableDataSource(datafiltered);
 
       this.dataSource.paginator = this.paginator.toArray()[0];
     } else {
       this.dataSource.filterPredicate = (data: IngresosInmobiliaria, filter: string) => {
         const compare = new Date(data.fecha);
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
 
 
 
   fijarFiltro(e: MatCheckboxChange) {
     if (e.checked) {
       this.dataSource =
         new MatTableDataSource(
           this.dataIngresos
             .filter(data =>
               data.tipoIngreso === this.descripcionIngresoFilter.value.estadoPago
             ));
     }
     if (!e.checked) {
       this.dataSource =
         new MatTableDataSource(
           this.dataIngresos
         );
     }
   } */
}
