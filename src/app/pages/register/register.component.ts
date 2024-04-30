import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Register } from './register.interface';
import { AuthService } from '../shared/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  providers: [HttpClient],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerObj: Register;
  constructor(private authService: AuthService, private router: Router) {
    this.registerObj = new Register();
  }
  onRegister() {
    this.authService.register(this.registerObj).subscribe(
      (res: any) => {
        if (res.status == 201) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Registration Success",
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.router.navigateByUrl('/login');
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: res.message,
          });
        }
      },
      (error) => {
        console.error('Registration error:', error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "An error occurred during registration.",
        });
      }
    );
  }

}
