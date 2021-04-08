import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';




interface IngresoTabla {
  id: number;
  fecha: Date;
  ingreso: number;
  respaldo: string;
  tipoIngreso: string;
  descripcion: string;
}

@Component({
  selector: 'app-rentacar-ingresos-list2',
  templateUrl: './rentacar-ingresos-list2.component.html',
  styleUrls: ['./rentacar-ingresos-list2.component.scss']
})
export class RentacarIngresosList2Component implements OnInit {


  ingresoTabla: IngresoTabla[] = [];
  totalEsperadoSeleccion: number = 0;
  totalPagadoSeleccion: number = 0;

  //configuraciones tabla
  displayedColumns: string[] = ['select', 'id', 'fecha', 'ingreso', 'respaldo', 'tipoIngreso', 'descripcion'];
  dataSource = new MatTableDataSource<IngresoTabla>();
  selection = new SelectionModel<IngresoTabla>(true, []);
  @ViewChild(MatPaginator) paginator = null;
  @ViewChild(MatSort) sort = null;



  constructor() { }

  ngOnInit(): void {
    this.cargarListaIngresos();
  }


  cargarListaIngresos(): void {

    this.ingresoTabla.push({
      id: 1,
      descripcion: 'x skdlmklsm slkdkmsld mslkskmd lsmxskxsml smdklsm  skcmslcmk sklmccm ',
      fecha: new Date(),
      ingreso: 0,
      respaldo: 'url',
      tipoIngreso: 'VENTA'
    })

    this.dataSource = new MatTableDataSource(this.ingresoTabla);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  revelarTotal() {


  }

  limpiarFiltros() {

  }



  /** Selects all rows if they are not all selected; otherwise clear selection. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  masterToggle() {
    this.totalEsperadoSeleccion = 0;
    this.totalPagadoSeleccion = 0;
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }



}
