import { Component, OnInit } from '@angular/core';
import { DialogContratosComponent } from './dialog-contratos/dialog-contratos.component';
import { MatDialog } from '@angular/material/dialog';
import { AbogadosService } from '../../abogados.service';



@Component({
  selector: 'app-abogados-ingresos-acciones',
  templateUrl: './abogados-ingresos-acciones.component.html',
  styleUrls: ['./abogados-ingresos-acciones.component.scss']
})
export class AbogadosIngresosAccionesComponent implements OnInit {

  constructor(
    public dialog:MatDialog,
    private abogadosService: AbogadosService,
    ) { }

  ngOnInit(): void {
  }


  openDialogContratos():void{
    this.abogadosService.openDialogContratos();
  }
}
