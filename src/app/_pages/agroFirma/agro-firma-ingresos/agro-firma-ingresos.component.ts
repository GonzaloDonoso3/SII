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

  idProyectoPadre!: Observable<number>
  dataSource: MatTableDataSource<ProyectoAgrofirma> = new MatTableDataSource();
  proyectos: ProyectoAgrofirma[] = [];
  idProyecto: null;

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
    this.idProyectoPadre = idProyecto;
    this.modalService.open(idModal);

    this.router.navigate(['agrofirma/ingresos/add', idProyecto]);
    localStorage.setItem("proyectoID", idProyecto);
  }

  closeModal(id: any): void{
    this.modalService.close(id);
    this.router.navigate(['agrofirma/ingresos']);
  }

}
