import { ApiProxy } from './proxies/apiProxy';
import { KnowledgeSync } from './modules/knowledgeSync';
import { KnowledgeRecord, SystemContext, User } from './interfaces';

// Placeholder for LiteLLM API endpoint or integration details
const LITELLM_API_ENDPOINT = import.meta.env.VITE_LITELLM_API_ENDPOINT || process.env.LITELLM_API_ENDPOINT || 'https://api.litellm.ai/completion'; // Example endpoint
const LITELLM_MODEL = import.meta.env.VITE_LITELLM_MODEL || process.env.LITELLM_MODEL || 'gpt-4o'; // Default model

export class JunAiAssistant {
  private apiProxy: ApiProxy;
  private knowledgeSync: KnowledgeSync;
  private context: SystemContext;
  private memoryContext: KnowledgeRecord[] = []; // Simple in-memory context for recent interactions

  constructor(context: SystemContext) {
    this.context = context;
    this.apiProxy = context.apiProxy;
    this.knowledgeSync = context.knowledgeSync;
    console.log('JunAiAssistant initialized.');
  }

  /**
   * Processes user input, interacts with AI, and syncs knowledge.
   * This is a core orchestration method, leveraging the Four Pillars.
   * Part of the Six Styles of Infinite Evolution (無限進化循環的六式奧義).
   * @param userInput The input from the user.
   * @param context Optional contextual information (e.g., platform).
   * @returns The AI's response.
   */
  async processInput(userInput: string, context?: any): Promise<string> {
    console.log('Processing input:', userInput);
    const userId = this.context.currentUser?.id;

    if (!userId) {
        console.error('Cannot process input: User not authenticated.');
        this.context.loggingService?.logError('Cannot process input: User not authenticated.', { input: userInput, context: context });
        return "Error: You need to be logged in to use the AI assistant.";
    }

    this.context.loggingService?.logInfo('Processing user input', { input: userInput, context: context, userId: userId });

    // TODO: Integrate with AuthorityForgingEngine to record user action (六式奧義: 觀察 - call context.authorityForgingEngine.recordAction)
    // This might be done by the caller (CLI/UI) before calling processInput

    // 1. Retrieve relevant knowledge from the knowledge base (永久記憶中樞)
    // Pass user ID to filter knowledge
    // TODO: Use Wisdom Secret Art for enhanced search if implemented (call context.wisdomSecretArt.enhancedKnowledgeSearch)
    const relevantKnowledge = await this.knowledgeSync.searchKnowledge(userInput, userId);
    console.log(`Found ${relevantKnowledge.length} relevant knowledge records for user ${userId}.`);
    this.context.loggingService?.logInfo(`Found ${relevantKnowledge.length} relevant knowledge records.`, { userId: userId });

    // 2. Prepare prompt for AI, including relevant knowledge and recent context (智慧沉澱秘術)
    const recentContext: KnowledgeRecord[] = this.memoryContext; // Use in-memory context
    const promptMessages = this.buildPromptMessages(userInput, relevantKnowledge, recentContext);

    // 3. Semantic Analysis & Reply (via LiteLLM API or AI Runes) (智慧沉澱秘術)
    // TODO: Use Wisdom Secret Art to orchestrate the AI call and potentially analyze the response (call context.wisdomSecretArt.getAiResponse or analyzeIntentAndDecideAction)
    // TODO: Integrate with RuneEngraftingCenter to select and call appropriate AI Runes based on the query/intent (call context.runeEngraftingCenter.executeRuneAction)

    // --- Simulate Intent Analysis and Action Decision --- (Part of 六式奧義: 決策)
    // In a real scenario, this would call context.wisdomSecretArt.analyzeIntentAndDecideAction
    const simulatedDecision = userInput.toLowerCase().includes('task') ?
        { intent: 'create_task', action: { type: 'suggest_task_creation', details: { description: `Task related to \\\"${userInput}\\\"` } } } : // Simulate suggesting a task
        userInput.toLowerCase().includes('rune') ?
        { intent: 'execute_rune', action: { type: 'suggest_rune_execution', details: { runeId: 'example-script-rune', action: 'greet', params: { name: this.context.currentUser?.name || 'User' } } } } : // Simulate suggesting rune execution
        { intent: 'answer_question', action: { type: 'answer_via_ai', details: { question: userInput } } }; // Default: answer via AI

    let aiResponse = '';

    switch (simulatedDecision.intent) {
        case 'create_task':
            console.log('AI decided to suggest task creation.');
            // TODO: Call SelfNavigationEngine to create a task (call context.selfNavigationEngine.createTask)
            // For now, just generate a response suggesting it.
            aiResponse = `Based on your input, I can help you create a task: \\\"${simulatedDecision.action.details.description}\\\". (Task creation simulated)`;
            break;
        case 'execute_rune':
             console.log('AI decided to suggest rune execution.');
             // TODO: Call RuneEngraftingCenter to execute the suggested rune action (call context.runeEngraftingCenter.executeRuneAction)
             // For now, just generate a response suggesting it.
             aiResponse = `Based on your input, I can execute the rune action \\\"${simulatedDecision.action.details.action}\\\" from \\\"${simulatedDecision.action.details.runeId}\\\". (Rune execution simulated)`;
             // Example of actual call if implemented:
             // const runeResult = await this.context.runeEngraftingCenter?.executeRuneAction(simulatedDecision.action.details.runeId, simulatedDecision.action.details.action, simulatedDecision.action.details.params, userId); // Pass userId
             // aiResponse = `Rune execution result: ${JSON.stringify(runeResult)}`;
             break;
        case 'answer_question':
        default:
            console.log('AI decided to answer the question.');
            // Call LiteLLM API for a direct answer (or use WisdomSecretArt's method)
            aiResponse = await this.getAiResponse(promptMessages); // Direct API call for MVP
            break;
    }

    console.log('Final AI Response:', aiResponse);
    this.context.loggingService?.logInfo('Generated final AI response', { response: aiResponse, userId: userId });

    // 4. Knowledge Base Sync (Input/Output bidirectional sync to Supabase) (永久記憶中樞 / 雙向同步領域)
    // Save the interaction (only save if it was a direct question/answer interaction, not task/rune suggestion)
    if (simulatedDecision.intent === 'answer_question') {
        // Pass user ID when saving knowledge
        const savedRecord = await this.knowledgeSync.saveKnowledge(userInput, aiResponse, userId);
        if (savedRecord) {
            console.log('Interaction saved to knowledge base.');
            // Update in-memory context for short-term memory
            this.updateMemoryContext(savedRecord);
            this.context.loggingService?.logInfo('Interaction saved to knowledge base', { recordId: savedRecord.id, userId: userId });
        } else {
             this.context.loggingService?.logWarning('Failed to save interaction to knowledge base.', { userId: userId });
             console.warn('Failed to save interaction to knowledge base.');
        }
    }

    // 5. Event Push (Triggered by Supabase trigger on new knowledge record, or by explicit publish) (六式奧義: 事件推送)
    // This is handled by the database trigger -> Edge Function -> potentially NotificationService for knowledge saves.
    // Other events (like task creation, rune execution) would be published by their respective modules.

    return aiResponse;
  }

  /**
   * Builds the message array for the AI API call, including context.
   * This is part of the Wisdom Secret Art (智慧沉澱秘術) process.
   * @param userInput The current user input.
   * @param relevantKnowledge Knowledge records retrieved from the KB.
   * @param recentContext Recent interaction records (short-term memory).
   * @returns An array of message objects for the AI API.
   */
  private buildPromptMessages(
      userInput: string,
      relevantKnowledge: KnowledgeRecord[],
      recentContext: KnowledgeRecord[]
  ): Array<{ role: 'system' | 'user' | 'assistant', content: string }> {
      const messages: Array<{ role: 'system' | 'user' | 'assistant', content: string }> = [];

      // Add a system message to define the AI's role and instructions
      messages.push({
          role: 'system',
          content: 'You are Jun.Ai.Key, a helpful and intelligent assistant. You can answer questions, help automate tasks, and manage knowledge. Use the provided knowledge and context to inform your responses.'
      });

      // Add relevant knowledge from the knowledge base as context (Leveraging 永久記憶中樞)
      if (relevantKnowledge.length > 0) {
          messages.push({
              role: 'system',
              content: 'Here is some relevant information from your knowledge base:\n\n' +
                       relevantKnowledge.map(rec => `Q: ${rec.question}\nA: ${rec.answer}`).join('\n---\n')
          });
      }

      // Add recent interaction history as short-term memory
      if (recentContext.length > 0) {
           messages.push({
              role: 'system',
              content: 'Here is the recent conversation history:\n\n' +
                       recentContext.map(rec => `User: ${rec.question}\nAssistant: ${rec.answer}`).join('\n')
          });
      }


      // Add the current user prompt
      messages.push({ role: 'user', content: userInput });

      return messages;
  }

  /**
   * Calls the LiteLLM API to get an AI response.
   * This is the core of the Semantic Analysis & Reply step (智慧沉澱秘術).
   * @param messages The message history and current prompt to send to the AI.
   * @returns The AI's generated text response.
   */
  private async getAiResponse(messages: Array<{ role: string, content: string }>): Promise<string> {
    console.log('Calling LiteLLM API...');
    this.context.loggingService?.logInfo('Calling LiteLLM API', { model: LITELLM_MODEL });

    // TODO: Construct the actual payload for LiteLLM based on its API spec
    // Ensure the messages format matches the API requirement (e.g., OpenAI format)

    const litellmPayload = {
      model: LITELLM_MODEL, // Use model from env or default
      messages: messages,
      max_tokens: 1000, // Adjust token limit as needed
      temperature: 0.7, // Adjust creativity
      // Add other parameters as needed (stream, functions, etc.)
    };

    try {
      // Use the ApiProxy to make the request to the LiteLLM endpoint
      // Assuming LiteLLM_API_ENDPOINT is a full URL
      const response = await this.apiProxy.externalRequest(
        LITELLM_API_ENDPOINT,
        {
            method: 'POST',
            data: litellmPayload,
            // LiteLLM might require an API key in headers or body depending on setup
            // If using an OpenAI key via LiteLLM, you might need:
            // headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }
            // Or LiteLLM might handle the key internally if configured
        },
        false // LiteLLM API usually uses its own key, not Supabase auth
      );

      // TODO: Parse the actual response structure from LiteLLM
      // This depends on the specific LiteLLM setup and model (e.g., OpenAI, Anthropic)
      // Example parsing for OpenAI-compatible response:
      const aiText = response?.choices?.[0]?.message?.content || 'Error: Could not get AI response.';

      this.context.loggingService?.logInfo('LiteLLM API call successful');

      return aiText;

    } catch (error: any) {
      console.error('Error calling LiteLLM API:', error.message);
      this.context.loggingService?.logError('Error calling LiteLLM API', { error: error.message, endpoint: LITELLM_API_ENDPOINT });
      // Simulate a fallback response if API call fails
      return `(Simulated AI Response) I encountered an error processing your request. Could you please rephrase or try again later? Error: ${error.message}`;
    }
  }

  /**
   * Updates the in-memory short-term memory context.
   * @param record The latest knowledge record (user input + AI response).
   */
  private updateMemoryContext(record: KnowledgeRecord) {
      this.memoryContext.push(record);
      // Keep context size manageable (e.g., last 10 interactions)
      const MAX_CONTEXT_SIZE = 10;
      if (this.memoryContext.length > MAX_CONTEXT_SIZE) {
          this.memoryContext.shift(); // Remove the oldest record
      }
  }

  // TODO: Add methods for integrating with other modules (Self-Navigation, Authority Forging).
  // For example, the AI might decide to trigger a task or forge an ability based on input/response analysis.
  // This could be done by analyzing the AI's response for specific keywords or structured output.
  // This analysis and subsequent action triggering is part of the Self-Navigation pillar and Six Styles (決策).
}