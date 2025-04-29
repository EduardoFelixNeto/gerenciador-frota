import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarAgendamentoDialogComponent } from './visualizar-agendamento-dialog.component';

describe('VisualizarAgendamentoDialogComponent', () => {
  let component: VisualizarAgendamentoDialogComponent;
  let fixture: ComponentFixture<VisualizarAgendamentoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizarAgendamentoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarAgendamentoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
