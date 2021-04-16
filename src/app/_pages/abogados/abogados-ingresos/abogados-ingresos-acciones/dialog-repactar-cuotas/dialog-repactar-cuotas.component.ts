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
  
  idContrato = localStorage.getItem("idContratoPago");
  nombreClienteLocal = localStorage.getItem("nombreCliente");
  contratoR !: any;

  addressFormContrato = this.fb.group({
    fechaCuota: ['', Validators.required],
    montoCuota: ['', Validators.required],
    cantidadCuota: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private abogadosTabsService: AbogadosTabsService,
    private abogadosService: AbogadosService
  ) { }

  ngOnInit(): void {
    this.getContratosCliente();
  }

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


}
