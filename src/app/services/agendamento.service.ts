import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Motorista} from './motorista.service';
import {Veiculo} from './veiculo.service';

export interface Agendamento {
  id?: number;
  motorista: Motorista;
  destino: string;
  dataAgendamento: string;
  dataInicio: string;
  dataFinal: string
  status: string;
  veiculo: Veiculo;
  quilometragemSaida?: number;
  observacoesSaida?: string;
  quilometragemFinal?: number;
  observacoesFinal?: string;
}


@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  private apiUrl = 'http://localhost:3000/agendamentos';

  constructor(private http: HttpClient) {}

  listar(): Observable<Agendamento[]> {
    return this.http.get<Agendamento[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Agendamento> {
    return this.http.get<Agendamento>(`${this.apiUrl}/${id}`);
  }

  criar(agendamento: Agendamento): Observable<Agendamento> {
    return this.http.post<Agendamento>(this.apiUrl, agendamento);
  }

  atualizar(agendamento: Agendamento): Observable<Agendamento> {
    console.log(agendamento);
    return this.http.put<Agendamento>(`${this.apiUrl}/${agendamento.id}`, agendamento);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
