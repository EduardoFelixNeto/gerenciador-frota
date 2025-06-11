import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Motorista} from './motorista.service';
import {Veiculo} from './veiculo.service';
import {AuthService} from './auth.service';

export interface Agendamento {
  id?: number;
  motorista: Motorista;
  destino: string;
  dataAgendamento: string;
  dataInicio: string;
  dataFinal: string;
  status: string;
  veiculo: Veiculo;
  quilometragemInicial?: number;
  observacaoInicio?: string;
  quilometragemFinal?: number;
  observacaoFim?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  private apiUrl = 'http://localhost:8080/api/agendamentos';

  constructor(private http: HttpClient, private authService: AuthService) {}

  listar(): Observable<Agendamento[]> {
    return this.http.get<Agendamento[]>(`${this.apiUrl}/getAll`, { headers: this.authService.getAuthHeaders().headers });
  }

  listarPorMotorista(): Observable<Agendamento[]> {
    const motoristaId = this.authService.getUsuarioLogado()?.id;
    return this.http.get<Agendamento[]>(`${this.apiUrl}/getAllMotorista/${motoristaId}`, { headers: this.authService.getAuthHeaders().headers });
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
