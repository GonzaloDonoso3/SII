import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Usuario } from '@models/shared/usuario';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { DialogRespaldosComponent } from 'src/app/_components/dialogs/dialog-respaldos/dialog-respaldos.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbogadosService } from '../../abogados.service';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';
import { Sucursal } from '@app/_models/shared/sucursal';
import { CuentasBancariasService } from '@app/_pages/shared/shared-services/cuentas-bancarias.service';
import { AlertHelper } from '@app/_helpers/alert.helper';


@Component({
  selector: 'app-abogados-ingresos-form',
  templateUrl: './abogados-ingresos-form.component.html',
  styleUrls: ['./abogados-ingresos-form.component.scss']
})
export class AbogadosIngresosFormComponent implements OnInit {

  usuario: Usuario = JSON.parse(localStorage.getItem('usuario') + '');

  addressForm = this.fb.group({
    rutCliente: [null, Validators.required],
    nombreCliente: [null, Validators.required],
    email: [null, Validators.required],
    telefono: [null, Validators.required],
    direccion: [null, Validators.required],
  });

  sucursales: Sucursal[];
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private sucursalService: SucursalSharedService,
    private cuentasService: CuentasBancariasService,
    private alert: AlertHelper,
    private abogadosService: AbogadosService,
  ) { 
    this.sucursales = this.sucursalService.sucursalListValue;
  }

  ngOnInit(): void {
  }

  onSubmit(){

  }

  //metodo que permite activar el input de otraPropiedad y otroTipo
  get f() {
    return this.addressForm.controls;
  }
}
