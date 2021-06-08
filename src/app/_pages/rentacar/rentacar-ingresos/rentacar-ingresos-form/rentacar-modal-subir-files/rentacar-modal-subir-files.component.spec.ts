import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentacarModalSubirFilesComponent } from './rentacar-modal-subir-files.component';

describe('RentacarModalSubirFilesComponent', () => {
  let component: RentacarModalSubirFilesComponent;
  let fixture: ComponentFixture<RentacarModalSubirFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentacarModalSubirFilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentacarModalSubirFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
