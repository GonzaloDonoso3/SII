import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Usuario } from '@models/shared/usuario';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first } from 'rxjs/operators';
import { RolSharedService } from '@app/_pages/shared/shared-services/rol-shared.service';
import { UsuarioSharedService } from '../../../../shared/shared-services/usuario-shared.service';
import { AdministracionService } from '../../../administracion.service';


@Component({
  selector: 'app-dialog-usuarios-editar',
  templateUrl: './dialog-usuarios-editar.component.html',
  styleUrls: ['./dialog-usuarios-editar.component.scss']
})
export class DialogUsuariosEditarComponent implements OnInit {

  formularioListo = new EventEmitter<string>();
  usuario: Usuario = JSON.parse(localStorage.getItem('usuario') + '');
  roles : any;
  dataUsuario: any;
  idUsuario : any;
  nombreUsuario: any;
  
  

  // ? Configuración de formulario
  addressForm = this.fb.group({
    RolID: ['', Validators.required],
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    nombreUsuario: ['', Validators.required],
    hash: ['', [Validators.required , Validators.minLength(6)]],
  });


  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private rolService: RolSharedService,
    private usuarioService: UsuarioSharedService,
    private administracionService: AdministracionService
  ) { }

  ngOnInit(): void {
    this.idUsuario = localStorage.getItem("idUsuarioEdit");
    this.nombreUsuario = localStorage.getItem("nombreSucursalEdit");
    this.getUsuario();
    this.getRoles();
  }

  // Obtener Roles
  getRoles(){
    this.rolService
      .getAll()
      .pipe(first())
      .subscribe((roles) => (this.roles = roles));
  }

  get f() {
    return this.addressForm.controls;
  }

  //Obtener Usuarios
  getUsuario() {
    //Carga Tabla 
    this.usuarioService.getAll().pipe(first()).subscribe((result: Usuario[]) => {
      this.dataUsuario = result.map(Usuario => {
        return Usuario;
      });
      // Cargar los datos del usuario en el formulario
      this.dataUsuario.forEach((x:Usuario) => {
        if(x.id == this.idUsuario){
          this.f.nombre.setValue(x.nombre);
          this.f.apellido.setValue(x.apellido);
          this.f.nombreUsuario.setValue(x.nombreUsuario);
        }
      });
    });
  }

  // Metodo editar usuario
  onSubmit(){
    switch (this.addressForm.status) {
      //Si el formulario esta correcto
      case 'VALID':
        this.usuarioService
      .update(this.idUsuario ,this.addressForm.value)
      .pipe(first())
      .subscribe(
        (data) => {
          this.snackBar.open('Usuario editado con exito', 'cerrar', {
            duration: 2000,
            verticalPosition: 'top',
          });
          this.addressForm.reset();
          this.administracionService.closeDialogModal();
          
        },
        (error) => {
          this.snackBar.open('No se pudo editar el usuario, contacte con informatica', 'cerrar', {
            duration: 2000,
            verticalPosition: 'top',
          });
        }
      );
        break;
      
      //Si el formulario es erroneo 
      case 'INVALID':
        this.snackBar.open('EL formulario debe ser Completado', 'cerrar', {
          duration: 2000,
          verticalPosition: 'top',
        });
        break;
      
      default:
        break;
    }
  }

}
