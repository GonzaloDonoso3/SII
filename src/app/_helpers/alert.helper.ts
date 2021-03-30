import Swal from 'sweetalert2';

export class AlertHelper {

  loadingAlert() {
    Swal.fire({
      title: 'Espere',
      text: 'Guardando informacion',
      icon: 'info',
      allowOutsideClick: false
    })
    Swal.showLoading();
  }

  warningAlert(TITLE: string, TEXT: string) {
    Swal.fire({
      title: TITLE,
      text: TEXT,
      icon: "warning"
    })
  }

  createAlert(TEXT: string) {
    Swal.fire({
      title: "Elemento creado!",
      text: TEXT,
      icon: "success"
    });
  }

  updateAlert(TEXT: string) {
    Swal.fire({
      title: "Elemento actualizado!",
      text: TEXT,
      icon: "success"
    });
  }

  deleteAlert(TEXT: string) {
    Swal.fire({
      title: "Elemento eliminado!",
      text: TEXT,
      icon: "success"
    });
  }

  errorAlert(TEXT: string) {
    Swal.fire({
      title: "Ah ocurrido un error",
      text: TEXT,
      icon: "error"
    })
  }

}
