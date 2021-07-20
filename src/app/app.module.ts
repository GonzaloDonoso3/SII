import { AlertHelper } from './_helpers/alert.helper';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { AuthInterceptor } from './_helpers/auth.interceptor';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { HomeMainComponent } from './_components/home-main/home-main.component';
import { MaterialModule } from './material.module';

import { NavComponent } from './nav/nav.component';
import { HostalModule } from './_pages/hostal/hostal.module';
import { ComponentsModule } from './_components/components.module';
import { AuthSharedService } from './_pages/shared/shared-services/auth-shared.service';
import { FullCalendarModule } from '@fullcalendar/angular'; 
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin from '@fullcalendar/interaction'; 

FullCalendarModule.registerPlugins([ 
  dayGridPlugin,
  interactionPlugin
]);



/* Configurar Pipe español */
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import {DecimalPipe} from '@angular/common';


registerLocaleData(localeEs, 'es');




@NgModule({
  declarations: [
    AppComponent,
    HomeMainComponent,
    NavComponent,
  ],
  imports: [
    ComponentsModule,
    HostalModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MaterialModule,
    FullCalendarModule,
    HttpClientModule
  ],
  providers: [
    DecimalPipe,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    /* Configurar Pipe español */
    { provide: LOCALE_ID, useValue: 'es' },
    AuthSharedService, AlertHelper
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
