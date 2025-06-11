import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map, Observable, of, switchMap, tap} from 'rxjs';

export interface AuthResponse {
  jwt: string;
  userDetails: User;
}

export interface User {
  id: number;
  nome: string;
  email: string;
  perfil: 'ADMIN' | 'MOTORISTA';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';
  private currentUser: User | null = null;

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('userDetails');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  login(email: string, senha: string): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, senha }).pipe(
      tap(res => {
        localStorage.setItem('token', res.jwt);

        const minimalUser: User = {
          id: res.userDetails.id,
          nome: res.userDetails.nome,
          email: res.userDetails.email,
          perfil: res.userDetails.perfil,
        };

        localStorage.setItem('userDetails', JSON.stringify(minimalUser));
        this.currentUser = minimalUser;
      }),
      switchMap(res => of(res.userDetails))
    );
  }


  logout(): void {
    localStorage.removeItem('token');
    this.currentUser = null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUsuarioLogado(): User | null {
    return this.currentUser;
  }

  getNome(): string | null {
    return this.currentUser?.nome ?? null;
  }

  getPerfil(): string | null {
    return this.currentUser?.perfil ?? null;
  }

  getAuthHeaders(): { headers: HttpHeaders } {
    const token = this.getToken();
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

}
