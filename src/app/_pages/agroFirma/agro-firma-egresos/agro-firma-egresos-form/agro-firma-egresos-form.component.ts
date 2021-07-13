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


@Component({
  selector: 'app-agro-firma-egresos-form',
  templateUrl: './agro-firma-egresos-form.component.html',
  styleUrls: ['./agro-firma-egresos-form.component.scss'],
  providers: [DatePipe]
})
export class AgroFirmaEgresosFormComponent implements OnInit {
  @Output()
  formularioListo = new EventEmitter<string>();
  // @Output() nombreHijo: string = "Sin nombre"

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
    private router: Router,
    public dialog: MatDialog,
    //private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private sucursalService: SucursalSharedService,
    private cuentasService: CuentasBancariasService,
    private alert: AlertHelper,
    private miDatePipe: DatePipe,
    private agroFirmaService: AgroFirmaService,
  ) { 
    this.sucursales = this.sucursalService.sucursalListValue;
  }

  
  

  ngOnInit(): void {
    //this.idProyecto = this.route.snapshot.params.idProyecto;        
    this.proyecto = localStorage.getItem("proyectoID");
    //console.log("imprimiendo al inicio", this.proyecto)
        
    
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
    RespaldoEgresos: this.respaldoEgresos,    
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
          

          this.egreso.idProyecto = this.egresosForm.value.idProyecto;
          this.egreso.idProyecto = this.proyecto;
          //console.log("viendo id del proyecto", this.egreso.idProyecto)
          

          if(this.egresosForm.value.numeroCuota > 1){              
            let sumarMes= 0;
            let restarMes= 0;
            let contadorCuota = 0;                    
              for (let i = 0; i < this.egresosForm.value.numeroCuota; i++) {                                                                                                                                                                                                                                                                                                                             
                    this.egresosForm.value.fecha.setMonth(this.egresosForm.value.fecha.getMonth() + sumarMes);                                                                                                  
                    this.egreso.fecha = this.egresosForm.value.fecha;
                    sumarMes = sumarMes + 1;
                    contadorCuota = contadorCuota + 1;
                    this.egreso.numeroCuota = contadorCuota.toString().concat("/").concat(this.egresosForm.value.numeroCuota);                                                                                                                                                                                                                                                                                                                                                                                         
                    restarMes = (sumarMes + 1) - sumarMes;                                 
                    if(sumarMes >= 2){                                            
                      sumarMes = restarMes;                      
                    }    
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
                            this.formularioListo.emit('true');
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
              }
              return;
          }
          else {
            this.egreso.fecha = this.egresosForm.value.fecha;          
            this.egresosForm.value.numeroCuota = "1/1";             
            this.egreso.numeroCuota = this.egresosForm.value.numeroCuota;          
          }

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

                  /*  this.snackBar.open('Regitro Exitoso !!', 'cerrar', {
                     duration: 2000,
                     verticalPosition: 'top',
                   }); */
                  this.formularioListo.emit('true');
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
