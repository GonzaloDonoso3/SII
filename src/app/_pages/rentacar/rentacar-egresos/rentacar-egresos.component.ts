import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rentacar-egresos',
  templateUrl: './rentacar-egresos.component.html',
  styleUrls: ['./rentacar-egresos.component.scss']
})
export class RentacarEgresosComponent implements OnInit {

  refrescar = '';
  constructor() { }

  ngOnInit(): void {
  }

  //Definir que el formulario esta listo
  formularioListo(e: string): void {

    this.ngOnInit();
    this.refrescar = e;
  }


}
