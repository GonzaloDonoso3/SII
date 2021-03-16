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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
