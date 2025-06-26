import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AbastecimentoService, Abastecimento } from '../services/abastecimento.service';
import {Veiculo, VeiculoService} from '../services/veiculo.service';
import {MatSelectModule} from '@angular/material/select';
import {Motorista, MotoristaService} from '../services/motorista.service';

@Component({
  selector: 'app-abastecimento-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,

  ],
  templateUrl: './abastecimento-dialog.component.html'
})
export class AbastecimentoDialogComponent implements OnInit {
  abastecimentoForm: FormGroup;
  loading = false;
  veiculos: Veiculo[] = [];
  motoristas: Motorista[] = [];
  tipoCombustiveOptions: string[] = ['GASOLINA', 'ETANOL', 'DIESEL', 'GNV'];

  constructor(
    private fb: FormBuilder,
    private abastecimentoService: AbastecimentoService,
    private dialogRef: MatDialogRef<AbastecimentoDialogComponent>,
    private veiculoService: VeiculoService,
    private motoristaService: MotoristaService,
    @Inject(MAT_DIALOG_DATA) public data: Abastecimento | null
  ) {
    this.abastecimentoForm = this.fb.group({
      id: [data?.id],
      veiculo: [data?.veiculo || '', Validators.required],
      data: [data?.data || '', Validators.required],
      valor: [data?.valor || '', [Validators.required, Validators.min(0.01)]],
      quilometragem: [data?.quilometragem || '', [Validators.required, Validators.min(0)]],
      motorista: [data?.motorista || '', Validators.required],
      tipoCombustivel: [data?.tipoCombustivel || '', Validators.required]
    });
  }

  ngOnInit(): void {
    this.veiculoService.listar().subscribe({
      next: veiculos => {
        this.veiculos = veiculos;

        if (this.data?.veiculo?.id) {
          const veiculoSelecionado = this.veiculos.find(v => v.id == this.data?.veiculo.id);
          if (veiculoSelecionado) {
            this.abastecimentoForm.get('veiculo')?.setValue(veiculoSelecionado);
          }
        }
      },
      error: () => console.error('Erro ao carregar veículos')
    });
    this.motoristaService.listar().subscribe({
      next: motoristas => {
        this.motoristas = motoristas;

        if (this.data?.motorista?.id) {
          const motoristaSelecionado = this.motoristas.find(m => m.id == this.data?.motorista.id);
          if (motoristaSelecionado) {
            this.abastecimentoForm.get('motorista')?.setValue(motoristaSelecionado);
          }
        }
      },
      error: () => console.error('Erro ao carregar motoristas')
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
