import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Usuario } from '@models/shared/usuario';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { DialogRespaldosComponent } from 'src/app/_components/dialogs/dialog-respaldos/dialog-respaldos.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';
import { EmpresaSharedService } from '@app/_pages/shared/shared-services/empresa-shared.service';
import { Sucursal } from '@app/_models/shared/sucursal';
import { AlertHelper } from '@app/_helpers/alert.helper';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-administracion-empresas-form',
  templateUrl: './administracion-empresas-form.component.html',
  styleUrls: ['./administracion-empresas-form.component.scss']
})
export class AdministracionEmpresasFormComponent implements OnInit {

  formularioListo = new EventEmitter<string>();
  usuario: Usuario = JSON.parse(localStorage.getItem('usuario') + '');
  empresas : any;

  // ? Configuración de formulario
  addressForm = this.fb.group({
    razonSocial: ['', Validators.required],
    rut: ['', Validators.required],
    giro: ['', Validators.required],
    actividad: ['', Validators.required],
    direccion: ['', Validators.required],
    descripcion: ['', Validators.required],
  });


  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private sucursalService: SucursalSharedService,
    private empresaService: EmpresaSharedService,
    private alert: AlertHelper
  ) { }

  ngOnInit(): void {
  }

  //Metodo guardar empresa
  onSubmit(){
    switch (this.addressForm.status) {
      //Si el formulario esta correcto
      case 'VALID':
        this.empresaService
      .create(this.addressForm.value)
      .pipe(first())
      .subscribe(
        (data) => {
          this.snackBar.open('Empresa ingresada con exito', 'cerrar', {
            duration: 2000,
            verticalPosition: 'top',
          });
          this.addressForm.reset();
        },
        (error) => {
          this.snackBar.open('No se pudo ingresar la empresa, contacte con informatica', 'cerrar', {
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
