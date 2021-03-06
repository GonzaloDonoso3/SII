import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';
import { Sucursal } from '@app/_models/shared/sucursal';
import { Empresa } from '@app/_models/shared/empresa';
import { EmpresaSharedService } from '@app/_pages/shared/shared-services/empresa-shared.service';
import { first } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbogadosTabsService } from '../../../abogados-tabs.service';
import { nuevoContrato } from '../../../../../_models/abogados/nuevoContrato';
import { nuevaCuota } from '../../../../../_models/abogados/nuevaCuota';
import { Usuario } from '@app/_models/shared/usuario';
import { AbogadosService } from '../../../abogados.service';


@Component({
  selector: 'app-dialog-contratos',
  templateUrl: './dialog-contratos.component.html',
  styleUrls: ['./dialog-contratos.component.scss']
})
export class DialogContratosComponent implements OnInit {

  idEmpresa = 2;
  sucursales!: Sucursal[];
  empresa = new Empresa();
  
  contrato = new nuevoContrato();
  cuota = new nuevaCuota();
  listaCuotas : nuevaCuota[] = [];
  dataSource: MatTableDataSource<nuevaCuota> = new MatTableDataSource();
  fechaCompromisoCuota : any;

  saldoPendiente = 0;
  usuario: Usuario = JSON.parse(localStorage.getItem('usuario') + '');
  idCliente = localStorage.getItem("idCliente");
  nombreClienteLocal = localStorage.getItem("nombreCliente");
  

// Variables que permiten realizar los filtros
  addressFormContrato = this.fb.group({
    fechaContrato: ['', Validators.required],
    idSucursal: ['', Validators.required],
    montoContrato: ['', Validators.required],
    nContrato: ['', Validators.required],
  });

// Variables que permiten realizar los filtros
  addressFormCuotas = this.fb.group({
    fechaCuota: ['', Validators.required],
    montoCuota: ['', Validators.required],
  });

  displayedColumns: string[] = [
    'fecha',
    'montoCuotaTabla',
  ];

  constructor(
    private fb: FormBuilder,
    private sucursalService: SucursalSharedService,
    private empresaService: EmpresaSharedService,
    private abogadosTabService: AbogadosTabsService,
    private snackBar: MatSnackBar,
    private abogadosService: AbogadosService,
  ) { 
    this.sucursales = this.sucursalService.sucursalListValue;
  }

  
  ngOnInit(): void {
    this.obtenerEmpresa(this.idEmpresa);
  }

  //Metodo que ayuda a obtener los valores del formulario
  get f(): any {
    return this.addressFormContrato.controls;
  }

  //Metodo que ayuda a obtener los valores del formulario
  get c(): any {
    return this.addressFormCuotas.controls;
  }

  //Metodo que los datos del contrato (formulario) esten correctos
  validarContrato(){
    this.contrato.id;
    this.contrato.fechaContrato = this.f.fechaContrato.value;
    this.contrato.idSucursal = this.f.idSucursal.value;
    this.contrato.montoContrato = this.f.montoContrato.value;
    this.contrato.nContrato = this.f.nContrato.value;
    this.fechaCompromisoCuota = this.f.fechaContrato.value;

    this.contrato.saldoPendiente = this.f.montoContrato.value;
    this.contrato.idCliente = Number(this.idCliente);
    this.contrato.idUsuario = this.usuario.id;
    
    this.contrato.estadoPago = 'pendiente';

    //Si el contrato no existe se crea
    this.abogadosTabService
      .crearSinoExisteContrato(this.contrato)
      .pipe()
      .subscribe((x: any) => {
        this.snackBar.open(x.respuesta, 'cerrar', {
          duration: 2000,
          verticalPosition: 'top',
        });
        this.contrato = x.contrato;
        this.saldoPendiente = this.contrato.montoContrato;
      });
  }

  //Metodo que permite agregar las cuotas a una tabla 
  agregarCuotas(): any{
    this.cuota.montoCuota = this.c.montoCuota.value;
    //Si el monto de las cuotas es menor al saldo pendiente 
    if (this.cuota.montoCuota <= this.saldoPendiente) {
      this.cuota.estado = 'pendiente';
      this.cuota.fechaPago = this.c.fechaCuota.value;
      this.cuota.idContrato = this.contrato.id;
      this.cuota.idUsuario = this.usuario.id;
      this.listaCuotas.push(this.cuota);
      
      this.saldoPendiente = this.saldoPendiente - this.cuota.montoCuota;
      this.cuota = new nuevaCuota();
      this.dataSource = new MatTableDataSource(this.listaCuotas);
    } 
    //Si no se muestra el error
    else {
      alert('monto no coincide con saldo pendiente');
    }
  }

  //Metodo que permite guardar el contrato
  guardarContrato(){
    this.abogadosTabService
      .guardarCuotas(this.listaCuotas)
      .pipe()
      .subscribe((x:any) => {
        this.abogadosService.closeDialogModal();
        this.listaCuotas = [];
        this.snackBar.open('Contato generado con exito', 'cerrar', {
          duration: 2000,
          verticalPosition: 'top',
        });
      });
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
}
