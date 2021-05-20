import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Usuario } from '@models/shared/usuario';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { DialogRespaldosComponent } from 'src/app/_components/dialogs/dialog-respaldos/dialog-respaldos.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';
import { Sucursal } from '@app/_models/shared/sucursal';
import { CuentasBancariasService } from '@app/_pages/shared/shared-services/cuentas-bancarias.service';
import { AlertHelper } from '@app/_helpers/alert.helper';
import { Observable } from 'rxjs';
import { first, map,startWith } from 'rxjs/operators';
import { UsuarioSharedService } from '@app/_pages/shared/shared-services/usuario-shared.service';
import { ImportadoraService } from '../../../importadora.service';
import { Empresa } from '@app/_models/shared/empresa';
import { EmpresaSharedService } from '@app/_pages/shared/shared-services/empresa-shared.service';

@Component({
  selector: 'app-importadora-egresos-tab-gasto-fijo-form',
  templateUrl: './importadora-egresos-tab-gasto-fijo-form.component.html',
  styleUrls: ['./importadora-egresos-tab-gasto-fijo-form.component.scss']
})
export class ImportadoraEgresosTabGastoFijoFormComponent implements OnInit {

  usuario: Usuario = JSON.parse(localStorage.getItem('usuario') + '');

  nameRespaldo = '';
  tiposIngresos: any[] = [];
  idEmpresa = 13;
  empresa = new Empresa();


  // ? Validar si es necesario importar modelos de datos
  egreso: any = {};
  // ? Configuración de formulario
  addressForm = this.fb.group({
    idSucursal: [null, Validators.required],
    tipoEgreso: [null, Validators.required],
    descripcion: [null, Validators.required],
    fecha: [null, Validators.required],
    monto: [null, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private sucursalService: SucursalSharedService,
    private usuariosService: UsuarioSharedService,
    private ImportadoraService: ImportadoraService,
    private empresaService: EmpresaSharedService
  ) { 
  }

  ngOnInit(): void {
    this.getEmpresa(this.idEmpresa);
   }
 
   getEmpresa(id: number): any {
     this.empresaService
       .getByIdWithSucursales(id)
       .pipe(first())
       .subscribe((x) => {
         x.Sucursals = Object.values(x.Sucursals);
         this.empresa = x;
       });
   }

  onSubmit(){
    // $ consulta el estado del formulario antes de recibir los adjuntos
    switch (this.addressForm.status) {
      case 'VALID':
        const dialogRef = this.dialog.open(DialogRespaldosComponent, {

          data: { url: 'egresoFijoImportadora/upload' }
        });
        dialogRef.afterClosed().subscribe(result => {
          //Se le asignan los datos del formulario al objeto EgresoInmobiliaria
          this.nameRespaldo = result;
          this.egreso.RespaldoEgresoFijoImportadoras = [];
          this.egreso.idSucursal = this.addressForm.value.idSucursal;
          this.egreso.tipoEgreso = this.addressForm.value.tipoEgreso;
          this.egreso.descripcion = this.addressForm.value.descripcion;
          this.egreso.fecha = this.addressForm.value.fecha;
          this.egreso.monto = this.addressForm.value.monto;
          
          //Se le asigna la id del usuario logueado
          this.egreso.idUsuario = this.usuario.id;

          //Se le agrega los respaldos subidos
          for (const name of this.nameRespaldo) {
            this.egreso.RespaldoEgresoFijoImportadoras.push({ url: name });
          }
          //Si todo esta correcto se ingresa el objeto
          if (result.length > 0) {
            this.ImportadoraService
              .createEgresosFijo(this.egreso)
              .pipe()
              .subscribe(
                (data) => {
                  this.snackBar.open('Egreso Registrado', 'cerrar', {
                    duration: 2000,
                    verticalPosition: 'top',
                  });
                  this.addressForm.reset();

                },
                (error) => {
                  //Si es incorrecto se envía un mensaje de error
                  this.snackBar.open('Tenemos Problemas para realizar el registro, favor contactar al equipo de desarrollo', 'cerrar', {
                    duration: 2000,
                    verticalPosition: 'top',
                  });
                }
              );
          } else {
            this.snackBar.open('Debemos Recibir sus respaldos para continuar !!', 'cerrar', {
              duration: 5000,
              verticalPosition: 'top',
            });
          }
        });
        break;

      //Si el formulario es erroneo 
      case 'INVALID':
        this.snackBar.open('EL formulario debe ser Completado !!', 'cerrar', {
          duration: 2000,
          verticalPosition: 'top',
        });
        break;
      
      default:
        break;
    }
  }

  //metodo que permite activar el input de otraPropiedad y otroTipo
  get f() {
    return this.addressForm.controls;
  }


}
