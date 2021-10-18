import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AgroFirmaService } from '../agro-firma.service';
import { ProyectoAgrofirma } from '@app/_models/agroFirma/proyectoAgroFirma';
import { MatDialog } from '@angular/material/dialog';
import { ModalService } from '@app/_components/_modal';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-agro-firma-ingresos',
  templateUrl: './agro-firma-ingresos.component.html',
  styleUrls: ['./agro-firma-ingresos.component.scss']
})
export class AgroFirmaIngresosComponent implements OnInit {

  projectId!: Observable<number>
  dataSource: MatTableDataSource<ProyectoAgrofirma> = new MatTableDataSource();
  proyectos: ProyectoAgrofirma[] = [];
  idProyecto!: null
  updateTime!: number

  constructor(
    private agroFirmaService: AgroFirmaService,
    public dialog: MatDialog,
    private modalService: ModalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.agroFirmaService.GetAllProyectos()
    .subscribe((proyectos: any) => {
      this.proyectos = proyectos;
    });
  }

  formulario(idModal: any, idProyecto: any): void {
    this.projectId = idProyecto;
    this.modalService.open(idModal);

    this.router.navigate(['agrofirma/ingresos/add', idProyecto]);
    localStorage.setItem("proyectoID", idProyecto);
  }

  openCreateBankAccountModal(modalId: any, projectId: any) {
    this.projectId = projectId
    this.modalService.open(modalId)
  }

  closeModal(id: any): void{
    this.modalService.close(id);
    this.router.navigate(['agrofirma/ingresos']);
  }

  formReady(datetime: number): void {
    this.updateTime = datetime
  }

}
