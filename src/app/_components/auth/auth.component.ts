import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { Usuario } from '@models/shared/usuario';
import { AuthSharedService } from '@app/_pages/shared/shared-services/auth-shared.service';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  usuario: Usuario = new Usuario();


  constructor(private auth: AuthSharedService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.buscarUsuario();
  }

  buscarUsuario(): void {
    const { token } = this.route.snapshot.params;
    this.auth.loginToken(token).subscribe((usuario: Usuario) => {
      this.usuario = usuario;
      this.router.navigate(['/']);
      //this.auth.validarPermiso();
    }, (error) => {
      console.log('error en el componente auth');
      window.location.href = `${environment.indexUrl}`;
    });
  }

}
