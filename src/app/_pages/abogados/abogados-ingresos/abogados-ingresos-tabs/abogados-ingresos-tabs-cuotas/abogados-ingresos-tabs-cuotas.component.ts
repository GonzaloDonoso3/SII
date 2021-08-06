import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, Input, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { AbogadosTabsService } from '../../../abogados-tabs.service';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { Cuota } from '../../../../../_models/abogados/cuota';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';




@Component({
  selector: 'app-abogados-ingresos-tabs-cuotas',
  templateUrl: './abogados-ingresos-tabs-cuotas.component.html',
  styleUrls: ['./abogados-ingresos-tabs-cuotas.component.scss']
})
export class AbogadosIngresosTabsCuotasComponent implements OnInit {

  // ? childrens
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChild(MatSort) sort = null;
  // ? table definitions.
  displayedColumns: string[] = [
    'select',
    'id',
    'fechaPago',
    'montoCuota',
    'estadoPago',
    'idContrato',
    'createdAt',
    'updatedAt',
  ];

  // Tabla en donde se almacenará los datos de la bd 
  dataSource: MatTableDataSource<Cuota> = new MatTableDataSource();
  dataCuotas: Cuota[] = [];

  // Definir el formulario que permitirá aplicar los filtros
  formFilter = new FormGroup({
    id: new FormControl(),
    montoCuota: new FormControl(),
    fechaPago: new FormControl(),
    startRegistro: new FormControl(),
    endRegistro: new FormControl(),
    startActualizacion: new FormControl(),
    endActualizacion: new FormControl(),
    estadoPago: new FormControl(),
    idContrato: new FormControl(),
  })

  selection = new SelectionModel<any>(true, []);
  totalSeleccion = 0;
  selectedRows!: any[];


  constructor(
    private abogadosTabsService: AbogadosTabsService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  //Metodo que se ejecuta al abrir la página
  ngOnInit(): void {
    this.getCuotas();
    this.aplicarfiltros();
  }


  // Obtener el listado de cuotas desde la BD
  getCuotas() {
    //Carga Tabla 
    this.abogadosTabsService.obtenerCuotas().subscribe((Cuotas: Cuota[]) => {
      this.dataCuotas = Cuotas.map(Cuotas => {
        return Cuotas;
      });
      this.dataSource = new MatTableDataSource(this.dataCuotas);
      this.dataSource.paginator = this.paginator.toArray()[0];
      this.dataSource.sort = this.sort
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
      const { id, montoCuota } = res
      let dataFiltered = this.dataCuotas;

      //Filtro Estado
      if (res.estadoPago) {
        dataFiltered = dataFiltered.filter((data: Cuota) => data.estado == res.estadoPago);
      }

      if ( id ) {
        dataFiltered = dataFiltered.filter((data: Cuota) => (data.id).toString().includes(id))
      }

      if ( montoCuota ) {
        dataFiltered = dataFiltered.filter((data: Cuota) => (data.montoCuota).toString().includes(montoCuota))
      }

      //Filtro Numero Contrato
      if (res.numeroContrato) {
        dataFiltered = dataFiltered.filter((data: Cuota) => data.idContrato == res.numeroContrato);
      }

      //Filtro Fecha Compromiso
      if (res.fechaPago) {
        dataFiltered = dataFiltered.filter((comp: Cuota) => comp.fechaPago.includes(res.fechaPago));
      }

      //Filtro Fecha Registro
      if (res.startRegistro && res.endRegistro) {
        dataFiltered = this.dataCuotas.map((data: any) => {
          data.createdAt = new Date(data.createdAt);
          return data;
        }).filter((comp: { createdAt: Date; }) => comp.createdAt >= res.startRegistro && comp.createdAt <= res.endRegistro);
      }

      //Filtro Fecha Actualización
      if (res.startActualizacion && res.endActualizacion) {
        dataFiltered = this.dataCuotas.map((data: any) => {
          data.updatedAt = new Date(data.updatedAt);
          return data;
        }).filter((comp: { updatedAt: Date; }) => comp.updatedAt >= res.startActualizacion && comp.updatedAt <= res.endActualizacion);
      }

      this.dataSource = new MatTableDataSource(dataFiltered);
      this.dataSource.paginator = this.paginator.toArray()[0];
      this.selection.clear()
      this.totalSeleccion = 0;
    })
  }


  //Limpiar los filtros realizados
  resetTable() {
    this.formFilter.patchValue({ estadoPago: null, numeroContrato: null, startCompromiso: null, endCompromiso: null, startRegistro: null, endRegistro: null, startActualizacion: null, endActualizacion: null })
    this.dataSource = new MatTableDataSource(this.dataCuotas);
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.dataSource.paginator['_pageIndex'] = 0
    this.getCuotas()
    this.selection.clear()
    this.totalSeleccion = 0;
  }

  //Metodo exportar excel
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
        const { Cliente, Causas, Sucursal, Usuario, idUsuario, ...newObject } = item
        return newObject
      })
    
    this.abogadosTabsService.exportAsExcelFile(newArray, 'Lista-Ingresos-Contratos-FirmaAbogados');

    }
  }
}
