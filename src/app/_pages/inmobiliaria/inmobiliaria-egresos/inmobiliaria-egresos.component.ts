import { Component, OnInit } from '@angular/core';
import { Empresa } from '@app/_models/shared/empresa';
import { Sucursal } from '@app/_models/shared/sucursal';
import { EmpresaSharedService } from '@app/_pages/shared/shared-services/empresa-shared.service';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';

@Component({
  selector: 'app-inmobiliaria-egresos',
  templateUrl: './inmobiliaria-egresos.component.html',
  styleUrls: ['./inmobiliaria-egresos.component.scss']
})
export class InmobiliariaEgresosComponent implements OnInit {

  //Obtener datos de las sucursales
  sucursales: Sucursal[] = [];
  empresa: Empresa = new Empresa();
  refrescar = '';
  constructor(
    private sucursalService: SucursalSharedService,
    private empresaService: EmpresaSharedService,
  ) {
    this.empresaService.getAll().subscribe(empresas => {
      const empresaFound = empresas.filter(data => data.razonSocial.includes('INMOBILIARIA'));

      this.sucursalService.getByEmpresa(empresaFound[0].id).subscribe(sucursales => {
        this.sucursales = sucursales;
      });

    });
  }

  //Definir que el formulario esta listo
  formularioListo(e: string): void {

    this.ngOnInit();
    this.refrescar = e;
  }

  ngOnInit(): void {
  }

}
