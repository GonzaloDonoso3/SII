import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Usuario } from '@models/shared/usuario';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { DialogRespaldosComponent } from 'src/app/_components/dialogs/dialog-respaldos/dialog-respaldos.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertHelper } from '@app/_helpers/alert.helper';
import { RentacarService } from '../../rentacar.service';
import { first } from 'rxjs/operators';
import { Empresa } from '@app/_models/shared/empresa';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpresaSharedService } from '../../../shared/shared-services/empresa-shared.service';
import { EgresosRentacar } from '../../../../_models/rentacar/egresoRentacar';

@Component({
  selector: 'app-rentacar-egresos-form',
  templateUrl: './rentacar-egresos-form.component.html',
  styleUrls: ['./rentacar-egresos-form.component.scss']
})
export class RentacarEgresosFormComponent implements OnInit {

  @Output() formularioListo = new EventEmitter<string>();

  usuario: Usuario = JSON.parse(localStorage.getItem('usuario') + '');
  nameRespaldo = '';
  empresa = new Empresa();
  idEmpresa = 4;
  egreso = new EgresosRentacar();
  empresaRazonSocial = '';
  num: number = 0;
  // ? Configuración de formulario
  addressForm = this.fb.group({
    idSucursal: [null, Validators.required],
    tipoEgreso: [null, Validators.required],
    descripcionEgreso: [null, Validators.required],
    fecha: [null, Validators.required],
    monto: [null, Validators.required],
    responsable: [null, Validators.required],
    otraPropiedad: ['']
  });

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private alert: AlertHelper,
    private rentacarService: RentacarService,
    private route: ActivatedRoute,
    private empresaService: EmpresaSharedService,
  ) { }

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

  onSubmit() {
    // $ consulta el estado del formulario antes de recibir los adjuntos
    switch (this.addressForm.status) {
      //Si el formulario esta correcto
      case 'VALID':
        const dialogRef = this.dialog.open(DialogRespaldosComponent, {

          data: { url: 'egresoRentacar/upload' }
        });
        dialogRef.afterClosed().subscribe(result => {
          //Se le asignan los datos del formulario al objeto EgresoInmobiliaria
          this.nameRespaldo = result;
          this.egreso.RespaldoEgresos = [];
          this.egreso.fecha = this.addressForm.value.fecha;
          this.egreso.monto = this.addressForm.value.monto;
          this.egreso.descripcion = this.addressForm.value.descripcionEgreso;
          this.egreso.responsable = this.addressForm.value.responsable;
          this.egreso.idSucursal = this.addressForm.value.idSucursal;
          this.egreso.tipoEgreso = this.addressForm.value.tipoEgreso;
          this.egreso.idArriendo = this.addressForm.value.idArriendo;


          //Se le asigna la id del usuario logueado
          this.egreso.idUsuario = this.usuario.id;

          //Se le agrega los respaldos subidos
          for (const name of this.nameRespaldo) {
            this.egreso.RespaldoEgresos.push({ url: name });
          }
          //Si todo esta correcto se ingresa el objeto
          if (result.length > 0) {
            this.rentacarService
              .createEgresos(this.egreso)
              .pipe(first())
              .subscribe(
                (data: any) => {
                  this.alert.createAlert("Registro Creado con exito");
                  this.formularioListo.emit(this.num + "");
                  this.num++;
                  this.addressForm.reset();

                },
                (error: any) => {
                  this.snackBar.open('Tenemos Problemas para realizar el registro, favor contactar al equipo de desarrollo', 'cerrar', {
                    duration: 2000,
                    verticalPosition: 'top',
                  });
                }
              );
          } else {
            //Si es incorrecto se envía un mensaje de error
            this.snackBar.open('Debemos Recibir sus respaldos para continuar', 'cerrar', {
              duration: 5000,
              verticalPosition: 'top',
            });
          }
        });
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
