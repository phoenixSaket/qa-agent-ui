import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { DevicePreviewComponent } from './components/device-preview/device-preview';
import { LogStreamComponent } from './components/log-stream/log-stream';
import { KnowledgeCenterComponent } from './components/knowledge-center/knowledge-center';
import { SocketService } from './services/socket';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, DevicePreviewComponent, LogStreamComponent, KnowledgeCenterComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  missionInput = '';
  isRecording = false;
  panels = {
    controls: false,
    chat: false,
    device: false
  };
  parsedMessages: { [key: number]: SafeHtml } = {};

  constructor(public socketService: SocketService, private sanitizer: DomSanitizer) {
    effect(() => {
      const msgs = this.socketService.agentMessages();
      msgs.forEach((msg, index) => {
        if (msg.sender === 'agent' && !this.parsedMessages[index]) {
            this.parseMessage(msg.text, index);
        }
      });
    });
  }

  async parseMessage(text: string, index: number) {
      const parsed = await marked.parse(text);
      this.parsedMessages[index] = this.sanitizer.bypassSecurityTrustHtml(parsed);
  }

  togglePanel(panel: 'controls' | 'chat' | 'device') {
    this.panels[panel] = !this.panels[panel];
  }

  sendCommand() {
    if (this.missionInput.trim()) {
      this.socketService.userCommand(this.missionInput.trim());
      this.missionInput = '';
    }
  }

  stopAgent() {
    this.socketService.stopAgent();
  }

  toggleRecording() {
    this.socketService.toggleRecordingMode(this.isRecording);
  }

  startStack() {
    this.socketService.startProject('frontend');
    this.socketService.startProject('backend');
  }
}
