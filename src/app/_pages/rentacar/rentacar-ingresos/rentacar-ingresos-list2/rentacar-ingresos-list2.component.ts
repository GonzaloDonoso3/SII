import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RentacarModalVerFilesComponent } from './../rentacar-ingresos-form/rentacar-modal-ver-files/rentacar-modal-ver-files.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges } from '@angular/core';
import { RentacarService } from '../../rentacar.service';




interface IngresoTabla {
  id: number;
  fecha: Date;
  ingreso: number;
  respaldo: any;
  descripcion: string;
  cliente: string;
  empresaEmisora: string;
  usuario: string;
}

@Component({
  selector: 'app-rentacar-ingresos-list2',
  templateUrl: './rentacar-ingresos-list2.component.html',
  styleUrls: ['./rentacar-ingresos-list2.component.scss']
})
export class RentacarIngresosList2Component implements OnInit, OnChanges {

  @Input() refrescar = '';

  //filtros
  formFilter = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
    cliente: new FormControl(),
    empresaEmisora: new FormControl(),
    descripcion: new FormControl(),
  })


  ingresoTabla: IngresoTabla[] = [];
  totalIngresoSeleccion: number = 0;

  //configuraciones tabla
  displayedColumns: string[] = ['select', 'id', 'fecha', 'ingreso', 'respaldo', 'cliente', 'empresaEmisora', 'descripcion', 'usuario'];
  dataSource = new MatTableDataSource<IngresoTabla>();
  selection = new SelectionModel<IngresoTabla>(true, []);
  selectedRows!: any[];
  @ViewChild(MatPaginator) paginator = null;
  @ViewChild(MatSort) sort = null;



  constructor(private rentacarService: RentacarService, private dialog: MatDialog) { }

  ngOnInit(): void {

  }



  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.refrescar);
    this.cargarListaIngresos();
    this.aplicarfiltros();
  }

  cargarListaIngresos(): void {
    this.ingresoTabla.length = 0;
    this.rentacarService.getIngresosLicitacion().subscribe((response) => {

      response.data.forEach((ingreso: any) => {
        this.ingresoTabla.push({
          id: ingreso.id_ingresoLicitacion,
          fecha: ingreso.fecha_ingresoLicitacion,
          ingreso: ingreso.monto_ingresoLicitacion,
          respaldo: ingreso.respaldoIngresoLicitaciones,
          descripcion: ingreso.descripcion_ingresoLicitacion,
          cliente: ingreso.licitacione.clientesLicitacione.nombre_clienteLicitacion,
          empresaEmisora: ingreso.licitacione.propietario.nombre_propietario,
          usuario: ingreso.licitacione.userAt
        });
      });
      this.dataSource = new MatTableDataSource(this.ingresoTabla);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }



  aplicarfiltros() {
    this.formFilter.valueChanges.subscribe(res => {
      let dataFiltered = this.ingresoTabla;
      if (res.descripcion) {
        dataFiltered = dataFiltered.filter((data: IngresoTabla) => data.descripcion.includes(res.descripcion));
      }
      if (res.cliente) {
        dataFiltered = dataFiltered.filter((data: IngresoTabla) => data.cliente.includes(res.cliente.toUpperCase()));
      }
      if (res.empresaEmisora) {
        dataFiltered = dataFiltered.filter((data: IngresoTabla) => data.empresaEmisora.includes(res.empresaEmisora));
      }
      if (res.start && res.end) {
        dataFiltered = dataFiltered.filter((data: IngresoTabla) => new Date(data.fecha) >= res.start && new Date(data.fecha) <= res.end);
      }
      this.dataSource = new MatTableDataSource(dataFiltered);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.selection.clear();
      this.totalIngresoSeleccion = 0;
    })
  }



  limpiarFiltros() {
    this.formFilter.patchValue({ start: null, end: null, cliente: null, descripcion: null, })
    this.dataSource = new MatTableDataSource(this.ingresoTabla);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.selection.clear()
    this.totalIngresoSeleccion = 0;
  }



  revelarTotal() {
    let totalIngresoSeleccion = 0;
    this.selection.selected.forEach(({ ingreso }) => {
      totalIngresoSeleccion = totalIngresoSeleccion + ingreso;
    })
    this.totalIngresoSeleccion = totalIngresoSeleccion;
  }


  recuperarArchivos(listArchivos: any) {
    this.dialog.open(RentacarModalVerFilesComponent, {
      data: { archivos: listArchivos },
    });
  }


  //Metodo exportar excel
  exportAsXLSX(): void {
    this.selectedRows = [];
    this.selection.selected.forEach((x) => this.selectedRows.push(x));
    this.rentacarService.exportAsExcelFile(this.selectedRows, 'Lista-ingresos-licitacion');
  }



  /** Selects all rows if they are not all selected; otherwise clear selection. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  masterToggle() {
    this.totalIngresoSeleccion = 0;
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }



}
