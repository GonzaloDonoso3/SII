import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, Input, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SucursalSharedService } from '../../../shared/shared-services/sucursal-shared.service';
import { first } from 'rxjs/operators';
import { EmpresaSharedService } from '../../../shared/shared-services/empresa-shared.service';
import { Empresa } from '@app/_models/shared/empresa';
import { AdministracionService } from '../../administracion.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-administracion-empresas-list',
  templateUrl: './administracion-empresas-list.component.html',
  styleUrls: ['./administracion-empresas-list.component.scss']
})
export class AdministracionEmpresasListComponent implements OnInit {

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
    'descripcion',
    'botones'
  ];

  // Tabla en donde se almacenará los datos de la bd 
  dataSource: MatTableDataSource<Empresa> = new MatTableDataSource();
  dataEmpresa: Empresa[] = [];


  formFilter = new FormGroup({
    razonSocial: new FormControl(),
    rut: new FormControl(),
    giro: new FormControl(),
    actividad: new FormControl(),
    direccion: new FormControl(),
    empresa: new FormControl(),
    descripcion: new FormControl(),

  })


  empresas: Empresa[] = [];
  nombreEmpresa!: string;
  selection = new SelectionModel<Empresa>(true, []);
  totalSeleccion = 0;
  selectedRows!: any[];
  empresasDelete!:any;

constructor(
  private sucursalService: SucursalSharedService,
  private empresaService: EmpresaSharedService,
  private administracionService: AdministracionService,
  private snackBar: MatSnackBar,
) { }

ngOnInit(): void {
  this.getEmpresas();
  this.getEmpresas();
  this.aplicarfiltros();
  
  //Cargar una lista auxilar con las sucursales, que posteriormente nos ayudará a eliminar un registro
  this.empresaService
    .getAll()
    .pipe(first())
    .subscribe((empresasDelete) => (this.empresasDelete = empresasDelete));
}

// Obtener el listado de empresas desde la BD
getEmpresas() {
  //Carga Tabla 
  this.empresaService.getAll().pipe(first()).subscribe((result: Empresa[]) => {
    this.dataEmpresa = result.map(Empresa => {
      return Empresa;
    });
    this.dataSource = new MatTableDataSource(this.dataEmpresa);
    this.dataSource.paginator = this.paginator.toArray()[0];
    console.log(this.dataEmpresa);
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

    let dataFiltered = this.dataEmpresa;

    //Filtro Razón Social
    if (res.razonSocial) {
      dataFiltered = dataFiltered.filter((data: Empresa) => data.razonSocial == res.razonSocial);
    }

    //Filtro Rut
    if (res.rut) {
      dataFiltered = dataFiltered.filter((data: Empresa) => data.rut == res.rut);
    }

    //Filtro Giro
    if (res.giro) {
      dataFiltered = dataFiltered.filter((data: Empresa) => data.giro == res.giro);
    }

    //Filtro Actividad
    if (res.actividad) {
      dataFiltered = dataFiltered.filter((data: Empresa) => data.actividad == res.actividad);
    }

    //Filtro Dirección
    if (res.direccion) {
      dataFiltered = dataFiltered.filter((data: Empresa) => data.direccion == res.direccion);
    }

    //Filtro Descripción
    if (res.descripcion) {
      dataFiltered = dataFiltered.filter((data: Empresa) => data.descripcion == res.descripcion);
    }

    this.dataSource = new MatTableDataSource(dataFiltered);
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.selection.clear()
    this.totalSeleccion = 0;
  })
}

//Limpiar los filtros
limpiarFiltros() {
  this.formFilter.patchValue({ rut: null, razonSocial: null, giro: null, actividad: null, direccion: null, descripcion: null})
  this.dataSource = new MatTableDataSource(this.dataEmpresa);
  this.dataSource.paginator = this.paginator.toArray()[0];
  this.selection.clear()
  this.totalSeleccion = 0;
}

//Metodo exportar excel
exportAsXLSX(): void {
 this.selectedRows = [];
  this.selection.selected.forEach((x) => this.selectedRows.push(x));
  this.administracionService.exportAsExcelFile(this.selectedRows, 'Lista-Empresas');
}

//Abrir Modal Editar
openDialogEdit(id: any, razonSocial: any){
  localStorage.setItem("idEmpresaEdit", id);
  localStorage.setItem("razonSocialEmpresaEdit", razonSocial);
  this.administracionService.openDialogEditEmpresa();
}

//Metodo eliminar una sucursal
deleteEmpresa(id: any, razonSocial: any) {
  const empresa = this.empresasDelete.find((x: any) => x.id === id);
  if (confirm('Esta seguro que desea eliminar el registro: ' + razonSocial)) {
    empresa.isDeleting = true;
    this.empresaService
      .delete(id)
      .pipe(first())
      .subscribe(() => {
        this.empresas = this.empresas.filter((x: any) => x.id !== id);
      });
    empresa.isDeleting = false;
  }
  this.snackBar.open('Empresa eliminada', 'cerrar', {
    duration: 2000,
    verticalPosition: 'top',
  });
  this.getEmpresas();
}

}
