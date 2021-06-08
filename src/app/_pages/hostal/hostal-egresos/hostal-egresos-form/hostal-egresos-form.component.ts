import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogRespaldosComponent } from '@app/_components/dialogs/dialog-respaldos/dialog-respaldos.component';
import { AlertHelper } from '@app/_helpers/alert.helper';
import { EgresoHostal } from '@app/_models/hostal/egresoHostal';
import { Sucursal } from '@app/_models/shared/sucursal';
import { Usuario } from '@app/_models/shared/usuario';
import { CuentasBancariasService } from '@app/_pages/shared/shared-services/cuentas-bancarias.service';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';
import { HostalService } from '../../hostal.service';



@Component({
  selector: 'app-hostal-egresos-form',
  templateUrl: './hostal-egresos-form.component.html',
  styleUrls: ['./hostal-egresos-form.component.scss']
})
export class HostalEgresosFormComponent implements OnInit {
  @Output()
  formularioListo = new EventEmitter<string>();

  num: number = 0;

  usuario: Usuario = JSON.parse(localStorage.getItem('usuario') + '');
  // ? set checkbox
  tiposEgresos: string[] = [];
  cuentasRegistradas: any[] = [];
  // ? construccion del formulario,

  egresosForm = this.fb.group({
    //agregar el detalle del formulario;
    fecha: [null, Validators.required],
    monto: [null, Validators.required],
    tipoEgreso: [null, Validators.required],
    descripcion: [null, Validators.required],
    responsable: [null, Validators.required],
    idSucursal: [null, Validators.required],
    /* idCuentaAsignada: [null, Validators.required], */
  });
  egreso: EgresoHostal = new EgresoHostal();
  nameRespaldo: string[] = [];

  sucursales: Sucursal[];
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private hostalService: HostalService,
    private sucursalService: SucursalSharedService,
    private cuentasService: CuentasBancariasService,
    private alert: AlertHelper
  ) {
    this.sucursales = this.sucursalService.sucursalListValue;

  }

  ngOnInit(): void {


    this.tiposEgresos = this.hostalService.tiposEgresosListValue;
    this.cuentasService.obtenerCuentas().subscribe(data => {
      this.cuentasRegistradas = data;

    });


  }
  onSubmit() {
    switch (this.egresosForm.status) {
      case 'VALID':
        const dialogRef = this.dialog.open(DialogRespaldosComponent, {

          data: { url: 'egresoHostal/upload' }
        });

        dialogRef.afterClosed().subscribe(result => {
          this.nameRespaldo = result;
          this.egreso.RespaldoEgresos = [];
          this.egreso.fecha = this.egresosForm.value.fecha;
          this.egreso.monto = this.egresosForm.value.monto;
          this.egreso.descripcion = this.egresosForm.value.descripcion;
          this.egreso.responsable = this.egresosForm.value.responsable;
          this.egreso.idSucursal = this.egresosForm.value.idSucursal;
          this.egreso.idUsuario = this.usuario.id;
          this.egreso.tipoEgreso = this.egresosForm.value.tipoEgreso;

          for (const respaldo of this.nameRespaldo) {
            this.egreso.RespaldoEgresos.push({ url: respaldo });
          }
          if (this.egreso.RespaldoEgresos.length > 0) {
            this.hostalService
              .egresoRegistrar(this.egreso)
              .pipe()
              .subscribe(
                (data: any) => {
                  this.alert.createAlert("Registro Creado con exito!");
                  this.formularioListo.emit(this.num + "");
                  this.num++;
                  this.egresosForm.reset();
                },
                (error: any) => {
                  this.snackBar.open('Tenemos Problemas para realizar el registro, porfavor contactar al equipo de desarrollo', 'cerrar', {
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
