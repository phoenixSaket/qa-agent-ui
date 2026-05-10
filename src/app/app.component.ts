import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DevicePreviewComponent } from './components/device-preview/device-preview.component';
import { LogStreamComponent } from './components/log-stream/log-stream.component';
import { KnowledgeCenterComponent } from './components/knowledge-center/knowledge-center.component';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, DevicePreviewComponent, LogStreamComponent, KnowledgeCenterComponent],
  template: `
    <div class="h-screen bg-gray-100 flex flex-col p-4">
      <header class="mb-4 flex justify-between items-center bg-white p-4 rounded-lg shadow">
        <h1 class="text-2xl font-bold text-gray-800">QA Agent UI</h1>
        
          <div class="flex items-end space-y-2 gap-4">
            <div class="flex items-center space-x-2">
              <span class="text-xs font-bold text-gray-500 uppercase">Frontend</span>
              <div class="w-3 h-3 rounded-full" [ngClass]="projectStates().frontend ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'"></div>
              <button 
                (click)="toggleProject('frontend')" 
                [disabled]="!paths().frontend"
                class="text-xs px-2 py-1 rounded transition-colors"
                [ngClass]="projectStates().frontend ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'">
                {{ projectStates().frontend ? 'Stop' : 'Start' }}
              </button>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-xs font-bold text-gray-500 uppercase">Backend</span>
              <div class="w-3 h-3 rounded-full" [ngClass]="projectStates().backend ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'"></div>
              <button 
                (click)="toggleProject('backend')" 
                [disabled]="!paths().backend"
                class="text-xs px-2 py-1 rounded transition-colors"
                [ngClass]="projectStates().backend ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'">
                {{ projectStates().backend ? 'Stop' : 'Start' }}
              </button>
            </div>
          </div>
      </header>

      <!-- Project Path Configuration -->
      <section class="mb-4 bg-white p-4 rounded-lg shadow flex flex-col md:flex-row gap-4 items-end">
        <div class="flex-1 flex flex-col gap-2 w-full">
          <label for="frontendPath" class="text-xs font-bold text-gray-500 uppercase">Frontend Path</label>
          <div class="flex gap-2">
            <input 
              id="frontendPath"
              name="frontendPath"
              type="text" 
              [(ngModel)]="frontendPath"
              class="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="/path/to/frontend"
            />
            <button 
              id="browseFrontendBtn"
              type="button"
              (click)="browse('frontend')"
              class="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded text-xs font-semibold transition-colors">
              Browse
            </button>
          </div>
        </div>
        <div class="flex-1 flex flex-col gap-2 w-full">
          <label for="backendPath" class="text-xs font-bold text-gray-500 uppercase">Backend Path</label>
          <div class="flex gap-2">
            <input 
              id="backendPath"
              name="backendPath"
              type="text" 
              [(ngModel)]="backendPath"
              class="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="/path/to/backend"
            />
            <button 
              id="browseBackendBtn"
              type="button"
              (click)="browse('backend')"
              class="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded text-xs font-semibold transition-colors">
              Browse
            </button>
          </div>
        </div>
        <button 
          id="updatePathsBtn"
          type="button"
          (click)="updatePaths()"
          class="bg-gray-800 hover:bg-black text-white px-4 py-1.5 rounded text-sm font-medium transition-colors h-[38px]">
          Update Paths
        </button>
      </section>

      <main class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 min-h-0">
        <!-- Left Column: Knowledge Base -->
        <div class="col-span-1 min-h-0 flex flex-col">
          <app-knowledge-center class="flex-1"></app-knowledge-center>
        </div>

        <!-- Middle Column: Device Preview -->
        <div class="col-span-1 min-h-0 flex flex-col">
          <app-device-preview class="flex-1"></app-device-preview>
          
          <!-- Command Input -->
          <div class="mt-4 bg-white p-4 rounded-lg shadow flex">
            <input 
              #missionInput
              type="text" 
              class="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter mission for the QA Agent..."
              (keyup.enter)="sendCommand(missionInput.value); missionInput.value = ''"
            />
            <button 
              (click)="sendCommand(missionInput.value); missionInput.value = ''"
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-md font-medium transition-colors">
              Execute
            </button>
          </div>
        </div>

        <!-- Right Column: Logs and Messages -->
        <div class="col-span-1 min-h-0 flex flex-col gap-4">
          <!-- Logs Component -->
          <app-log-stream class="flex-1 min-h-0"></app-log-stream>
          
          <!-- Agent Messages -->
          <div class="flex-1 min-h-0 bg-white rounded-lg shadow border border-gray-200 flex flex-col overflow-hidden">
            <div class="bg-gray-50 p-2 border-b border-gray-200">
              <h3 class="font-semibold text-gray-800 text-sm">Agent Messages</h3>
            </div>
            <div class="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
              <div *ngFor="let msg of messages()" class="flex flex-col">
                <span class="font-bold text-xs" [ngClass]="{
                  'text-blue-600': msg.sender === 'system',
                  'text-green-600': msg.sender === 'user',
                  'text-purple-600': msg.sender === 'agent'
                }">{{ msg.sender | uppercase }}</span>
                <span class="text-gray-700" [innerHTML]="msg.text"></span>
              </div>
              <div *ngIf="messages().length === 0" class="text-gray-500 text-center italic mt-10">No messages yet.</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class AppComponent {
  private socketService = inject(SocketService);
  
  projectStates = this.socketService.projectStates;
  paths = this.socketService.paths;
  messages = this.socketService.messages;

  frontendPath = '';
  backendPath = '';

  constructor() {
    // Sync paths from service to local model for editing
    effect(() => {
      const currentPaths = this.paths();
      if (currentPaths.frontend) this.frontendPath = currentPaths.frontend;
      if (currentPaths.backend) this.backendPath = currentPaths.backend;
    });
  }

  updatePaths() {
    this.socketService.setPaths({
      frontend: this.frontendPath,
      backend: this.backendPath
    });
  }

  browse(type: 'frontend' | 'backend') {
    this.socketService.browseDirectory(type);
  }

  toggleProject(type: 'frontend' | 'backend') {
    if (this.projectStates()[type]) {
      this.socketService.stopProject(type);
    } else {
      this.socketService.startProject(type);
    }
  }

  sendCommand(mission: string) {
    if (mission.trim()) {
      this.socketService.sendCommand(mission.trim());
    }
  }
}
