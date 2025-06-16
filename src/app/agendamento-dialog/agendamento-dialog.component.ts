import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AgendamentoService, Agendamento } from '../services/agendamento.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MotoristaService, Motorista } from '../services/motorista.service';
import { VeiculoService, Veiculo } from '../services/veiculo.service';

@Component({
  selector: 'app-agendamento-dialog',
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
  templateUrl: './agendamento-dialog.component.html'
})
export class AgendamentoDialogComponent implements OnInit {
  agendamentoForm: FormGroup;
  statusOptions = ['PENDENTE', 'AGENDADO', 'EM_USO', 'FINALIZADO'];
  motoristas: Motorista[] = [];
  veiculos: Veiculo[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private agendamentoService: AgendamentoService,
    private motoristaService: MotoristaService,
    private veiculoService: VeiculoService,
    private dialogRef: MatDialogRef<AgendamentoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Agendamento | null
  ) {
    this.agendamentoForm = this.fb.group({
      id: [data?.id],
      motorista: [data?.motorista || '', Validators.required],
      veiculo: [data?.veiculo || '', Validators.required],
      destino: [data?.destino || '', Validators.required],
      dataInicio: [data?.dataInicio || '', Validators.required],
      status: [data?.status || 'PENDENTE', Validators.required]
    });

  }

  salvar(): void {
    if (this.agendamentoForm.invalid) {
      this.agendamentoForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const agendamento = this.agendamentoForm.value as Agendamento;

    if (agendamento.id) {
      this.agendamentoService.atualizar(agendamento).subscribe({
        next: () => {
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: () => {
          this.loading = false;
        }
      });
    } else {
      this.agendamentoService.criar(agendamento).subscribe({
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

  ngOnInit(): void {
    this.motoristaService.listar().subscribe({
      next: motoristas => {
        this.motoristas = motoristas.filter(
          motorista => motorista.perfil === 'MOTORISTA'
        );

        if (this.data?.motorista?.id) {
          const motoristaSelecionado = this.motoristas.find(m => m.id == this.data?.motorista.id);
          if (motoristaSelecionado) {
            this.agendamentoForm.get('motorista')?.setValue(motoristaSelecionado);
          }
        }
      },
      error: () => console.error('Erro ao carregar motoristas')
    });

    this.veiculoService.listar().subscribe({
      next: veiculos => {
        this.veiculos = veiculos;

        if (this.data?.veiculo?.id) {
          const veiculoSelecionado = this.veiculos.find(v => v.id == this.data?.veiculo.id);
          if (veiculoSelecionado) {
            this.agendamentoForm.get('veiculo')?.setValue(veiculoSelecionado);
          }
        }
      },
      error: () => console.error('Erro ao carregar veículos')
    });
  }

}
