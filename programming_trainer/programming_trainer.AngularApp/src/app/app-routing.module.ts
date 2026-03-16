import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BotChatComponent } from './pages/bot-chat/bot-chat.component';
import { StudentPortfolioComponent } from './pages/student-portfolio/student-portfolio.component';

const routes: Routes = [
  // Öffentlicher Login-Bereich
  { path: 'auth/login', component: LoginComponent },
  
  // Geschützte Bereiche
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'bot-chat', component: BotChatComponent, canActivate: [AuthGuard] },
  { path: 'portfolio', component: StudentPortfolioComponent, canActivate: [AuthGuard] },

  // Redirect von leerem Pfad auf Bot-Chat (Hauptfunktion)
  { path: '', redirectTo: '/bot-chat', pathMatch: 'full' },

  // Fallback bei ungültiger URL
  { path: '**', redirectTo: '/bot-chat' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

