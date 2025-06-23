// src/modules/knowledgeSync.ts
// Knowledge Sync Module
// Acts as an intermediary between UI/other modules and the MemoryEngine.
// Handles data validation, basic business logic related to knowledge, and potentially sync orchestration for knowledge.
// Part of the Bidirectional Sync Domain (雙向同步領域) and interacts with Permanent Memory (永久記憶).

import { MemoryEngine } from '../core/memory/MemoryEngine';
import { SystemContext, KnowledgeRecord } from '../interfaces';
// import { LoggingService } from '../core/logging/LoggingService'; // Dependency
// import { EventBus } from './events/EventBus'; // Dependency


export class KnowledgeSync {
    private memoryEngine: MemoryEngine; // The core MemoryEngine
    private context: SystemContext;
    // private loggingService: LoggingService; // Access via context
    // private eventBus: EventBus; // Access via context

    constructor(context: SystemContext) {
        this.context = context;
        this.memoryEngine = context.memoryEngine; // Get MemoryEngine from context
        // this.loggingService = context.loggingService;
        // this.eventBus = context.eventBus;
        console.log('KnowledgeSync module initialized.');
        // TODO: Integrate with SyncService for orchestration of sync across devices/platforms. (Part of Bidirectional Sync Domain)
    }

    /**
     * Saves a new knowledge record.
     * Performs basic validation and calls the MemoryEngine.
     * @param question The question. Required.
     * @param answer The answer. Required.
     * @param userId The user ID. Required.
     * @param source Optional source.
     * @param devLogDetails Optional dev log details.
     * @returns Promise<KnowledgeRecord | null> The saved record or null.
     */
    async saveKnowledge(question: string, answer: string, userId: string, source?: string, devLogDetails?: any): Promise<KnowledgeRecord | null> {
        console.log('[KnowledgeSync] Attempting to save knowledge for user:', userId);
        this.context.loggingService?.logInfo('Attempting to save knowledge', { userId });

        if (!question || !answer || !userId) {
            console.error('[KnowledgeSync] Validation failed: Question, answer, and user ID are required.');
            this.context.loggingService?.logError('Validation failed for saving knowledge', { userId });
            throw new Error('Question, answer, and user ID are required.');
        }

        try {
            // Call the core MemoryEngine to record the knowledge
            const savedRecord = await this.memoryEngine.recordKnowledge(question, answer, userId, source, devLogDetails); // Pass all details

            if (savedRecord) {
                console.log('[KnowledgeSync] Knowledge saved successfully:', savedRecord.id);
                this.context.loggingService?.logInfo('Knowledge saved successfully', { recordId: savedRecord.id, userId: userId });
                // TODO: Trigger local sync event if needed (call context.syncService.handleLocalDataChange)
            } else {
                 console.error('[KnowledgeSync] Failed to save knowledge via MemoryEngine.');
                 this.context.loggingService?.logError('Failed to save knowledge via MemoryEngine', { userId: userId });
            }

            return savedRecord;

        } catch (error: any) {
            console.error('[KnowledgeSync] Error saving knowledge:', error);
            this.context.loggingService?.logError('Error saving knowledge', { userId: userId, error: error.message });
            throw error; // Re-throw the error
        }
    }

    /**
     * Searches the knowledge base for records matching a query for a specific user.
     * Can perform keyword or semantic search.
     * @param query The search query. Required.
     * @param userId The user ID. Required.
     * @param useSemanticSearch Optional: Whether to use semantic search. Defaults to false.
     * @returns Promise<KnowledgeRecord[]> An array of matching records.
     */
    async searchKnowledge(query: string, userId: string, useSemanticSearch: boolean = false): Promise<KnowledgeRecord[]> {
        console.log(`[KnowledgeSync] Searching knowledge for user: ${userId} with query: "${query}" (Semantic: ${useSemanticSearch})`);
        this.context.loggingService?.logInfo('Attempting to search knowledge', { query, userId, useSemanticSearch });

        if (!query || !userId) {
            console.warn('[KnowledgeSync] Search query and user ID are required.');
            this.context.loggingService?.logWarning('Search query and user ID are required.');
            return [];
        }

        try {
            // Call the core MemoryEngine to perform the query
            // Pass the useSemanticSearch flag to MemoryEngine
            const results = await this.memoryEngine.queryKnowledge(query, userId, useSemanticSearch); // Pass useSemanticSearch

            console.log(`[KnowledgeSync] Search completed. Found ${results.length} results.`);
            this.context.loggingService?.logInfo(`Knowledge search completed. Found ${results.length} results.`, { query, userId: userId });

            return results;

        } catch (error: any) {
            console.error('[KnowledgeSync] Error searching knowledge:', error);
            this.context.loggingService?.logError('Error searching knowledge', { query, userId: userId, error: error.message });
            throw error; // Re-throw the error
        }
    }

     /**
     * Fetches all knowledge records for a specific user.
     * @param userId The user ID. Required.
     * @returns Promise<KnowledgeRecord[]> An array of all records for the user.
     */
    async getAllKnowledgeForUser(userId: string): Promise<KnowledgeRecord[]> {
        console.log(`[KnowledgeSync] Getting all knowledge for user: ${userId}`);
        this.context.loggingService?.logInfo('Attempting to get all knowledge', { userId });

        if (!userId) {
            console.warn('[KnowledgeSync] User ID is required to get all knowledge.');
            this.context.loggingService?.logWarning('User ID is required to get all knowledge.');
            return [];
        }

        try {
            // Call the core MemoryEngine to get all knowledge
            const records = await this.memoryEngine.getAllKnowledgeForUser(userId);

            console.log(`[KnowledgeSync] Fetched ${records.length} records.`);
            this.context.loggingService?.logInfo(`Fetched ${records.length} records.`, { userId: userId });

            return records;

        } catch (error: any) {
            console.error('[KnowledgeSync] Error getting all knowledge:', error);
            this.context.loggingService?.logError('Error getting all knowledge', { userId: userId, error: error.message });
            throw error; // Re-throw the error
        }
    }


    /**
     * Updates an existing knowledge record.
     * @param id The ID of the record. Required.
     * @param updates The updates to apply. Required.
     * @param userId The user ID for verification. Required.
     * @returns Promise<KnowledgeRecord | null> The updated record or null.
     */
    async updateKnowledge(id: string, updates: Partial<Omit<KnowledgeRecord, 'id' | 'timestamp' | 'user_id' | 'embedding_vector'>>, userId: string): Promise<KnowledgeRecord | null> {
        console.log(`[KnowledgeSync] Attempting to update knowledge record ${id} for user: ${userId}`, updates);
        this.context.loggingService?.logInfo(`Attempting to update knowledge record ${id}`, { id, updates, userId });

        if (!id || !userId || Object.keys(updates).length === 0) {
            console.warn('[KnowledgeSync] Update failed: ID, user ID, and updates are required.');
            this.context.loggingService?.logWarning('Update failed: ID, user ID, and updates are required.', { id, userId, updates });
            throw new Error('ID, user ID, and updates are required.');
        }

        try {
            // Call the core MemoryEngine to update the knowledge
            const updatedRecord = await this.memoryEngine.updateKnowledge(id, updates, userId); // Pass userId

            if (updatedRecord) {
                console.log('[KnowledgeSync] Knowledge updated successfully:', updatedRecord.id);
                this.context.loggingService?.logInfo('Knowledge updated successfully', { recordId: updatedRecord.id, userId: userId });
                // TODO: Trigger local sync event if needed (call context.syncService.handleLocalDataChange)
            } else {
                 console.warn('[KnowledgeSync] Failed to update knowledge via MemoryEngine (record not found or user mismatch).');
                 this.context.loggingService?.logWarning('Failed to update knowledge via MemoryEngine (record not found or user mismatch).', { recordId: id, userId: userId });
            }

            return updatedRecord;

        } catch (error: any) {
            console.error('[KnowledgeSync] Error updating knowledge:', error);
            this.context.loggingService?.logError('Error updating knowledge', { recordId: id, userId: userId, error: error.message });
            throw error; // Re-throw the error
        }
    }

    /**
     * Deletes a knowledge record.
     * @param id The ID of the record. Required.
     * @param userId The user ID for verification. Required.
     * @returns Promise<boolean> True if deletion was successful.
     */
    async deleteKnowledge(id: string, userId: string): Promise<boolean> {
        console.log(`[KnowledgeSync] Attempting to delete knowledge record ${id} for user: ${userId}`);
        this.context.loggingService?.logInfo(`Attempting to delete knowledge record ${id}`, { id, userId });

        if (!id || !userId) {
            console.warn('[KnowledgeSync] Delete failed: ID and user ID are required.');
            this.context.loggingService?.logWarning('Delete failed: ID and user ID are required.', { id, userId });
            throw new Error('ID and user ID are required.');
        }

        try {
            // Call the core MemoryEngine to delete the knowledge
            const success = await this.memoryEngine.deleteKnowledge(id, userId); // Pass userId

            if (success) {
                console.log('[KnowledgeSync] Knowledge deleted successfully:', id);
                this.context.loggingService?.logInfo('Knowledge deleted successfully', { recordId: id, userId: userId });
                // TODO: Trigger local sync event if needed (call context.syncService.handleLocalDataChange)
            } else {
                 console.warn('[KnowledgeSync] Failed to delete knowledge via MemoryEngine (record not found or user mismatch).');
                 this.context.loggingService?.logWarning('Failed to delete knowledge via MemoryEngine (record not found or user mismatch).', { recordId: id, userId: userId });
            }

            return success;

        } catch (error: any) {
            console.error('[KnowledgeSync] Error deleting knowledge:', error);
            this.context.loggingService?.logError('Error deleting knowledge', { recordId: id, userId: userId, error: error.message });
            throw error; // Re-throw the error
        }
    }

    // TODO: Add methods for importing/exporting knowledge.
    // TODO: Add methods for managing tags, sources, etc.
    // TODO: This module is part of the Bidirectional Sync Domain (雙向同步領域) and interacts with Permanent Memory (永久記憶).
}