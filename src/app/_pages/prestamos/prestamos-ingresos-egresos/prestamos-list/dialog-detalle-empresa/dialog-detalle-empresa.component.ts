import { Component, OnInit, ViewChildren, ViewChild, QueryList, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Prestamos } from '@app/_models/prestamos/prestamos';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertHelper } from '@app/_helpers/alert.helper';
import { PrestamosService } from '@app/_pages/prestamos/prestamos.service';

@Component({
  selector: 'app-dialog-detalle-empresa',
  templateUrl: './dialog-detalle-empresa.component.html',
  styleUrls: ['./dialog-detalle-empresa.component.scss']
})
export class DialogDetalleEmpresaComponent implements OnInit {
  
  // ? childrens
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChild(MatSort) sort = null;
  // ? table definitions.
  displayedColumns: string[] = [
    'select',
    'id',
    'fecha',
    'monto',
    // 'tipoPago',
    //'empresaS',
    // 'bancoS',
     'empresaD',
    // 'bancoD',    
    // 'responsable',
    // 'descripcion',
  ];
  dataSource: MatTableDataSource<Prestamos> = new MatTableDataSource();  
  dataPrestamo: Prestamos[] = [];

  idPrestamo = localStorage.getItem('idPrestamoEmpresa')
  nombreEmpresa = localStorage.getItem('nombreEmpresa')
  empresa : any;
  // cuota: any;
  // monto: any; 
  // estadoCuota: any;

  // Variables que ayudan a aplicar los filtros
  formFilter = new FormGroup({    
    start: new FormControl(),    
    end: new FormControl(),
    empresaD: new FormControl(),
    responsable: new FormControl(),
    descripcion: new FormControl(),
  })

  selection = new SelectionModel<any>(true, []);
  totalSeleccion = 0;
  selectedRows!: any[];


  constructor(
    private fb: FormBuilder,
    private prestamosService: PrestamosService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private alert: AlertHelper
  ) { }

  ngOnInit(): void {
    this.obtenerPrestamos();
    this.aplicarfiltros();
  }

  obtenerPrestamos(){
    this.prestamosService.getPrestamos(this.idPrestamo)
    .pipe()
    .subscribe((x:any) => { 
      console.log("obteniendo datos de empresas", x)
      this.empresa = x.empresaS;
      console.log("nombre de la empresa", this.empresa)     
      this.dataSource = new MatTableDataSource(x);
      this.dataSource.sort
      this.dataSource.paginator = this.paginator.toArray()[0];      
      this.dataPrestamo = x;
    })
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.filteredData.forEach(row => {
        this.selection.select(row);
  
      });
    console.log(this.selection.selected);
  }

  aplicarfiltros() {
    this.formFilter.valueChanges.subscribe(res => {
      
      let dataFiltered = this.dataPrestamo; 
      
      //Filtro descripcion
      if (res.empresaD) {
        dataFiltered = dataFiltered.filter((data: any) => data.empresaD == res.empresaD);
      }
      
      //Filtro Fecha
      if (res.start && res.end) {
        dataFiltered = dataFiltered.filter((data: any) => new Date(data.fecha) >= res.start && new Date(data.fecha) <= res.end);
      }
      
      //Filtro descripcion
      if (res.descripcion) {
        dataFiltered = dataFiltered.filter((data: any) => data.descripcion == res.descripcion);
      }
            
      this.dataSource = new MatTableDataSource(dataFiltered);
      this.dataSource.paginator = this.paginator.toArray()[0];
      this.totalSeleccion = 0;
      this.selection.clear();
    })
  }

  limpiarFiltros() {
    this.formFilter.patchValue({ start: null, end: null, estadoPago: null})
    this.dataSource = new MatTableDataSource(this.dataPrestamo);
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.selection.clear()
    this.totalSeleccion = 0;
  }

   // Cerrar Dialog
   closeDialog(){
    this.prestamosService.closeDialogModal();
   }

}
