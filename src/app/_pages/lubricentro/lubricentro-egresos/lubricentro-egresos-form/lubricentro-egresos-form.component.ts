import { Usuario } from '@models/shared/usuario';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogRespaldosComponent } from '@app/_components/dialogs/dialog-respaldos/dialog-respaldos.component';
import { EgresoLubricentro } from '@app/_models/lubricentro/egresoLubricentro';
import { Sucursal } from '@app/_models/shared/sucursal';
import { CuentasBancariasService } from '@app/_pages/shared/shared-services/cuentas-bancarias.service';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';
import { LubricentroService } from '../../lubricentro.service';
import { AlertHelper } from '@app/_helpers/alert.helper';

@Component({
  selector: 'app-lubricentro-egresos-form',
  templateUrl: './lubricentro-egresos-form.component.html',
  styleUrls: ['./lubricentro-egresos-form.component.scss']
})
export class LubricentroEgresosFormComponent implements OnInit {

  @Output()
  formularioListo = new EventEmitter<string>();
  // ? set checkbox
  tiposEgresos: string[] = [];
  cuentasRegistradas: any[] = [];
  // ? construccion del formulario,

  usuario: Usuario = JSON.parse(localStorage.getItem('usuario') + '');

  egresosForm = this.fb.group({
    //agregar el detalle del formulario;
    fecha: [null, Validators.required],
    monto: [null, Validators.required],
    tipoEgreso: [null, Validators.required],
    descripcion: [null, Validators.required],
    responsable: [null, Validators.required],
    idSucursal: [null, Validators.required],
    idIngreso: [null,],
    /* idCuentaAsignada: [null, Validators.required], */
  });
  egreso: EgresoLubricentro = new EgresoLubricentro();
  nameRespaldo: string[] = [];

  sucursales: Sucursal[];
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private lubricentroService: LubricentroService,
    private sucursalService: SucursalSharedService,
    private cuentasService: CuentasBancariasService,
    private alert: AlertHelper
  ) {
    this.sucursales = this.sucursalService.sucursalListValue;

  }

  ngOnInit(): void {
    this.tiposEgresos = this.lubricentroService.tiposEgresosListValue;
    this.cuentasService.obtenerCuentas().subscribe(data => {
      this.cuentasRegistradas = data;

    });


  }
  onSubmit() {
    switch (this.egresosForm.status) {
      case 'VALID':
        const dialogRef = this.dialog.open(DialogRespaldosComponent, {

          data: { url: 'egresoLubricentro/upload' }
        });

        dialogRef.afterClosed().subscribe(result => {
          this.nameRespaldo = result;
          this.egreso.RespaldoEgresoLubricentros = [];
          this.egreso.fecha = this.egresosForm.value.fecha;
          this.egreso.monto = this.egresosForm.value.monto;
          this.egreso.descripcion = this.egresosForm.value.descripcion;
          this.egreso.responsable = this.egresosForm.value.responsable;
          this.egreso.idSucursal = this.egresosForm.value.idSucursal;
          this.egreso.idIngreso = this.egresosForm.value.idIngreso;
          this.egreso.idUsuario = this.usuario.id;
          console.log(this.egreso.idUsuario);
          this.egreso.tipoEgreso = this.egresosForm.value.tipoEgreso;

          for (const respaldo of this.nameRespaldo) {
            this.egreso.RespaldoEgresoLubricentros.push({ url: respaldo });
          }
          if (this.egreso.RespaldoEgresoLubricentros.length > 0) {
            this.lubricentroService
              .egresoRegistrar(this.egreso)
              .pipe()
              .subscribe(
                (data: any) => {
                  this.alert.createAlert("Registro Creado con exito!");

                  /*   this.snackBar.open('Regitro Exitoso !!', 'cerrar', {
                      duration: 2000,
                      verticalPosition: 'top',
                    }); */
                  this.formularioListo.emit('true');
                  this.egresosForm.reset();
                },
                (error: any) => {
                  this.snackBar.open('Tenemos Problemas para realizar el registro, favor contactar al equipo de desarrollo', 'cerrar', {
                    duration: 2000,
                    verticalPosition: 'top',
                  });
                  console.log(error);
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
      case 'INVALID':
        this.snackBar.open('Debe completar el Formulario', 'cerrar', {
          duration: 2000,
          verticalPosition: 'top',
        });
        break;
      default:
        break;
    }




  }

}
