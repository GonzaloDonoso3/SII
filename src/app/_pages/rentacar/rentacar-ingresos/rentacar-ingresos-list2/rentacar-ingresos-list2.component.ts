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
  respaldo: string;
  descripcion: string;
  cliente: string;
  codigoLicitacion: string;
}

@Component({
  selector: 'app-rentacar-ingresos-list2',
  templateUrl: './rentacar-ingresos-list2.component.html',
  styleUrls: ['./rentacar-ingresos-list2.component.scss']
})
export class RentacarIngresosList2Component implements OnInit, OnChanges {

  @Input() refrescar = '';


  ingresoTabla: IngresoTabla[] = [];
  totalIngresoSeleccion: number = 0;

  //configuraciones tabla
  displayedColumns: string[] = ['select', 'id', 'fecha', 'ingreso', 'respaldo', 'cliente', 'codigoLicitacion', 'descripcion'];
  dataSource = new MatTableDataSource<IngresoTabla>();
  selection = new SelectionModel<IngresoTabla>(true, []);
  selectedRows!: any[];
  @ViewChild(MatPaginator) paginator = null;
  @ViewChild(MatSort) sort = null;



  constructor(private rentacarService: RentacarService) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.cargarListaIngresos();
  }

  cargarListaIngresos(): void {
    this.ingresoTabla.length = 0;
    this.rentacarService.getIngresosLicitacion().subscribe((response) => {
      response.data.forEach((ingreso: any) => {
        this.ingresoTabla.push({
          id: ingreso.id_ingresoLicitacion,
          fecha: ingreso.fecha_ingresoLicitacion,
          ingreso: ingreso.monto_ingresoLicitacion,
          respaldo: '',
          descripcion: ingreso.descripcion_ingresoLicitacion,
          cliente: ingreso.licitacione.clientesLicitacione.nombre_clienteLicitacion,
          codigoLicitacion: ingreso.licitacione.codigo_licitacion
        });
      });
      this.dataSource = new MatTableDataSource(this.ingresoTabla);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  limpiarFiltros() {

  }



  revelarTotal() {
    let totalIngresoSeleccion = 0;
    this.selection.selected.forEach(({ ingreso }) => {
      totalIngresoSeleccion = totalIngresoSeleccion + ingreso;
    })
    this.totalIngresoSeleccion = totalIngresoSeleccion;
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
