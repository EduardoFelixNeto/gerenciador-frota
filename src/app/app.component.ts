import { Component } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  username: string | null = '';

  constructor(private authService: AuthService, private router: Router) {
    // Pega o nome armazenado (caso o usuário esteja logado)
    this.username = this.authService.getNome();
  }

  logout(): void {
    this.authService.logout();
    // Atualiza o nome do usuário (caso queira esconder a navbar ou limpar info)
    this.username = null;
    this.router.navigate(['/login']);
  }
}
