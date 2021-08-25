import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HostalService } from '@app/_pages/hostal/hostal.service';
import { LubricentroService } from '@app/_pages/lubricentro/lubricentro.service';
import { InmobiliariaService } from '@app/_pages/inmobiliaria/inmobiliaria.service';
import { RentacarService } from '@app/_pages/rentacar/rentacar.service';
import { ImportadoraService } from '@app/_pages/importadora/importadora.service';
import { AbogadosService } from '@app/_pages/abogados/abogados.service';
import { DomSanitizer} from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';


export interface DialogData {
  archivos: any[];
  servicio: string;

}
@Component({
  selector: 'app-dialog-downloads',
  templateUrl: './dialog-downloads.component.html',
  styleUrls: ['./dialog-downloads.component.scss']
})
export class DialogDownloadsComponent implements OnInit {
  archivos: any[];
  constructor(
    public dialogRef: MatDialogRef<DialogDownloadsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private hostalService: HostalService,
    private lubricentroService: LubricentroService,
    private inmobiliariaService: InmobiliariaService,
    private rentacarService: RentacarService,
    private importadoraService: ImportadoraService,
    private abogadosService: AbogadosService
  ) {
    this.archivos = this.data.archivos;        
  }
  descargar(url: string) {
    switch (this.data.servicio) {
      case 'hostal-ingreso':
        this.hostalService.ingresoGetFiles(url);
        break;
      case 'hostal-egreso':
        this.hostalService.egresoGetFiles(url);
        break;      
      case 'abogados-egresos':
        this.abogadosService.egresoGetFiles(url);
        break;
      case 'lubricentro-egreso':
        this.lubricentroService.egresoGetFiles(url);
        break;
      case 'lubricentro-ingreso':
        this.lubricentroService.ingresoGetFiles(url);
        break;
        case 'inmobiliaria-ingreso':
        this.inmobiliariaService.ingresoGetFiles(url);
        break;
        case 'inmobiliaria-egreso':
        this.inmobiliariaService.egresoGetFiles(url);
        break;
        case 'rentacar-egreso':
        this.rentacarService.egresoGetFiles(url);
        break;
        case 'importadora-ingreso':
        this.importadoraService.ingresoGetFiles(url);
        break;
        case 'importadora-egresoFijo':
        this.importadoraService.egresoFijoGetFiles(url);
        break;
        case 'importadora-egresoConteiner':
          this.importadoraService.egresoConteinerGetFiles(url);
          break;
      default:
        break;
    }

  }
  ngOnInit(): void {
    
  }

}


@Component({
  selector: 'dialog-show',
  templateUrl: 'dialog-show.html',
})
export class DialogShow implements OnInit{
  archivos: any[];
  servicio: string;
  imagen: any;
  timeStamp = '';
  descargarImagen = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private hostalService: HostalService,
    private sanitizer: DomSanitizer,
    private abogadosService: AbogadosService,
    private snackBar: MatSnackBar, 
    private lubricentroService: LubricentroService,   
    private inmobiliariaService: InmobiliariaService,
    private rentacarService: RentacarService,
    private importadoraService: ImportadoraService,
  )  
  {
    this.archivos = this.data.archivos;
    this.servicio = this.data.servicio;     
  }

  ngOnInit(): void {     
    if (this.servicio === 'hostal-ingreso') {
      this.hostalService.buscarImagen(this.archivos[0].url)
      .pipe()
      .subscribe(
        (data:any) => {                            
          this.imagen = window.URL.createObjectURL(data);        
          this.descargarImagen = window.URL.createObjectURL(data);
          this.imagen = this.sanitizer.bypassSecurityTrustUrl(this.imagen);          
        },
        (error: any) => {
          (document.getElementById('cerrarModal') as HTMLInputElement).click();
          this.snackBar.open('No existe documento asociado a este ingreso', 'cerrar', {
            duration: 2000,
            verticalPosition: 'top',
          });
          console.log(error);
        }
      );
    }
    if (this.servicio === 'hostal-egreso') {
      this.hostalService.egresosBuscarImagen(this.archivos[0].url)
      .pipe()
      .subscribe(
        (data:any) => {        
          this.imagen = window.URL.createObjectURL(data);        
          this.descargarImagen = window.URL.createObjectURL(data);
          this.imagen = this.sanitizer.bypassSecurityTrustUrl(this.imagen);                
        },
        (error: any) => {
          (document.getElementById('cerrarModal') as HTMLInputElement).click();
          this.snackBar.open('No existe documento asociado a este egreso', 'cerrar', {
            duration: 2000,
            verticalPosition: 'top',
          });
          console.log(error);
        }
      );
    }
    if (this.servicio === 'abogados-egresos') {
      this.abogadosService.buscarImagen(this.archivos[0].url)
      .pipe()
      .subscribe(
        (data:any) => {        
          this.imagen = window.URL.createObjectURL(data); 
          this.descargarImagen = window.URL.createObjectURL(data);       
          this.imagen = this.sanitizer.bypassSecurityTrustUrl(this.imagen);                
        },
        (error: any) => {
          (document.getElementById('cerrarModal') as HTMLInputElement).click();
          this.snackBar.open('No existe documento asociado a este egreso', 'cerrar', {
            duration: 2000,
            verticalPosition: 'top',
          });
          console.log(error);
        }
      );
    }
    if (this.servicio === 'lubricentro-ingreso') {
      this.lubricentroService.buscarImagen(this.archivos[0].url)
      .pipe()
      .subscribe(
        (data:any) => {        
          this.imagen = window.URL.createObjectURL(data);  
          this.descargarImagen = window.URL.createObjectURL(data);             
          this.imagen = this.sanitizer.bypassSecurityTrustUrl(this.imagen);                
        },
        (error: any) => {
          (document.getElementById('cerrarModal') as HTMLInputElement).click();
          this.snackBar.open('No existe documento asociado a este ingreso', 'cerrar', {
            duration: 2000,
            verticalPosition: 'top',
          });
          console.log(error);
        }
      );
    }
    if (this.servicio === 'lubricentro-egreso') {
      this.lubricentroService.buscarImagenEgreso(this.archivos[0].url)
      .pipe()
      .subscribe(
        (data:any) => {        
          this.imagen = window.URL.createObjectURL(data);        
          this.descargarImagen = window.URL.createObjectURL(data);             
          this.imagen = this.sanitizer.bypassSecurityTrustUrl(this.imagen);                
        },
        (error: any) => {
          (document.getElementById('cerrarModal') as HTMLInputElement).click();
          this.snackBar.open('No existe documento asociado a este egreso', 'cerrar', {
            duration: 2000,
            verticalPosition: 'top',
          });
          console.log(error);
        }
      );
    }
    if (this.servicio === 'lubricentro-egreso-cuota') {
      this.lubricentroService.buscarImagenCuota(this.archivos[0].url)
      .pipe()
      .subscribe(
        (data:any) => {        
          this.imagen = window.URL.createObjectURL(data);        
          this.descargarImagen = window.URL.createObjectURL(data);             
          this.imagen = this.sanitizer.bypassSecurityTrustUrl(this.imagen);                
        },
        (error: any) => {
          (document.getElementById('cerrarModal') as HTMLInputElement).click();
          this.snackBar.open('No existe documento asociado a este egreso', 'cerrar', {
            duration: 2000,
            verticalPosition: 'top',
          });
          console.log(error);
        }
      );
    }
    if (this.servicio === 'inmobiliaria-ingreso') {
      this.inmobiliariaService.buscarImagen(this.archivos[0].url)
      .pipe()
      .subscribe(
        (data:any) => {        
          this.imagen = window.URL.createObjectURL(data);  
          this.descargarImagen = window.URL.createObjectURL(data);             
          this.imagen = this.sanitizer.bypassSecurityTrustUrl(this.imagen);                
        },
        (error: any) => {
          (document.getElementById('cerrarModal') as HTMLInputElement).click();
          this.snackBar.open('No existe documento asociado a este ingreso', 'cerrar', {
            duration: 2000,
            verticalPosition: 'top',
          });
          console.log(error);
        }
      );
    }
    if (this.servicio === 'inmobiliaria-egreso') {      
      this.inmobiliariaService.buscarImagenEgreso(this.archivos[0].url)
      .pipe()
      .subscribe(
        (data:any) => {         
          this.imagen = window.URL.createObjectURL(data);        
          this.descargarImagen = window.URL.createObjectURL(data);             
          this.imagen = this.sanitizer.bypassSecurityTrustUrl(this.imagen);                
        },
        (error: any) => {
          (document.getElementById('cerrarModal') as HTMLInputElement).click();
          this.snackBar.open('No existe documento asociado a este egreso', 'cerrar', {
            duration: 2000,
            verticalPosition: 'top',
          });
          console.log(error);
        }
      );
    }
    if (this.servicio === 'inmobiliaria-egreso-cuota') {
      this.inmobiliariaService.buscarImagenCuota(this.archivos[0].url)
      .pipe()
      .subscribe(
        (data:any) => {        
          this.imagen = window.URL.createObjectURL(data);        
          this.descargarImagen = window.URL.createObjectURL(data);             
          this.imagen = this.sanitizer.bypassSecurityTrustUrl(this.imagen);                
        },
        (error: any) => {
          (document.getElementById('cerrarModal') as HTMLInputElement).click();
          this.snackBar.open('No existe documento asociado a este egreso', 'cerrar', {
            duration: 2000,
            verticalPosition: 'top',
          });
          console.log(error);
        }
      );
    }    
    if (this.servicio === 'rentacar-egreso') {      
      this.rentacarService.buscarImagenEgreso(this.archivos[0].url)
      .pipe()
      .subscribe(
        (data:any) => {         
          this.imagen = window.URL.createObjectURL(data);        
          this.descargarImagen = window.URL.createObjectURL(data);             
          this.imagen = this.sanitizer.bypassSecurityTrustUrl(this.imagen);                
        },
        (error: any) => {
          (document.getElementById('cerrarModal') as HTMLInputElement).click();
          this.snackBar.open('No existe documento asociado a este egreso', 'cerrar', {
            duration: 2000,
            verticalPosition: 'top',
          });
          console.log(error);
        }
      );
    }
    if (this.servicio === 'rentacar-egreso-cuota') {      
      this.rentacarService.buscarImagenCuota(this.archivos[0].url)
      .pipe()
      .subscribe(
        (data:any) => {         
          this.imagen = window.URL.createObjectURL(data);        
          this.descargarImagen = window.URL.createObjectURL(data);             
          this.imagen = this.sanitizer.bypassSecurityTrustUrl(this.imagen);                
        },
        (error: any) => {
          (document.getElementById('cerrarModal') as HTMLInputElement).click();
          this.snackBar.open('No existe documento asociado a este egreso', 'cerrar', {
            duration: 2000,
            verticalPosition: 'top',
          });
          console.log(error);
        }
      );
    }    
    if (this.servicio === 'importadora-ingreso') {
      this.importadoraService.buscarImagen(this.archivos[0].url)
      .pipe()
      .subscribe(
        (data:any) => {        
          this.imagen = window.URL.createObjectURL(data);  
          this.descargarImagen = window.URL.createObjectURL(data);             
          this.imagen = this.sanitizer.bypassSecurityTrustUrl(this.imagen);                
        },
        (error: any) => {
          (document.getElementById('cerrarModal') as HTMLInputElement).click();
          this.snackBar.open('No existe documento asociado a este ingreso', 'cerrar', {
            duration: 2000,
            verticalPosition: 'top',
          });
          console.log(error);
        }
      );
    }
    if (this.servicio === 'importadora-egresoFijo') {      
      this.importadoraService.buscarImagenEgreso(this.archivos[0].url)
      .pipe()
      .subscribe(
        (data:any) => {         
          this.imagen = window.URL.createObjectURL(data);        
          this.descargarImagen = window.URL.createObjectURL(data);             
          this.imagen = this.sanitizer.bypassSecurityTrustUrl(this.imagen);                
        },
        (error: any) => {
          (document.getElementById('cerrarModal') as HTMLInputElement).click();
          this.snackBar.open('No existe documento asociado a este egreso', 'cerrar', {
            duration: 2000,
            verticalPosition: 'top',
          });
          console.log(error);
        }
      );
    }
    if (this.servicio === 'importadora-egresoConteiner') {      
      this.importadoraService.buscarImagenEgresoC(this.archivos[0].url)
      .pipe()
      .subscribe(
        (data:any) => {         
          this.imagen = window.URL.createObjectURL(data);        
          this.descargarImagen = window.URL.createObjectURL(data);             
          this.imagen = this.sanitizer.bypassSecurityTrustUrl(this.imagen);                
        },
        (error: any) => {
          (document.getElementById('cerrarModal') as HTMLInputElement).click();
          this.snackBar.open('No existe documento asociado a este egreso', 'cerrar', {
            duration: 2000,
            verticalPosition: 'top',
          });
          console.log(error);
        }
      );
    }      
  }

  download() {    
    let a = document.createElement('a');                    
          a.href = this.descargarImagen;
          a.download = "img.png";
          a.click();                    
  }

  loaded(event: any) {    
    this.timeStamp = event.timeStamp;
  }
}


