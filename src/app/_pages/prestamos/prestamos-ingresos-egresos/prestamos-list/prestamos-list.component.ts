import { Component, OnInit, ViewChild, ViewChildren, QueryList, Input, SimpleChanges } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Prestamos } from '@app/_models/prestamos/prestamos';
import { FormControl, FormGroup } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { PrestamosService } from '../../prestamos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogShow } from '@app/_components/dialogs/dialog-downloads/dialog-downloads.component';

@Component({
  selector: 'app-prestamos-list',
  templateUrl: './prestamos-list.component.html',
  styleUrls: ['./prestamos-list.component.scss']
})
export class PrestamosListComponent implements OnInit {
  // ? childrens
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChild(MatSort) sort = new MatSort;

  // ? Inputs & Outputs
  @Input()
  refrescar = '';

  //configuracion de tablas
  displayedColumns: string[] = [
    'select',
    'id',
    'fecha',
    'monto',
    'tipoPago',
    'empresaS',
    'bancoS',
    'empresaD',
    'bancoD',    
    'responsable',
    'descripcion',
    'respaldos',
  ]
  dataSource: MatTableDataSource<Prestamos> = new MatTableDataSource();
  dataIngresos: Prestamos[] = [];

  changelog: string[] = [];

  formFilter = new FormGroup({
    id: new FormControl(),
    monto: new FormControl(),
    start: new FormControl(),
    end: new FormControl(),
    empresaS: new FormControl(),
    bancoS: new FormControl(),  
    empresaD: new FormControl(),
    bancoD: new FormControl(),   
    tipoPago: new FormControl(),
    responsable: new FormControl(),
    descripcion: new FormControl()
  })

 
  selection = new SelectionModel<Prestamos>(true, []);
  tiposIngresos: string[] = [];
  estadosPagos: string[] = [];
  totalSeleccion = 0;
  selectedRows!: any[];
  cuentasRegistradas: any[] = [];

  empresas : string[] = [];
  bancos: string[] = [];
  tiposPagos: string[] = [];  

  constructor(
    private prestamosService: PrestamosService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.empresas = ['Teresa Del Carmen', 'Teresa Garrido e Hijos', 'Sociedad Vargas', 'Miguel Vargas', 'Sociedad Garrido', 'Solanch Macarena', 'Firma Abogados'];
    this.bancos = ['Banco de Chile', 'Banco Santander', 'Banco Itau', 'Banco de Estado', 'Banco Falabella', 'Banco Ripley'];
    this.tiposPagos = ['Efectivo', 'Debito', 'Credito', 'Transferencia', 'Cheque'];

    this.aplicarfiltros();
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName of Object.keys(changes)) {
      const change = changes[propName];
      const to = JSON.stringify(change.currentValue);
      const from = JSON.stringify(change.previousValue);
      const changeLog = `${propName}: changed from ${from} to ${to} `;
      this.changelog.push(changeLog);
      this.prestamosService.prestamosGetAll().subscribe((data: Prestamos[]) => {
        this.dataIngresos = data.map(prestamo => {          
          prestamo.monto = prestamo.monto;
          return prestamo;
        });
        this.dataSource = new MatTableDataSource(this.dataIngresos);
        this.dataSource.paginator = this.paginator.toArray()[0];
        this.dataSource.sort = this.sort

      });
    }

  }

  recuperarArchivos(listArchivos: any) {    
    setTimeout(() => {
      this.dialog.open(DialogShow, {
        data: {archivos: listArchivos, servicio: 'prestamos'},
      });
    }, 1000);
  }

  revelarTotal() {
    this.totalSeleccion = 0;
    this.selection.selected.forEach(data =>{
      this.totalSeleccion += data.monto
    });
  }

  aplicarfiltros() {

    this.formFilter.valueChanges.subscribe(res => {
      const { id, monto } = res
      let dataFiltered = this.dataIngresos;

      if (id) {
        dataFiltered = dataFiltered.filter((data: Prestamos) => (data.id).toString().includes(id))
      }    
      if (monto) {
        dataFiltered = dataFiltered.filter((data: Prestamos) => (data.monto).toString().includes(monto))
      }

      if (res.empresaS) {
        dataFiltered = dataFiltered.filter((data: Prestamos) => data.empresaS.includes(res.empresaS));
      }
      
      if (res.bancoS) {
        dataFiltered = dataFiltered.filter((data: Prestamos) => data.bancoS.includes(res.bancoS));
      }

      if (res.empresaD) {
        dataFiltered = dataFiltered.filter((data: Prestamos) => data.empresaD.includes(res.empresaD));
      }

      if (res.bancoD) {
        dataFiltered = dataFiltered.filter((data: Prestamos) => data.bancoD.includes(res.bancoD));
      }

      if (res.responsable) {
        dataFiltered = dataFiltered.filter((data: Prestamos) => data.responsable.includes(res.responsable));
      }

      if (res.descripcion) {
        dataFiltered = dataFiltered.filter((data: Prestamos) => data.descripcion == res.descripcion);
      }      

      if (res.start && res.end) {
        dataFiltered = dataFiltered.filter((data: Prestamos) => new Date(data.fecha) >= res.start && new Date(data.fecha) <= res.end);
      }
      

      this.dataSource = new MatTableDataSource(dataFiltered);
      this.dataSource.paginator = this.paginator.toArray()[0];
      this.dataSource.sort = this.sort
      this.totalSeleccion = 0;
      this.selection.clear();
    })
  }





  // ? filters
  limpiarFiltros() {
    
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
  }

  resetTable() {
    this.formFilter.patchValue({ start: null, end: null, idSucursal: null, tipoIngreso: null, estadoPago: null, cliente: null, nDocumento: null })
    this.dataSource = new MatTableDataSource(this.dataIngresos);
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.dataSource.sort = this.sort
    this.dataSource.paginator['_pageIndex'] = 0
    this.updateTable()
    this.selection.clear()
    this.totalSeleccion = 0;
  }

  updateTable(){
    this.prestamosService.prestamosGetAll().subscribe((data: Prestamos[]) => {
      this.dataIngresos = data.map(prestamo => {          
        prestamo.monto = prestamo.monto;
        return prestamo;
      });
      this.dataSource = new MatTableDataSource(this.dataIngresos);
      this.dataSource.paginator = this.paginator.toArray()[0];
      this.dataSource.sort = this.sort

    });
  }

  verDetalle(){
    //Selecciona los valores de la fila seleccionada    
    this.selectedRows = [];
    this.selection.selected.forEach((x) => {this.selectedRows.push(x)});
    if(this.selectedRows.length > 0){
      this.selectedRows.forEach((x) => {      
        localStorage.setItem("idPrestamoEmpresa", x.id);
        localStorage.setItem("nombreEmpresa", x.empresaS)        
      });
      //Se ejecuta el metodo que abre el dialog, enviandole le id del Egreso por cuota
      let idPrestamoEmpresa = localStorage.getItem("idPrestamoEmpresa");       
      this.prestamosService.openDialogDetalleEmpresa(idPrestamoEmpresa);      
    } else {
      this.snackBar.open('Por favor seleccione un prestamo para visualizar el detalle', 'cerrar', {
        duration: 2000,
        verticalPosition: 'top',
      });
    }
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
        const { RespaldoIngresos, Usuario, Sucursal, ...newObject } = item
        return newObject
      })
    
    this.prestamosService.exportAsExcelFile(newArray, 'Lista-Egresos-Rentacar');

    }
  }

}
