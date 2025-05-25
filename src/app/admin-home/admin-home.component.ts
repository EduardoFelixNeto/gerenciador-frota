import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

import { AgendamentoService, Agendamento } from '../services/agendamento.service';
import { AgendamentoDialogComponent } from '../agendamento-dialog/agendamento-dialog.component';

import { AbastecimentoListComponent } from '../abastecimento-list/abastecimento-list.component';
import { ManutencaoListComponent } from '../manutencao-list/manutencao-list.component';
import {OcorrenciaListComponent} from '../ocorrencia-list/ocorrencia-list.component';
import {AgendamentoListComponent} from '../agendamento-list/agendamento-list.component';
import {MotoristaListComponent} from '../motorista-list/motorista-list.component';
import {VeiculoListComponent} from '../veiculo-list/veiculo-list.component';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatCardModule,
    AgendamentoDialogComponent,
    AbastecimentoListComponent,
    ManutencaoListComponent,
    OcorrenciaListComponent,
    AgendamentoListComponent,
    MotoristaListComponent,
    VeiculoListComponent
  ],
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {
  abaSelecionada = 0; // 0 = Agendamentos | 1 = Abastecimentos | 2 = Manutenções

  displayedColumns: string[] = ['motorista', 'destino', 'dataInicio', 'status', 'acoes'];
  dataSource = new MatTableDataSource<Agendamento>();
  filtroForm: FormGroup;
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private agendamentoService: AgendamentoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.filtroForm = this.fb.group({
      motorista: [''],
      status: [''],
      periodo: ['']
    });
  }

  ngOnInit(): void {
    this.carregarAgendamentos();
  }

  carregarAgendamentos(): void {
    this.loading = true;
    this.agendamentoService.listar().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.aplicarFiltro();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  aplicarFiltro(): void {
    const { motorista, status, periodo } = this.filtroForm.value;
    let filtros = this.dataSource.data;

    if (motorista) {
      filtros = filtros.filter(a => a.motorista.id);
    }

    if (status) {
      filtros = filtros.filter(a => a.status === status);
    }

    if (periodo) {
      const [inicio, fim] = periodo.split('-').map((p: string) => new Date(p.trim()));
      filtros = filtros.filter(a => {
        const dataInicio = new Date(a.dataInicio);
        return dataInicio >= inicio && dataInicio <= fim;
      });
    }

    this.dataSource.data = filtros;
  }

  novoAgendamento(): void {
    const dialogRef = this.dialog.open(AgendamentoDialogComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Agendamento criado com sucesso!', 'Fechar', { duration: 3000 });
        this.carregarAgendamentos();
      }
    });
  }

  editarAgendamento(agendamento: Agendamento): void {
    const dialogRef = this.dialog.open(AgendamentoDialogComponent, {
      width: '450px',
      data: agendamento
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Agendamento atualizado com sucesso!', 'Fechar', { duration: 3000 });
        this.carregarAgendamentos();
      }
    });
  }
}
