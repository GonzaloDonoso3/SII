import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Usuario } from '@models/shared/usuario';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';
import { first } from 'rxjs/operators';
import { RolSharedService } from '@app/_pages/shared/shared-services/rol-shared.service';
import { UsuarioSharedService } from '../../../shared/shared-services/usuario-shared.service';

@Component({
  selector: 'app-administracion-usuarios-form',
  templateUrl: './administracion-usuarios-form.component.html',
  styleUrls: ['./administracion-usuarios-form.component.scss']
})
export class AdministracionUsuariosFormComponent implements OnInit {

  formularioListo = new EventEmitter<string>();
  usuario: Usuario = JSON.parse(localStorage.getItem('usuario') + '');
  roles : any;
  
  

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
    private sucursalService: SucursalSharedService,
    private rolService: RolSharedService,
    private usuarioService: UsuarioSharedService
  ) { }

  ngOnInit(): void {
    this.getRoles();
  }

  getRoles(){
    this.rolService
      .getAll()
      .pipe(first())
      .subscribe((roles) => (this.roles = roles));
  }


  onSubmit(){
    switch (this.addressForm.status) {
      //Si el formulario esta correcto
      case 'VALID':
        this.usuarioService
      .register(this.addressForm.value)
      .pipe(first())
      .subscribe(
        (data) => {
          this.snackBar.open('Usuario ingresado con exito', 'cerrar', {
            duration: 2000,
            verticalPosition: 'top',
          });
          this.addressForm.reset();
        },
        (error) => {
          this.snackBar.open('No se pudo ingresar el usuario, contacte con informatica', 'cerrar', {
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
