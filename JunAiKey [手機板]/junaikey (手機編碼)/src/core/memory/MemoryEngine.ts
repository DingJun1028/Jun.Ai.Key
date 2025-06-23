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
     * @returns Promise<KnowledgeRecord[]> An array of matching KnowledgeRecords.
     */
    async queryKnowledge(query: string, userId: string): Promise<KnowledgeRecord[]> {
        console.log('Querying knowledge records in Supabase:', query, 'for user:', userId);
        this.context.loggingService?.logInfo('Attempting to query knowledge', { query, userId });

        if (!userId) {
             console.warn('[MemoryEngine] Cannot query knowledge: User ID is required.');
             this.context.loggingService?.logWarning('Cannot query knowledge: User ID is required.');
             return []; // Return empty if no user ID
        }

        try {
            // TODO: Implement enhanced semantic search using vector embeddings (Knowledge DNA Implicit Chain)
            // This would involve:
            // 1. Generating an embedding for the query using an embedding model (via ApiProxy/WisdomSecretArt).
            // 2. Performing a vector similarity search in Supabase (requires pgvector extension) or Pinecone (via ApiProxy).
            // 3. Combining vector search results with traditional full-text search results (Knowledge DNA Explicit Chain).
            // 4. Ranking and filtering results.

            // For MVP, perform a basic full-text search using Supabase's built-in text search features
            const { data, error } = await this.supabase
                .from('knowledge_records')
                .select('*')
                .eq('user_id', userId) // Filter by user ID (RLS should also enforce this)
                .textSearch('question_answer_fts', query, { // Assuming a combined text search index or similar
                     type: 'websearch', // Use websearch type for better results with phrases
                     config: 'english' // Use English config
                });

            if (error) {
                console.error('Error querying knowledge from Supabase:', error);
                this.context.loggingService?.logError('Failed to query knowledge', { query, userId: userId, error: error.message });
                throw error; // Re-throw the error
            }

            const results = data as KnowledgeRecord[];
            console.log(`Found ${results.length} matching records for user ${userId}.`);
            this.context.loggingService?.logInfo(`Knowledge query successful. Found ${results.length} records.`, { query, userId: userId });

            return results;

        } catch (error: any) {
            console.error('Failed to query knowledge:', error);
            this.context.loggingService?.logError('Failed to query knowledge', { query, userId: userId, error: error.message });
            return []; // Return empty array on failure
        }
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
                .order('timestamp', { ascending: false }); // Order by newest first

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