import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MotoristaService } from '../services/motorista.service';
import { AgendamentoService, Agendamento } from '../services/agendamento.service';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { VisualizarAgendamentoDialogComponent } from '../visualizar-agendamento-dialog/visualizar-agendamento-dialog.component';
import { OcorrenciaDialogComponent } from '../ocorrencia-dialog/ocorrencia-dialog.component';
import {AuthService} from '../services/auth.service';
import {VeiculoService} from '../services/veiculo.service';
import {OcorrenciaService} from '../services/ocorrencia.service';

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
    ConfirmDialogComponent,
    VisualizarAgendamentoDialogComponent,
    OcorrenciaDialogComponent
  ],
  templateUrl: './motorista-home.component.html',
  styleUrls: ['./motorista-home.component.css']
})
export class MotoristaHomeComponent implements OnInit {
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
    const motoristaId = this.authService.getUsuarioLogado()?.id;

    this.agendamentoService.listar().subscribe({
      next: (data) => {
        this.motoristaService.listar().subscribe(motoristas => {
          this.veiculoService.listar().subscribe(veiculos => {
            this.agendamentos = data
              .filter(a => a.motoristaId === motoristaId && ['PENDENTE', 'AGENDADO', 'EM USO'].includes(a.status))
              .map(a => ({
                ...a,
                motoristaNome: motoristas.find(m => Number(m.id) === a.motoristaId)?.nome,
                veiculoPlaca: veiculos.find(v => Number(v.id) === a.veiculoId)?.placa
              }))
              .sort((a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime());
            console.log(this.agendamentos);
            this.loading = false;
          });
        });
      }
    });
  }

  visualizarAgendamento(agendamento: Agendamento): void {
    this.dialog.open(VisualizarAgendamentoDialogComponent, {
      width: '400px',
      data: agendamento
    });
  }

  iniciarViagem(agendamento: Agendamento): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { mensagem: 'Deseja iniciar esta viagem?' }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.loading = true;
        agendamento.status = 'EM USO';
        this.agendamentoService.atualizar(agendamento).subscribe({
          next: () => {
            this.snackBar.open('Viagem iniciada com sucesso!', 'Fechar', { duration: 3000 });
            this.carregarAgendamentos();
          },
          error: () => {
            this.snackBar.open('Erro ao iniciar viagem.', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }

  finalizarViagem(agendamento: Agendamento): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { mensagem: 'Deseja finalizar esta viagem?' }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.loading = true;
        agendamento.status = 'FINALIZADO';
        this.agendamentoService.atualizar(agendamento).subscribe({
          next: () => {
            this.snackBar.open('Viagem finalizada com sucesso!', 'Fechar', { duration: 3000 });
            this.carregarAgendamentos();
          },
          error: () => {
            this.snackBar.open('Erro ao finalizar viagem.', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }

  solicitarOcorrencia(agendamento: Agendamento): void {
    const dialogRef = this.dialog.open(OcorrenciaDialogComponent, {
      width: '400px',
      data: {
        motoristaId: agendamento.motoristaId,
        veiculoId: agendamento.veiculoId
      }
    });

    dialogRef.afterClosed().subscribe(submetido => {
      if (submetido) {
        this.snackBar.open('Ocorrência enviada com sucesso!', 'Fechar', { duration: 3000 });
      }
    });
  }
}
