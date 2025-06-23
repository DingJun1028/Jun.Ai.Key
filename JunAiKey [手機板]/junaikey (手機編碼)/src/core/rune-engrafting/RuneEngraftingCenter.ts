// src/core/rune-engrafting/RuneEngraftingCenter.ts
// 符文嵌合協議 (Rune Engrafting Center) - 核心模組
// Manages the registration, discovery, and execution of external capabilities (Runes).
// Forms the Omni Agent Group and enables Infinite Expansion.
// Corresponds to the Rune Fusion Protocol concept.
// Design Principle: Provides a standardized interface for interacting with diverse external services and plugins.

import { Rune, SystemContext, RuneManifest, MobileGitSyncConfig, ScriptingAppWorkflow } from '../../interfaces';
import { SupabaseClient } from '@supabase/supabase-js';
// import { LoggingService } from '../logging/LoggingService'; // Dependency
// import { EventBus } from '../../modules/events/EventBus'; // Dependency
// import { ApiProxy } from '../../proxies/apiProxy'; // Dependency


export class RuneEngraftingCenter {
  // private availableRunes: Rune[] = []; // List of available runes/plugins - Now fetched from Supabase
  private context: SystemContext;
  private supabase: SupabaseClient;
  // private loggingService: LoggingService; // Access via context
  // private eventBus: EventBus; // Access via context
  // private apiProxy: ApiProxy; // Access via context


  constructor(context: SystemContext) {
    this.context = context;
    this.supabase = context.apiProxy.supabaseClient; // Use the Supabase client from ApiProxy
    // this.loggingService = context.loggingService;
    // this.eventBus = context.eventBus;
    // this.apiProxy = context.apiProxy;
    console.log('RuneEngraftingCenter initialized.');

    // TODO: Load initial data (public and user-specific runes) from persistence on startup (Supports Bidirectional Sync Domain)
    // This might involve fetching all public runes and the current user's runes on auth state change.
    // TODO: Integrate with SyncService for syncing rune availability/updates (雙向同步領域)

    // Simulate registering some initial runes for demonstration
    // These are global/public runes for now, but should be loaded from DB
    // The actual registration logic should be in a setup script or migration, not the constructor
    // Keeping them here for MVP demo purposes
    // Note: The `implementation` property is NOT stored in Supabase for security and complexity reasons.
    // The implementation logic resides here in the RuneEngraftingCenter or associated files.
    // The Rune object stored in DB only contains metadata (id, name, type, manifest, config, etc.)

    // Example Rune Implementations (These would be defined elsewhere and referenced by ID)
    const runeImplementations: { [runeId: string]: any } = {
        'example-script-rune': {
            runExample: async (params: any, context: SystemContext) => { // Added context parameter
                console.log('[Rune] Executing example script rune: runExample with params:', params, 'for user:', context.currentUser?.id);
                context.loggingService?.logInfo('Executed example-script-rune: runExample', { params, userId: context.currentUser?.id });
                // TODO: Execute script code in a WASM sandbox (Part of 符文嵌合協議)
                await new Promise(resolve => setTimeout(resolve, 300)); // Simulate work
                return { status: 'success', output: 'Example script finished.' };
            },
            greet: async (params: { name?: string }, context: SystemContext) => { // Added context parameter
                 const greeting = `Hello, ${params.name || 'world'}!`;
                 console.log('[Rune] Executing greet rune: greet with params:', params, 'for user:', context.currentUser?.id);
                 context.loggingService?.logInfo('Executed example-script-rune: greet', { params, userId: context.currentUser?.id });
                 // TODO: Execute script code in a WASM sandbox (Part of 符文嵌合協議)
                 await new Promise(resolve => setTimeout(resolve, 200)); // Simulate work
                 return { status: 'success', output: greeting };
            }
        },
        'example-api-adapter': {
           fetchData: async (params: any, context: SystemContext) => { // Added context parameter
               console.log('[Rune] Simulating fetching data from external API with params:', params, 'for user:', context.currentUser?.id);
               // TODO: Implement actual API call to external service via apiProxy (Part of 符文嵌合協議)
               // Example: const result = await context.apiProxy.externalRequest('https://external.api/data', { method: 'GET', params: params }, true); // Use Supabase auth if needed
               context.loggingService?.logInfo('Executed example-api-adapter: fetchData', { params, userId: context.currentUser?.id });
               await new Promise(resolve => setTimeout(resolve, 800));
               return { status: 'simulated_success', data: { result: 'some simulated data' } };
            },
           sendData: async (params: any, context: SystemContext) => { // Added context parameter
               console.log('[Rune] Simulating sending data to external API with params:', params, 'for user:', context.currentUser?.id);
               // TODO: Implement actual API call to external service via apiProxy (Part of 符文嵌合協議)
               // Example: const result = await context.apiProxy.externalRequest('https://external.api/data', { method: 'POST', data: params }, true);
               context.loggingService?.logInfo('Executed example-api-adapter: sendData', { params, userId: context.currentUser?.id });
               await new Promise(resolve => setTimeout(resolve, 600));
               return { status: 'simulated_success', message: 'Simulated data sent' };
           }
        },
        'capacities-data-source': {
            queryObjects: async (params: any, context: SystemContext) => {
                console.log('[Rune] Calling apiProxy.callCapacitiesAPI: queryObjects with params:', params, 'for user:', context.currentUser?.id);
                context.loggingService?.logInfo('Executed capacities-data-source: queryObjects', { params, userId: context.currentUser?.id });
                // Call the specific API proxy method
                return context.apiProxy.callCapacitiesAPI('queryObjects', 'POST', params); // Assuming POST for query
            },
            saveObject: async (params: any, context: SystemContext) => {
                 console.log('[Rune] Calling apiProxy.callCapacitiesAPI: saveObject with params:', params, 'for user:', context.currentUser?.id);
                 context.loggingService?.logInfo('Executed capacities-data-source: saveObject', { params, userId: context.currentUser?.id });
                 return context.apiProxy.callCapacitiesAPI('saveObject', 'POST', params);
            },
             listObjects: async (params: any, context: SystemContext) => {
                 console.log('[Rune] Calling apiProxy.callCapacitiesAPI: listObjects with params:', params, 'for user:', context.currentUser?.id);
                 context.loggingService?.logInfo('Executed capacities-data-source: listObjects', { params, userId: context.currentUser?.id });
                 return context.apiProxy.callCapacitiesAPI('listObjects', 'GET', params); // Assuming GET for list
            }
        },
        'infoflow-data-source': {
            searchNotes: async (params: any, context: SystemContext) => {
                console.log('[Rune] Calling apiProxy.callInfoflowAPI: searchNotes with params:', params, 'for user:', context.currentUser?.id);
                context.loggingService?.logInfo('Executed infoflow-data-source: searchNotes', { params, userId: context.currentUser?.id });
                return context.apiProxy.callInfoflowAPI('searchNotes', params);
            },
             createNote: async (params: any, context: SystemContext) => {
                console.log('[Rune] Calling apiProxy.callInfoflowAPI: createNote with params:', params, 'for user:', context.currentUser?.id);
                context.loggingService?.logInfo('Executed infoflow-data-source: createNote', { params, userId: context.currentUser?.id });
                return context.apiProxy.callInfoflowAPI('createNote', params);
            },
             listNotes: async (params: any, context: SystemContext) => {
                console.log('[Rune] Calling apiProxy.callInfoflowAPI: listNotes with params:', params, 'for user:', context.currentUser?.id);
                context.loggingService?.logInfo('Executed infoflow-data-source: listNotes', { params, userId: context.currentUser?.id });
                return context.apiProxy.callInfoflowAPI('listNotes', params);
            }
        },
        'aitable-ai-data-source': { // Note: This is Aitable.ai, not Airtable
            queryRecords: async (params: any, context: SystemContext) => {
                console.log('[Rune] Calling apiProxy.callAitableAIAPI: queryRecords with params:', params, 'for user:', context.currentUser?.id);
                context.loggingService?.logInfo('Executed aitable-ai-data-source: queryRecords', { params, userId: context.currentUser?.id });
                return context.apiProxy.callAitableAIAPI('queryRecords', params);
            },
             createRecord: async (params: any, context: SystemContext) => {
                console.log('[Rune] Calling apiProxy.callAitableAIAPI: createRecord with params:', params, 'for user:', context.currentUser?.id);
                context.loggingService?.logInfo('Executed aitable-ai-data-source: createRecord', { params, userId: context.currentUser?.id });
                return context.apiProxy.callAitableAIAPI('createRecord', params);
            },
             updateRecord: async (params: any, context: SystemContext) => {
                console.log('[Rune] Calling apiProxy.callAitableAIAPI: updateRecord with params:', params, 'for user:', context.currentUser?.id);
                context.loggingService?.logInfo('Executed aitable-ai-data-source: updateRecord', { params, userId: context.currentUser?.id });
                return context.apiProxy.callAitableAIAPI('updateRecord', params);
            }
        },
        'upnote-data-source': {
            searchNotes: async (params: any, context: SystemContext) => {
                console.log('[Rune] Calling apiProxy.callUpNoteAPI: searchNotes with params:', params, 'for user:', context.currentUser?.id);
                context.loggingService?.logInfo('Executed upnote-data-source: searchNotes', { params, userId: context.currentUser?.id });
                // Note: UpNote currently does not have a public API. This is a placeholder for future possibility or local integration.
                return context.apiProxy.callUpNoteAPI('searchNotes', params);
            },
             createNote: async (params: any, context: SystemContext) => {
                console.log('[Rune] Calling apiProxy.callUpNoteAPI: createNote with params:', params, 'for user:', context.currentUser?.id);
                context.loggingService?.logInfo('Executed upnote-data-source: createNote', { params, userId: context.currentUser?.id });
                return context.apiProxy.callUpNoteAPI('createNote', params);
            },
             getNoteContent: async (params: any, context: SystemContext) => {
                console.log('[Rune] Calling apiProxy.callUpNoteAPI: getNoteContent with params:', params, 'for user:', context.currentUser?.id);
                context.loggingService?.logInfo('Executed upnote-data-source: getNoteContent', { params, userId: context.currentUser?.id });
                return context.apiProxy.callUpNoteAPI('getNoteContent', params);
            }
        },
        'boost-space-api': {
            analyzeJunAI: async (params: { inputText: string, analysisType?: string, priority?: number }, context: SystemContext) => {
                console.log('[Rune] Calling Boost.Space API: /jun-ai/analyze with params:', params, 'for user:', context.currentUser?.id);
                context.loggingService?.logInfo('Executed boost-space-api: analyzeJunAI', { params, userId: context.currentUser?.id });
                // Call the specific API proxy method for Boost.Space
                return context.apiProxy.callBoostSpaceAPI('/jun-ai/analyze', 'POST', params);
            },
            getUniversalKeyTemplates: async (params: any, context: SystemContext) => {
                 console.log('[Rune] Calling Boost.Space API: /universal-key/templates with params:', params, 'for user:', context.currentUser?.id);
                 context.loggingService?.logInfo('Executed boost-space-api: getUniversalKeyTemplates', { params, userId: context.currentUser?.id });
                 return context.apiProxy.callBoostSpaceAPI('/universal-key/templates', 'GET', params);
            },
            executeUniversalKey: async (params: { templateId: string, parameters: any }, context: SystemContext) => {
                 console.log('[Rune] Calling Boost.Space API: /universal-key/execute with params:', params, 'for user:', context.currentUser?.id);
                 context.loggingService?.logInfo('Executed boost-space-api: executeUniversalKey', { params, userId: context.currentUser?.id });
                 return context.apiProxy.callBoostSpaceAPI('/universal-key/execute', 'POST', params);
            },
            syncBackup: async (params: { data: any, dataType: string }, context: SystemContext) => {
                 console.log('[Rune] Calling Boost.Space API: /sync/backup with params:', params, 'for user:', context.currentUser?.id);
                 context.loggingService?.logInfo('Executed boost-space-api: syncBackup', { params, userId: context.currentUser?.id });
                 return context.apiProxy.callBoostSpaceAPI('/sync/backup', 'POST', params);
            },
             syncRestore: async (params: { dataType: string }, context: SystemContext) => {
                 console.log('[Rune] Calling Boost.Space API: /sync/restore with params:', params, 'for user:', context.currentUser?.id);
                 context.loggingService?.logInfo('Executed boost-space-api: syncRestore', { params, userId: context.currentUser?.id });
                 return context.apiProxy.callBoostSpaceAPI('/sync/restore', 'GET', params); // Assuming GET for restore
            }
        },
        'scripting-app-webhook-trigger': {
            triggerScript: async (params: { scriptName: string, payload?: any }, context: SystemContext) => {
                console.log('[Rune] Calling apiProxy.callScriptingAppWebhook with params:', params, 'for user:', context.currentUser?.id);
                context.loggingService?.logInfo('Executed scripting-app-webhook-trigger: triggerScript', { params, userId: context.currentUser?.id });
                // Call the specific API proxy method for Scripting.App webhook
                // The payload sent to the webhook should tell Scripting.app which script to run and what data to use
                return context.apiProxy.callScriptingAppWebhook({ scriptName: params.scriptName, payload: params.payload, userId: context.currentUser?.id }); // Pass user ID in payload
            }
        },
        'make-com-webhook-trigger': {
            trigger: async (payload: any, context: SystemContext) => {
                console.log('[Rune] Calling apiProxy.callMakeWebhook with payload:', payload, 'for user:', context.currentUser?.id);
                context.loggingService?.logInfo('Executed make-com-webhook-trigger: trigger', { payload, userId: context.currentUser?.id });
                // Call the specific API proxy method for Make.com webhook
                return context.apiProxy.callMakeWebhook(payload);
            }
        },
        'straico-ai-agent': {
            promptCompletion: async (params: { prompt: string, model?: string }, context: SystemContext) => {
                console.log('[Rune] Calling apiProxy.callStraicoAIAPI: promptCompletion with params:', params, 'for user:', context.currentUser?.id);
                context.loggingService?.logInfo('Executed straico-ai-agent: promptCompletion', { params, userId: context.currentUser?.id });
                // Call the specific API proxy method for Straico
                return context.apiProxy.callStraicoAIAPI('prompt/completion', { prompt: params.prompt, model: params.model || 'gpt-4o' }); // Assuming Straico uses OpenAI models
            },
             analyzeText: async (params: { text: string, analysisType: string }, context: SystemContext) => {
                console.log('[Rune] Calling apiProxy.callStraicoAIAPI: analyzeText with params:', params, 'for user:', context.currentUser?.id);
                context.loggingService?.logInfo('Executed straico-ai-agent: analyzeText', { params, userId: context.currentUser?.id });
                // This would map to a specific Straico endpoint or prompt
                return context.apiProxy.callStraicoAIAPI('analyze', params); // Hypothetical analyze endpoint
            }
        },
        'mobile-git-sync-rune': {
            // The implementation here is a placeholder that calls the SyncService
            // The SyncService is responsible for the actual communication with the mobile device.
            pull: async (params: any, context: SystemContext) => {
                console.log('[Rune] Calling SyncService to simulate Mobile Git Pull with params:', params, 'for user:', context.currentUser?.id);
                context.loggingService?.logInfo('Executed mobile-git-sync-rune: pull', { params, userId: context.currentUser?.id });
                // The SyncService method will handle the communication with the mobile device
                return context.syncService?.syncMobileGitRepo(context.currentUser?.id!, 'pull', params); // Pass user ID
            },
            push: async (params: any, context: SystemContext) => {
                 console.log('[Rune] Calling SyncService to simulate Mobile Git Push with params:', params, 'for user:', context.currentUser?.id);
                 context.loggingService?.logInfo('Executed mobile-git-sync-rune: push', { params, userId: context.currentUser?.id });
                 return context.syncService?.syncMobileGitRepo(context.currentUser?.id!, 'push', params); // Pass user ID
            },
            commit: async (params: { message: string }, context: SystemContext) => {
                 console.log('[Rune] Calling SyncService to simulate Mobile Git Commit with params:', params, 'for user:', context.currentUser?.id);
                 context.loggingService?.logInfo('Executed mobile-git-sync-rune: commit', { params, userId: context.currentUser?.id });
                 // This might trigger a command on the mobile device via SyncService
                 // The SyncService's syncMobileGitRepo now handles the simulated commit log
                 return { status: 'simulated_success', message: `Simulated commit with message: \"${params.message}\"` };
            },
            status: async (params: any, context: SystemContext) => {
                 console.log('[Rune] Calling SyncService to simulate Mobile Git Status with params:', params, 'for user:', context.currentUser?.id);
                 context.loggingService?.logInfo('Executed mobile-git-sync-rune: status', { params, userId: context.currentUser?.id });
                 // This might query the mobile device via SyncService
                 return { status: 'simulated_success', output: 'Simulated git status: Clean working tree' };
            },
            saveFileToRepo: async (params: { filePath: string, content: string, commit?: boolean, commitMessage?: string }, context: SystemContext) => {
                 console.log('[Rune] Calling SyncService to simulate saving file to Mobile Git Repo with params:', params, 'for user:', context.currentUser?.id);
                 context.loggingService?.logInfo('Executed mobile-git-sync-rune: saveFileToRepo', { params, userId: context.currentUser?.id });
                 // This would send the file content and path to the mobile device via SyncService
                 return { status: 'simulated_success', message: `Simulated saving file ${params.filePath} to mobile repo.` };
            }
        },
        'github-api-rune': {
            // The implementation here calls the ApiProxy for GitHub
            getFileContent: async (params: { owner: string, repo: string, path: string, ref?: string }, context: SystemContext) => {
                console.log('[Rune] Calling apiProxy.callGitHubAPI: getFileContent with params:', params, 'for user:', context.currentUser?.id);
                context.loggingService?.logInfo('Executed github-api-rune: getFileContent', { params, userId: context.currentUser?.id });
                // Call the specific API proxy method for GitHub
                // Note: GitHub API requires specific headers (Accept) and authentication (Token)
                return context.apiProxy.callGitHubAPI(`/repos/${params.owner}/${params.repo}/contents/${params.path}`, 'GET', params);
            },
            updateFileContent: async (params: { owner: string, repo: string, path: string, content: string, message: string, sha: string, branch?: string }, context: SystemContext) => {
                 console.log('[Rune] Calling apiProxy.callGitHubAPI: updateFileContent with params:', params, 'for user:', context.currentUser?.id);
                 context.loggingService?.logInfo('Executed github-api-rune: updateFileContent', { params, userId: context.currentUser?.id });
                 // Call the specific API proxy method for GitHub
                 // Note: GitHub API for updating file content is a PUT request
                 return context.apiProxy.callGitHubAPI(`/repos/${params.owner}/${params.repo}/contents/${params.path}`, 'PUT', {
                     message: params.message,
                     content: btoa(params.content), // Content must be Base64 encoded
                     sha: params.sha, // Required for updates
                     branch: params.branch,
                 });
            },
            createCommit: async (params: { owner: string, repo: string, message: string, tree: string, parents: string[] }, context: SystemContext) => {
                 console.log('[Rune] Calling apiProxy.callGitHubAPI: createCommit with params:', params, 'for user:', context.currentUser?.id);
                 context.loggingService?.logInfo('Executed github-api-rune: createCommit', { params, userId: context.currentUser?.id });
                 // Call the specific API proxy method for GitHub
                 return context.apiProxy.callGitHubAPI(`/repos/${params.owner}/${params.repo}/git/commits`, 'POST', params);
            },
            createPullRequest: async (params: { owner: string, repo: string, title: string, head: string, base: string, body?: string }, context: SystemContext) => {
                 console.log('[Rune] Calling apiProxy.callGitHubAPI: createPullRequest with params:', params, 'for user:', context.currentUser?.id);
                 context.loggingService?.logInfo('Executed github-api-rune: createPullRequest', { params, userId: context.currentUser?.id });
                 // Call the specific API proxy method for GitHub
                 return context.apiProxy.callGitHubAPI(`/repos/${params.owner}/${params.repo}/pulls`, 'POST', params);
            }
        },
        // TODO: Add implementations for other runes as needed
    };


  }

  /**
   * Registers a new Rune (external capability) in Supabase.
   * This expands the Omni Agent Group (萬能代理群) and enables Infinite Expansion (無限擴充).
   * @param rune The Rune object to register.
   * @returns Promise<Rune> The registered Rune.
   */
  async registerRune(rune: Omit<Rune, 'id' | 'installation_timestamp'>): Promise<Rune> {
    console.log('Registering new rune to Supabase:', rune.name, 'for user:', rune.user_id);
    // TODO: Validate rune manifest against RuneManifestSchema (Part of 符文嵌合協議)
    // TODO: Ensure rune implementation is safe to execute (sandboxing!) (Integrates with Security Service / WASM Sandbox)

    try {
        // Persist rune to Supabase (Supports Bidirectional Sync Domain)
        // The `implementation` property is NOT stored in the DB.
        const { data, error } = await this.supabase
            .from('runes')
            .insert([rune])
            .select() // Select the inserted data to get the generated ID and timestamp
            .single(); // Expecting a single record back

        if (error) {
            console.error('Error registering rune to Supabase:', error);
            this.context.loggingService?.logError('Failed to register rune', { name: rune.name, userId: rune.user_id, error: error.message });
            throw error;
        }

        const registeredRune = data as Rune;

        console.log('New rune registered:', registeredRune.name, registeredRune.id, 'for user:', registeredRune.user_id);
        // TODO: Publish a 'rune_registered' event (part of Six Styles/EventBus)
        this.context.eventBus?.publish('rune_registered', { runeId: registeredRune.id, name: registeredRune.name, userId: registeredRune.user_id }, registeredRune.user_id); // Include userId in event
        this.context.loggingService?.logInfo(`Rune registered: ${registeredRune.name}`, { runeId: registeredRune.id, type: registeredRune.type, userId: registeredRune.user_id });

        return registeredRune;

    } catch (error: any) {
        console.error('Failed to register rune:', error);
        this.context.loggingService?.logError('Failed to register rune', { name: rune.name, userId: rune.user_id, error: error.message });
        throw error;
    }
  }

  /**
   * Retrieves a registered Rune by its ID for a specific user (or public ones) from Supabase.
   * Note: This fetches the metadata from DB. The actual `implementation` is looked up internally.
   * @param id The ID of the rune.
   * @param userId The user ID to filter by (for user-specific runes). Required.
   * @returns Promise<Rune | undefined> The Rune object (with implementation attached) or undefined if not found or user mismatch.
   */
  async getRune(id: string, userId: string): Promise<Rune | undefined> {
    console.log('Retrieving rune by ID from Supabase:', id, 'for user:', userId);
    if (!userId) {
        console.warn('Cannot retrieve rune: User ID is required.');
        this.context.loggingService?.logWarning('Cannot retrieve rune: User ID is required.');
        return undefined;
    }
    try {
        // Fetch from persistence (Supabase) (Supports Bidirectional Sync Domain)
        // Filter by ID and optionally by user ID (RLS should handle this, but explicit filter is safer)
        const { data, error } = await this.supabase
            .from('runes')
            .select('*')
            .eq('id', id)
            .or(`user_id.eq.${userId},is_public.eq.true`); // Check ownership or public status

        if (error) throw error;
        // Supabase select with .eq('id', id) should return an array, take the first element
        const runeMetadata = data?.[0] as Omit<Rune, 'implementation'> | undefined;

        if (runeMetadata) {
             console.log(`Fetched rune metadata ${id} for user ${userId}.`);
             this.context.loggingService?.logInfo(`Fetched rune metadata ${id} successfully.`, { id: id, userId: userId });

             // Attach the internal implementation logic
             const implementation = this.getRuneImplementation(runeMetadata.id);
             if (!implementation) {
                 console.warn(`[RuneEngraftingCenter] Implementation not found for rune: ${runeMetadata.id}`);
                 this.context.loggingService?.logWarning(`Implementation not found for rune: ${runeMetadata.id}`, { runeId: runeMetadata.id });
                 // Return the rune metadata without implementation, or throw, depending on desired behavior
                 // For now, return undefined as the rune is not fully functional without implementation
                 return undefined;
             }

             return { ...runeMetadata, implementation } as Rune;

        } else {
             console.warn(`Rune ${id} not found or does not belong to user ${userId}.`);
             this.context.loggingService?.logWarning(`Rune not found or user mismatch: ${id}`, { userId });
             return undefined;
        }

    } catch (error: any) {
        console.error(`Error fetching rune ${id} from Supabase:`, error);
        this.context.loggingService?.logError(`Failed to fetch rune ${id}`, { id: id, userId: userId, error: error.message });
        return undefined;
    }
  }

  /**
   * Retrieves the internal implementation logic for a given Rune ID.
   * This logic is NOT stored in the database.
   * @param runeId The ID of the rune.
   * @returns The implementation object or undefined.
   */
  private getRuneImplementation(runeId: string): any | undefined {
      // This is where you would map Rune IDs to their actual code/logic
      // For MVP, using a hardcoded map. In a real system, this might involve
      // loading code dynamically, referencing functions, etc.
      const implementations: { [id: string]: any } = {
          'example-script-rune': {
              runExample: async (params: any, context: SystemContext) => { /* ... implementation ... */ return { status: 'success', output: 'Example script finished.' }; },
              greet: async (params: { name?: string }, context: SystemContext) => { /* ... implementation ... */ const greeting = `Hello, ${params.name || 'world'}!`; return { status: 'success', output: greeting }; }
          },
          'example-api-adapter': {
              fetchData: async (params: any, context: SystemContext) => { /* ... implementation ... */ await new Promise(resolve => setTimeout(resolve, 800)); return { status: 'simulated_success', data: { result: 'some simulated data' } }; },
              sendData: async (params: any, context: SystemContext) => { /* ... implementation ... */ await new Promise(resolve => setTimeout(resolve, 600)); return { status: 'simulated_success', message: 'Simulated data sent' }; }
          },
          'capacities-data-source': {
               queryObjects: async (params: any, context: SystemContext) => { return context.apiProxy.callCapacitiesAPI('queryObjects', 'POST', params); },
               saveObject: async (params: any, context: SystemContext) => { return context.apiProxy.callCapacitiesAPI('saveObject', 'POST', params); },
               listObjects: async (params: any, context: SystemContext) => { return context.apiProxy.callCapacitiesAPI('listObjects', 'GET', params); }
          },
          'infoflow-data-source': {
               searchNotes: async (params: any, context: SystemContext) => { return context.apiProxy.callInfoflowAPI('searchNotes', params); },
               createNote: async (params: any, context: SystemContext) => { return context.apiProxy.callInfoflowAPI('createNote', params); },
               listNotes: async (params: any, context: SystemContext) => { return context.apiProxy.callInfoflowAPI('listNotes', params); }
          },
          'aitable-ai-data-source': {
               queryRecords: async (params: any, context: SystemContext) => { return context.apiProxy.callAitableAIAPI('queryRecords', params); },
               createRecord: async (params: any, context: SystemContext) => { return context.apiProxy.callAitableAIAPI('createRecord', params); },
               updateRecord: async (params: any, context: SystemContext) => { return context.apiProxy.callAitableAIAPI('updateRecord', params); }
          },
          'upnote-data-source': {
               searchNotes: async (params: any, context: SystemContext) => { return context.apiProxy.callUpNoteAPI('searchNotes', params); },
               createNote: async (params: any, context: SystemContext) => { return context.apiProxy.callUpNoteAPI('createNote', params); },
               getNoteContent: async (params: any, context: SystemContext) => { return context.apiProxy.callUpNoteAPI('getNoteContent', params); }
          },
          'boost-space-api': {
               analyzeJunAI: async (params: any, context: SystemContext) => { return context.apiProxy.callBoostSpaceAPI('/jun-ai/analyze', 'POST', params); },
               getUniversalKeyTemplates: async (params: any, context: SystemContext) => { return context.apiProxy.callBoostSpaceAPI('/universal-key/templates', 'GET', params); },
               executeUniversalKey: async (params: any, context: SystemContext) => { return context.apiProxy.callBoostSpaceAPI('/universal-key/execute', 'POST', params); },
               syncBackup: async (params: any, context: SystemContext) => { return context.apiProxy.callBoostSpaceAPI('/sync/backup', 'POST', params); },
               syncRestore: async (params: any, context: SystemContext) => { return context.apiProxy.callBoostSpaceAPI('/sync/restore', 'GET', params); }
          },
          'scripting-app-webhook-trigger': {
               triggerScript: async (params: any, context: SystemContext) => { return context.apiProxy.callScriptingAppWebhook({ scriptName: params.scriptName, payload: params.payload, userId: context.currentUser?.id }); }
          },
          'make-com-webhook-trigger': {
               trigger: async (payload: any, context: SystemContext) => { return context.apiProxy.callMakeWebhook(payload); }
          },
          'straico-ai-agent': {
               promptCompletion: async (params: any, context: SystemContext) => { return context.apiProxy.callStraicoAIAPI('prompt/completion', { prompt: params.prompt, model: params.model || 'gpt-4o' }); },
               analyzeText: async (params: any, context: SystemContext) => { return context.apiProxy.callStraicoAIAPI('analyze', params); }
          },
          'mobile-git-sync-rune': {
               pull: async (params: any, context: SystemContext) => { return context.syncService?.syncMobileGitRepo(context.currentUser?.id!, 'pull', params); },
               push: async (params: any, context: SystemContext) => { return context.syncService?.syncMobileGitRepo(context.currentUser?.id!, 'push', params); },
               commit: async (params: any, context: SystemContext) => { return { status: 'simulated_success', message: `Simulated commit with message: \"${params.message}\"` }; },
               status: async (params: any, context: SystemContext) => { return { status: 'simulated_success', output: 'Simulated git status: Clean working tree' }; },
               saveFileToRepo: async (params: any, context: SystemContext) => { return { status: 'simulated_success', message: `Simulated saving file ${params.filePath} to mobile repo.` }; }
          },
          'github-api-rune': {
               getFileContent: async (params: any, context: SystemContext) => { return context.apiProxy.callGitHubAPI(`/repos/${params.owner}/${params.repo}/contents/${params.path}`, 'GET', params); },
               updateFileContent: async (params: any, context: SystemContext) => { return context.apiProxy.callGitHubAPI(`/repos/${params.owner}/${params.repo}/contents/${params.path}`, 'PUT', { message: params.message, content: btoa(params.content), sha: params.sha, branch: params.branch }); },
               createCommit: async (params: any, context: SystemContext) => { return context.apiProxy.callGitHubAPI(`/repos/${params.owner}/${params.repo}/git/commits`, 'POST', params); },
               createPullRequest: async (params: any, context: SystemContext) => { return context.apiProxy.callGitHubAPI(`/repos/${params.owner}/${params.repo}/pulls`, 'POST', params); }
          },
          // TODO: Add implementations for other runes as needed
      };
      return implementations[runeId];
  }


  /**
   * Lists all registered Runes, optionally filtered by type and user, from Supabase.
   * These represent the available members of the Omni Agent Group (萬能代理群).
   * @param type Optional: Filter runes by type ('api-adapter' | 'script-plugin' | 'ui-component' | 'data-source' | 'automation-tool' | 'ai-agent' | 'device-adapter' | 'webhook-trigger').
   * @param userId The user ID to filter by (show user-specific and public runes). Required.
   * @returns Promise<Rune[]> An array of Rune objects (with implementation attached).
   */
  async listRunes(type?: Rune['type'], userId?: string): Promise<Rune[]> {
    console.log('Listing runes from Supabase for user:', userId, 'type:', type || 'all');
    // TODO: Fetch from persistence (Supabase) (Supports Bidirectional Sync Domain)
    let dbQuery = this.supabase
        .from('runes')
        .select('*');

    if (type) {
      dbQuery = dbQuery.eq('type', type);
    }

    // If userId is provided, show only runes belonging to that user or public runes
    if (userId) {
        dbQuery = dbQuery.or(`user_id.eq.${userId},is_public.eq.true`); // RLS should also enforce this
    }

    try {
        const { data, error } = await dbQuery;
        if (error) throw error;
        console.log(`Fetched ${data.length} runes for user ${userId}.`);

        // Attach implementations to the fetched rune metadata
        const runesWithImplementation = (data as Omit<Rune, 'implementation'>[]).map(runeMetadata => {
            const implementation = this.getRuneImplementation(runeMetadata.id);
            // If implementation is missing, the rune is not fully functional, but we might still list it
            // For now, we'll include it even if implementation is undefined, but executeRuneAction will fail.
            return { ...runeMetadata, implementation } as Rune;
        });


        return runesWithImplementation;
    } catch (error: any) {
        console.error('Error listing runes from Supabase:', error);
        this.context.loggingService?.logError('Failed to list runes', { type, userId, error: error.message });
        return [];
    }
  }

   /**
    * Gets the configuration for a specific rune for a specific user from Supabase.
    * @param runeId The ID of the rune.
    * @param userId The user ID for verification. Required.
    * @returns Promise<any | undefined> The rune's configuration object or undefined.
    */
   async getRuneConfiguration(runeId: string, userId: string): Promise<any | undefined> {
       console.log('Getting rune configuration from Supabase for rune:', runeId, 'user:', userId);
       if (!userId) {
           console.warn('Cannot get rune configuration: User ID is required.');
           this.context.loggingService?.logWarning('Cannot get rune configuration: User ID is required.');
           return undefined;
       }
       // Use the getter which includes user verification
       const rune = await this.getRune(runeId, userId); // Await the async getter
       return rune?.configuration;
   }

  /**
   * Updates the configuration for a specific rune for a specific user in Supabase.
   * @param runeId The ID of the rune.
   * @param configuration The new configuration object.
   * @param userId The user ID for verification. Required.
   * @returns Promise<Rune | undefined> The updated Rune object (with implementation attached) or undefined if not found or user mismatch.
   */
  async updateRuneConfiguration(runeId: string, configuration: any, userId: string): Promise<Rune | undefined> {
      console.log(`Updating rune configuration for rune ${runeId} for user ${userId}...`, configuration);
      this.context.loggingService?.logInfo(`Attempting to update rune configuration: ${runeId}`, { runeId, userId, configuration });

      if (!userId) {
          console.error('[RuneEngraftingCenter] Cannot update rune configuration: User ID is required.');
          this.context.loggingService?.logError('Cannot update rune configuration: User ID is required.');
          throw new Error('User ID is required to update rune configuration.');
      }

      try {
          // Update configuration in Supabase (Supports Bidirectional Sync Domain)
          // Filter by ID and user_id to ensure ownership (RLS should also enforce this)
          const { data, error } = await this.supabase
              .from('runes')
              .update({ configuration: configuration })
              .eq('id', runeId)
              .eq('user_id', userId) // Ensure ownership (cannot update public rune config unless it's your own copy)
              .select() // Select the updated data
              .single(); // Expecting a single record back

          if (error) {
              console.error(`Error updating rune configuration ${runeId} in Supabase:`, error);
              this.context.loggingService?.logError(`Failed to update rune configuration ${runeId}`, { runeId, userId, error: error.message });
              throw error;
          }

          if (!data) {
               console.warn(`Rune ${runeId} not found or does not belong to user ${userId} for configuration update.`);
               this.context.loggingService?.logWarning(`Rune not found or user mismatch for config update: ${runeId}`, { userId });
               return undefined;
          }

          const updatedRuneMetadata = data as Omit<Rune, 'implementation'>;
          console.log(`Rune configuration for ${runeId} updated in Supabase.`);

          // Attach the internal implementation logic
          const implementation = this.getRuneImplementation(updatedRuneMetadata.id);
          if (!implementation) {
              console.warn(`[RuneEngraftingCenter] Implementation not found for updated rune: ${updatedRuneMetadata.id}`);
              // Decide how to handle this - maybe return metadata only?
          }

          const updatedRune = { ...updatedRuneMetadata, implementation } as Rune;


          // TODO: Publish 'rune_updated' event (part of Six Styles/EventBus)
          this.context.eventBus?.publish('rune_updated', updatedRune, userId); // Include userId in event
          this.context.loggingService?.logInfo(`Rune configuration updated: ${runeId}`, { userId: userId });

          return updatedRune;

      } catch (error: any) {
          console.error(`Failed to update rune configuration ${runeId}:`, error);
          this.context.loggingService?.logError(`Failed to update rune configuration ${runeId}`, { runeId, userId, error: error.message });
          throw error;
      }
   }

  /**
   * Deletes a rune for a specific user from Supabase.
   * @param runeId The ID of the rune.
   * @param userId The user ID for verification. Required.
   * @returns Promise<boolean> True if deletion was successful, false otherwise.
   */
  async deleteRune(runeId: string, userId: string): Promise<boolean> {
      console.log(`Deleting rune ${runeId} from Supabase for user ${userId}...`);
      this.context.loggingService?.logInfo(`Attempting to delete rune ${runeId}`, { runeId, userId });

      if (!userId) {
          console.warn('[RuneEngraftingCenter] Cannot delete rune: User ID is required.');
          this.context.loggingService?.logWarning('Cannot delete rune: User ID is required.');
          return false;
      }

      try {
          // Delete from Supabase (Supports Bidirectional Sync Domain)
          // Filter by ID and user_id to ensure ownership (RLS should also enforce this)
          // Cannot delete public runes unless you are the author (requires author_id check) or admin
          const { count, error } = await this.supabase
              .from('runes')
              .delete()
              .eq('id', runeId)
              .eq('user_id', userId) // Ensure ownership
              // TODO: Add policy to allow author_id deletion for public runes if needed
              .select('id', { count: 'exact' }); // Select count to check if a row was deleted

          if (error) { throw error; }

          const deleted = count !== null && count > 0; // Check if count is greater than 0

          if (deleted) {
              console.log(`Rune ${runeId} deleted from Supabase.`);
              // TODO: Publish 'rune_deleted' event (part of Six Styles/EventBus)
              this.context.eventBus?.publish('rune_deleted', { runeId: runeId, userId: userId }, userId); // Include userId in event
              this.context.loggingService?.logInfo(`Rune deleted: ${runeId}`, { userId: userId });
          } else {
               console.warn(`Rune ${runeId} not found for deletion or does not belong to user ${userId}.`);
               this.context.loggingService?.logWarning(`Rune not found or user mismatch for deletion: ${runeId}`, { userId });
          }

          return deleted;

      } catch (error: any) {
          console.error(`Failed to delete rune ${runeId}:`, error);
          this.context.loggingService?.logError(`Failed to delete rune ${runeId}`, { runeId, userId, error: error.message });
          throw error;
      }
   }

   /**
    * Simulates installing a public rune for a specific user.
    * This involves creating a user-specific copy of the public rune metadata in Supabase.
    * @param publicRuneId The ID of the public rune to install. Required.
    * @param userId The user ID who is installing the rune. Required.
    * @returns Promise<Rune | null> The newly installed user-specific rune or null on failure.
    */
   async installRune(publicRuneId: string, userId: string): Promise<Rune | null> {
       console.log(`Simulating installing public rune ${publicRuneId} for user ${userId}...`);
       this.context.loggingService?.logInfo(`Attempting to install public rune ${publicRuneId}`, { publicRuneId, userId });

       if (!userId) {
           console.error('[RuneEngraftingCenter] Cannot install rune: User ID is required.');
           this.context.loggingService?.logError('Cannot install rune: User ID is required.');
           throw new Error('User ID is required to install rune.');
       }

       try {
           // 1. Fetch the public rune metadata from Supabase
           const { data: publicRuneData, error: fetchError } = await this.supabase
               .from('runes')
               .select('*')
               .eq('id', publicRuneId)
               .eq('is_public', true) // Ensure it's a public rune
               .single();

           if (fetchError) { throw fetchError; }
           if (!publicRuneData) {
               console.warn(`Public rune ${publicRuneId} not found for installation.`);
               this.context.loggingService?.logWarning(`Public rune not found for installation: ${publicRuneId}`, { userId });
               return null;
           }

           const publicRune = publicRuneData as Omit<Rune, 'implementation'>;

           // 2. Check if the user already has this rune installed (optional, but good practice)
           const existingUserRune = await this.supabase
               .from('runes')
               .select('id')
               .eq('user_id', userId)
               .eq('name', publicRune.name) // Check by name to see if a copy already exists
               .single();

           if (existingUserRune.data) {
               console.warn(`User ${userId} already has a rune named "${publicRune.name}" installed.`);
               this.context.loggingService?.logWarning(`User already has rune installed: ${publicRune.name}`, { userId });
               // Optionally return the existing rune or null
               return null; // Or fetch and return the existing user rune
           }


           // 3. Create a new rune record for the user, copying the public definition
           const newUserRuneData: Omit<Rune, 'id' | 'installation_timestamp'> = {
               name: publicRune.name,
               description: publicRune.description,
               type: publicRune.type,
               manifest: publicRune.manifest,
               version: publicRune.version,
               author_id: publicRune.author_id, // Keep author ID
               is_enabled: true, // Enabled by default on install
               configuration: publicRune.configuration || {}, // Copy default configuration, allow user to change later
               user_id: userId, // Assign to the installing user
               is_public: false, // This copy is private to the user
               // implementation is NOT copied to the DB
           };

           const { data: newUserRuneResult, error: insertError } = await this.supabase
               .from('runes')
               .insert([newUserRuneData])
               .select()
               .single();

           if (insertError) {
               console.error('Error installing rune to Supabase:', insertError);
               this.context.loggingService?.logError('Failed to install rune', { publicRuneId, userId, error: insertError.message });
               throw insertError;
           }

           const installedRuneMetadata = newUserRuneResult as Omit<Rune, 'implementation'>;
           console.log(`Public rune ${publicRuneId} installed as user rune: ${installedRuneMetadata.id} for user ${userId}.`);

           // Attach the internal implementation logic to the returned object
           const implementation = this.getRuneImplementation(installedRuneMetadata.id); // Note: This assumes the implementation lookup works for user runes too
            if (!implementation) {
                 console.warn(`[RuneEngraftingCenter] Implementation not found for installed user rune: ${installedRuneMetadata.id}`);
                 this.context.loggingService?.logWarning(`Implementation not found for installed user rune: ${installedRuneMetadata.id}`, { runeId: installedRuneMetadata.id });
                 // Return metadata only, or throw, depending on desired behavior
                 // For now, return null as the rune is not fully functional without implementation
                 return null;
            }


           const installedRune = { ...installedRuneMetadata, implementation } as Rune;


           // TODO: Publish 'rune_installed' event
           this.context.eventBus?.publish('rune_installed', { runeId: installedRune.id, publicRuneId: publicRuneId, userId: userId }, userId);
           this.context.loggingService?.logInfo(`Public rune installed: ${installedRune.name}`, { runeId: installedRune.id, publicRuneId: publicRuneId, userId: userId });

           return installedRune;

       } catch (error: any) {
           console.error(`Failed to install public rune ${publicRuneId}:`, error);
           this.context.loggingService?.logError(`Failed to install public rune ${publicRuneId}`, { publicRuneId, userId: userId, error: error.message });
           return null; // Return null on failure
       }
   }


  /**
   * Executes a specific action provided by a registered Rune for a specific user.
   * This is how the OmniKey (萬能元鍵) leverages the Omni Agent Group (萬能代理群).
   * @param runeId The ID of the rune.
   * @param action The name of the action to execute within the rune.
   * @param params Optional parameters to pass to the rune action.
   * @param userId The user ID for permission checks. Required.
   * @returns Promise<any> The result of the rune action execution.
   */
  async executeRuneAction(runeId: string, action: string, params: any, userId: string): Promise<any> {
    console.log(`Executing action \"${action}\" on rune \"${runeId}\" with params:`, params, 'for user:', userId);
    this.context.loggingService?.logInfo(`Attempting to execute rune action: ${runeId}:${action}`, { runeId, action, params, userId: userId });

    if (!userId) {
        console.error('Cannot execute rune action: User ID is required.');
        this.context.loggingService?.logError('Cannot execute rune action: User ID is required.');
        throw new Error('User ID is required to execute rune action.');
    }

    // Use the getter which includes user verification and attaches implementation
    const rune = await this.getRune(runeId, userId); // Await the async getter
    if (!rune) {
      // getRune already logs warning/error
      throw new Error(`Rune not found or does not belong to user: ${runeId}`);
    }

    // TODO: Implement logic to execute the specific action defined by the rune's implementation.
    // This is highly dependent on the rune type and its implementation structure.
    // Security: Ensure execution is sandboxed and respects permissions (integrate with Security Service / WASM Sandbox).
    // TODO: Record rune action execution as a UserAction? (Part of Six Styles/Action Recording - call context.authorityForgingEngine.recordAction)
    this.context.authorityForgingEngine?.recordAction({
        type: `rune:execute:${rune.type}:${action}`,
        details: { runeId, action, params },
        context: { platform: 'core' },
        user_id: userId, // Associate action with user
    });
    this.context.loggingService?.logInfo(`Executing rune action: ${rune.name}:${action}`, { runeId, action, params, userId: userId });


    try {
        // Check if the action exists in the rune's implementation
        if (typeof rune.implementation[action] === 'function') {
             console.log(`Calling implementation for ${rune.type} action \"${action}\"...`);
             // Pass context or necessary services to the rune implementation if needed
             // Pass the full context, which includes the current user
             const result = await rune.implementation[action](params, this.context); // Pass context to implementation
             console.log(`${rune.type} action result:`, result);
             this.context.loggingService?.logInfo(`Rune action executed successfully: ${rune.name}:${action}`, { runeId, action, result, userId: userId });
             return result;
        } else {
             console.error(`Action \"${action}\" not found in ${rune.type} \"${rune.name}\".`);
             this.context.loggingService?.logError(`Action \"${action}\" not found in ${rune.type} \"${rune.name}\".`, { runeId, action, userId: userId });
             throw new Error(`Action \"${action}\" not found in ${rune.type} \"${rune.name}\".`);
        }

    } catch (error: any) {
        console.error(`Error executing rune action \"${action}\" on \"${rune.name}\":`, error.message);
        this.context.loggingService?.logError(`Rune action execution failed: ${rune.name}:${action}`, { runeId, action, error: error.message, userId: userId });
        throw new Error(`Rune action execution failed: ${error.message}`);
    }
  }

  // TODO: Implement methods for updating, removing runes. (Supports Infinite Expansion)
  // TODO: Define clear standards/interfaces for different rune types (API adapters, scripts, etc.). (Supports Infinite Expansion)
  // TODO: Implement a secure sandboxing mechanism for executing script-plugin runes. (Integrates with Security Service)
  // TODO: Implement a Rune registry/marketplace concept (part of Infinite Expansion).
  // TODO: Runes are a form of "萬能元鍵".
}