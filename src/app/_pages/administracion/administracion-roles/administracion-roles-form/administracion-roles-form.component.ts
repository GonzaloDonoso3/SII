import { Component, OnInit, EventEmitter, Output } from '@angular/core'
import { Usuario } from '@models/shared/usuario'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service'
import { first } from 'rxjs/operators'
import { RolSharedService } from '@app/_pages/shared/shared-services/rol-shared.service'
import { UsuarioSharedService } from '../../../shared/shared-services/usuario-shared.service'

@Component({
  selector: 'app-administracion-roles-form',
  templateUrl: './administracion-roles-form.component.html',
  styleUrls: ['./administracion-roles-form.component.scss']
})
export class AdministracionRolesFormComponent implements OnInit {
  formularioListo = new EventEmitter<string>()
  usuario: Usuario = JSON.parse(localStorage.getItem('usuario') + '')
  roles: any

  // ? Configuración de formulario
  addressForm = this.fb.group({
    nombre: ['', Validators.required]
  })

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private rolService: RolSharedService,
    private usuarioService: UsuarioSharedService
  ) {}

  ngOnInit(): void {}

  //Metodo agregar rol
  onSubmit() {
    switch (this.addressForm.status) {
      //Si el formulario esta correcto
      case 'VALID':
        this.rolService
          .create(this.addressForm.value)
          .pipe(first())
          .subscribe(
            (data) => {
              this.snackBar.open('Rol ingresado con exito', 'cerrar', {
                duration: 2000,
                verticalPosition: 'top'
              })
              this.addressForm.reset()
            },
            (error) => {
              this.snackBar.open(
                'No se pudo ingresar el rol, contacte con informatica',
                'cerrar',
                {
                  duration: 2000,
                  verticalPosition: 'top'
                }
              )
            }
          )
        break

      //Si el formulario es erroneo
      case 'INVALID':
        this.snackBar.open('EL formulario debe ser Completado', 'cerrar', {
          duration: 2000,
          verticalPosition: 'top'
        })
        break

      default:
        break
    }
  }
}
