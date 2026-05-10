import { Injectable, signal } from '@angular/core';
import { Socket } from 'ngx-socket-io';

export interface ProjectLog {
  type: string;
  message: string;
}

export interface AgentMessage {
  sender: 'system' | 'user' | 'agent';
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public uiDump = signal<string>('');
  public screenshot = signal<string>('');
  public logs = signal<ProjectLog[]>([]);
  public messages = signal<AgentMessage[]>([]);
  public projectStates = signal<{ frontend: boolean; backend: boolean }>({ frontend: false, backend: false });
  // Expose control methods for UI
  public setPaths(paths: { frontend?: string; backend?: string }) {
    this.socket.emit('set_paths', paths);
  }
  public browseDirectory(type: 'frontend' | 'backend') {
    this.socket.emit('browse_directory', type);
  }
  public startProject(type: 'frontend' | 'backend') {
    this.socket.emit('start_project', type);
  }
  public stopProject(type: 'frontend' | 'backend') {
    this.socket.emit('stop_project', type);
  }
  public activeTarget = signal<string | null>(null);

  constructor(private socket: Socket) {
    this.setupListeners();
    this.socket.emit('get_project_states');
  }

  private setupListeners() {
    // existing listeners ...

    this.socket.on('ui_dump', (data: { xml: string }) => {
      this.uiDump.set(data.xml);
    });

    this.socket.on('agent_screenshot', (data: { base64: string }) => {
      this.screenshot.set(data.base64);
    });

    this.socket.on('project_log', (data: ProjectLog) => {
      this.logs.update(logs => [...logs, data]);
    });

    this.socket.on('agent_message', (data: AgentMessage) => {
      this.messages.update(msgs => [...msgs, data]);
    });

    this.socket.on('project_state', (data: { type: 'frontend' | 'backend'; running: boolean }) => {
      this.projectStates.update(states => ({
        ...states,
        [data.type]: data.running
      }));
    });
    
    this.socket.on('highlight_target', (data: { bounds: string }) => {
      this.activeTarget.set(data.bounds);
    });

    this.socket.on('paths_updated', (data: { frontend: string; backend: string }) => {
      this.paths.set(data);
    });
  }

  public paths = signal<{ frontend: string; backend: string }>({ frontend: '', backend: '' });

  public sendCommand(mission: string) {
    this.socket.emit('user_command', mission);
  }

  public fetchKnowledgeFiles() {
    // Basic fetch or we can do it via httpclient
  }
}
