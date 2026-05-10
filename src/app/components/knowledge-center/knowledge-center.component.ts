import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { marked } from 'marked';

@Component({
  selector: 'app-knowledge-center',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col h-full bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div class="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-gray-800 font-semibold">Knowledge Center</h3>
        <button (click)="loadFiles()" class="text-blue-600 hover:text-blue-800 text-sm font-medium">Refresh</button>
      </div>
      
      <div class="flex flex-1 overflow-hidden">
        <div class="w-1/3 border-r border-gray-200 bg-gray-50 overflow-y-auto">
          <ul class="divide-y divide-gray-200">
            <li *ngFor="let file of files()" 
                (click)="selectFile(file)"
                class="p-3 cursor-pointer hover:bg-blue-50"
                [class.bg-blue-100]="activeFile() === file">
              <span class="text-sm font-medium text-gray-700 truncate block">{{ file }}</span>
            </li>
            <li *ngIf="files().length === 0" class="p-4 text-sm text-gray-500 text-center">No files found.</li>
          </ul>
        </div>
        <div class="w-2/3 p-6 overflow-y-auto bg-white prose prose-sm max-w-none">
          <div *ngIf="fileContent()" [innerHTML]="fileContent()"></div>
          <div *ngIf="!fileContent() && activeFile()" class="text-gray-500 text-center mt-10">Loading...</div>
          <div *ngIf="!activeFile()" class="text-gray-400 text-center mt-10">Select a file to view its contents.</div>
        </div>
      </div>
    </div>
  `
})
export class KnowledgeCenterComponent implements OnInit {
  private http = inject(HttpClient);
  
  files = signal<string[]>([]);
  activeFile = signal<string | null>(null);
  fileContent = signal<string>('');

  ngOnInit() {
    this.loadFiles();
  }

  loadFiles() {
    this.http.get<{files: string[]}>('http://localhost:3001/api/knowledge-files').subscribe({
      next: (res) => this.files.set(res.files),
      error: (err) => console.error('Failed to load files', err)
    });
  }

  async selectFile(filename: string) {
    this.activeFile.set(filename);
    this.fileContent.set('');
    
    this.http.get(`http://localhost:3001/api/knowledge-files/${filename}`, { responseType: 'text' }).subscribe({
      next: async (content) => {
        const html = await marked.parse(content);
        this.fileContent.set(html);
      },
      error: (err) => console.error(`Failed to load ${filename}`, err)
    });
  }
}
