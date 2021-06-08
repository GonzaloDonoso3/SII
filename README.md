Requisitos:
* Tener instalado node.js 
* Tener instalador angular/cli
* Tener un gestor de base de datos mysql
* Tener instalado git
 
Instrucciones de instalación:
 
* En el grupo organizacional de github existen 3 repositorios , uno llamado api-rest-finanzas , client-angular-finanzas y client-angular-finanzas2 , es necesario clonar esos 3 repositorios.
* Por defecto los proyectos estarán en la rama master , cambiese a la rama development y en base a esa rama crece una nueva con su nombre.
*  Una vez posicionado en su rama , hacer ppm Install en cada uno de los proyectos para instalar sus respectivas dependencias.
* En el proyecto “api-rest-finanzas” crear un nuevo archivo .env el cual contenga las  siguiente variables de entorno:
	PORT=3000
	LOCAL=true
	NODE_ENV="dev"
	USERNAME="root"
	PASSWORD=""
	DATABASE=“bd_finanzas”
	SECRET=“secret”

* A continuación en el gestor de base de datos cree una nueva base de datos llamada “bd_finanzas” y iniciar el proyecto con el comando npm run dev .
* Una vez ejecutado el comando espere hasta que se haya sincronizado las tablas.
* Luego importe el script .sql en la base de datos “bd_finanzas” el cual llenara todas las tablas con datos de prueba.
* Luego iniciar el proyecto client-angular-finanzas con el comando ng serve y iniciar el proyecto client-angular-finanzas2 con el comando ng serve —Port 4201 para que los 2 se ejecuten en puertos distintos.
* Una vez en ejecución , en el navegador colocar http://localhost:4200  y iniciar sesión con usuario:admin y clave: admin123.
* Si surge algún problema o duda portase en contacto.
