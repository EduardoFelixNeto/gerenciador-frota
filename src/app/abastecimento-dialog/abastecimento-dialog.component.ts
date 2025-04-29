import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AbastecimentoService, Abastecimento } from '../services/abastecimento.service';

@Component({
  selector: 'app-abastecimento-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './abastecimento-dialog.component.html'
})
export class AbastecimentoDialogComponent {
  abastecimentoForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private abastecimentoService: AbastecimentoService,
    private dialogRef: MatDialogRef<AbastecimentoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Abastecimento | null
  ) {
    this.abastecimentoForm = this.fb.group({
      id: [data?.id],
      veiculoPlaca: [data?.veiculoPlaca || '', Validators.required],
      dataAbastecimento: [data?.dataAbastecimento || '', Validators.required],
      litros: [data?.litros || '', [Validators.required, Validators.min(1)]],
      valorTotal: [data?.valorTotal || '', [Validators.required, Validators.min(0.01)]],
      kmAtual: [data?.kmAtual || '', [Validators.required, Validators.min(0)]]
    });
  }

  salvar(): void {
    if (this.abastecimentoForm.invalid) {
      this.abastecimentoForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const abastecimento = this.abastecimentoForm.value as Abastecimento;

    if (abastecimento.id) {
      this.abastecimentoService.atualizar(abastecimento).subscribe({
        next: () => {
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: () => {
          this.loading = false;
        }
      });
    } else {
      this.abastecimentoService.criar(abastecimento).subscribe({
        next: () => {
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
