import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-rentacar-modal-detalle-pagos-danios',
  templateUrl: './rentacar-modal-detalle-pagos-danios.component.html',
  styleUrls: ['./rentacar-modal-detalle-pagos-danios.component.scss']
})
export class RentacarModalDetallePagosDaniosComponent implements OnInit {

  @Input() arrayPagosDanio: any
  constructor() { }

  ngOnInit(): void {
  }

}
