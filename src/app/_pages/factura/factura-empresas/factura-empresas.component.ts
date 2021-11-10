import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AlertHelper } from '@app/_helpers/alert.helper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FacturaService } from '@app/_pages/factura/factura.service';
import { PrestamosService } from '@app/_pages/prestamos/prestamos.service';
import { EmpresaSharedService } from '@app/_pages/shared/shared-services/empresa-shared.service';
import { first } from 'rxjs/operators';
import { Empresa } from '@app/_models/shared/empresa';

@Component({
  selector: 'app-factura-empresas',
  templateUrl: './factura-empresas.component.html',
  styleUrls: ['./factura-empresas.component.scss']
})
export class FacturaEmpresasComponent implements OnInit {

  listaEmpresas: any = [];

  listaProductosServicios: any = [];
  identificador: number = 0;
  totalNeto: number = 0;
  totalIVA: number = 0;
  netoIVA: number = 0;


  arraylist: any = [];
  factura: any[] = [];
  arrayEmpresa: any = [];
  //empresas: Empresa[] = [];
  dataEmpresa: Empresa[] = [];

  addressForm = this.fb.group({
    empresa: [null, Validators.required],
    rutReceptor: [null, Validators.required],
    razonSocialR: [null, Validators.required],
    comuna: [null, Validators.required],
    giro: [null, Validators.required],
    direccion: [null, Validators.required],
    ciudad: [null, Validators.required],
    productoServicio: [null],
    descripcion: [null],
    cantidad: [null],
    precio: [null],
    descuento: [null],
    totalNeto: [null],
    totalIVA: [null],
    netoIVA: [null]
  })


  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private facturaService: FacturaService,
    private prestamosService: PrestamosService,
    private empresaService: EmpresaSharedService,
    private alert: AlertHelper
  ) { }

  ngOnInit(): void {
    this.ListaProdcutosServicios();
    //this.getEmpresa();
    this.ObtenerEmpresas();
  }

  ObtenerEmpresas() {
    let lista: any = [];
    let empresa = {
      identificador: "",
      rutRepresentante: "",
      contrasena: "",
      rut: "",
      razonSocial: "",
      actividadEconomica: "",
      comuna: "",
      giro: "",
      direccion: "",
      telefono: ""
    };
    this.empresaService.getAll().pipe(first()).subscribe((respuesta) => {
      lista = respuesta;
      for (let objeto of lista) {
        empresa.rutRepresentante = objeto.rutRepresentante;
        empresa.contrasena = objeto.contrasena;
        empresa.rut = objeto.rut;
        empresa.razonSocial = objeto.razonSocial;
        empresa.actividadEconomica = objeto.actividadEconomica;
        empresa.comuna = objeto.comuna;
        empresa.giro = objeto.giro;
        empresa.direccion = objeto.direccion;
        empresa.telefono = objeto.telefono;
        this.listaEmpresas.push(empresa);
      }
    });
  }

  /*
  getEmpresa(): any {
    this.empresaService.getAll().pipe(first()).subscribe((e) => {

      console.log("jjjjjjj", e)
      this.arraylist = e;
      for (const data of this.arraylist) {
        this.factura.push(data.razonSocial);
        // this.arrayEmpresa.push(this.factura.razonSocial);
      }
      // this.factura.razonSocial = this.arrayEmpresa;
    });
  }
  */

  onSubmit() {
  }

  ListaProdcutosServicios() {
    this.listaProductosServicios;
  }

  AgregarProductoServicio() {
    let identificador = this.identificador++;
    let nombre = this.addressForm.controls['productoServicio'].value;
    let descripcion = this.addressForm.controls['descripcion'].value;
    let cantidad = this.addressForm.controls['cantidad'].value;
    let precio = this.addressForm.controls['precio'].value;
    let descuentoPorcentaje = this.addressForm.controls['descuento'].value;
    let x = (cantidad * precio) * (descuentoPorcentaje / 100);
    let y = (cantidad * precio) - ((cantidad * precio) * (descuentoPorcentaje / 100));
    let descuento = x.toFixed();
    let subTotal = y.toFixed();
    let productoServicio = {
      "identificador": identificador,
      "nombre": nombre,
      "descripcion": descripcion,
      "cantidad": cantidad,
      "precio": precio,
      "descuentoPorcentaje": descuentoPorcentaje,
      "descuento": descuento,
      "subTotal": subTotal,
    };
    this.listaProductosServicios.push(productoServicio);
    this.totalNeto = this.totalNeto + (cantidad * precio);
    this.totalIVA = (this.totalNeto * 19) / 100;
    this.netoIVA = (this.totalNeto + this.totalIVA);
    let iva = this.totalIVA.toFixed();
    let netoiva = this.netoIVA.toFixed();
    this.addressForm.controls['totalNeto'].setValue(this.totalNeto);
    this.addressForm.controls['totalIVA'].setValue(iva);
    this.addressForm.controls['netoIVA'].setValue(netoiva);
    this.ListaProdcutosServicios();
    this.addressForm.controls['productoServicio'].setValue("");
    this.addressForm.controls['descripcion'].setValue("");
    this.addressForm.controls['cantidad'].setValue("");
    this.addressForm.controls['precio'].setValue("");
    this.addressForm.controls['descuento'].setValue("");
  }

  QuitarProductoServicio(identificador: number) {
    for (let i = 0; i < this.listaProductosServicios.length; i++) {
      if (identificador === this.listaProductosServicios[i].identificador) {
        this.totalNeto = this.totalNeto - this.listaProductosServicios[i].cantidad * this.listaProductosServicios[i].precio;
        this.totalIVA = this.totalNeto * 19 / 100;
        this.netoIVA = this.totalNeto + this.totalIVA;
        let iva = this.totalIVA.toFixed();
        let netoiva = this.netoIVA.toFixed();
        this.addressForm.controls['totalNeto'].setValue(this.totalNeto);
        this.addressForm.controls['totalIVA'].setValue(iva);
        this.addressForm.controls['netoIVA'].setValue(netoiva);
      }
    }
    this.listaProductosServicios.splice(identificador, 1);
    for (let i = 0; i < this.listaProductosServicios.length; i++) {
      this.listaProductosServicios[i].identificador = i;
    }
    this.ListaProdcutosServicios();
  }

  EmitirFactura() {

    let empresa = this.addressForm.controls['empresa'].value;
    
    let listaDetalles: any = [];
    for (let i = 0; i < this.listaProductosServicios.length; i++) {
      let nombre = this.listaProductosServicios[i].productoServicio;
      let cantidad = this.listaProductosServicios[i].cantidad;
      let precio = this.listaProductosServicios[i].precio;
      let descuento = this.listaProductosServicios[i].descuentoPorcentaje;
      let detalle = {
        "nombre": nombre,
        "cantidad": cantidad,
        "precio": precio,
        "total": (cantidad * precio),
        "isExento": false,
        "descuento": descuento
      };
      listaDetalles.push(detalle);
    }

    let fechaActual = new Date();
    let diaActual = fechaActual.getDate();
    let mesActual = fechaActual.getMonth() + 1;
    let axoActual = fechaActual.getFullYear();
    let fechaReferencia = fechaActual.toISOString()
    let fechaEmision;
    if (mesActual < 10) {
      fechaEmision = `${axoActual}-0${mesActual}-${diaActual}`;
    } else {
      fechaEmision = `${axoActual}-${mesActual}-${diaActual}`;
    }

    let rut = this.addressForm.controls["rutReceptor"].value;
    let razonSocial = this.addressForm.controls["razonSocialR"].value;
    let comuna = this.addressForm.controls["comuna"].value;
    let giro = this.addressForm.controls["giro"].value;
    let direccion = this.addressForm.controls["direccion"].value;
    let ciudad = this.addressForm.controls["ciudad"].value;
    let neto = this.addressForm.controls['totalNeto'].value;
    let iva = this.addressForm.controls["totalIVA"].value;
    let total = this.addressForm.controls["netoIVA"].value;
    let descuento = this.addressForm.controls["descuento"].value;

    let json = {
      "receptor": {
        "rut": rut,
        "razonSocial": razonSocial,
        "comuna": comuna,
        "giro": giro,
        "direccion": direccion,
        "ciudad": ciudad,
      },
      "emisor": {
        "rut": empresa.rut,
        "razonSocial": empresa.razonSocial,
        "actividadesEconomicas": [
          empresa.actividadEconomica
        ],
        "comuna": empresa.comuna,
        "giro": empresa.giro,
        "direccion": empresa.direccion,
        "telefono": empresa.telefono
      },
      "detalles": listaDetalles,
      "referencias": [{
        "fecha": fechaReferencia,
        "tipoDocReferencia": 33,
        "folioReferencia": 43,
        "glosa": "Factura Electrónica"
      }],
      "encabezado": {
        "folio": 43,
        "tipoDTE": 33,
        "fechaEmision": fechaEmision
      },
      "totales": {
        "neto": neto,
        "iva": iva,
        "total": total,
        "exento": 0
      },
      "otrosDTE": {
        "indicadorServicio": 0,
        "tipoTraslado": 0,
        "tipoDespacho": 0
      },
      "certificadoDigital": {
        "rut": empresa.rutRepresentante,
        "password": empresa.contrasena,
      },
      "DescuentosRecargos": [{
        "Descripcion": "D",
        "TipoMovimiento": 0,
        "TipoValor": "%",
        "Valor": descuento
      }]
    }
    this.facturaService.enviarFactura(json).subscribe(response => {
      console.log(response);
    })
  }
}