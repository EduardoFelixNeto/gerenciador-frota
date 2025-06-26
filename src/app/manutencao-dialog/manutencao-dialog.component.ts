import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ManutencaoService, Manutencao } from '../services/manutencao.service';
import {MatSelectModule} from '@angular/material/select';
import {Veiculo, VeiculoService} from '../services/veiculo.service';

@Component({
  selector: 'app-manutencao-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  templateUrl: './manutencao-dialog.component.html'
})
export class ManutencaoDialogComponent implements OnInit {
  manutencaoForm: FormGroup;
  loading = false;
  veiculos: Veiculo[] = [];

  constructor(
    private fb: FormBuilder,
    private manutencaoService: ManutencaoService,
    private dialogRef: MatDialogRef<ManutencaoDialogComponent>,
    private veiculoService: VeiculoService,
    @Inject(MAT_DIALOG_DATA) public data: Manutencao | null
  ) {
    this.manutencaoForm = this.fb.group({
      id: [data?.id],
      veiculo: [data?.veiculo || '', Validators.required],
      data: [data?.data || '', Validators.required],
      descricao: [data?.descricao || '', [Validators.required, Validators.minLength(5)]],
      valor: [data?.valor || '', [Validators.required, Validators.min(0.01)]],
      tipo: [data?.tipo || '', Validators.required],
      quilometragem: [data?.quilometragem || '', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.veiculoService.listar().subscribe({
      next: veiculos => {
        this.veiculos = veiculos;

        if (this.data?.veiculo?.id) {
          const veiculoSelecionado = this.veiculos.find(v => v.id === this.data!.veiculo.id);
          if (veiculoSelecionado) {
            this.manutencaoForm.patchValue({ veiculo: veiculoSelecionado });
          }
        }
      },
      error: () => {
        // Tratar erro ao listar veículos
      }
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
