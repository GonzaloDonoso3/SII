import { Component, OnInit } from '@angular/core';
import { Empresa } from '@app/_models/shared/empresa';
import { Sucursal } from '@app/_models/shared/sucursal';
import { EmpresaSharedService } from '@app/_pages/shared/shared-services/empresa-shared.service';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';

@Component({
  selector: 'app-lubricentro-home',
  templateUrl: './lubricentro-home.component.html',
  styleUrls: ['./lubricentro-home.component.scss']
})
export class LubricentroHomeComponent implements OnInit {


  sucursales: Sucursal[] = [];
  empresa: Empresa = new Empresa();
  refrescar = '';
  constructor(
    private sucursalService: SucursalSharedService,
    private empresaService: EmpresaSharedService,
  ) {
    this.empresaService.getAll().subscribe(data => {
      const empresa = data.filter(data => data.razonSocial.includes('LUBRICENTRO'));

      this.sucursalService.getByEmpresa(empresa[0].id).subscribe(data => {
        const sucursales = data;
        console.log(data);
      });

    });

  }

  formularioListo(e: string): void {

    this.ngOnInit();
    this.refrescar = e;
  }
  ngOnInit(): void {

  }

}
