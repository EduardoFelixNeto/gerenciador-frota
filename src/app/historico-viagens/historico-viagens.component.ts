import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { AgendamentoService, Agendamento } from '../services/agendamento.service';
import { VeiculoService } from '../services/veiculo.service';
import { AuthService } from '../services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MotoristaService} from '../services/motorista.service';

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
    private authService: AuthService,
    private motoristaService: MotoristaService
  ) {}

  ngOnInit(): void {
    this.carregarHistorico();
  }

  carregarHistorico(): void {
    this.loading = true;
    const motoristaId = this.authService.getUsuarioLogado()?.id;

    this.agendamentoService.listar().subscribe({
      next: (data) => {
        this.motoristaService.listar().subscribe(motoristas => {
          this.veiculoService.listar().subscribe(veiculos => {
            this.historico = data
              .filter(a => a.motorista.id === motoristaId?.toString() && ['FINALIZADO'].includes(a.status))
              .map(a => ({
                ...a,
                motoristaNome: motoristas.find(m => Number(m.id) === a.motorista.id)?.nome,
                veiculoPlaca: veiculos.find(v => Number(v.id) === a.veiculo.id)?.placa
              }))
              .sort((a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime());

            this.loading = false;
          });
        });
      }
    });
  }
}
