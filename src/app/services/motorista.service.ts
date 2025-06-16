import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Motorista {
  id?: number;
  nome: string;
  cpf: string;
  cnh: string;
  validadeCnh: string;
  telefone: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  }
  email: string;
  senha: string;
  perfil: string;
}

@Injectable({
  providedIn: 'root'
})
export class MotoristaService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  listar(): Observable<Motorista[]> {
    return this.http.get<Motorista[]>(`${this.apiUrl}/getAtivos`);
  }

  buscarPorId(id: number): Observable<Motorista> {
    return this.http.get<Motorista>(`${this.apiUrl}/${id}`);
  }

  criar(motorista: Motorista): Observable<Motorista> {
    return this.http.post<Motorista>(`${this.apiUrl}/create`, motorista);
  }

  atualizar(motorista: Motorista): Observable<Motorista> {
    return this.http.put<Motorista>(`${this.apiUrl}/put/${motorista.id}`, motorista);
  }

  excluir(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/inativar/${id}`, { ativo: false });
  }

  buscarEnderecoPorCep(cep: string): Observable<any> {
    return this.http.get(`https://viacep.com.br/ws/${cep}/json/`);
  }

}
