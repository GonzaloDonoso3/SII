import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, Input, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SucursalSharedService } from '../../../shared/shared-services/sucursal-shared.service';
import { first } from 'rxjs/operators';
import { EmpresaSharedService } from '../../../shared/shared-services/empresa-shared.service';
import { AdministracionService } from '../../administracion.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioSharedService } from '../../../shared/shared-services/usuario-shared.service';
import { Usuario } from '@app/_models/shared/usuario';
import { RolSharedService } from '../../../shared/shared-services/rol-shared.service';
import { Rol } from '@app/_models/shared/rol';

@Component({
  selector: 'app-administracion-usuarios-list',
  templateUrl: './administracion-usuarios-list.component.html',
  styleUrls: ['./administracion-usuarios-list.component.scss']
})
export class AdministracionUsuariosListComponent implements OnInit {

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  // ? table definitions.
  displayedColumns: string[] = [
    'select',
    'id',
    'nombre',
    'apellido',
    'nombreUsuario',
    'roles',
    'botones'
  ];

  // Tabla en donde se almacenará los datos de la bd 
  dataSource: MatTableDataSource<Usuario> = new MatTableDataSource();
  dataUsuario: Usuario[] = [];


  formFilter = new FormGroup({
    nombre: new FormControl(),
    apellido: new FormControl(),
    giro: new FormControl(),
    nombreUsuario: new FormControl(),
    roles: new FormControl(),

  })

  usuarios: Usuario[] = [];
  roles : Rol[] = [];
  nombreEmpresa!: string;
  selection = new SelectionModel<Usuario>(true, []);
  totalSeleccion = 0;
  selectedRows!: any[];
  usuariosDelete!:any;
  rol !: Rol;

constructor(
  private sucursalService: SucursalSharedService,
  private empresaService: EmpresaSharedService,
  private administracionService: AdministracionService,
  private snackBar: MatSnackBar,
  private usuariosService: UsuarioSharedService,
  private rolService: RolSharedService,
) { }

ngOnInit(): void {
  this.getRoles();
  this.aplicarfiltros();
  
  //Cargar una lista auxilar con las sucursales, que posteriormente nos ayudará a eliminar un registro
  this.usuariosService
    .getAll()
    .pipe(first())
    .subscribe((usuariosDelete) => (this.usuariosDelete = usuariosDelete));

    setTimeout(() => {
      this.getUsuarios()
     }, 100);
}

// Obtener el listado de usuarios desde la BD
getUsuarios() {
  //Carga Tabla 
  this.usuariosService.getAll().pipe(first()).subscribe((result: Usuario[]) => {
    this.dataUsuario = result.map(Usuario => {

      //Buscar Rol del usuario
      this.roles.forEach((rol) => {
        if(Usuario.RolID == parseInt(rol.id)){
          Usuario.rol = rol.nombre;
        }
      });
      return Usuario;
    });
    this.dataSource = new MatTableDataSource(this.dataUsuario);
    this.dataSource.paginator = this.paginator.toArray()[0];
  });
}


// Obtener los roles
getRoles(){
  this.rolService
    .getAll()
    .pipe(first())
    .subscribe((roles) => (this.roles = roles));
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

    let dataFiltered = this.dataUsuario;

    //Filtro Nombre
    if (res.nombre) {
      dataFiltered = dataFiltered.filter((data: Usuario) => data.nombre == res.nombre);
    }

    //Filtro Apellido
    if (res.apellido) {
      dataFiltered = dataFiltered.filter((data: Usuario) => data.apellido == res.apellido);
    }

    //Filtro Nombre Usuario
    if (res.nombreUsuario) {
      dataFiltered = dataFiltered.filter((data: Usuario) => data.nombreUsuario == res.nombreUsuario);
    }

    //Filtro Roles
    if (res.roles) {
      dataFiltered = dataFiltered.filter((data: Usuario) => data.rol == res.roles);
    }

  
    this.dataSource = new MatTableDataSource(dataFiltered);
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.selection.clear()
    this.totalSeleccion = 0;
  })
}

//Limpiar los filtros
limpiarFiltros() {
  this.formFilter.patchValue({ nombre: null, apellido: null, nombreUsuario: null, roles: null})
  this.dataSource = new MatTableDataSource(this.dataUsuario);
  this.dataSource.paginator = this.paginator.toArray()[0];
  this.selection.clear()
  this.totalSeleccion = 0;
}

//Metodo exportar excel
exportAsXLSX(): void {
 this.selectedRows = [];
  this.selection.selected.forEach((x) => this.selectedRows.push(x));
  this.administracionService.exportAsExcelFile(this.selectedRows, 'Lista-Usuarios');
}

//Abrir Modal Editar
openDialogEdit(id: any, nombre: any){
  localStorage.setItem("idUsuarioEdit", id);
  localStorage.setItem("nombreUsuarioEdit", nombre);
  this.administracionService.openDialogEditUsuario();
}

//Metodo eliminar una sucursal
deleteUsuario(id: any, nombre: string, apellido: string) {
  const sucursal = this.usuariosDelete.find((x: any) => x.id === id);
  if (confirm('Esta seguro que desea eliminar el usuario: ' + nombre + " " + apellido)) {
    sucursal.isDeleting = true;
    this.usuariosService
      .delete(id)
      .pipe(first())
      .subscribe(() => {
        this.usuarios = this.usuarios.filter((x: any) => x.id !== id);
      });
    sucursal.isDeleting = false;
  }
  this.snackBar.open('Usuario eliminado', 'cerrar', {
    duration: 2000,
    verticalPosition: 'top',
  });
  this.getUsuarios();
}

}
