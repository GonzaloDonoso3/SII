import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-rentacar-modal-detalle-pagos-extras',
  templateUrl: './rentacar-modal-detalle-pagos-extras.component.html',
  styleUrls: ['./rentacar-modal-detalle-pagos-extras.component.scss']
})
export class RentacarModalDetallePagosExtrasComponent implements OnInit {

  @Input() arrayPagosExtra: any
  constructor() { }

  ngOnInit(): void {
  }

}
