import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { env } from '../../../environment/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

/**
 * Service to manage WebSocket connections using Socket.IO.
 */
export class SocketService {
  private socket!: Socket;
  /**
   * Connect to the WebSocket server, optionally with a JWT token.
   * @param {string} [token] - Optional JWT token for authentication
   */
  connect(token?: string): void {
    if (this.socket && this.socket.connected) return; // already connected

    this.socket = io(env.envUrl, {
      transports: ['websocket'],
      auth: { token }, // optional, send JWT if backend requires auth
    });

    this.socket.on('connect', () => console.log('✅ Socket connected:', this.socket.id));
    this.socket.on('disconnect', () => console.log('❌ Socket disconnected'));
  }

   /**
   * Disconnect from the WebSocket server if connected.
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

   /**
   * Emit an event with data to the WebSocket server.
   * @param {string} event - The event name
   * @param {any} data - The data to send with the event
   */
  emit(event: string, data: any): void {
    this.socket.emit(event, data);
  }

    /**
   * Listen to a WebSocket event and return an observable of its data.
   * @template T
   * @param {string} event - The event name to listen for
   * @returns {Observable<T>} Observable emitting the event data
   */
  on<T>(event: string): Observable<T> {
    return new Observable((subscriber) => {
      this.socket.on(event, (data: T) => {
        subscriber.next(data);
      });
    });
  }
}
