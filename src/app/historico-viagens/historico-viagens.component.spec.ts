import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoViagensComponent } from './historico-viagens.component';

describe('HistoricoViagensComponent', () => {
  let component: HistoricoViagensComponent;
  let fixture: ComponentFixture<HistoricoViagensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricoViagensComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricoViagensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
