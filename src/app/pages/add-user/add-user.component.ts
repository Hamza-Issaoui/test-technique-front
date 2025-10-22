import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../shared/authGuard/auth.service';
import { Router } from '@angular/router';
import { AddUser } from './add-user.interface';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  providers: [HttpClient],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css',
})
export class AddUserComponent {
  createUserObj: AddUser;
  constructor(private authService: AuthService, private router: Router) {
    this.createUserObj = new AddUser();
  }
  /**
   * Create a new user by calling the registration API.
   * Shows a success or error alert depending on the response.
   */
  onCreateUser() {
    this.authService.register(this.createUserObj).subscribe(
      (res: any) => {
        if (res.status == 201) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Registration Success',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            this.router.navigateByUrl('/users');
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
        console.error('Registration error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'An error occurred during registration.',
        });
      }
    );
  }
  
  /**
   * Navigate to the users list page.
   */
  goToUsers(): void {
    this.router.navigate(['/users']);
  }
}
