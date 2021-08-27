import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgroFirmaProyectosComponent } from './agro-firma-proyectos.component';

describe('AgroFirmaProyectosComponent', () => {
  let component: AgroFirmaProyectosComponent;
  let fixture: ComponentFixture<AgroFirmaProyectosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgroFirmaProyectosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgroFirmaProyectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
