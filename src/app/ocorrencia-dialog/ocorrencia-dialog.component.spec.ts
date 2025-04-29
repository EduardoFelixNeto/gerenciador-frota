import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcorrenciaDialogComponent } from './ocorrencia-dialog.component';

describe('OcorrenciaDialogComponent', () => {
  let component: OcorrenciaDialogComponent;
  let fixture: ComponentFixture<OcorrenciaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OcorrenciaDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OcorrenciaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
