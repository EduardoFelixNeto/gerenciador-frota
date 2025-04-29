import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendamentoDialogComponent } from './agendamento-dialog.component';

describe('AgendamentoDialogComponent', () => {
  let component: AgendamentoDialogComponent;
  let fixture: ComponentFixture<AgendamentoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendamentoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendamentoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
