import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './pages/shared/table-users.service';
import { AuthService } from './pages/shared/authGuard/auth.service';
import { ArticleService } from './pages/shared/article.service';
import { CommentService } from './pages/shared/comment.service';
import { SocketService } from './pages/shared/socket.service';
import { LayoutComponent } from './layout/layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, LayoutComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'test-technique-front';
}
