import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbastecimentoDialogComponent } from './abastecimento-dialog.component';

describe('AbastecimentoDialogComponent', () => {
  let component: AbastecimentoDialogComponent;
  let fixture: ComponentFixture<AbastecimentoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbastecimentoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbastecimentoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
