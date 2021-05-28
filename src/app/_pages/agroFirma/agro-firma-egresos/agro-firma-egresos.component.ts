import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit } from '@angular/core';
import { AgroFirmaService } from '@app/_pages/agroFirma/agro-firma.service';
import { Empresa } from '@app/_models/shared/empresa';
import { EmpresaSharedService } from '@app/_pages/shared/shared-services/empresa-shared.service';
import { ProyectoAgrofirma } from '@app/_models/agroFirma/proyectoAgroFirma';
import { EgresoHostal } from '@app/_models/hostal/egresoHostal';

@Component({
  selector: 'app-agro-firma-egresos',
  templateUrl: './agro-firma-egresos.component.html',
  styleUrls: ['./agro-firma-egresos.component.scss']
})
export class AgroFirmaEgresosComponent implements OnInit {

  //Creación de variables y asignación de datos
  dataSource: MatTableDataSource<ProyectoAgrofirma> = new MatTableDataSource();
  dataEgresos: ProyectoAgrofirma[] = [];

  proyectos: any[] = [];
  empresa: Empresa = new Empresa();

  constructor(
    private agroFirmaService:  AgroFirmaService,
    private empresaService: EmpresaSharedService,
  ) { }

  ngOnInit(): void {
    //this.getproyectos();
  }
  
  getproyectos(){
    this.agroFirmaService.GetAllProyectos().subscribe((data: ProyectoAgrofirma[]) => {            
       this.proyectos = data;
       console.log("consultando a la api", this.proyectos)
      });
  }
}
