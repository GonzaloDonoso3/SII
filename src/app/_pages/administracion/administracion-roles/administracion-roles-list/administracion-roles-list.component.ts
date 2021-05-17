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
import { UsuarioSharedService } from '../../../shared/shared-services/usuario-shared.service';
import { Usuario } from '@app/_models/shared/usuario';
import { RolSharedService } from '../../../shared/shared-services/rol-shared.service';
import { Rol } from '@app/_models/shared/rol';

@Component({
  selector: 'app-administracion-roles-list',
  templateUrl: './administracion-roles-list.component.html',
  styleUrls: ['./administracion-roles-list.component.scss']
})
export class AdministracionRolesListComponent implements OnInit {

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  // ? table definitions.
  displayedColumns: string[] = [
    'select',
    'id',
    'nombre',
    'botones',
  ];

  // Tabla en donde se almacenará los datos de la bd 
  dataSource: MatTableDataSource<Rol> = new MatTableDataSource();
  dataRol: Rol[] = [];


  formFilter = new FormGroup({
    nombre: new FormControl(),
    apellido: new FormControl(),
    giro: new FormControl(),
    nombreUsuario: new FormControl(),
    roles: new FormControl(),

  })

  usuarios: Usuario[] = [];
  roles : any;
  nombreEmpresa!: string;
  selection = new SelectionModel<Rol>(true, []);
  totalSeleccion = 0;
  selectedRows!: any[];
  sucursalesDelete!:any;
  rol !: Rol;

constructor(
  private administracionService: AdministracionService,
  private rolService: RolSharedService,
) { }

ngOnInit(): void {
  this.getRoles();
  this.aplicarfiltros();
}

// Obtener el listado de roles desde la BD
getRoles() {
  //Carga Tabla 
  this.rolService.getAll().pipe(first()).subscribe((result: Rol[]) => {
    this.dataRol = result.map(Rol => {
      return Rol;
    });
    this.dataSource = new MatTableDataSource(this.dataRol);
    this.dataSource.paginator = this.paginator.toArray()[0];
    console.log(this.dataRol);
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

    let dataFiltered = this.dataRol;

    //Filtro Nombre
    if (res.nombre) {
      dataFiltered = dataFiltered.filter((data: Rol) => data.nombre == res.nombre);
    }

    this.dataSource = new MatTableDataSource(dataFiltered);
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.selection.clear()
    this.totalSeleccion = 0;
  })
}

//Limpiar los filtros
limpiarFiltros() {
  this.formFilter.patchValue({ nombre: null})
  this.dataSource = new MatTableDataSource(this.dataRol);
  this.dataSource.paginator = this.paginator.toArray()[0];
  this.selection.clear()
  this.totalSeleccion = 0;
}

//Metodo exportar excel
exportAsXLSX(): void {
 this.selectedRows = [];
  this.selection.selected.forEach((x) => this.selectedRows.push(x));
  this.administracionService.exportAsExcelFile(this.selectedRows, 'Lista-Roles');
}

//Abrir Modal Editar
openDialogEdit(id: any, nombre: any){
  localStorage.setItem("idRolEdit", id);
  localStorage.setItem("nombreRolEdit", nombre);
  this.administracionService.openDialogEditRol();
}
}
