import { Component, OnInit, Output, Input,  EventEmitter } from '@angular/core';
import { DatePipe } from "@angular/common";
import { Usuario } from '@app/_models/shared/usuario';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { EgresoAgroFirma } from '@app/_models/agroFirma/egresoAgroFirma';
import { Sucursal } from '@app/_models/shared/sucursal';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogRespaldosComponent } from '@app/_components/dialogs/dialog-respaldos/dialog-respaldos.component';
import { AlertHelper } from '@app/_helpers/alert.helper';
import { AgroFirmaService } from '@app/_pages/agroFirma/agro-firma.service';
import { CuentasBancariasService } from '@app/_pages/shared/shared-services/cuentas-bancarias.service';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';
import { ActivatedRoute, Router, RouterModule, Routes } from '@angular/router';
import { AgroFirmaRoutingModule } from '@app/_pages/agroFirma/agro-firma-routing.module';
import { Observable, of } from 'rxjs';


@Component({
  selector: 'app-agro-firma-egresos-form',
  templateUrl: './agro-firma-egresos-form.component.html',
  styleUrls: ['./agro-firma-egresos-form.component.scss'],
  providers: [DatePipe]
})
export class AgroFirmaEgresosFormComponent implements OnInit {
  @Output() formReady = new EventEmitter<number>()
  @Input() projectId!: Observable<number>

  usuario: Usuario = JSON.parse(localStorage.getItem('usuario') + '');
  // ? set checkbox
  tiposEgresos: string[] = [];
  cuentasRegistradas: any[] = [];
  idProyecto = null;
  isAddMode!: boolean;
  respaldoEgresos: any[] = [];
  egresosForm!: FormGroup;
  //Variables que usan para los egresos de Prestamos bancarios y automotriz
  mostrarDatos : boolean = true;
  datoCuota = 'N/A';
  montoTotal = '1000';  
  proyecto : any = '0';
  selected: any;
  opcionSeleccionado: string = '0';
  verSeleccion: string = '';
  

  egreso: EgresoAgroFirma = new EgresoAgroFirma();
  nameRespaldo: string[] = [];

  sucursales: Sucursal[];
  
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private sucursalService: SucursalSharedService,
    private cuentasService: CuentasBancariasService,
    private alert: AlertHelper,
    private agroFirmaService: AgroFirmaService,
  ) { 
    this.sucursales = this.sucursalService.sucursalListValue;
  }

  
  

  ngOnInit(): void {

    // ? construccion del formulario,
    this.egresosForm = this.fb.group({
      //agregar el detalle del formulario;
      fecha: [null, Validators.required],
      monto: [null],
      tipoEgreso: [null, Validators.required],
      descripcion: [null, Validators.required],
      responsable: [null, Validators.required],    
      montoCuota: [null],
      numeroCuota: [null],
      idProyecto: [null],    
      RespaldoEgresos: this.respaldoEgresos   
    });
    this.tiposEgresos = this.agroFirmaService.tiposEgresosListValue;
    this.cuentasService.obtenerCuentas().subscribe(data => {
      this.cuentasRegistradas = data;
    });
    
    
  }

  //Metodo para mostrar numero de cuotas
  activarEdicion(): void {
    this.mostrarDatos = false; 
    this.egresosForm.controls["numeroCuota"].setValidators(Validators.required);
    this.egresosForm.controls["numeroCuota"].updateValueAndValidity();  
    this.egresosForm.controls["monto"].clearValidators();           
    this.egresosForm.controls["monto"].updateValueAndValidity();
                          
  }
//Metodo para ocultar los numeros de cuotas
  desactivarEdicion(): void {
    this.mostrarDatos = true;
    this.egresosForm.controls["monto"].setValidators(Validators.required);
    this.egresosForm.controls["monto"].updateValueAndValidity();                         
    this.egresosForm.controls["numeroCuota"].clearValidators();           
    this.egresosForm.controls["numeroCuota"].updateValueAndValidity();
   
  }

//Capturamos los tipos de egresos
  capturar() {
    this.verSeleccion = this.opcionSeleccionado;
    if(this.verSeleccion == "Prestamos Bancarios"  || this.verSeleccion == "Prestamos Automotriz"){
      this.montoTotal == "1000";        
    }        
  }

  onSubmit() {
    switch (this.egresosForm.status) {
      case 'VALID':
        const dialogRef = this.dialog.open(DialogRespaldosComponent, {

          data: { url: 'egresoAgrofirma/upload' }
        });

        dialogRef.afterClosed().subscribe(result => {
          this.nameRespaldo = result;
          this.egreso.RespaldoEgresos = [];
          this.egreso.fecha = this.egresosForm.value.fecha;
          // Si el usuario ingresa Egreso Bancario y Automotriz al monto se le asigna el numero de cuota
          if(this.egresosForm.value.monto == null) {                        
            this.egreso.monto = this.egresosForm.value.montoCuota;
          } else {
            this.egreso.monto = this.egresosForm.value.monto;                    
          }
          this.egreso.descripcion = this.egresosForm.value.descripcion;
          this.egreso.responsable = this.egresosForm.value.responsable;          
          this.egreso.idUsuario = this.usuario.id;
          this.egreso.tipoEgreso = this.egresosForm.value.tipoEgreso;
          this.egreso.numeroCuota = this.egresosForm.value.numeroCuota;                  
          this.egreso.idProyecto = Number(this.projectId);
          

          for (const respaldo of this.nameRespaldo) {
            this.egreso.RespaldoEgresos.push({ url: respaldo });
          }
          if (this.egreso.RespaldoEgresos.length > 0) {                        
            this.agroFirmaService
              .egresoRegistrar(this.egreso)
              .pipe()
              .subscribe(
                (data: any) => {
                  this.alert.createAlert("Registro Creado con exito!");                  
                  this.formReady.emit(new Date().getTime());
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
