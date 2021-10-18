import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-prestamos-ingresos-egresos',
  templateUrl: './prestamos-ingresos-egresos.component.html',
  styleUrls: ['./prestamos-ingresos-egresos.component.scss']
})
export class PrestamosIngresosEgresosComponent implements OnInit {
  refrescar = '';

  constructor() { }

  formularioListo(e: string): void {

    this.ngOnInit();
    this.refrescar = e;
  }

  ngOnInit(): void {
  }

}
