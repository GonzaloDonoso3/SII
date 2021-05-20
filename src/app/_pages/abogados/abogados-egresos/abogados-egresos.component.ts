import { Component, OnInit } from '@angular/core';
import { Empresa } from '@app/_models/shared/empresa';
import { Sucursal } from '@app/_models/shared/sucursal';
import { EmpresaSharedService } from '@app/_pages/shared/shared-services/empresa-shared.service';
import { SucursalSharedService } from '@app/_pages/shared/shared-services/sucursal-shared.service';

@Component({
  selector: 'app-abogados-egresos',
  templateUrl: './abogados-egresos.component.html',
  styleUrls: ['./abogados-egresos.component.scss']
})
export class AbogadosEgresosComponent implements OnInit {
  sucursales: Sucursal[] = [];
  empresa: Empresa = new Empresa();
  refrescar = '';
  constructor(
    private sucursalService: SucursalSharedService,
    private empresaService: EmpresaSharedService,
  ) {
    this.empresaService.getAll().subscribe(empresas => {
      const empresaFound = empresas.filter(empresa => empresa.razonSocial.includes('FIRMA ABOGADOS'));

      this.sucursalService.getByEmpresa(empresaFound[0].id).subscribe(sucursales => {
        this.sucursales = sucursales;
      });
    });
  }
  formularioListo(e: string): void {

    this.ngOnInit();
    this.refrescar = e;
  }
  ngOnInit(): void {

  }}
