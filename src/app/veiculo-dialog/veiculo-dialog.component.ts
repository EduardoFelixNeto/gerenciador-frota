import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { VeiculoService, Veiculo } from '../services/veiculo.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-veiculo-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './veiculo-dialog.component.html'
})
export class VeiculoDialogComponent {
  veiculoForm: FormGroup;
  statusOptions = ['DISPONIVEL', 'INATIVO', 'EM_MANUTENCAO'];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private veiculoService: VeiculoService,
    private dialogRef: MatDialogRef<VeiculoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Veiculo | null
  ) {
    this.veiculoForm = this.fb.group({
      id: [data?.id],
      placa: [data?.placa || '', Validators.required],
      modelo: [data?.modelo || '', Validators.required],
      tipo: [data?.tipo || '', Validators.required],
      ano: [data?.ano || '', [Validators.required, Validators.min(1900)]],
      quilometragemAtual: [data?.quilometragemAtual || '', [Validators.required, Validators.min(0)]],
      status: [data?.status || 'DISPONIVEL', Validators.required]
    });
  }

  salvar(): void {
    if (this.veiculoForm.invalid) {
      this.veiculoForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const veiculo = this.veiculoForm.value as Veiculo;

    if (veiculo.id) {
      this.veiculoService.atualizar(veiculo).subscribe({
        next: () => {
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: () => {
          this.loading = false;
        }
      });
    } else {
      this.veiculoService.criar(veiculo).subscribe({
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
