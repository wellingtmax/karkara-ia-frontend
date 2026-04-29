import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { finalize } from 'rxjs/operators';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent {
  messages: Message[] = [
    {
      sender: 'bot',
      text: 'Ola! Sou seu assistente com IA. Como posso ajudar?'
    }
  ];

  userMessage = '';
  loading = false;

  constructor(private chatService: ChatService) {}

sendMessage() {
  const message = this.userMessage.trim();

  if (!message || this.loading) return;

  this.messages.push({ sender: 'user', text: message });

  this.userMessage = '';
  this.loading = true;

  this.chatService.sendMessage(message)
    .pipe(
      finalize(() => this.loading = false)
    )
    .subscribe({
      next: (res) => {
        this.messages.push({
          sender: 'bot',
          text: res.reply
        });
      },
      error: () => {
        this.messages.push({
          sender: 'bot',
          text: 'Erro ao conectar com a IA.'
        });
      }
    });
}
}