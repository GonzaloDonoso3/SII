import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, Input, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { Sucursal } from '@app/_models/shared/sucursal';
import { DialogDownloadsComponent } from '@app/_components/dialogs/dialog-downloads/dialog-downloads.component';
import { SucursalSharedService } from '../../../shared/shared-services/sucursal-shared.service';
import { first } from 'rxjs/operators';
import { EmpresaSharedService } from '../../../shared/shared-services/empresa-shared.service';
import { Empresa } from '@app/_models/shared/empresa';


@Component({
  selector: 'app-administracion-sucursales-list',
  templateUrl: './administracion-sucursales-list.component.html',
  styleUrls: ['./administracion-sucursales-list.component.scss']
})
export class AdministracionSucursalesListComponent implements OnInit {

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

    // ? table definitions.
    displayedColumns: string[] = [
      'select',
      'id',
      'razonSocial',
      'rut',
      'giro',
      'actividad',
      'direccion',
      'empresa'
    ];
  
    // Tabla en donde se almacenará los datos de la bd 
    dataSource: MatTableDataSource<Sucursal> = new MatTableDataSource();
    dataSucursal: Sucursal[] = [];
  
  
    formFilter = new FormGroup({
      razonSocial: new FormControl(),
      rut: new FormControl(),
      giro: new FormControl(),
      actividad: new FormControl(),
      direccion: new FormControl(),
      empresa: new FormControl(),
  
    })
  
  
    sucursales: Sucursal[] = [];
    empresas : any;
    nombreEmpresa!: string;
    selection = new SelectionModel<Sucursal>(true, []);
    totalSeleccion = 0;
    selectedRows!: any[];

  constructor(
    private sucursalService: SucursalSharedService,
    private empresaService: EmpresaSharedService
  ) { }

  ngOnInit(): void {
    this.getClientes();
    this.getEmpresas();
  }

  // Obtener el listado de cliente desde la BD
  getClientes() {
    //Carga Tabla 
    this.sucursalService.getAll().pipe(first()).subscribe((result: Sucursal[]) => {
      this.dataSucursal = result.map(Sucursal => {
        //Sucursal.empresa = Sucursal.Empresa.razonSocial;
        return Sucursal;
      });
      this.dataSource = new MatTableDataSource(this.dataSucursal);
      this.dataSource.paginator = this.paginator.toArray()[0];
      console.log(this.dataSucursal);
    });
  }

  getEmpresas(){
    this.empresaService
    .getAll()
    .pipe(first())
    .subscribe((empresas) => {
      this.empresas = empresas;
    });
  }

    // ? selection rows
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
  
    // Metodo que sirve para la seleccion de un campo de la tabla
    masterToggle() {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.filteredData.forEach(row => {
          this.selection.select(row);
  
        });
      console.log(this.selection.selected);
    }

  //Limpiar los filtros
  limpiarFiltros() {
    this.formFilter.patchValue({ rut: null, nombre: null, telefono: null, email: null, direccion: null })
    this.dataSource = new MatTableDataSource(this.dataSucursal);
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.selection.clear()
    this.totalSeleccion = 0;
  }

  //Obtener los respaldos asociados
  recuperarArchivos(listArchivos: any) {
    /*this.dialog.open(DialogDownloadsComponent, {
      data: { archivos: listArchivos, servicio: 'inmobiliaria-ingreso' },
    });*/
  }


  //Metodo exportar excel
  exportAsXLSX(): void {
   /* this.selectedRows = [];
    this.selection.selected.forEach((x) => this.selectedRows.push(x));
    this.abogadosTabsService.exportAsExcelFile(this.selectedRows, 'Lista-Clientes');*/
  }

}
