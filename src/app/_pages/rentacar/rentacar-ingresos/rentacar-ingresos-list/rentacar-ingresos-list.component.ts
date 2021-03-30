import { RentacarService } from './../../rentacar.service';
import { Component, OnInit } from '@angular/core';
import { AlertHelper } from '@app/_helpers/alert.helper';
import { ResponseListaArriendos, Arriendo } from '@app/_models/rentacar/responseListaArriendos';

@Component({
  selector: 'app-rentacar-ingresos-list',
  templateUrl: './rentacar-ingresos-list.component.html',
  styleUrls: ['./rentacar-ingresos-list.component.scss']
})
export class RentacarIngresosListComponent implements OnInit {

  arriendos: Arriendo[] = [];

  totalEsperadoSeleccion = 0;
  totalPagadoSeleccion = 0;


  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];


  dataSource = [
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  ];



  constructor(private rentacarService: RentacarService, private alert: AlertHelper) { }

  ngOnInit(): void {
    this.cargarListaPagosArriendos();
  }

  cargarListaPagosArriendos() {
    this.rentacarService.getListaPagosArriendos().subscribe((response: ResponseListaArriendos) => {
      if (response.success) {
        this.arriendos = response.data;
        console.log(this.arriendos)
      } else {
        this.alert.errorAlert('Error al cargar los pagos , intete nuevamente');
      }
    })
  }

  limpiarFiltros() {

  }

  revelarTotal() {

  }

}
