import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';
import { Sucursal } from '@app/_models/shared/sucursal';
import { Empresa } from '@app/_models/shared/empresa';
import { EmpresaSharedService } from '@app/_pages/shared/shared-services/empresa-shared.service';
import { first } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario } from '@app/_models/shared/usuario';
<<<<<<< HEAD
import { AbogadosService } from '../../../../abogados/abogados.service';
=======
import { DialogRespaldosComponent } from 'src/app/_components/dialogs/dialog-respaldos/dialog-respaldos.component';
>>>>>>> a39eea546d51dcd7ad258fb4ca8e6a665bf9dabf
import { EgresosContainerImportadora } from '@app/_models/importadora/egresoContainerImportadora';
import { EgresosNeumaticoImportadora } from '@app/_models/importadora/egresoNeumaticoImportadora';
import { ImportadoraService } from '../../../importadora.service';
import { Console } from 'node:console';
import { MatDialog } from '@angular/material/dialog';
import {DecimalPipe} from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-importadora-egresos-tab-gasto-neumaticos-form',
  templateUrl: './importadora-egresos-tab-gasto-neumaticos-form.component.html',
  styleUrls: ['./importadora-egresos-tab-gasto-neumaticos-form.component.scss']
})
export class ImportadoraEgresosTabGastoNeumaticosFormComponent implements OnInit {

  idEmpresa = 9;
  sucursales!: Sucursal[];
  empresa = new Empresa();
  montoTotal !: number;
  montoTotal2 !: number;
  montoTotalNeumatico !: number;
  cantidadTipo !:number;
  costoComision  !: number;
  costoInterior  !: number;
  costoMaritimo !: number;
  seguros !: number;
  impuestoProntuario !: number;
  impuestoProntuario2 !: number;
  idConteiner!: any;
  nameRespaldo = '';
  costoNeumatico2 !: number;
  montoTotalLote !: number;
  impuestoLote !: number;
  text = 0; //initialised the text variable 

  //Validadores
  existeConteiner !: Boolean;
  cantidadNeumaticos !:  number;
  porcentajeConteiner !: number;
  
<<<<<<< HEAD
=======

>>>>>>> a39eea546d51dcd7ad258fb4ca8e6a665bf9dabf

  container = new EgresosContainerImportadora();
  neumatico = new EgresosNeumaticoImportadora();
  


  listaNeumatico: EgresosNeumaticoImportadora[] = [];

  dataSource: MatTableDataSource<EgresosNeumaticoImportadora> = new MatTableDataSource();
  fechaCompromisoCuota : any;

  saldoPendiente = 0;
  usuario: Usuario = JSON.parse(localStorage.getItem('usuario') + '');
  idCliente = localStorage.getItem("idCliente");
  nombreClienteLocal = localStorage.getItem("nombreCliente");
  

// Variables que permiten realizar los filtros
  addressFormConteiner = this.fb.group({
    fecha: ['', Validators.required],
    idSucursal: ['', Validators.required],
    nContainer: ['', Validators.required],
    costoNeumatico: ['', Validators.required],
    costoComision: ['', Validators.required],
    costoInterior: ['', Validators.required],
    costoMaritimo: ['', Validators.required],
    impuestoProntuario: ['', Validators.required],
    seguros: ['', Validators.required],
    cantidadTipo: ['', Validators.required],
  });

// Variables que permiten realizar los filtros
  addressFormNeumatico = this.fb.group({
    tipoNeumatico: ['', Validators.required],
    cantidad: ['', Validators.required],
    pContainer: ['', Validators.required],
    pGanancia: ['', Validators.required],
    costoUnitarioN: ['', Validators.required],
  });

  displayedColumns: string[] = [    
    'unitarioNuevo',
    'totalTipoNeumatico',
    'neumatico',
    'cantidad',
    'conteiner', 
    'comision',
    'interior',
    'maritimo',
    'portuario',
    'seguros',
    'unitario',    
    'total',        
    'ganancia',
    'totalVenta',
    'costoNeumatico',                
  ];

  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sucursalService: SucursalSharedService,
    private empresaService: EmpresaSharedService,
    private snackBar: MatSnackBar,
    private importadoraService: ImportadoraService,
    public dialog: MatDialog,
    private decimalPipe: DecimalPipe
  ) { 
    this.sucursales = this.sucursalService.sucursalListValue;
  }

  
  ngOnInit(): void {
    this.obtenerEmpresa(this.idEmpresa);
    this.existeConteiner = false;
    this.porcentajeConteiner = 100;
    this.cantidadNeumaticos = 0;          
  }

  onKeyUp(x: any) { // appending the updated value to the variable            
    this.text = x.target.value * 0.03;
  }

  //Metodo que ayuda a obtener los valores del formulario
  get f(): any {
    return this.addressFormConteiner.controls;
  }

  //Metodo que ayuda a obtener los valores del formulario
  get c(): any {
    return this.addressFormNeumatico.controls;
  }

  //Metodo que los datos del contrato (formulario) esten correctos
  validarConteiner(){
    this.existeConteiner = true;
    switch (this.addressFormConteiner.status) {
      case 'VALID':
        const dialogRef = this.dialog.open(DialogRespaldosComponent, {

          data: { url: 'egresoContainerImportadora/upload' }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.nameRespaldo = result;
          this.container.RespaldoEgresoContainerImportadoras = [];
          this.container.id;
          this.container.fecha = this.f.fecha.value;
          this.container.idSucursal = this.f.idSucursal.value;
          this.container.nContainer = this.f.nContainer.value;
          this.container.costoComision = this.f.costoComision.value;
          this.container.costoInterior = this.f.costoInterior.value;
          this.container.costoMaritimo = this.f.costoMaritimo.value;
          this.container.costoNeumatico = this.f.costoNeumatico.value;
          this.costoNeumatico2 = this.f.costoNeumatico.value;
          this.container.impuestoProntuario = this.f.impuestoProntuario.value;
          this.impuestoProntuario2 = this.f.impuestoProntuario.value;
          this.container.seguros = this.f.seguros.value;
          this.container.montoTotal = this.f.costoComision.value + this.f.costoInterior.value + this.f.costoMaritimo.value + this.f.costoNeumatico.value + this.f.impuestoProntuario.value+ this.f.seguros.value;                    


          this.container.idUsuario = this.usuario.id;
          this.montoTotal = this.container.montoTotal;
          this.cantidadTipo = this.f.cantidadTipo.value;
          this.cantidadNeumaticos = this.cantidadTipo;

          //Se le agrega los respaldos subidos
          for (const name of this.nameRespaldo) {
            this.container.RespaldoEgresoContainerImportadoras.push({ url: name });
          }
          //Si todo esta correcto se ingresa el objeto
          if (result.length > 0) {
              this.importadoraService
              .createEgresosConteiner(this.container)
              .pipe()
              .pipe()
              .subscribe((x: any) => {
                this.snackBar.open('Egreso Registrado', 'cerrar', {
                  duration: 2000,
                  verticalPosition: 'top',
                });
                this.idConteiner = x.payload.id;
                this.existeConteiner = true;
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

  //Metodo que permite agregar las cuotas a una tabla 
<<<<<<< HEAD
  agregarCuotas(): any{
    console.log(this.container);
=======
  agregarNeumatico(): any{

>>>>>>> a39eea546d51dcd7ad258fb4ca8e6a665bf9dabf
    //Si el monto de las cuotas es menor al saldo pendiente 
    if (this.montoTotal >= 0 && (this.porcentajeConteiner - this.c.pContainer.value)  >= 0 && (this.cantidadNeumaticos - 1) >= 0) {
      switch (this.addressFormNeumatico.status) {
        case 'VALID':
              this.neumatico.idContainer = this.idConteiner;
              this.neumatico.tipoNeumatico = this.c.tipoNeumatico.value;
              this.neumatico.cantidad = this.c.cantidad.value;
              this.neumatico.pContainer = this.c.pContainer.value;              
              this.neumatico.unitarioChino = this.c.costoUnitarioN.value;
        
              this.neumatico.costoNeumatico = (this.container.costoNeumatico * (this.c.pContainer.value /100));              
              this.neumatico.costoComision = (this.container.costoComision * (this.c.pContainer.value /100));              
              this.neumatico.costoInterior = (this.container.costoInterior * (this.c.pContainer.value /100));              
              this.neumatico.costoMaritimo = (this.container.costoMaritimo * (this.c.pContainer.value /100));                            
              this.neumatico.seguros = (this.container.seguros * (this.c.pContainer.value /100));
              this.neumatico.impuestoProntuario = (this.container.impuestoProntuario * (this.c.pContainer.value /100));              
        
              
              this.neumatico.montoTotal = this.neumatico.costoComision + this.neumatico.costoInterior + this.neumatico.costoMaritimo + this.neumatico.impuestoProntuario + this.neumatico.costoNeumatico;                                                        
              this.neumatico.valorUnitario = this.neumatico.montoTotal / this.c.cantidad.value;                            
              this.montoTotalNeumatico = this.neumatico.costoComision + this.neumatico.costoInterior + this.neumatico.costoMaritimo + this.neumatico.seguros + this.neumatico.impuestoProntuario + this.neumatico.costoNeumatico;                                        
              
              this.neumatico.unitarioNuevo = this.neumatico.unitarioChino;
              this.neumatico.totalTipoNeumatico = this.neumatico.unitarioChino * this.c.cantidad.value;
              this.neumatico.costoComision = this.neumatico.totalTipoNeumatico * 0.03;               
              this.neumatico.impuestoProntuario = (this.impuestoProntuario2 /this.costoNeumatico2) * this.neumatico.totalTipoNeumatico;              
              this.montoTotal2 = this.neumatico.costoComision + this.neumatico.costoInterior + this.neumatico.costoMaritimo + this.neumatico.impuestoProntuario + this.neumatico.seguros;              
              this.neumatico.valorUnitario = (this.montoTotal2 / this.c.cantidad.value) + this.neumatico.unitarioNuevo;
              
              this.montoTotalLote = this.neumatico.valorUnitario * this.c.cantidad.value;
              this.neumatico.montoTotal = this.neumatico.valorUnitario * this.c.cantidad.value;
              
              this.neumatico.pGanancia = this.c.pGanancia.value;              
              this.neumatico.costoNeumatico = this.neumatico.valorUnitario + (this.neumatico.valorUnitario * (this.c.pGanancia.value/100));              
              this.neumatico.totalVenta = this.neumatico.costoNeumatico * this.c.cantidad.value;                                        
              this.impuestoLote = ((this.neumatico.totalVenta / 1.19) * 0.19) - this.neumatico.impuestoProntuario;                                          
              this.neumatico.utilidad = (this.neumatico.totalVenta - this.montoTotalLote) - this.impuestoLote;              

<<<<<<< HEAD
      
      this.neumatico.costoComision = (this.container.costoComision * (this.c.pContainer.value /100))/this.c.cantidad.value;
      this.neumatico.costoInterior = (this.container.costoInterior * (this.c.pContainer.value /100))/this.c.cantidad.value;
      this.neumatico.costoMaritimo = this.container.costoMaritimo/this.cantidadTipo;
      this.neumatico.seguros = this.container.seguros/this.cantidadTipo;
      this.neumatico.impuestoProntuario = (this.container.impuestoProntuario * (this.c.pContainer.value /100))/this.c.cantidad.value;

      this.neumatico.montoTotal = this.neumatico.costoComision + this.neumatico.costoInterior + this.neumatico.costoMaritimo + this.neumatico.seguros + this.neumatico.impuestoProntuario;
      this.neumatico.valorUnitario = this.neumatico.montoTotal / this.c.cantidad.value;
      this.neumatico.pGanancia = this.neumatico.valorUnitario + (this.c.pGanancia.id * (this.c.pGanancia.value/100));
      this.listaNeumatico.push(this.neumatico);
      
      this.montoTotal = this.montoTotal - this.neumatico.montoTotal;
      // this.saldoPendiente = this.saldoPendiente - this.cuota.montoCuota;
      this.neumatico = new EgresosNeumaticoImportadora();
      this.dataSource = new MatTableDataSource(this.listaNeumatico);
=======
              
              

              this.listaNeumatico.push(this.neumatico);
              this.neumatico = new EgresosNeumaticoImportadora();
              this.dataSource = new MatTableDataSource(this.listaNeumatico);

              //Validadores
              this.montoTotal = this.montoTotal - this.montoTotalNeumatico;
              this.porcentajeConteiner = this.porcentajeConteiner - this.c.pContainer.value;
              this.cantidadNeumaticos = this.cantidadNeumaticos - 1;

          break;
>>>>>>> a39eea546d51dcd7ad258fb4ca8e6a665bf9dabf

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
    //Si no se muestra el error
    else {
      alert('monto no coincide con saldo pendiente');
    }
  }

  //Metodo que permite guardar el contrato
<<<<<<< HEAD
  guardarContrato(){
    // this.abogadosTabService
    //   .guardarCuotas(this.listaCuotas)
    //   .pipe()
    //   .subscribe((x:any) => {
    //     this.abogadosService.closeDialogModal();
    //     this.listaCuotas = [];
    //     this.snackBar.open('Contato generado con exito', 'cerrar', {
    //       duration: 2000,
    //       verticalPosition: 'top',
    //     });
    //   });
=======
  guardarConteiner(){
   
    if(this.montoTotal == 0 && this.listaNeumatico.length > 0 && this.porcentajeConteiner <= 1 && this.cantidadNeumaticos == 0){
        this.importadoraService
        .guardarNeumaticos(this.listaNeumatico)
        .pipe()
        .subscribe((x:any) => {
          this.snackBar.open('Conteiner guardado con exito', 'cerrar', {
            duration: 2000,
            verticalPosition: 'top',
          });
          this.addressFormConteiner.reset();
          this.addressFormNeumatico.reset();
          this.existeConteiner = false;
          this.listaNeumatico = [];
        });
   }else{
        this.snackBar.open('Aun queda monto por asignar o no se ha ingresado ningún neumático', 'cerrar', {
          duration: 2000,
          verticalPosition: 'top',
        });
   }
>>>>>>> a39eea546d51dcd7ad258fb4ca8e6a665bf9dabf
  }

  obtenerEmpresa(id: number): any {
    this.empresaService
      .getByIdWithSucursales(id)
      .pipe(first())
      .subscribe((x) => {
        x.Sucursals = Object.values(x.Sucursals);
        this.empresa = x;
      });
  }

  volverVistaAtigua() {    
    this.router.navigate(['/importadora']);
  }

}
