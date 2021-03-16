import { Component, OnInit } from '@angular/core';
import { Empresa } from '@app/_models/shared/empresa';
import { Sucursal } from '@app/_models/shared/sucursal';
import { EmpresaSharedService } from '@app/_pages/shared/shared-services/empresa-shared.service';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';

@Component({
  selector: 'app-lubricentro-egresos',
  templateUrl: './lubricentro-egresos.component.html',
  styleUrls: ['./lubricentro-egresos.component.scss']
})
export class LubricentroEgresosComponent implements OnInit {


  sucursales: Sucursal[] = [];
  empresa: Empresa = new Empresa();
  refrescar = '';
  constructor(
    private sucursalService: SucursalSharedService,
    private empresaService: EmpresaSharedService,
  ) {
    this.empresaService.getAll().subscribe(empresas => {
      const empresa = empresas.filter(data => data.razonSocial.includes('LUBRICENTRO'));

      this.sucursalService.getByEmpresa(empresa[0].id);

    });
  }

  formularioListo(e: string): void {

    this.ngOnInit();
    this.refrescar = e;
  }
  ngOnInit(): void {

  }

}
