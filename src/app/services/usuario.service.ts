import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Endereco {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
  complemento: string;
  numero: string;
}

export type Perfil = 'ADMIN' | 'MOTORISTA';

export interface Usuario {
  id?: number;
  nome: string;
  cnh: string;
  validadeCnh: string;
  email: string;
  senha?: string;
  perfil: Perfil;
  ativo: boolean;
  telefone: string;
  endereco: Endereco;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  listarAtivos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/getAtivos`);
  }

  buscarPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/getById/${id}`);
  }

  criar(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/create`, usuario);
  }

  atualizar(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/put/${id}`, usuario);
  }

  inativar(id: number): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl}/inativar/${id}`, {});
  }
}
