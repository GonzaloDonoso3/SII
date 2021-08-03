import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgroFirmaProyectosFormComponent } from './agro-firma-proyectos-form.component';

describe('AgroFirmaProyectosFormComponent', () => {
  let component: AgroFirmaProyectosFormComponent;
  let fixture: ComponentFixture<AgroFirmaProyectosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgroFirmaProyectosFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgroFirmaProyectosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
