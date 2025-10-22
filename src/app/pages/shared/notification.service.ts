import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../../../environment/environment';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
    private baseUrl = `${env.envUrl}/api/notifications`;

  constructor(private http: HttpClient) {}

  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  markAsSeen(id: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/seen`, {});
  }

  markAllAsSeen(): Observable<any> {
    return this.http.patch(`${this.baseUrl}/seen-all`, {});
  }
}
