import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DatePipe } from "@angular/common";
import { Usuario } from '@app/_models/shared/usuario';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogRespaldosComponent } from '@app/_components/dialogs/dialog-respaldos/dialog-respaldos.component';
import { AlertHelper } from '@app/_helpers/alert.helper';
import { AgroFirmaService } from '@app/_pages/agroFirma/agro-firma.service';
import { CuentasBancariasService } from '@app/_pages/shared/shared-services/cuentas-bancarias.service';
import { IngresoAgroFirma } from '@app/_models/agroFirma/ingresoAgroFirma';
import { Observable } from 'rxjs';
import { CuentaRegistrada } from '@app/_models/agroFirma/CuentaRegistrada';


@Component({
  selector: 'app-agro-firma-ingresos-form',
  templateUrl: './agro-firma-ingresos-form.component.html',
  styleUrls: ['./agro-firma-ingresos-form.component.scss'],
  providers: [DatePipe]
})
export class AgroFirmaIngresosFormComponent implements OnInit, OnChanges {
  @Output() formReady = new EventEmitter<number>()

  // Input Decorator para obtener el id del proyecto seleccionado desde el componente padre
  @Input() idProyecto!: Observable<number>

  usuario: Usuario = JSON.parse(localStorage.getItem('usuario') + '');
  cuentasRegistradas: CuentaRegistrada[]=[]
  proyecto : any = '0';
  ingresosForm!: FormGroup;
  ingreso: IngresoAgroFirma = new IngresoAgroFirma();
  nameRespaldo: string[] = [];
  submitted: boolean = false
  
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cuentasService: CuentasBancariasService,
    private alert: AlertHelper,
    private agroFirmaService: AgroFirmaService,
  ) { }

  ngOnInit(): void {
    
    // construccion del formulario,
    this.ingresosForm = this.fb.group({
      fecha: [null, Validators.required],
      monto: [null, Validators.required],
      nDocumento: [null, Validators.required],
      descripcionIngreso: [null, Validators.required],
      tipoIngreso: [null, Validators.required],
      estadoPago: [null, Validators.required],
      idCuentaProyecto: [null, Validators.required],
      nAutorizacion: [null, Validators.required],
      idProyecto: null,
      idUsuario: null
    });
    this.renderSelectBankAccounts()
  }
  

  //Metodo para cargar nuevamente el select de las cuentas bancarias cuando se selecciona otro proyecto
  ngOnChanges(changes: SimpleChanges) {
    this.renderSelectBankAccounts()
  }
  
  onSubmit() {
    this.ingresosForm.patchValue({idProyecto: this.idProyecto, idUsuario: this.usuario.id})
    switch (this.ingresosForm.status) {
      case 'VALID':
        const dialogRef = this.dialog.open(DialogRespaldosComponent, {
          data: { url: 'ingresoAgrofirma/upload' }
        });
        
        dialogRef.afterClosed().subscribe(result => {
          this.ingreso = this.ingresosForm.getRawValue();
          console.log(this.ingreso.fecha)
          this.agroFirmaService.registrarIngreso(this.ingreso)
          .pipe()
          .subscribe((data: any) => {
            this.alert.createAlert("Registro Creado con exito!");                                      
            this.formReady.emit(new Date().getTime());
            
            this.ingresosForm.reset();
            Object.keys(this.ingresosForm.controls).forEach(key => {
              this.ingresosForm.get(key)?.clearValidators()
              this.ingresosForm.get(key)?.updateValueAndValidity()
            })
            this.renderSelectBankAccounts()
          },
          (error: any) => {
            this.snackBar.open('Tenemos Problemas para realizar el registro, porfavor contactar al equipo de desarrollo', 'cerrar', {
              duration: 2000,
              verticalPosition: 'top',
            });
            console.log(error);
          });
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

  renderSelectBankAccounts = () => {
    this.cuentasService.obtenerCuentasPorProyecto(Number(this.idProyecto)).subscribe(data => {
      this.cuentasRegistradas = data;
    })
  }

}
