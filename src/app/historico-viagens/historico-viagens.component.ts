import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { AgendamentoService, Agendamento } from '../services/agendamento.service';
import { VeiculoService } from '../services/veiculo.service';
import { AuthService } from '../services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-historico-viagens',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './historico-viagens.component.html',
  styleUrls: ['./historico-viagens.component.css']
})
export class HistoricoViagensComponent implements OnInit {
  historico: Agendamento[] = [];
  loading = false;

  constructor(
    private agendamentoService: AgendamentoService,
    private veiculoService: VeiculoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carregarHistorico();
  }

  carregarHistorico(): void {
    this.loading = true;
    const motoristaId = this.authService.getUsuarioLogado()?.id;

    if (!motoristaId) {
      this.loading = false;
      return;
    }

    this.agendamentoService.listar().subscribe({
      next: (agendamentos) => {
        this.veiculoService.listar().subscribe(veiculos => {
          this.historico = agendamentos
            .filter(a => a.motoristaId === motoristaId && a.status === 'FINALIZADO')
            .map(a => ({
              ...a,
              veiculoPlaca: veiculos.find(v => Number(v.id) === a.veiculoId)?.placa
            }))
            .sort((a, b) => new Date(b.dataInicio).getTime() - new Date(a.dataInicio).getTime()); // mais recentes primeiro
          this.loading = false;
        });
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
