import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, Input, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { Sucursal } from '@app/_models/shared/sucursal';
import { DialogDownloadsComponent } from '@app/_components/dialogs/dialog-downloads/dialog-downloads.component';
import { SucursalSharedService } from '../../../shared/shared-services/sucursal-shared.service';
import { first } from 'rxjs/operators';
import { EmpresaSharedService } from '../../../shared/shared-services/empresa-shared.service';
import { Empresa } from '@app/_models/shared/empresa';
import { AdministracionService } from '../../administracion.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-administracion-sucursales-list',
  templateUrl: './administracion-sucursales-list.component.html',
  styleUrls: ['./administracion-sucursales-list.component.scss']
})
export class AdministracionSucursalesListComponent implements OnInit {

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

    // ? table definitions.
    displayedColumns: string[] = [
      'select',
      'id',
      'razonSocial',
      'rut',
      'giro',
      'actividad',
      'direccion',
      'empresa',
      'descripcion',
      'botones'
    ];
  
    // Tabla en donde se almacenará los datos de la bd 
    dataSource: MatTableDataSource<Sucursal> = new MatTableDataSource();
    dataSucursal: Sucursal[] = [];
  
  
    formFilter = new FormGroup({
      razonSocial: new FormControl(),
      rut: new FormControl(),
      giro: new FormControl(),
      actividad: new FormControl(),
      direccion: new FormControl(),
      empresa: new FormControl(),
      descripcion: new FormControl(),
  
    })
  
  
    sucursales: Sucursal[] = [];
    empresas : any;
    nombreEmpresa!: string;
    selection = new SelectionModel<Sucursal>(true, []);
    totalSeleccion = 0;
    selectedRows!: any[];
    sucursalesDelete!:any;

  constructor(
    private sucursalService: SucursalSharedService,
    private empresaService: EmpresaSharedService,
    private administracionService: AdministracionService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.getSucursales();
    this.getEmpresas();
    this.aplicarfiltros();
    
    //Cargar una lista auxilar con las sucursales, que posteriormente nos ayudará a eliminar un registro
    this.sucursalService
      .getAll()
      .pipe(first())
      .subscribe((sucursalesDelete) => (this.sucursalesDelete = sucursalesDelete));
  }

  // Obtener el listado de cliente desde la BD
  getSucursales() {
    //Carga Tabla 
    this.sucursalService.getAll().pipe(first()).subscribe((result: Sucursal[]) => {
      this.dataSucursal = result.map(Sucursal => {
        //Sucursal.empresa = Sucursal.Empresa.razonSocial;
        return Sucursal;
      });
      this.dataSource = new MatTableDataSource(this.dataSucursal);
      this.dataSource.paginator = this.paginator.toArray()[0];
      console.log(this.dataSucursal);
    });
  }

  // Obtener las empresas
  getEmpresas(){
    this.empresaService
    .getAll()
    .pipe(first())
    .subscribe((empresas) => {
      this.empresas = empresas;
    });
  }

    // ? selection rows
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
  
    // Metodo que sirve para la seleccion de un campo de la tabla
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

      let dataFiltered = this.dataSucursal;

      //Filtro Estado
      if (res.razonSocial) {
        dataFiltered = dataFiltered.filter((data: Sucursal) => data.razonSocial == res.razonSocial);
      }

      //Filtro Numero Contrato
      if (res.rut) {
        dataFiltered = dataFiltered.filter((data: Sucursal) => data.rut == res.rut);
      }

      //Filtro Fecha Compromiso
      if (res.giro) {
        dataFiltered = dataFiltered.filter((data: Sucursal) => data.giro == res.giro);
      }

      //Filtro Estado
      if (res.actividad) {
        dataFiltered = dataFiltered.filter((data: Sucursal) => data.actividad == res.actividad);
      }

      //Filtro Numero Contrato
      if (res.direccion) {
        dataFiltered = dataFiltered.filter((data: Sucursal) => data.direccion == res.direccion);
      }

      //Filtro Fecha Compromiso
      if (res.empresa) {
        console.log(res.empresa);
        dataFiltered = dataFiltered.filter((data: Sucursal) => data.idEmpresa == res.empresa);
      }

      this.dataSource = new MatTableDataSource(dataFiltered);
      this.dataSource.paginator = this.paginator.toArray()[0];
      this.selection.clear()
      this.totalSeleccion = 0;
    })
  }

  //Limpiar los filtros
  limpiarFiltros() {
    this.formFilter.patchValue({ rut: null, razonSocial: null, giro: null, actividad: null, direccion: null,  empresa: null})
    this.dataSource = new MatTableDataSource(this.dataSucursal);
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.selection.clear()
    this.totalSeleccion = 0;
  }

  //Metodo exportar excel
  exportAsXLSX(): void {
   this.selectedRows = [];
    this.selection.selected.forEach((x) => this.selectedRows.push(x));
    this.administracionService.exportAsExcelFile(this.selectedRows, 'Lista-Sucursales');
  }

  //Abrir Modal Editar
  openDialogEdit(id: any, razonSocial: any){
    localStorage.setItem("idSucursalEdit", id);
    localStorage.setItem("razonSocialSucursalEdit", razonSocial);
    this.administracionService.openDialogEditSucursal();
  }

  //Metodo eliminar una sucursal
  deleteSucursal(id: any, razonSocial: any) {
    const sucursal = this.sucursalesDelete.find((x: any) => x.id === id);
    if (confirm('Esta seguro que desea eliminar el registro: ' + razonSocial)) {
      sucursal.isDeleting = true;
      this.sucursalService
        .delete(id)
        .pipe(first())
        .subscribe(() => {
          this.sucursales = this.sucursales.filter((x: any) => x.id !== id);
        });
      sucursal.isDeleting = false;
    }
    this.snackBar.open('Sucursal eliminada', 'cerrar', {
      duration: 2000,
      verticalPosition: 'top',
    });
    this.getSucursales();
  }
}
