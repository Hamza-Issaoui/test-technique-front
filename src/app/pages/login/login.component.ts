import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from './login.interface';
import { AuthService } from '../shared/authGuard/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  providers: [HttpClient],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginObj: Login;
  constructor(private authService: AuthService, private router: Router) {
    this.loginObj = new Login();
  }

  /**
   * Attempt to log in a user using provided credentials.
   * Shows success or error alerts depending on the response.
   */
  onLogin() {
    //debugger;
    this.authService.login(this.loginObj).subscribe(
      (res: any) => {
        if (res.success) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Login Success',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            this.router.navigateByUrl('/articles');
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: res.message,
          });
        }
      },
      (error) => {
        console.error('Login error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'An error occurred during login.',
        });
      }
    );
  }
}
