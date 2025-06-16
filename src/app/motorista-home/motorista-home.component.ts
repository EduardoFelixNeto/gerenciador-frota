import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';

import { MotoristaService } from '../services/motorista.service';
import { AgendamentoService, Agendamento } from '../services/agendamento.service';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { VisualizarAgendamentoDialogComponent } from '../visualizar-agendamento-dialog/visualizar-agendamento-dialog.component';
import { OcorrenciaDialogComponent } from '../ocorrencia-dialog/ocorrencia-dialog.component';
import { AuthService } from '../services/auth.service';
import { VeiculoService } from '../services/veiculo.service';
import { OcorrenciaService } from '../services/ocorrencia.service';
import { HistoricoViagensComponent } from '../historico-viagens/historico-viagens.component';
import {InicioViagemDialogComponent} from '../inicio-viagem-dialog/inicio-viagem-dialog.component';
import {FimViagemDialogComponent} from '../fim-viagem-dialog/fim-viagem-dialog.component';

@Component({
  selector: 'app-motorista-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    ConfirmDialogComponent,
    VisualizarAgendamentoDialogComponent,
    OcorrenciaDialogComponent,
    HistoricoViagensComponent
  ],
  templateUrl: './motorista-home.component.html',
  styleUrls: ['./motorista-home.component.css']
})
export class MotoristaHomeComponent implements OnInit {
  abaSelecionada = 0;
  agendamentos: Agendamento[] = [];
  loading = false;

  constructor(
    private agendamentoService: AgendamentoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private motoristaService: MotoristaService,
    private veiculoService: VeiculoService,
    private ocorrenciaService: OcorrenciaService
  ) {}

  ngOnInit(): void {
    this.carregarAgendamentos();
  }

  carregarAgendamentos(): void {
    this.loading = true;

    this.agendamentoService.listarPorMotorista().subscribe({
      next: (data) => {
        this.agendamentos = data
          .filter(a => ['PENDENTE', 'AGENDADO', 'EM_USO'].includes(a.status))
          .sort((a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime());
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  visualizarAgendamento(agendamento: Agendamento): void {
    this.dialog.open(VisualizarAgendamentoDialogComponent, {
      width: '400px',
      data: agendamento
    });
  }

  iniciarViagem(agendamento: Agendamento): void {
    const dialogRef = this.dialog.open(InicioViagemDialogComponent, {
      width: '300px',
      data: { mensagem: 'Deseja iniciar esta viagem?' }
    });

    dialogRef.afterClosed().subscribe(dados => {
      if (dados) {
        this.loading = true;
        agendamento.status = dados.status;
        agendamento.dataInicio = dados.dataInicio;
        agendamento.quilometragemInicial = dados.quilometragemSaida;
        agendamento.observacaoInicio = dados.observacoes;
        this.agendamentoService.atualizar(agendamento).subscribe({
          next: () => {
            this.snackBar.open('Viagem iniciada com sucesso!', 'Fechar', { duration: 3000 });
            this.carregarAgendamentos();
          },
          error: () => {
            this.snackBar.open('Erro ao iniciar viagem.', 'Fechar', { duration: 3000 });
            this.carregarAgendamentos();
          }
        });
      }
    });
  }

  finalizarViagem(agendamento: Agendamento): void {
    const dialogRef = this.dialog.open(FimViagemDialogComponent, {
      width: '300px',
      data: { mensagem: 'Deseja finalizar esta viagem?' }
    });

    dialogRef.afterClosed().subscribe(dados => {
      if (dados) {
        this.loading = true;
        agendamento.status = dados.status;
        agendamento.dataFim = new Date().toISOString();
        agendamento.quilometragemFinal = dados.quilometragemFinal;
        agendamento.observacaoFim = dados.observacoes;
        this.agendamentoService.atualizar(agendamento).subscribe({
          next: () => {
            this.snackBar.open('Viagem finalizada com sucesso!', 'Fechar', { duration: 3000 });
            this.carregarAgendamentos();
          },
          error: () => {
            this.snackBar.open('Erro ao finalizar viagem.', 'Fechar', { duration: 3000 });
            this.carregarAgendamentos();
          }
        });
      }
    });
  }

  solicitarOcorrencia(agendamento: Agendamento): void {
    const dialogRef = this.dialog.open(OcorrenciaDialogComponent, {
      width: '400px',
      data: {
        motoristaId: agendamento.motorista.id,
        veiculoId: agendamento.veiculo.id
      }
    });

    dialogRef.afterClosed().subscribe(submetido => {
      if (submetido) {
        this.snackBar.open('Ocorrência enviada com sucesso!', 'Fechar', { duration: 3000 });
      }
    });
  }
}
