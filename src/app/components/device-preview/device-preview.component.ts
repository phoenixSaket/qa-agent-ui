import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-device-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col h-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
      <div class="bg-gray-800 p-3 border-b border-gray-700 flex justify-between items-center">
        <h3 class="text-white font-semibold">Device Preview</h3>
      </div>
      
      <div class="relative flex-1 overflow-auto p-4 flex justify-center items-center bg-black">
        <div class="relative inline-block" *ngIf="screenshotBase64()">
          <img [src]="'data:image/png;base64,' + screenshotBase64()" class="max-w-xs md:max-w-sm rounded object-contain border border-gray-600" alt="Device Screen"/>
          
          <div *ngIf="targetRect()" class="absolute border-2 border-red-500 bg-red-500 bg-opacity-20 animate-pulse"
               [ngStyle]="targetRect()">
          </div>
        </div>
        
        <div *ngIf="!screenshotBase64()" class="text-gray-500 text-sm flex flex-col items-center">
          <svg class="animate-spin h-8 w-8 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Waiting for screen capture...
        </div>
      </div>
    </div>
  `
})
export class DevicePreviewComponent {
  private socketService = inject(SocketService);
  
  screenshotBase64 = this.socketService.screenshot;
  activeTarget = this.socketService.activeTarget;

  targetRect = computed(() => {
    const target = this.activeTarget();
    if (!target) return null;
    
    // Parse bounds: [x1,y1][x2,y2]
    const match = target.match(/\\[(\\d+),(\\d+)\\]\\[(\\d+),(\\d+)\\]/);
    if (!match) return null;

    const [_, x1, y1, x2, y2] = match;
    
    // Device preview might be scaled. Assume a generic scale or just return percentages.
    // Ideally, we calculate percentage based on device details. 
    // For simplicity, we'll return raw px and rely on CSS transforms or scale, 
    // but the best way is to assume a 1080x2400 device for exact percentages:
    const left = (parseInt(x1) / 1080) * 100;
    const top = (parseInt(y1) / 2400) * 100;
    const width = ((parseInt(x2) - parseInt(x1)) / 1080) * 100;
    const height = ((parseInt(y2) - parseInt(y1)) / 2400) * 100;

    return {
      left: `${left}%`,
      top: `${top}%`,
      width: `${width}%`,
      height: `${height}%`
    };
  });
}
