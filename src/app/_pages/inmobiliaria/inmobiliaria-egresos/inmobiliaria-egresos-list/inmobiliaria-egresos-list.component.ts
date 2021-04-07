import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { first, filter } from 'rxjs/operators';
import { AlertHelper } from '@app/_helpers/alert.helper';
import { Component, Input, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { InmobiliariaService } from '../../inmobiliaria.service';
import { EgresosInmobiliaria } from '@app/_models/inmobiliaria/egresoInmobiliaria';
import { logging } from 'protractor';
import { MatDialog } from '@angular/material/dialog';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Sucursal } from '@app/_models/shared/sucursal';
import { DialogDownloadsComponent } from '@app/_components/dialogs/dialog-downloads/dialog-downloads.component';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-inmobiliaria-egresos-list',
  templateUrl: './inmobiliaria-egresos-list.component.html',
  styleUrls: ['./inmobiliaria-egresos-list.component.scss']
})
export class InmobiliariaEgresosListComponent implements OnInit {

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
      'tipoEgreso',
      'descripcionEgreso',
      'sucursal',
      'usuario',
    //  'responsable'
    ];

    //Creación de variables y asignación de datos
    dataSource: MatTableDataSource<EgresosInmobiliaria> = new MatTableDataSource();
    dataEgresos: EgresosInmobiliaria[] = [];
  
    changelog: string[] = [];
    rangoFecha = new FormGroup({
      start: new FormControl(),
      end: new FormControl(),
  
    });
    sucursalFilter = new FormGroup({
      idSucursal: new FormControl(),
    });
    clienteFilter = new FormGroup({
      cliente: new FormControl(),
    });
    tipoEgresoFilter = new FormGroup({
      tipoEgreso: new FormControl(),
    });
    descripcionEgresoFilter = new FormGroup({
      descripcionEgreso: new FormControl(),
      fixed: new FormControl(),
    });
    propiedadFilter = new FormGroup({
      Propiedad: new FormControl(),
  
    });
    sucursales: Sucursal[] = [];
    selection = new SelectionModel<EgresosInmobiliaria>(true, []);
    tiposEgresos: string[] = [];
    estadosPagos: string[] = [];
    totalSeleccion = 0;
    cuentasRegistradas: any[] = [];
    constructor(
      private inmobiliariaService: InmobiliariaService,
      public dialog: MatDialog,
      private sucursalService: SucursalSharedService
    ) {
  
    }
//Cargar metodos de inicio
  ngOnInit(): void {
    this.sucursales = this.sucursalService.sucursalListValue;
    this.tiposEgresos = this.inmobiliariaService.tiposEgresosListValue;

    this.rangoFecha.valueChanges.subscribe(res => {
      if (res.start != null && res.end != null) {
        const rango = this.rangoFecha.value;
        this.applyDateFilter(rango.start,
          rango.end);
      }
    });
    this.sucursalFilter.valueChanges.subscribe(res => {
      this.applySucursalFilter(res.idSucursal);
    });
    
    this.tipoEgresoFilter.valueChanges.subscribe(res => {
      this.applyTipoEgresoFilter(res.tipoEgreso);
    });
    
    this.propiedadFilter.valueChanges.subscribe(res => {
      this.applyPropiedadFilter(res.Propiedad);
    });

    this.descripcionEgresoFilter.valueChanges.subscribe(res => {
      this.applyDescripcionEgresoFilter(res.descripcionEgreso);
    });
  }

  //Carga Tabla 
  ngOnChanges(changes: SimpleChanges): void {
    for (const propName of Object.keys(changes)) {
      const change = changes[propName];
      const to = JSON.stringify(change.currentValue);
      const from = JSON.stringify(change.previousValue);
      const changeLog = `${propName}: changed from ${from} to ${to} `;
      this.changelog.push(changeLog);
      
      this.inmobiliariaService.getAllEgresos().subscribe((egresos: EgresosInmobiliaria[]) => {
      this.dataEgresos = egresos.map(Egresos => {
        Egresos.sucursal = Egresos.Sucursal.razonSocial;
        Egresos.usuario = Egresos.Usuario.nombreUsuario;
        return Egresos;
        
      });
      this.dataSource = new MatTableDataSource(this.dataEgresos);
      this.dataSource.paginator = this.paginator.toArray()[0];
    });
    }
  }

  //Cargar los archivos de respaldo
  recuperarArchivos(listArchivos: any) {
    this.dialog.open(DialogDownloadsComponent, {
      data: { archivos: listArchivos, servicio: 'inmobiliaria-egreso' },
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

  //Sumar el total de las filas seleccionadas
  revelarTotal() {
    this.totalSeleccion = 0;
    console.log(this.selection.selected.length);
    this.selection.selected.forEach(data => {
      this.totalSeleccion += data.monto;
    });
  }

  // Inicio Filtros
  limpiarFiltros() {
    this.dataSource = new MatTableDataSource(this.dataEgresos);
    this.dataSource.paginator = this.paginator.toArray()[0];
  }

  applySucursalFilter(filterValue: string) {
    this.dataSource.filterPredicate = (data: EgresosInmobiliaria, filter: string) => data.sucursal === filter;
    this.dataSource.filter = filterValue;
    this.dataSource.paginator = this.paginator.toArray()[0];
  }
  applyPropiedadFilter(_filter: string) {
    this.dataSource.filterPredicate = (data: EgresosInmobiliaria, filter: string) => {
      if (!data.propiedad === null) {
        return data.propiedad.startsWith(filter);
      } else {
        return data.propiedad === filter;
      }
    };
    this.dataSource.filter = _filter;
    this.dataSource.paginator = this.paginator.toArray()[0];
  }
  
  applyDescripcionEgresoFilter(_filter: string) {
    this.dataSource.filterPredicate = (data: EgresosInmobiliaria, filter: string ) => {
      if (!data.descripcionEgreso === null){
        return data.descripcionEgreso.startsWith(filter);
      }else{
        return data.descripcionEgreso === filter;
      }
    }
    this.dataSource.filter = _filter;
    this.dataSource.paginator = this.paginator.toArray()[0];
  }

  applyTipoEgresoFilter(filterValue: string) {
    this.dataSource.filterPredicate = (data: EgresosInmobiliaria, filter: string) => data.tipoEgreso.includes(filter);
    this.dataSource.filter = filterValue;
    this.dataSource.paginator = this.paginator.toArray()[0];
  }

  applyDateFilter(start: Date, end: Date) {
    if (!this.descripcionEgresoFilter.value.fixed) {
      const datafiltered = this.dataEgresos.map(data => {
        data.fecha = new Date(data.fecha);
        return data;
      }).filter(comp => comp.fecha >= start && comp.fecha <= end);

      this.dataSource = new MatTableDataSource(datafiltered);

      this.dataSource.paginator = this.paginator.toArray()[0];
    } else {
      this.dataSource.filterPredicate = (data: EgresosInmobiliaria, filter: string) => {
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

// Fin Filtros

  fijarFiltro(e: MatCheckboxChange) {
    if (e.checked) {
      this.dataSource =
        new MatTableDataSource(
          this.dataEgresos
            .filter(data =>
              data.tipoEgreso === this.descripcionEgresoFilter.value.estadoPago
            ));
    }
    if (!e.checked) {
      this.dataSource =
        new MatTableDataSource(
          this.dataEgresos
        );
    }
  }
}
