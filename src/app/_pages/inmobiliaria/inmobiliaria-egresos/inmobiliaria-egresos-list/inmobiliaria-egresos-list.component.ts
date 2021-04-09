import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, Input, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { InmobiliariaService } from '../../inmobiliaria.service';
import { EgresosInmobiliaria } from '@app/_models/inmobiliaria/egresoInmobiliaria';
import { MatDialog } from '@angular/material/dialog';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Sucursal } from '@app/_models/shared/sucursal';
import { DialogDownloadsComponent } from '@app/_components/dialogs/dialog-downloads/dialog-downloads.component';

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

  formFilter = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
    idSucursal: new FormControl(),
    descripcionEgreso: new FormControl(),
    tipoEgreso: new FormControl(),
    Propiedad: new FormControl(),
  })




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
    this.aplicarfiltros();
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

    this.selection.selected.forEach(data => {
      this.totalSeleccion += data.monto;
    });
  }



  aplicarfiltros() {
    this.formFilter.valueChanges.subscribe(res => {

      let dataFiltered = this.dataEgresos;

      if (res.Propiedad) {
        dataFiltered = dataFiltered.filter((data: EgresosInmobiliaria) => data.propiedad.includes(res.Propiedad));
      }

      if (res.descripcionEgreso) {
        dataFiltered = dataFiltered.filter((data: EgresosInmobiliaria) => data.descripcion.includes(res.descripcionEgreso));
      }

      if (res.tipoEgreso) {
        dataFiltered = dataFiltered.filter((data: EgresosInmobiliaria) => data.tipoEgreso == res.tipoEgreso);
      }

      if (res.idSucursal) {
        dataFiltered = dataFiltered.filter((data: EgresosInmobiliaria) => data.sucursal == res.idSucursal);
      }

      if (res.start && res.end) {
        dataFiltered = dataFiltered.filter((data: EgresosInmobiliaria) => new Date(data.fecha) >= res.start && new Date(data.fecha) <= res.end);
      }

      this.dataSource = new MatTableDataSource(dataFiltered);
      this.dataSource.paginator = this.paginator.toArray()[0];
      this.totalSeleccion = 0;
      this.selection.clear();
    })


  }


  // Inicio Filtros
  limpiarFiltros() {
    this.formFilter.patchValue({ start: null, end: null, idSucursal: null, tipoEgreso: null, Propiedad: null, descripcionEgreso: null, })
    this.dataSource = new MatTableDataSource(this.dataEgresos);
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.selection.clear()
    this.totalSeleccion = 0;
  }





}