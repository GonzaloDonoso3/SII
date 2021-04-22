import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rentacar-ingresos',
  templateUrl: './rentacar-ingresos.component.html',
  styleUrls: ['./rentacar-ingresos.component.scss']
})
export class RentacarIngresosComponent implements OnInit {

  refrescar = '';

  constructor() { }

  ngOnInit(): void {
  }

  formularioListo(e: string): void {
    this.ngOnInit();
    this.refrescar = e;
  }


}
