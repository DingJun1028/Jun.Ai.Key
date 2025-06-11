import { MessageBus } from './message-bus';
import { AgentRegistry } from './agent-registry';
import { BaseAgent, AgentMessage, AgentResponse } from './base-agent';

export class OmniKeyCoreAgent extends BaseAgent {
  private agentRegistry: AgentRegistry;
  private messageBus: MessageBus;

  constructor(agentRegistry: AgentRegistry, messageBus: MessageBus) {
    super('OmniKeyCoreAgent');
    this.agentRegistry = agentRegistry;
    this.messageBus = messageBus;
    this.messageBus.subscribe(this.agentName, this.handleMessage.bind(this));
  }

  protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {
    console.log(`[${this.agentName}] Received message: type=${message.type}, sender=${message.sender}, correlationId=${message.correlationId}`);

    const targetAgentName = this.determineTargetAgent(message.type);

    if (targetAgentName) {
      const targetAgent = this.agentRegistry.getAgent(targetAgentName);
      if (targetAgent) {
        const outboundMessage: AgentMessage = { ...message, sender: this.agentName };
        this.messageBus.publish(targetAgentName, outboundMessage);
        console.log(`[${this.agentName}] Routed message type ${message.type} to agent ${targetAgentName}`);
        return { success: true, data: { message: `Request routed to ${targetAgentName}` } };
      } else {
        console.error(`[${this.agentName}] Agent ${targetAgentName} not found in registry.`);
        return { success: false, error: `Agent ${targetAgentName} not found.` };
      }
    }
    console.warn(`[${this.agentName}] No route for message type: ${message.type}`);
    return { success: false, error: `No route for message type: ${message.type}` };
  }

  private determineTargetAgent(messageType: string): string | null {
    if (messageType.startsWith('input_')) return 'OmniFormatAgent';
    if (messageType.startsWith('knowledge_')) return 'OmniLibraryAgent';
    if (messageType.startsWith('ai_')) return 'OmniWisdomAgent';
    if (messageType.startsWith('sync_')) return 'OmniSyncAgent';
    return null;
  }

  public async initialize(): Promise<void> {
    console.log(`[${this.agentName}] Initialized.`);
  }
}

{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "pwa-node",
      "request": "launch",
      "name": "Launch Webpack Dev Server",
      "runtimeExecutable": "npx",
      "runtimeArgs": [
        "webpack",
        "serve",
        "--mode",
        "development",
        "--open"
      ],
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal"
    },
    {
      "type": "pwa-chrome",
      "request": "launch",
      "name": "Launch Chrome against localhost",
      "url": "http://localhost:8080",
      "webRoot": "${workspaceFolder}/src"
    },
    {
      "type": "debugpy",
      "request": "launch",
      "name": "Launch Python File",
      "program": "${workspaceFolder}/${input:pythonFile}"
    }
  ],
  "inputs": [
    {
      "id": "pythonFile",
      "type": "pickString",
      "description": "Select the Python file to debug",
      "options": [
        "hello.py"
      ]
    }
  ]
}