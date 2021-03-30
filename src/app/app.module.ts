import { AlertHelper } from './_helpers/alert.helper';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { AuthInterceptor } from './_helpers/auth.interceptor';
import { NgModule } from '@angular/core';
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


@NgModule({
  declarations: [
    AppComponent,
    HomeMainComponent,
    NavComponent
  ],
  imports: [
    ComponentsModule,
    HostalModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MaterialModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    AuthSharedService, AlertHelper
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
