import { Component, OnInit, ViewChildren, QueryList, SimpleChanges } from '@angular/core';
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
import { Contrato } from '../../../../../_models/abogados/contrato';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-dialog-repactar-cuotas',
  templateUrl: './dialog-repactar-cuotas.component.html',
  styleUrls: ['./dialog-repactar-cuotas.component.scss']
})
export class DialogRepactarCuotasComponent implements OnInit {

  // ? childrens
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  // ? table definitions.
  displayedColumns: string[] = [
    'fecha',
    'monto',
    'estadoPago'
  ];
  dataSource: MatTableDataSource<Contrato> = new MatTableDataSource();
  dataContrato: Contrato[] = [];

  displayedColumns2: string[] = [
    'fechaCuotaTabla',
    'montoCuotaTabla',
  ];
  dataSourceCuotas: MatTableDataSource<nuevaCuota> = new MatTableDataSource();
  
  idContrato = localStorage.getItem("idContratoPago");
  nombreClienteLocal = localStorage.getItem("nombreCliente");
  contratoR !: any;
  cuotas !: any;
  datos !: any;

  addressFormContrato = this.fb.group({
    fechaCuota: ['', Validators.required],
    montoCuota: ['', Validators.required],
    cantidadCuota: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private abogadosTabsService: AbogadosTabsService,
    private abogadosService: AbogadosService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.getContratosCliente();
  }

  //Se obtienen los contratos del cliente desde la BD
  getContratosCliente(){
    //Carga Tabla 
    this.abogadosTabsService
    .obtenerContratoNumero(this.idContrato)
    .pipe()
    .subscribe((x: any) => {
     this.dataSource = new MatTableDataSource(x.CuotasContratos);
     this.dataSource.paginator = this.paginator.toArray()[0];
     this.contratoR = x;
     console.log(this.contratoR);
   });
  }

  get f(): any {
    return this.addressFormContrato.controls;
  }

  //Se calculan las cuotas segun los datos ingresados 
  calcularCuotas(): void {
    this.cuotas = [];
    this.datos = new nuevaCuota();
    this.datos.idContrato = this.idContrato;
    this.datos.nCuotas = this.f.cantidadCuota.value;
    this.datos.montoInicial = this.f.montoCuota.value;
    this.datos.fechaInicio = this.f.fechaCuota.value;
    this.abogadosTabsService
      .calcularCuotas(this.datos)
      .pipe()
      .subscribe((x:any) => {
        this.cuotas = x;
        this.dataSourceCuotas = new MatTableDataSource(this.cuotas);
      });
  }

  //Con este metodo se realiza finalmente la repactación
  repactar(): void {
    this.abogadosTabsService
      .repactarContrato(this.contratoR.CuotasContratos, this.cuotas)
      .subscribe((x:any) => {
        console.log(x);
      });
      this.abogadosService.closeDialogModal();
      this.snackBar.open('Cuotas repactadas con exito', 'cerrar', {
        duration: 2000,
        verticalPosition: 'top',
      });
  }
   // Cerrar Dialog
   closeDialog(){
    this.abogadosService.closeDialogModal();
   }

}
