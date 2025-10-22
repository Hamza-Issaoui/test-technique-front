import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../app/pages/shared/notification.service';
import { CommonModule } from '@angular/common';
import { Socket, io } from 'socket.io-client';
import { env } from '../../environment/environment';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  imports: [
    CommonModule,   
    RouterModule    
  ],

})
export class LayoutComponent implements OnInit, OnDestroy {
  notifications: any[] = [];
  unseenCount = 0;
  showDropdown = false;
  sidebarActive = false;
  socket!: Socket;
  userRole: string | null = null;

  constructor(private router: Router, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
  
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userRole = user.role;
  
      // ✅ Connecter le socket
      this.socket = io(env.envUrl);
  
      // ✅ Rejoindre la room de l'utilisateur connecté
      this.socket.emit('joinUser', user._id);
  
      // ✅ Écouter les notifications pour cet utilisateur
      this.socket.on('user-notification', (notif: any) => {
        this.notifications.unshift(notif);
        this.unseenCount++;

        if (this.showDropdown) {
            this.markAllAsSeen();
          }
      });
    }
  
    document.addEventListener('click', this.closeSidebarIfOpen.bind(this));
  }
  
/**
 * Disconnect socket and remove document click listener on component destroy.
 */
  ngOnDestroy() {
    if (this.socket) this.socket.disconnect();
    document.removeEventListener('click', this.closeSidebarIfOpen.bind(this));

  }

  /**
 * Fetch all notifications and update unseen count.
 */
  loadNotifications() {
    this.notificationService.getNotifications().subscribe({
      next: (data) => {
        this.notifications = data;
        this.unseenCount = data.filter(n => !n.seen).length;
      },
      error: (err) => console.error('Error fetching notifications', err)
    });
  }

  /**
 * Toggle the notification dropdown visibility and mark all as seen if opened.
 */
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
    if (this.showDropdown && this.unseenCount > 0) {
      this.markAllAsSeen();
    }
  }

  /**
 * Mark all notifications as seen and reset unseen count.
 */
  markAllAsSeen() {
    this.notificationService.markAllAsSeen().subscribe(() => {
      this.notifications.forEach(n => n.seen = true);
      this.unseenCount = 0;
    });
  }
 
  /**
 * Clear local storage and navigate to the login page.
 */
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  /**
 * Toggle sidebar visibility by updating its active class and component state.
 */
  toggleSidebar() {
    this.sidebarActive = !this.sidebarActive;
    const sidebar = document.querySelector('.sidebar');
    sidebar?.classList.toggle('active', this.sidebarActive);
  }
  
  /**
 * Close sidebar if click occurs outside sidebar or menu button.
 * @param {MouseEvent} event - The mouse click event
 */
  closeSidebarIfOpen(event: MouseEvent) {
    const sidebar = document.querySelector('.sidebar');
    const menuButton = document.querySelector('.menu-toggle');
  
    if (
      this.sidebarActive &&
      sidebar &&
      !sidebar.contains(event.target as Node) &&
      !menuButton?.contains(event.target as Node)
    ) {
      sidebar.classList.remove('active');
      this.sidebarActive = false;
    }
  }

}
