import { MatSort } from '@angular/material/sort';
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
import { DialogShow } from '@app/_components/dialogs/dialog-downloads/dialog-downloads.component';
import { DatePipe } from "@angular/common";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-inmobiliaria-egresos-list',
  templateUrl: './inmobiliaria-egresos-list.component.html',
  styleUrls: ['./inmobiliaria-egresos-list.component.scss'],
  providers: [DatePipe]
})
export class InmobiliariaEgresosListComponent implements OnInit {

  // ? childrens
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChild(MatSort) sort = null;

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
    'numeroCuota',
    //  'responsable'
  ];

  result = "N/A"; 

  //Creación de variables y asignación de datos
  dataSource: MatTableDataSource<EgresosInmobiliaria> = new MatTableDataSource();
  dataEgresos: EgresosInmobiliaria[] = [];

  changelog: string[] = [];

  formFilter = new FormGroup({
    id: new FormControl(),
    monto: new FormControl(),
    start: new FormControl(),
    end: new FormControl(),
    idSucursal: new FormControl(),
    descripcionEgreso: new FormControl(),
    tipoEgreso: new FormControl(),
    propiedad: new FormControl(),
    numeroCuota: new FormControl(),    
  })




  sucursales: Sucursal[] = [];
  selection = new SelectionModel<EgresosInmobiliaria>(true, []);
  tiposEgresos: string[] = [];
  estadosPagos: string[] = [];
  totalSeleccion = 0;
  selectedRows!: any[]
  cuentasRegistradas: any[] = [];
  
  constructor(
    private inmobiliariaService: InmobiliariaService,
    public dialog: MatDialog,
    private sucursalService: SucursalSharedService,
    private snackBar: MatSnackBar
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
        //Conviertiendo los numeros de cuotas Nulos en N/A
        this.dataEgresos.forEach(data => {
          if (data['numeroCuota']== null) {
            data.numeroCuota = this.result;          
            }
          });
        this.dataSource = new MatTableDataSource(this.dataEgresos);
        this.dataSource.paginator = this.paginator.toArray()[0];
        this.dataSource.sort = this.sort;
      });
    }
  }

  // Abrir Ventana Modal Registrar Pago
  openDialogRegistrarPago(){
    //Selecciona los valores de la fila seleccionada    
    this.selectedRows = [];
    this.selection.selected.forEach((x) => {            
      this.selectedRows.push(x)});
    this.selectedRows.forEach((x) => {      
      localStorage.setItem("idEgresoPago", x.id);
      localStorage.setItem("numeroCuota", x.numeroCuota);
    });
    //Se ejecuta el metodo que abre el dialog, enviandole le id del Egreso por cuota
    let idEgresoPagoCuota = localStorage.getItem("idEgresoPago");
    let valorNumeroC = localStorage.getItem("numeroCuota");
    if(valorNumeroC != "N/A"){
      this.inmobiliariaService.openDialogRegistrarPago(idEgresoPagoCuota);
    } else{    
      this.snackBar.open('Por favor seleccione un egreso con cuotas sin pagar', 'cerrar', {
      duration: 2000,
      verticalPosition: 'top',
    });
  }
  }

  actualizarTabla(){
    this.inmobiliariaService.getAllEgresos().subscribe((egresos: EgresosInmobiliaria[]) => {
      this.dataEgresos = egresos.map(Egresos => {
        Egresos.sucursal = Egresos.Sucursal.razonSocial;
        Egresos.usuario = Egresos.Usuario.nombreUsuario;
        return Egresos;
      });
      //Conviertiendo los numeros de cuotas Nulos en N/A
      this.dataEgresos.forEach(data => {
        if (data['numeroCuota']== null) {
          data.numeroCuota = this.result;          
          }
        });
      this.dataSource = new MatTableDataSource(this.dataEgresos);
      this.dataSource.paginator = this.paginator.toArray()[0];
      this.dataSource.sort = this.sort;
    });
  }

  //Cargar los archivos de respaldo
  recuperarArchivos(listArchivos: any) {
    setTimeout(() => {
    this.dialog.open(DialogShow, {    
      data: { archivos: listArchivos, servicio: 'inmobiliaria-egreso' },
    });
  }, 1000);
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
      const { id, monto } = res

      let dataFiltered = this.dataEgresos;

      if (id) {
        dataFiltered = dataFiltered.filter((data: EgresosInmobiliaria) => (data.id).toString().includes(id))
      }    
      if (monto) {
        dataFiltered = dataFiltered.filter((data: EgresosInmobiliaria) => (data.monto).toString().includes(monto))
      }
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

      if (res.monto){
        dataFiltered = dataFiltered.filter((data: EgresosInmobiliaria) => data.monto == res.monto);

      }

      this.dataSource = new MatTableDataSource(dataFiltered);
      this.dataSource.paginator = this.paginator.toArray()[0];
      this.totalSeleccion = 0;
      this.dataSource.sort = this.sort;
      this.selection.clear();
    })


  }


  // Inicio Filtros
  limpiarFiltros() {
    this.formFilter.patchValue({ start: null, end: null, idSucursal: null, tipoEgreso: null, Propiedad: null, descripcionEgreso: null, monto:null})
    this.dataSource = new MatTableDataSource(this.dataEgresos);
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.dataSource.sort = this.sort;
    this.dataSource.paginator['_pageIndex'] = 0;
    this.actualizarTabla();
    this.selection.clear();
    this.totalSeleccion = 0;
  }

  exportAsXLSX(): void {
    this.selectedRows = [];
    if(this.selection.selected.length == 0) {
      this.snackBar.open('!Seleccione algún registro!', 'cerrar', {
        duration: 2000,
        verticalPosition: 'top',
      });
    } else {
      this.selection.selected.forEach((x) => this.selectedRows.push(x));
        const newArray = this.selectedRows.map((item) => {
        const { Sucursal, Usuario, RespaldoEgresoInmobiliaria, ...newObject } = item
        return newObject
      })
    
    this.inmobiliariaService.exportAsExcelFile(newArray, 'Lista-Egresos-Rentacar');

    }
  }
}