import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: Socket;
  private room!: string;

  constructor() { }

  connect(): void {
    this.socket = io('http://localhost:3000');
  }

  joinRoom(room: string): void {
    this.room = room;
    this.socket.emit('joinRoom', room); // Emite el evento 'joinRoom' al servidor con el nombre de la sala
  }

  leaveRoom(): void {
    this.socket.emit('leaveRoom'); // Emite el evento 'leaveRoom' al servidor
  }


  sendDrawing(data: any): void {
    // this.socket.emit('drawing', data);
    this.socket.emit('drawing', { room: this.room, data });
  }

  getDrawing(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('drawing', (data: any) => {
        observer.next(data);
      });
    });
  }

  sendChatMessage(message: string): void {
    // this.socket.emit('chatMessage', message);
    this.socket.emit('chatMessage', { room: this.room, message });

  }

  getChatMessage(): Observable<string> {
    return new Observable<string>(observer => {
      this.socket.on('chatMessage', (message: string) => {
        observer.next(message);
      });
    });
  }


}
