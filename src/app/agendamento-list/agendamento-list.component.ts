import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { AgendamentoService, Agendamento } from '../services/agendamento.service';
import { AgendamentoDialogComponent } from '../agendamento-dialog/agendamento-dialog.component';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {AbastecimentoDialogComponent} from '../abastecimento-dialog/abastecimento-dialog.component';
import {Manutencao} from '../services/manutencao.service';
import {ManutencaoDialogComponent} from '../manutencao-dialog/manutencao-dialog.component';

@Component({
  selector: 'app-agendamento-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    AgendamentoDialogComponent,
    MatSnackBarModule,
    ConfirmDialogComponent
  ],
  templateUrl: './agendamento-list.component.html',
  styleUrls: ['./agendamento-list.component.css']
})
export class AgendamentoListComponent implements OnInit {
  displayedColumns: string[] = ['motorista', 'destino', 'dataInicio', 'status', 'acoes'];
  dataSource = new MatTableDataSource<Agendamento>();
  filtro: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private agendamentoService: AgendamentoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.listarAgendamentos();
  }

  listarAgendamentos(): void {
    this.agendamentoService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: Agendamento, filter: string) => {
        return data.motorista.nome.toLowerCase().includes(filter) ||
          data.destino.toLowerCase().includes(filter) ||
          data.status.toLowerCase().includes(filter) ||
          data.dataInicio.toLowerCase().includes(filter);
      };
    });
  }

  aplicarFiltro(): void {
    this.dataSource.filter = this.filtro.trim().toLowerCase();
  }

  abrirDialog(agendamento?: Agendamento): void {
    const dialogRef = this.dialog.open(AgendamentoDialogComponent, {
      width: '450px',
      data: agendamento ? { ...agendamento } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Operação realizada com sucesso!', 'Fechar', {duration: 3000});
        this.listarAgendamentos();
      }
    });
  }

  excluirAgendamento(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { mensagem: 'Tem certeza que deseja excluir este agendamento?' }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.agendamentoService.excluir(id).subscribe({
          next: () => {
            this.snackBar.open('Agendamento excluído com sucesso.', 'Fechar', { duration: 3000 });
            this.listarAgendamentos();
          },
          error: () => {
            this.snackBar.open('Erro ao excluir agendamento.', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }

  agendarViagem(agendamento: Agendamento): void {
    agendamento.status = 'AGENDADO';
    this.agendamentoService.atualizar(agendamento);
    this.snackBar.open(`Agendamento para ${agendamento.motorista.nome} foi feito com sucesso.`, 'Fechar', {
      duration: 3000
    });
    console.log('Agendar Viagem:', agendamento);
  }

  registrarAbastecimento(agendamento: Agendamento): void {
    const abastecimento = {
      veiculoPlaca: agendamento.veiculo.placa,
      dataAbastecimento: new Date().toISOString().slice(0, 10),
      litros: 0,
      valorTotal: 0,
      kmAtual: agendamento.quilometragemInicial ?? agendamento.veiculo.quilometragemAtual
    };

    const dialogRef = this.dialog.open(AbastecimentoDialogComponent, {
      width: '400px',
      data: abastecimento
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Abastecimento registrado com sucesso!', 'Fechar', { duration: 3000 });
      }
    });
  }

  registrarManutencao(agendamento: Agendamento): void {
    const manutencao = {
      veiculoPlaca: agendamento.veiculo.placa,
      dataManutencao: new Date().toISOString().slice(0, 10),
    }


    const dialogRef = this.dialog.open(ManutencaoDialogComponent, {
      width: '400px',
      data: manutencao ? { ...manutencao } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Operação realizada com sucesso!', 'Fechar', { duration: 3000 });
      }
    });
  }

}
