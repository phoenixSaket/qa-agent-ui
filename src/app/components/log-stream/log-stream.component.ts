import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-log-stream',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col h-full bg-[#1e1e1e] rounded-lg overflow-hidden border border-gray-700 font-mono text-sm">
      <div class="bg-[#2d2d2d] p-2 border-b border-gray-700 flex justify-between items-center text-xs">
        <div class="flex space-x-2">
          <button 
            class="px-3 py-1 rounded" 
            [class.bg-blue-600]="activeFilter() === 'all'" 
            [class.text-white]="activeFilter() === 'all'"
            [class.text-gray-400]="activeFilter() !== 'all'"
            (click)="activeFilter.set('all')">All</button>
          <button 
            class="px-3 py-1 rounded" 
            [class.bg-blue-600]="activeFilter() === 'frontend'" 
            [class.text-white]="activeFilter() === 'frontend'"
            [class.text-gray-400]="activeFilter() !== 'frontend'"
            (click)="activeFilter.set('frontend')">Frontend</button>
          <button 
            class="px-3 py-1 rounded" 
            [class.bg-blue-600]="activeFilter() === 'backend'" 
            [class.text-white]="activeFilter() === 'backend'"
            [class.text-gray-400]="activeFilter() !== 'backend'"
            (click)="activeFilter.set('backend')">Backend</button>
        </div>
      </div>
      
      <div class="flex-1 overflow-y-auto p-4 space-y-1">
        <div *ngFor="let log of filteredLogs()" 
             [ngClass]="{'text-red-400': log.message.includes('ERROR') || log.message.includes('500'), 'text-green-400': log.message.includes('success'), 'text-gray-300': !log.message.includes('ERROR') && !log.message.includes('success')}">
          <span class="text-gray-500">[{{ log.type | uppercase }}]</span> {{ log.message }}
        </div>
        <div *ngIf="filteredLogs().length === 0" class="text-gray-600 italic">No logs received yet...</div>
      </div>
    </div>
  `
})
export class LogStreamComponent {
  private socketService = inject(SocketService);
  
  logs = this.socketService.logs;
  activeFilter = signal<'all' | 'frontend' | 'backend'>('all');

  filteredLogs = computed(() => {
    const filter = this.activeFilter();
    const currentLogs = this.logs();
    if (filter === 'all') return currentLogs;
    return currentLogs.filter(log => log.type === filter);
  });
}
