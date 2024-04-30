import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../shared/table-users.service';
import Swal from 'sweetalert2';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-table-users',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  providers: [HttpClient],
  templateUrl: './table-users.component.html',
  styleUrl: './table-users.component.css'
})

export class TableUsersComponent implements OnInit {
  users: any[] = [];
  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) { }
  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getAllUsers().subscribe(
      (data: any) => {
        this.users = data.listUsers;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  confirmDelete(user: any): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: `You won't be able to revert the deletion of ${user.firstname} ${user.lastname}!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(user._id).subscribe(
          (res) => {
            this.fetchUsers();
            swalWithBootstrapButtons.fire(
              'Deleted!',
              'Your User has been deleted.',
              'success'
            );
          },
          (error) => {
            console.error('Error deleting user:', error);
            swalWithBootstrapButtons.fire(
              'Error!',
              'Failed to delete the user.',
              'error'
            );
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your imaginary user is safe :)',
          'error'
        );
      }
    });
  }

  logout() {
    localStorage.removeItem('authToken');

    this.router.navigateByUrl('/login');
  }

  navigate(id: any, type: string): void {
    this.router.navigate(['/update-user', {
      id: id,
      action: type
    }]);
  }

  goToCreateUser(): void {
    this.router.navigate(['/create-user']);
  }

}