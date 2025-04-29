import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ManutencaoService, Manutencao } from '../services/manutencao.service';

@Component({
  selector: 'app-manutencao-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './manutencao-dialog.component.html'
})
export class ManutencaoDialogComponent {
  manutencaoForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private manutencaoService: ManutencaoService,
    private dialogRef: MatDialogRef<ManutencaoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Manutencao | null
  ) {
    this.manutencaoForm = this.fb.group({
      id: [data?.id],
      veiculoPlaca: [data?.veiculoPlaca || '', Validators.required],
      dataManutencao: [data?.dataManutencao || '', Validators.required],
      descricao: [data?.descricao || '', [Validators.required, Validators.minLength(5)]],
      valor: [data?.valor || '', [Validators.required, Validators.min(0.01)]]
    });
  }

  salvar(): void {
    if (this.manutencaoForm.invalid) {
      this.manutencaoForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const manutencao = this.manutencaoForm.value as Manutencao;

    if (manutencao.id) {
      this.manutencaoService.atualizar(manutencao).subscribe({
        next: () => {
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: () => {
          this.loading = false;
        }
      });
    } else {
      this.manutencaoService.criar(manutencao).subscribe({
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
