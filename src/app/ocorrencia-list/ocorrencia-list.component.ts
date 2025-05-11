import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { OcorrenciaService, Ocorrencia } from '../services/ocorrencia.service';
import { MotoristaService } from '../services/motorista.service';
import { VeiculoService } from '../services/veiculo.service';

@Component({
  selector: 'app-ocorrencia-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './ocorrencia-list.component.html',
  styleUrls: ['./ocorrencia-list.component.css']
})
export class OcorrenciaListComponent implements OnInit {
  displayedColumns: string[] = ['motorista', 'veiculo', 'descricao'];
  dataSource = new MatTableDataSource<any>();
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private ocorrenciaService: OcorrenciaService,
    private motoristaService: MotoristaService,
    private veiculoService: VeiculoService
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.loading = true;
    this.ocorrenciaService.listar().subscribe(ocorrencias => {
      this.motoristaService.listar().subscribe(motoristas => {
        this.veiculoService.listar().subscribe(veiculos => {
          const lista = ocorrencias.map(o => ({
            ...o,
            motorista: motoristas.find(m => Number(m.id) === o.motoristaId)?.nome || 'Desconhecido',
            veiculo: veiculos.find(v => Number(v.id) === o.veiculoId)?.placa || 'Desconhecido'
          }));
          this.dataSource = new MatTableDataSource(lista);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.loading = false;
        });
      });
    });
  }
}
