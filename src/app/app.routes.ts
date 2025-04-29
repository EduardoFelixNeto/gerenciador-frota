import {Router, Routes} from '@angular/router';
import {inject} from '@angular/core';
import {authGuard} from './guards/auth.guard';
import {AuthService} from './services/auth.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(c => c.LoginComponent),
  },
  {
    path: 'admin',
    canActivate: [() => authGuard(inject(AuthService), inject(Router))],
    loadComponent: () => import('./admin-home/admin-home.component').then(c => c.AdminHomeComponent),
  },
  {
    path: 'motorista',
    canActivate: [() => authGuard(inject(AuthService), inject(Router))],
    loadComponent: () => import('./motorista-home/motorista-home.component').then(c => c.MotoristaHomeComponent),
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
