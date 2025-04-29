import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManutencaoListComponent } from './manutencao-list.component';

describe('ManutencaoListComponent', () => {
  let component: ManutencaoListComponent;
  let fixture: ComponentFixture<ManutencaoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManutencaoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManutencaoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
