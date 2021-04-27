import { Component, OnInit, EventEmitter, Output } from '@angular/core'
import { Usuario } from '@models/shared/usuario'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { first } from 'rxjs/operators'
import { RolSharedService } from '@app/_pages/shared/shared-services/rol-shared.service'
import { AdministracionService } from '../../../administracion.service'
import { Rol } from '@app/_models/shared/rol'

@Component({
  selector: 'app-dialog-roles-editar',
  templateUrl: './dialog-roles-editar.component.html',
  styleUrls: ['./dialog-roles-editar.component.scss']
})
export class DialogRolesEditarComponent implements OnInit {
  formularioListo = new EventEmitter<string>()
  usuario: Usuario = JSON.parse(localStorage.getItem('usuario') + '')
  roles: any
  idRol: any
  nombreRol: any
  dataRol: any

  // ? Configuración de formulario
  addressForm = this.fb.group({
    nombre: ['', Validators.required]
  })

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private rolService: RolSharedService,
    private adminstracionService: AdministracionService
  ) {}

  ngOnInit(): void {
    this.idRol = localStorage.getItem('idRolEdit')
    this.nombreRol = localStorage.getItem('nombreRolEdit')
    this.getRol()
  }

  get f() {
    return this.addressForm.controls
  }

  //Obtener los roles
  getRol() {
    //Carga Tabla
    this.rolService
      .getAll()
      .pipe(first())
      .subscribe((result: Rol[]) => {
        this.dataRol = result.map((Rol) => {
          return Rol
        })
        //Cargar los datos del rol seleccionado
        this.dataRol.forEach((x: Rol) => {
          if (x.id == this.idRol) {
            this.f.nombre.setValue(x.nombre)
          }
        })
      })
  }

  //Metodo actualizar rol
  onSubmit() {
    switch (this.addressForm.status) {
      //Si el formulario esta correcto
      case 'VALID':
        this.rolService
          .update(this.idRol, this.addressForm.value)
          .pipe(first())
          .subscribe(
            (data) => {
              this.snackBar.open('Rol editado con exito', 'cerrar', {
                duration: 2000,
                verticalPosition: 'top'
              })
              this.addressForm.reset()
              this.adminstracionService.closeDialogModal()
            },
            (error) => {
              this.snackBar.open(
                'No se pudo editar el rol, contacte con informatica',
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
