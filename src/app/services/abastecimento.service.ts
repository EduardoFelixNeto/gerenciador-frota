import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Veiculo} from './veiculo.service';
import {Motorista} from './motorista.service';

export interface Abastecimento {
  id?: number;
  veiculo: Veiculo;
  motorista: Motorista;
  data: string;
  valor: number;
  quilometragem: number;
  tipoCombustivel: string; // 'COMUM' ou 'ADITIVADO'
}

@Injectable({
  providedIn: 'root'
})
export class AbastecimentoService {
  private readonly apiUrl = 'http://localhost:8080/api/abastecimento'; // seu json-server (ou backend)

  constructor(private http: HttpClient) {}

  listar(): Observable<Abastecimento[]> {
    return this.http.get<Abastecimento[]>(this.apiUrl + '/getAll');
  }

  buscarPorId(id: number): Observable<Abastecimento> {
    return this.http.get<Abastecimento>(`${this.apiUrl}/${id}`);
  }

  criar(abastecimento: Abastecimento): Observable<Abastecimento> {
    return this.http.post<Abastecimento>(this.apiUrl + '/create', abastecimento);
  }

  atualizar(abastecimento: Abastecimento): Observable<Abastecimento> {
    return this.http.put<Abastecimento>(`${this.apiUrl}/update/${abastecimento.id}`, abastecimento);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
