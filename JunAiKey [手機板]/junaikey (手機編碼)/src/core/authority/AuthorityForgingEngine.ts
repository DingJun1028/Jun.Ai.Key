// src/core/authority/AuthorityForgingEngine.ts
// 權能鍛造廠 (Authority Forging Engine) - 核心模組
// Manages the creation, storage, and execution of automated scripts or "Abilities".
// Observes user actions to identify patterns for automation suggestions.
// Corresponds to the Capability Forge concept and the "Observe", "Act", "Generate" steps.
// Design Principle: Empowers users with automated capabilities forged from their interactions or defined manually.

import { UserAction, ForgedAbility, SystemContext } from '../../interfaces';
import { SupabaseClient } from '@supabase/supabase-js';
// import { WisdomSecretArt } from '../wisdom/WisdomSecretArt'; // Dependency for pattern analysis/script generation
// import { EventBus } from '../../modules/events/EventBus'; // Dependency for events
// import { LoggingService } from '../logging/LoggingService'; // Dependency


export class AuthorityForgingEngine {
  // private userActions: UserAction[] = []; // Buffer of recent user actions (in-memory for MVP) - Now fetched from Supabase
  // private forgedAbilities: ForgedAbility[] = []; // Store generated abilities (in-memory for MVP) - Now fetched from Supabase
  private context: SystemContext;
  private supabase: SupabaseClient;
  // private wisdomSecretArt: WisdomSecretArt; // Access via context
  // private eventBus: EventBus; // Access via context
  // private loggingService: LoggingService; // Access via context


  constructor(context: SystemContext) {
    this.context = context;
    this.supabase = context.apiProxy.supabaseClient; // Use the Supabase client from ApiProxy
    // this.wisdomSecretArt = context.wisdomSecretArt;\
    // this.eventBus = context.eventBus;\
    // this.loggingService = context.loggingService;\
    console.log('AuthorityForgingEngine initialized.');\
    // TODO: Load initial data (abilities) from persistence on startup (Supports Bidirectional Sync Domain)\
    // This might involve fetching all abilities for the current user on auth state change.\
  }\
\
  /**\
   * Records a user action in Supabase.\
   * This action data is used by the Wisdom Secret Art to identify patterns (Supports Wisdom Precipitation Secret Art)\
   * and by Analytics/Logging for AARRR/KPI metrics (Supports Observe/Monitor in Six Styles).\
   * @param action The user action details (without timestamp, id, user_id). Required.\
   * @returns Promise<UserAction | null> The created UserAction or null if saving failed.\
   */\
  async recordAction(action: Omit<UserAction, 'timestamp' | 'id' | 'user_id'>): Promise<UserAction | null> {\
    const userId = this.context.currentUser?.id;\
    if (!userId) {\
        console.warn('[AuthorityForgingEngine] Cannot record action: User not authenticated.');\
        this.context.loggingService?.logWarning('Cannot record action: User not authenticated.', { actionType: action.type });\
        return null;\
    }\
\
    const newAction: Omit<UserAction, 'id' | 'timestamp'> = {\
      user_id: userId, // Associate action with current user\
      ...action,\
    };\
\
    console.log('Action recording to Supabase:', newAction.type, newAction.details, 'for user:', newAction.user_id);\
    this.context.loggingService?.logInfo(`Attempting to record action: ${newAction.type}`, { userId: userId });\
\
\
    try {\
        // Persist action to Supabase (Supports Bidirectional Sync Domain)\
        const { data, error } = await this.supabase\
            .from('user_actions')\
            .insert([newAction])\
            .select() // Select the inserted data to get the generated ID and timestamp\
            .single(); // Expecting a single record back\
\
        if (error) {\
            console.error('Error recording action to Supabase:', error);\
            this.context.loggingService?.logError('Failed to record action', { actionType: action.type, userId: userId, error: error.message });\
            throw error; // Re-throw the error for the caller to handle\
        }\
\
        const persistedAction = data as UserAction;\
\
        console.log('Action recorded:', persistedAction.id, persistedAction.type, 'for user:', persistedAction.user_id);\
\
        // TODO: Log action using LoggingService (Supports Observe/Monitor in Six Styles - call context.loggingService.logInfo)\
        this.context.loggingService?.logInfo(`User Action: ${persistedAction.type}`, { details: persistedAction.details, context: persistedAction.context, userId: persistedAction.user_id });\
\
        // TODO: Publish 'user_action' event via EventBus (Supports Event Push in Six Styles - call context.eventBus.publish)\
        this.context.eventBus?.publish('user_action', persistedAction, userId); // Include userId in event\
\
        // TODO: Integrate with Wisdom Secret Art/EvolutionEngine to analyze actions in the background (Supports Wisdom Precipitation Secret Art)\
        // This should ideally run in a background process or be triggered by an event listener in EvolutionEngine\
        // The EvolutionEngine's runEvolutionCycle method now fetches actions via AnalyticsService which uses getRecentActions here.\
\
        return persistedAction;\
\
    } catch (error: any) {\
        console.error('Failed to record action:', error);\
        this.context.loggingService?.logError('Failed to record action', { actionType: action.type, userId: userId, error: error.message });\
        return null; // Return null on failure\
    }\
  }\
\
  /**\
   * Retrieves recent user actions for a specific user from Supabase.\
   * Used by AnalyticsService to find patterns.\
   * @param userId The user ID. Required.\
   * @param limit The maximum number of actions to retrieve. Required.\
   * @returns Promise<UserAction[]> An array of recent user actions.\
   */\
  async getRecentActions(userId: string, limit: number = 100): Promise<UserAction[]> {\
      console.log(`Retrieving recent actions from Supabase for user: ${userId}, limit: ${limit}`);\
      this.context.loggingService?.logInfo(`Attempting to fetch recent actions for user ${userId}`, { userId, limit });\
\
      if (!userId) {\
          console.warn('[AuthorityForgingEngine] Cannot retrieve actions: User ID is required.');\
          this.context.loggingService?.logWarning('Cannot retrieve actions: User ID is required.');\
          return [];\
      }\
      try {\
          // Fetch recent actions from Supabase, filtered by user_id (Supports Bidirectional Sync Domain)\
          const { data, error } = await this.supabase\
              .from('user_actions')\
              .select('*')\
              .eq('user_id', userId)\
              .order('timestamp', { ascending: false } as any) // Supabase expects { ascending: boolean }\
              .limit(limit);\
          if (error) { throw error; }\
          return data as UserAction[];\
\
      } catch (error: any) {\
          console.error('Error fetching recent actions from Supabase:', error);\
          this.context.loggingService?.logError('Failed to fetch recent actions', { userId: userId, error: error.message });\
          return [];\
      }\
  }\
\
\
  /**\
   * Manually forge a new ability for a specific user in Supabase.\
   * This is one way to create a \"\u842c\u80fd\u5143\u9375\".\
   * @param name Ability name. Required.\
   * @param description Ability description. Optional.\
   * @param script The script code. Required.\
   * @param trigger The trigger object. Required.\
   * @param userId The user ID to associate the ability with. Required.\
   * @returns Promise<ForgedAbility | null> The newly created ForgedAbility or null if saving failed.\
   */\
  async manuallyForgeAbility(name: string, description: string, script: string, trigger: any, userId: string): Promise<ForgedAbility | null> {\
       console.log('Manually forging new ability to Supabase:', name, 'for user:', userId);\
       this.context.loggingService?.logInfo('Attempting to manually forge ability', { name, userId });\
\
       if (!userId) {\
           console.error('[AuthorityForgingEngine] Cannot manually forge ability: User ID is required.');\
           this.context.loggingService?.logError('Cannot manually forge ability: User ID is required.');\
           throw new Error('User ID is required to manually forge ability.');\
       }\
\
       const newAbility: Omit<ForgedAbility, 'id' | 'creation_timestamp' | 'forged_from_actions' | 'last_used_timestamp'> = {\
          name,\
          description,\
          script,\
          trigger,\
          user_id: userId, // Associate with user\
          is_public: false, // Manually forged are private by default\
          version: '1.0', // Default version\
      };\
\
      try {\
          // Store forged abilities persistently (e.g., in Supabase) (Supports Bidirectional Sync Domain)\
          const { data, error } = await this.supabase\
              .from('abilities')\
              .insert([newAbility])\
              .select() // Select the inserted data to get the generated ID and timestamp\
              .single(); // Expecting a single record back\
\
          if (error) {\
              console.error('Error manually forging ability to Supabase:', error);\
              this.context.loggingService?.logError('Failed to manually forge ability', { name: name, userId: userId, error: error.message });\
              throw error; // Re-throw the error\
          }\
\
          const persistedAbility = data as ForgedAbility;\
\
          console.log('Manually forged new ability:', persistedAbility.name, persistedAbility.id, 'for user:', persistedAbility.user_id);\
          // TODO: Trigger an event indicating a new ability has been forged (part of Six Styles/EventBus - call context.eventBus.publish)\
          this.context.eventBus?.publish('ability_forged', persistedAbility, userId); // Include userId in event\
          this.context.loggingService?.logInfo(`Manually forged ability: ${persistedAbility.name}`, { abilityId: persistedAbility.id, userId: userId });\
\
          return persistedAbility;\
\
      } catch (error: any) {\
          console.error('Failed to manually forge ability:', error);\
          this.context.loggingService?.logError('Failed to manually forge ability', { name: name, userId: userId, error: error.message });\
          return null; // Return null on failure\
      }\
  }\
\
\
  /**\
   * Retrieves all forged abilities for a specific user (or public ones) from Supabase.\
   * @param userId The user ID to filter abilities by. Required.\
   * @returns Promise<ForgedAbility[]> An array of ForgedAbility objects.\
   */\
  async getForgedAbilities(userId: string): Promise<ForgedAbility[]> {\
    console.log('Retrieving forged abilities from Supabase for user:', userId);\
    this.context.loggingService?.logInfo('Attempting to fetch forged abilities', { userId });\
\
    if (!userId) {\
        console.warn('[AuthorityForgingEngine] Cannot retrieve abilities: User ID is required.');\
        this.context.loggingService?.logWarning('Cannot retrieve abilities: User ID is required.');\
        return []; // Return empty if no user ID\
    }\
    try {\
        // Fetch from persistence (Supabase) (Supports Bidirectional Sync Domain)\
        // Filter by user_id or public status (RLS should handle this, but explicit filter is safer)\
        const { data, error } = await this.supabase\
            .from('abilities')\
            .select('*')\
            .or(`user_id.eq.${userId},is_public.eq.true`); // Example RLS-compatible filter\
        if (error) { throw error; }\
        console.log(`Fetched ${data.length} abilities for user ${userId}.`);\
        return data as ForgedAbility[];\
\
    } catch (error: any) {\
        console.error('Error fetching abilities from Supabase:', error);\
        this.context.loggingService?.logError('Failed to fetch abilities', { userId: userId, error: error.message });\
        return [];\
    }\
  }\
\
  /**\
   * Retrieves a specific forged ability by ID for a specific user (or if public) from Supabase.\
   * @param abilityId The ID of the ability. Required.\
   * @param userId The user ID for verification. Required.\
   * @returns Promise<ForgedAbility | undefined> The ForgedAbility object or undefined.\
   */\
  async getAbilityById(abilityId: string, userId: string): Promise<ForgedAbility | undefined> {\
       console.log('Retrieving ability by ID from Supabase:', abilityId, 'for user:', userId);\
       this.context.loggingService?.logInfo(`Attempting to fetch ability ${abilityId}`, { id: abilityId, userId });\
\
       if (!userId) {\
           console.warn('[AuthorityForgingEngine] Cannot retrieve ability: User ID is required.');\
           this.context.loggingService?.logWarning('Cannot retrieve ability: User ID is required.');\
           return undefined;\
       }\
       try {\
           // Fetch from persistence (Supabase) (Supports Bidirectional Sync Domain)\
           // Filter by ID and user_id (RLS should handle this, but explicit filter is safer)\
            const { data, error } = await this.supabase\
                .from('abilities')\
                .update({ last_used_timestamp: new Date().toISOString() } as any) // Update last used timestamp on fetch (simple approach), Supabase expects ISO string\
                .eq('id', abilityId)\
                .or(`user_id.eq.${userId},is_public.eq.true`) // Check ownership or public status\
                .select() // Select the updated data\
                .single();\
\
            if (error) {\
                 // Supabase returns error.code 'PGRST116' if no rows found\
                 if (error.code === 'PGRST116') {\
                     console.warn(`Ability ${abilityId} not found for user ${userId}.`);\
                     this.context.loggingService?.logWarning(`Ability not found: ${abilityId}`, { userId });\
                     return undefined; // Not found\
                 }\
                 throw error; // Re-throw other errors\
            }\
\
            const ability = data as ForgedAbility;\
\
            console.log(`Fetched ability ${abilityId} for user ${userId}.`);\
            this.context.loggingService?.logInfo(`Fetched ability ${abilityId} successfully.`, { id: abilityId, userId: userId });\
\
            return ability;\
\
       } catch (error: any) {\
           console.error(`Error fetching ability ${abilityId} from Supabase:', error);\
           this.context.loggingService?.logError(`Failed to fetch ability ${abilityId}`, { id: abilityId, userId: userId, error: error.message });\
           return undefined;\
       }\
  }\
\
  /**\
   * Updates an existing forged ability for a specific user in Supabase.\
   * @param abilityId The ID of the ability to update. Required.\
   * @param updates The updates to apply. Required.\
   * @param userId The user ID for verification. Required.\
   * @returns Promise<ForgedAbility | undefined> The updated ForgedAbility or undefined if not found or user mismatch.\
   */\
  async updateAbility(abilityId: string, updates: Partial<Omit<ForgedAbility, 'id' | 'creation_timestamp' | 'forged_from_actions' | 'user_id' | 'last_used_timestamp'>>, userId: string): Promise<ForgedAbility | undefined> {\
      console.log(`Updating ability ${abilityId} in Supabase for user ${userId}...`, updates);\
      this.context.loggingService?.logInfo(`Attempting to update ability ${abilityId}`, { id: abilityId, updates, userId });\
\
       if (!userId) {\
           console.warn('[AuthorityForgingEngine] Cannot update ability: User ID is required.');\
           this.context.loggingService?.logWarning('Cannot update ability: User ID is required.');\
           return undefined;\
       }\
\
      try {\
          // Persist update to Supabase (Supports Bidirectional Sync Domain)\
          // Filter by ID and user_id to ensure ownership\
            const { data, error } = await this.supabase\
                .from('abilities')\
                .update(updates)\
                .eq('id', abilityId)\
                .eq('user_id', userId) // Ensure ownership (cannot update public rune config unless it's your own copy)\
                .select() // Select the updated data\
                .single();\
\
            if (error) {\
                 // Supabase returns error.code 'PGRST116' if no rows found\
                 if (error.code === 'PGRST116') {\
                     console.warn(`Ability ${abilityId} not found or does not belong to user ${userId} for update.`);\
                     this.context.loggingService?.logWarning(`Ability not found or user mismatch for update: ${abilityId}`, { userId });\
                     return undefined;\
                 }\
                 throw error; // Re-throw other errors\
            }\
\
            const updatedAbility = data as ForgedAbility;\
\
\
          console.log(`Ability ${abilityId} updated in Supabase.`);\
          // TODO: Trigger an event indicating an ability has been updated (part of Six Styles/EventBus)\
          this.context.eventBus?.publish('ability_updated', updatedAbility, userId); // Include userId in event\
          this.context.loggingService?.logInfo(`Ability updated successfully: ${abilityId}`, { id: abilityId, userId: userId });\
\
          return updatedAbility;\
\
      } catch (error: any) {\
          console.error(`Failed to update ability ${abilityId}:`, error);\
          this.context.loggingService?.logError(`Failed to update ability ${abilityId}`, { id: abilityId, updates, userId: userId, error: error.message });\
          throw error; // Re-throw the error\
      }\
  }\
\
  /**\
   * Deletes a forged ability for a specific user from Supabase.\
   * @param abilityId The ID of the ability to delete. Required.\
   * @param userId The user ID for verification. Required.\
   * @returns Promise<boolean> True if deletion was successful, false otherwise.\
   */\
  async deleteAbility(abilityId: string, userId: string): Promise<boolean> {\
      console.log(`Deleting ability ${abilityId} from Supabase for user ${userId}...`);\
      this.context.loggingService?.logInfo(`Attempting to delete ability ${abilityId}`, { id: abilityId, userId });\
\
       if (!userId) {\
           console.warn('[AuthorityForgingEngine] Cannot delete ability: User ID is required.');\
           this.context.loggingService?.logWarning('Cannot delete ability: User ID is required.');\
           return false;\
       }\
\
      try {\
          // Persist deletion to Supabase (Supports Bidirectional Sync Domain)\
          // Filter by ID and user_id to ensure ownership (RLS should also enforce this)\
          // Cannot delete public runes unless you are the author (requires author_id check) or admin\
          const { count, error } = await this.supabase\
              .from('abilities')\
              .delete()\
              .eq('id', abilityId)\
              .eq('user_id', userId) // Ensure ownership\
              // TODO: Add policy to allow author_id deletion for public runes if needed\
              .select('id', { count: 'exact' }); // Select count to check if a row was deleted\
\
          if (error) { throw error; }\
\
          const deleted = count !== null && count > 0; // Check if count is greater than 0\
\
          if (deleted) {\
              console.log(`Ability ${abilityId} deleted from Supabase.`);\
              // TODO: Trigger an event indicating an ability has been deleted (part of Six Styles/EventBus)\
              this.context.eventBus?.publish('ability_deleted', { abilityId: abilityId, userId: userId }, userId); // Include userId in event\
              this.context.loggingService?.logInfo(`Ability deleted successfully: ${abilityId}`, { id: abilityId, userId: userId });\
          } else {\
               console.warn(`Ability ${abilityId} not found for deletion or does not belong to user ${userId}.`);\
               this.context.loggingService?.logWarning(`Ability not found for deletion or user mismatch: ${abilityId}`, { id: abilityId, userId });\
          }\
\
          return deleted;\
\
      } catch (error: any) {\
          console.error(`Failed to delete ability ${abilityId}:`, error);\
          this.context.loggingService?.logError(`Failed to delete ability ${abilityId}`, { id: abilityId, userId: userId, error: error.message });\
          throw error;\
      }\
  }\
\
\
  /**\
   * Executes a specific forged ability for a specific user.\
   * This is how a \"\u842c\u80fd\u5143\u9375\" is used.\
   * @param abilityId The ID of the ability to execute. Required.\
   * @param params Optional parameters for the script.\
   * @param userId The user ID for permission checks. Required.\
   * @returns Promise<any> The result of the script execution.\
   */\
  async executeAbility(abilityId: string, params?: any, userId?: string): Promise<any> {\
      console.log(`Executing ability: ${abilityId} for user ${userId}`);\
      this.context.loggingService?.logInfo(`Executing ability: ${abilityId}`, { id: abilityId, params, userId });\
\
      if (!userId) {\
           console.error('[AuthorityForgingEngine] Cannot execute ability: User ID is required.');\
           this.context.loggingService?.logError('Cannot execute ability: User ID is required.');\
           throw new Error('User ID is required to execute ability.');\
       }\
\
      // Use the getter which includes user verification\
      const ability = await this.getAbilityById(abilityId, userId); // Await the async getter\
      if (!ability) {\
          // getAbilityById already logs warning/error\
          throw new Error(`Ability not found or does not belong to user: ${abilityId}`);\
      }\
\
      console.log('Running script:\\n', ability.script);\
      // TODO: Implement a secure sandboxed environment to execute the script (e.js. Node.js vm, Web Worker, Edge Function)\
      // This is a critical security consideration! (Integrates with Security Service)\
      // TODO: The execution environment should have access to other core modules (via SystemContext)\
      // so scripts can interact with KB, Runes, Tasks, etc. (Supports Act in Six Styles)\
\
      // MVP Placeholder: Simulate script execution\
      try {\
          console.log('Simulating script execution with params:', params);\
          // In a real scenario, you'd evaluate or run `ability.script` in a sandbox\
          // eval(ability.script); // WARNING: eval is dangerous! Use a sandbox!\
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate work\
          const result = { status: 'simulated_success', output: `Simulated execution of ${ability.name} complete.` };\
          console.log('Ability execution simulated result:', result);\
\
          // TODO: Update last_used_timestamp for the ability (Supports KPI/AARRR - Retention)\
          // TODO: Record this execution as a user action? (Part of Six Styles/Action Recording)\
          // TODO: Trigger an event indicating the ability was executed (part of Six Styles/EventBus)\
          this.context.eventBus?.publish('ability_executed', { abilityId: abilityId, result: result, userId: userId }, userId); // Include userId in event\
          this.context.loggingService?.logInfo(`Ability executed successfully: ${abilityId}`, { id: abilityId, result, userId: userId });\
\
          return result;\
      } catch (error: any) {\
          console.error('Error simulating ability execution:', error);\
          this.context.loggingService?.logError(`Ability execution failed: ${abilityId}`, { id: abilityId, error: error.message, userId: userId });\
          throw new Error(`Ability execution failed: ${error.message}`);\
      }\
  }\
\
  // TODO: Implement different trigger types (schedule, keyword, event). (Part of Six Styles: \u89f8\u767c)\
  // TODO: Implement UI/interaction recording (e.g., capturing clicks, keypresses, form submissions) - Part of Six Styles (Observe).\
  // TODO: Implement pattern recognition logic to suggest/forge new abilities automatically - Part of Wisdom Secret Art (Precipitation) and Six Styles (\u5b78\u7fd2/\u751f\u6210).\
}\
",
      "isBinary": false,
      "fullPath": "src/core/authority/AuthorityForgingEngine.ts",
      "lastModified": 1750137412240
    },

  <bindAction type="file" filePath="src/core/memory/MemoryEngine.ts">
// src/core/memory/MemoryEngine.ts
// 永久記憶中樞 (Long-term Memory) - 核心模組
// Manages the user's personal knowledge base, including storage, retrieval, and potentially semantic search.
// Corresponds to the Knowledge DNA concept (Explicit and Implicit Chains).
// Design Principle: Provides persistent, searchable storage for user knowledge.

import { SystemContext, KnowledgeRecord } from '../../interfaces';
import { SupabaseClient } from '@supabase/supabase-js';
// import { WisdomSecretArt } from '../wisdom/WisdomSecretArt'; // Dependency for semantic processing
// import { EventBus } from '../../modules/events/EventBus'; // Dependency for realtime updates
// import { mergeCRDT } from './crdt-sync'; // Dependency for merging logic (if using CRDT)


export class MemoryEngine {
    private context: SystemContext;
    private supabase: SupabaseClient;
    // private wisdomSecretArt: WisdomSecretArt; // Access via context
    // private eventBus: EventBus; // Access via context

    // In-memory cache for recent/frequently accessed knowledge (optional optimization)
    // private knowledgeCache: Map<string, KnowledgeRecord> = new Map();

    constructor(context: SystemContext) {
        this.context = context;
        this.supabase = context.apiProxy.supabaseClient; // Use the Supabase client from ApiProxy
        // this.wisdomSecretArt = context.wisdomSecretArt;
        // this.eventBus = context.eventBus;
        console.log('MemoryEngine initialized.');

        // TODO: Load initial data from Supabase on startup (Supports Bidirectional Sync Domain)
        // This might involve fetching a small set of recent records or metadata.

        // TODO: Set up Supabase Realtime subscription for knowledge_records table (Part of Bidirectional Sync Domain)
        // This allows receiving updates from other clients or Edge Functions.
        // Example: this.subscribeToKnowledgeUpdates((record, type) => this.handleRealtimeUpdate(record, type));
    }

    /**
     * Records a new knowledge record in Supabase for a specific user.
     * Part of the Long-term Memory process and the "Precipitate" step.
     * @param question The user's input/question. Required.
     * @param answer The AI's response/answer. Required.
     * @param userId The user ID to associate the record with. Required.
     * @param source Optional source of the knowledge.
     * @param devLogDetails Optional details for development logs.
     * @returns Promise<KnowledgeRecord | null> The created KnowledgeRecord or null if saving failed.
     */
    async recordKnowledge(question: string, answer: string, userId: string, source?: string, devLogDetails?: any): Promise<KnowledgeRecord | null> {
        console.log('Recording knowledge record to Supabase for user:', userId);
        this.context.loggingService?.logInfo('Attempting to record knowledge', { userId });

        if (!userId) {
             console.error('[MemoryEngine] Cannot record knowledge: User ID is required.');
             this.context.loggingService?.logError('Cannot record knowledge: User ID is required.');
             throw new Error('User ID is required to record knowledge.');
        }

        const newRecord: Omit<KnowledgeRecord, 'id' | 'timestamp' | 'embedding_vector'> = {
            question,
            answer,
            user_id: userId, // Associate with user
            source: source || 'manual', // Default source
            tags: [], // Example empty tags
            dev_log_details: devLogDetails, // Include dev log details if provided
        };

        try {
            // Insert into Supabase (Supports Bidirectional Sync Domain)
            const { data, error } = await this.supabase
                .from('knowledge_records')
                .insert([newRecord])
                .select() // Select the inserted data to get the generated ID and timestamp
                .single(); // Expecting a single record back

            if (error) {
                console.error('Error recording knowledge to Supabase:', error);
                this.context.loggingService?.logError('Failed to record knowledge', { userId: userId, error: error.message });
                throw error; // Re-throw the error for the caller to handle
            }

            const createdRecord = data as KnowledgeRecord;

            console.log('Knowledge record recorded:', createdRecord.id, 'for user:', createdRecord.user_id);

            // TODO: Trigger semantic processing (embedding generation) using Wisdom Secret Art in the background
            // This should ideally be done asynchronously, perhaps triggered by a database webhook or Edge Function.
            // Example: this.context.wisdomSecretArt?.processData(createdRecord, userId); // Pass user ID

            // TODO: Publish 'knowledge_record_created' event via EventBus (Supports Event Push - call context.eventBus.publish)
            this.context.eventBus?.publish('knowledge_record_created', createdRecord, userId); // Include userId in event

            this.context.loggingService?.logInfo(`Knowledge recorded: ${createdRecord.id}`, { userId: userId });

            return createdRecord;

        } catch (error: any) {
            console.error('Failed to record knowledge:', error);
            this.context.loggingService?.logError('Failed to record knowledge', { userId: userId, error: error.message });
            return null; // Return null on failure
        }
    }

    /**
     * Fetches knowledge records from Supabase based on a query for a specific user.
     * This method supports basic keyword search and is a placeholder for enhanced semantic search.
     * Part of the Long-term Memory process.
     * @param query The search query. Required.
     * @param userId The user ID to filter records by. Required.
     * @param useSemanticSearch Optional: Whether to attempt semantic search.
     * @returns Promise<KnowledgeRecord[]> An array of matching KnowledgeRecords.
     */
    async queryKnowledge(query: string, userId: string, useSemanticSearch: boolean = false): Promise<KnowledgeRecord[]> {
        console.log(`Querying knowledge records in Supabase: "${query}" for user: ${userId} (Semantic: ${useSemanticSearch})`);
        this.context.loggingService?.logInfo('Attempting to query knowledge', { query, userId, useSemanticSearch });

        if (!userId) {
             console.warn('[MemoryEngine] Cannot query knowledge: User ID is required.');
             this.context.loggingService?.logWarning('Cannot query knowledge: User ID is required.');
             return []; // Return empty if no user ID
        }

        try {
            if (useSemanticSearch) {
                console.log('[MemoryEngine] Attempting semantic search (simulated)...');
                // TODO: Implement enhanced semantic search using vector embeddings (Knowledge DNA Implicit Chain)
                // This would involve:
                // 1. Generating an embedding for the query using an embedding model (via ApiProxy/WisdomSecretArt).
                // 2. Performing a vector similarity search in Supabase (requires pgvector extension) or Pinecone (via ApiProxy).
                // 3. Combining vector search results with traditional full-text search results (Knowledge DNA Explicit Chain).
                // 4. Ranking and filtering results based on similarity score and relevance.

                // --- Semantic Search Simulation ---
                // For MVP, simulate semantic search results by filtering keyword results
                // based on a simple heuristic or returning a subset.
                const keywordResults = await this.performKeywordSearch(query, userId);
                const simulatedSemanticResults = keywordResults.filter(record =>
                    record.question.includes(query) || record.answer.includes(query) // Simple filter
                ).slice(0, Math.min(3, keywordResults.length)); // Return top N simulated semantic results

                console.log(`Found ${simulatedSemanticResults.length} simulated semantic matching records for user ${userId}.`);
                this.context.loggingService?.logInfo(`Simulated semantic knowledge query successful. Found ${simulatedSemanticResults.length} records.`, { query, userId: userId });

                return simulatedSemanticResults;

            } else {
                console.log('[MemoryEngine] Performing keyword search...');
                // Perform a basic full-text search using Supabase's built-in text search features
                return this.performKeywordSearch(query, userId);
            }

        } catch (error: any) {
            console.error('Failed to query knowledge:', error);
            this.context.loggingService?.logError('Failed to query knowledge', { query, userId: userId, error: error.message });
            throw error; // Re-throw the error
        }
    }

    /**
     * Performs a basic full-text keyword search in Supabase.
     * @param query The search query. Required.
     * @param userId The user ID to filter records by. Required.
     * @returns Promise<KnowledgeRecord[]> An array of matching KnowledgeRecords.
     */
    private async performKeywordSearch(query: string, userId: string): Promise<KnowledgeRecord[]> {
         const { data, error } = await this.supabase
            .from('knowledge_records')
            .select('*')
            .eq('user_id', userId) // Filter by user ID (RLS should also enforce this)
            .textSearch('question_answer_fts', query, { // Assuming a combined text search index or similar
                 type: 'websearch', // Use websearch type for better results with phrases
                 config: 'english' // Use English config
            });

        if (error) {
            console.error('Error performing keyword search from Supabase:', error);
            this.context.loggingService?.logError('Failed to perform keyword search', { query, userId: userId, error: error.message });
            throw error; // Re-throw the error
        }

        const results = data as KnowledgeRecord[];
        console.log(`Found ${results.length} keyword matching records for user ${userId}.`);
        this.context.loggingService?.logInfo(`Keyword knowledge query successful. Found ${results.length} records.`, { query, userId: userId });

        return results;
    }


    /**
     * Fetches all knowledge records for a specific user from Supabase.
     * Use with caution on large datasets.
     * @param userId The user ID to filter records by. Required.
     * @returns Promise<KnowledgeRecord[]> An array of all KnowledgeRecords for the user.
     */
    async getAllKnowledgeForUser(userId: string): Promise<KnowledgeRecord[]> {
        console.log('Fetching all knowledge records from Supabase for user:', userId);
        this.context.loggingService?.logInfo('Attempting to fetch all knowledge', { userId });

        if (!userId) {
             console.warn('[MemoryEngine] Cannot fetch all knowledge: User ID is required.');
             this.context.loggingService?.logWarning('Cannot fetch all knowledge: User ID is required.');
             return []; // Return empty if no user ID
        }

        try {
            // Fetch all records from Supabase for the user (Supports Bidirectional Sync Domain)
            const { data, error } = await this.supabase
                .from('knowledge_records')
                .select('*')
                .eq('user_id', userId) // Filter by user ID (RLS should also enforce this)
                .order('timestamp', { ascending: false } as any); // Order by newest first

            if (error) {
                console.error('Error fetching all knowledge from Supabase:', error);
                this.context.loggingService?.logError('Failed to fetch all knowledge', { userId: userId, error: error.message });
                throw error; // Re-throw the error
            }

            const records = data as KnowledgeRecord[];
            console.log(`Fetched ${records.length} records for user ${userId}.`);
            this.context.loggingService?.logInfo(`Fetched all knowledge successfully. Found ${records.length} records.`, { userId: userId });

            return records;

        } catch (error: any) {
            console.error('Failed to fetch all knowledge:', error);
            this.context.loggingService?.logError('Failed to fetch all knowledge', { userId: userId, error: error.message });
            return []; // Return empty array on failure
        }
    }


    /**
     * Updates an existing knowledge record for a specific user in Supabase.
     * @param id The ID of the record to update. Required.
     * @param updates The updates to apply (e.g., { question: 'new Q', answer: 'new A' }). Required.
     * @param userId The user ID for verification. Required.
     * @returns Promise<KnowledgeRecord | null> The updated KnowledgeRecord or null if update failed or user mismatch.
     */
    async updateKnowledge(id: string, updates: Partial<Omit<KnowledgeRecord, 'id' | 'timestamp' | 'user_id' | 'embedding_vector'>>, userId: string): Promise<KnowledgeRecord | null> {
        console.log(`Updating knowledge record ${id} in Supabase for user ${userId}...`, updates);
        this.context.loggingService?.logInfo(`Attempting to update knowledge record ${id}`, { id, updates, userId });

        if (!userId) {
             console.warn('[MemoryEngine] Cannot update knowledge: User ID is required.');
             this.context.loggingService?.logWarning('Cannot update knowledge: User ID is required.');
             return null; // Return null if no user ID
        }

        try {
            // Update in Supabase (Supports Bidirectional Sync Domain)
            // Filter by ID and user_id to ensure ownership (RLS should also enforce this)
            const { data, error } = await this.supabase
                .from('knowledge_records')
                .update(updates)
                .eq('id', id)
                .eq('user_id', userId) // Ensure ownership
                .select() // Select the updated data
                .single(); // Expecting a single record back

            if (error) {
                console.error(`Error updating knowledge record ${id} in Supabase:`, error);
                this.context.loggingService?.logError(`Failed to update knowledge record ${id}`, { id, updates, userId: userId, error: error.message });
                throw error; // Re-throw the error
            }

            if (!data) {
                 console.warn(`Knowledge record ${id} not found or does not belong to user ${userId} for update.`);
                 this.context.loggingService?.logWarning(`Knowledge record not found or user mismatch for update: ${id}`, { userId });
                 return null; // Return null if not found or user mismatch
            }

            const updatedRecord = data as KnowledgeRecord;
            console.log(`Knowledge record ${id} updated in Supabase.`);

            // TODO: Trigger semantic processing update (re-embedding) using Wisdom Secret Art in the background
            // This should ideally be done asynchronously.
            // Example: this.context.wisdomSecretArt?.processData(updatedRecord, userId); // Pass user ID

            // TODO: Publish 'knowledge_record_updated' event via EventBus (Supports Event Push - call context.eventBus.publish)
            this.context.eventBus?.publish('knowledge_record_updated', updatedRecord, userId); // Include userId in event

            this.context.loggingService?.logInfo(`Knowledge updated: ${updatedRecord.id}`, { userId: userId });

            return updatedRecord;

        } catch (error: any) {
            console.error(`Failed to update knowledge record ${id}:`, error);
            this.context.loggingService?.logError(`Failed to update knowledge record ${id}`, { id, updates, userId: userId, error: error.message });
            return null; // Return null on failure
        }
    }

    /**
     * Deletes a knowledge record for a specific user from Supabase.
     * @param id The ID of the record to delete. Required.
     * @param userId The user ID for verification. Required.
     * @returns Promise<boolean> True if deletion was successful, false otherwise.
     */
    async deleteKnowledge(id: string, userId: string): Promise<boolean> {
        console.log(`Deleting knowledge record ${id} from Supabase for user ${userId}...`);
        this.context.loggingService?.logInfo(`Attempting to delete knowledge record ${id}`, { id, userId });

        if (!userId) {
             console.warn('[MemoryEngine] Cannot delete knowledge: User ID is required.');
             this.context.loggingService?.logWarning('Cannot delete knowledge: User ID is required.');
             return false; // Return false if no user ID
        }

        try {
            // Delete from Supabase (Supports Bidirectional Sync Domain)
            // Filter by ID and user_id to ensure ownership (RLS should also enforce this)
            const { count, error } = await this.supabase
                .from('knowledge_records')
                .delete()
                .eq('id', id)
                .eq('user_id', userId) // Ensure ownership
                .select('id', { count: 'exact' }); // Select count to check if a row was deleted

            if (error) {
                console.error(`Error deleting knowledge record ${id} from Supabase:`, error);
                this.context.loggingService?.logError(`Failed to delete knowledge record ${id}`, { id, userId: userId, error: error.message });
                throw error; // Re-throw the error
            }

            const deleted = count !== null && count > 0; // Check if count is greater than 0

            if (deleted) {
                console.log(`Knowledge record ${id} deleted from Supabase.`);
                // TODO: Publish 'knowledge_record_deleted' event via EventBus (Supports Event Push - call context.eventBus.publish)
                this.context.eventBus?.publish('knowledge_record_deleted', { id: id, userId: userId }, userId); // Include userId in event
                this.context.loggingService?.logInfo(`Knowledge deleted: ${id}`, { userId: userId });
            } else {
                 console.warn(`Knowledge record ${id} not found or does not belong to user ${userId} for deletion.`);
                 this.context.loggingService?.logWarning(`Knowledge record not found or user mismatch for deletion: ${id}`, { userId });
            }

            return deleted;

        } catch (error: any) {
            console.error(`Failed to delete knowledge record ${id}:`, error);
            this.context.loggingService?.logError(`Failed to delete knowledge record ${id}`, { id, userId: userId, error: error.message });
            return false; // Return false on failure
        }
    }


    /**
     * Subscribes to real-time updates from the knowledge_records table for the current user.
     * This is crucial for cross-device synchronization (雙向同步領域).
     * @param callback A function to call when a change is received. Required.
     * @returns The Realtime subscription object.
     */
    subscribeToKnowledgeUpdates(callback: (record: KnowledgeRecord, type: 'INSERT' | 'UPDATE' | 'DELETE') => void): any {
        console.log('[MemoryEngine] Subscribing to knowledge record realtime updates.');
        // TODO: Implement actual Supabase Realtime subscription
        // Filter by user_id if possible in Realtime policies or client-side
        // const subscription = this.supabase
        //     .channel('knowledge_records') // Or a channel specific to the user if possible
        //     .on('postgres_changes', { event: '*', schema: 'public', table: 'knowledge_records' }, (payload) => {
        //         console.log('Realtime change received:', payload);
        //         // Ensure the change is for the current user if not filtered by channel/policy
        //         if (payload.new?.user_id === this.context.currentUser?.id || payload.old?.user_id === this.context.currentUser?.id) {
        //              const record = (payload.new || payload.old) as KnowledgeRecord;
        //              callback(record, payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE');
        //         }\
        //     })\
        //     .subscribe();\
        // return subscription;\

        // Simulate subscription for MVP
        console.warn('[MemoryEngine] Realtime subscription simulated.');
        return { unsubscribe: () => console.warn('[MemoryEngine] Simulated unsubscribe.') }; // Return a dummy unsubscribe function
    }

    /**
     * Unsubscribes from real-time updates.
     * @param subscription The subscription object returned by subscribeToKnowledgeUpdates. Required.
     */
    unsubscribeFromKnowledgeUpdates(subscription: any): void {
        console.log('[MemoryEngine] Unsubscribing from knowledge record realtime updates.');
        // TODO: Implement actual Supabase Realtime unsubscribe
        // subscription?.unsubscribe();
        console.warn('[MemoryEngine] Simulated unsubscribe.');
    }


    // TODO: Implement semantic processing integration (embedding generation, similarity search) using WisdomSecretArt. (Part of Wisdom Precipitation Secret Art)
    // TODO: Implement CRDT merging logic if needed for complex offline/multi-writer scenarios. (Part of Bidirectional Sync Domain)
    // TODO: Integrate with SyncService for orchestration of sync across devices/platforms. (Part of Bidirectional Sync Domain)
    // TODO: This module is the core of the Long-term Memory (永久記憶) pillar.
}

// Example Usage (called by KnowledgeSync):
// const memoryEngine = new MemoryEngine(systemContext);
// memoryEngine.recordKnowledge('What is Jun.Ai.Key?', 'It is an OmniKey system.', 'user-sim-123');
// memoryEngine.queryKnowledge('OmniKey', 'user-sim-123');
// memoryEngine.getAllKnowledgeForUser('user-sim-123');
// memoryEngine.updateKnowledge('record-id-123', { answer: 'Updated answer.' }, 'user-sim-123');
// memoryEngine.deleteKnowledge('record-id-123', 'user-sim-123');
// const sub = memoryEngine.subscribeToKnowledgeUpdates((rec, type) => console.log('Realtime:', type, rec));
// // later: memoryEngine.unsubscribeFromKnowledgeUpdates(sub);