import { SystemContext } from '../interfaces';
// import { SupabaseClient } from '@supabase/supabase-js'; // For storing notifications or triggering Edge Functions
// import { EventBus } from '../events/EventBus'; // To subscribe to events
// import { LoggingService } from '../core/logging/LoggingService'; // Dependency

export interface Notification {
    id: string;
    userId?: string; // Target user
    type: 'info' | 'warning' | 'error' | 'success';
    message: string;
    details?: any;
    timestamp: string; // ISO 8601
    isRead: boolean;
    channel: 'ui' | 'email' | 'webhook' | 'push'; // Delivery channel
    // TODO: Add action links, icon, expiry
}

export class NotificationService {
    // private supabase: SupabaseClient; // For persisting notifications
    // private eventBus: EventBus; // To subscribe to events
    // private loggingService: LoggingService; // For logging notifications
    private uiNotifications: Notification[] = []; // Simple in-memory store for UI notifications
    private uiNotificationListeners: ((notifications: Notification[]) => void)[] = []; // Listeners for UI notifications

    constructor(/* supabaseClient: SupabaseClient, eventBus: EventBus, loggingService: LoggingService */) {
        // this.supabase = supabaseClient;
        // this.eventBus = eventBus;
        // this.loggingService = loggingService;
        console.log('NotificationService initialized (Placeholder - using in-memory array for UI).');
        // TODO: Subscribe to relevant events from EventBus (e.g., 'task_completed', 'ability_forged', 'new_knowledge')
        // Example: this.eventBus.subscribe('new_knowledge', (payload) => this.handleNewKnowledgeEvent(payload));
        // Example: this.eventBus.subscribe('task_completed', (payload) => this.handleTaskCompletedEvent(payload));
        // Example: this.eventBus.subscribe('task_failed', (payload) => this.handleTaskFailedEvent(payload));
        // TODO: Load initial UI notifications from persistence (Supports Bidirectional Sync Domain)
    }

    /**
     * Sends a notification.
     * @param notification The notification object (without id, timestamp, isRead).
     * @returns Promise<Notification | null> The created notification or null on failure.
     */
    async sendNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>): Promise<Notification | null> {
        console.log(`[NotificationService] Sending notification: ${notification.type} - ${notification.message} (Channel: ${notification.channel})`);

        const newNotification: Notification = {
            id: 'notif-' + Date.now() + '-' + Math.random().toString(16).slice(2),
            timestamp: new Date().toISOString(),
            isRead: false,
            ...notification,
        };

        try {
            // TODO: Persist notification to Supabase table (Supports Bidirectional Sync Domain)
            // const { data, error } = await this.supabase.from('notifications').insert([newNotification]).select().single();
            // if (error) throw error;
            // const createdNotification = data as Notification;

            // Simulate persistence
            const createdNotification = newNotification;

            // Handle delivery based on channel
            switch (createdNotification.channel) {
                case 'ui':
                    this.uiNotifications.push(createdNotification); // Add to in-memory UI list
                    this.notifyUiListeners(); // Notify UI components
                    console.log('[NotificationService] Added UI notification.');
                    break;
                case 'email':
                    console.log('[NotificationService] Simulating sending email notification.');
                    // TODO: Integrate with email sending service (SendGrid, Resend, Supabase Edge Function)
                    break;
                case 'webhook':
                    console.log('[NotificationService] Simulating sending webhook notification.');
                    // TODO: Integrate with webhook service (Supabase Edge Function, external service)
                    // The Supabase Edge Function `trigger_notification` is an example of this.
                    break;
                case 'push':
                    console.log('[NotificationService] Simulating sending push notification.');
                    // TODO: Integrate with push notification service (OneSignal, Expo)
                    break;
                default:
                    console.warn(`[NotificationService] Unknown notification channel: ${createdNotification.channel}`);
            }

            // TODO: Publish a 'new_notification' event via EventBus (Supports Event Push - call eventBus.publish)
            // this.eventBus.publish('new_notification', createdNotification);

            // TODO: Log notification sent (Supports Observe/Monitor, AARRR - Activation/Retention - call loggingService.logInfo)
            // this.loggingService.logInfo(`Notification sent: ${createdNotification.id}`, { type: createdNotification.type, channel: createdNotification.channel, userId: createdNotification.userId });

            return createdNotification;

        } catch (error: any) {
            console.error('[NotificationService] Failed to send notification:', error);
            // TODO: Log error using LoggingService (Supports Observe/Monitor - call loggingService.logError)
            return null;
        }
    }

    /**
     * Retrieves UI notifications for a user (placeholder).
     * @param userId Optional: Filter by user ID.
     * @returns Promise<Notification[]>\
     */\
    async getUiNotifications(userId?: string): Promise<Notification[]> {\
        console.log(`[NotificationService] Getting UI notifications for user: ${userId || 'all'} (Placeholder)`);\
        // TODO: Fetch from Supabase table, filtered by userId and isRead status (Supports Bidirectional Sync Domain)\
        // For MVP, return the in-memory list\
        return this.uiNotifications.filter(n => !n.isRead && (!userId || n.userId === userId)); // Filter for unread and by user\
    }\
\
    /**\
     * Marks a UI notification as read (placeholder).\
     * @param notificationId The ID of the notification.\
     * @returns Promise<boolean> True if successful.\
     */\
    async markAsRead(notificationId: string): Promise<boolean> {\
        console.log(`[NotificationService] Marking notification ${notificationId} as read (Placeholder).`);\
        // TODO: Update isRead status in Supabase table (Supports Bidirectional Sync Domain)\
        // For MVP, update in-memory list\
        const notification = this.uiNotifications.find(n => n.id === notificationId);\
        if (notification) {\
            notification.isRead = true;\
            console.log(`Notification ${notificationId} marked as read.`);\
            this.notifyUiListeners(); // Notify UI components\
            // TODO: Publish 'notification_updated' event (Supports Event Push - call eventBus.publish)\
            // TODO: Log notification read (Supports Observe/Monitor, AARRR - Activation/Retention - call loggingService.logInfo)\
            return true;\
        }\
        console.warn(`Notification not found for marking as read: ${notificationId}`);\
        // TODO: Log warning using LoggingService (Supports Observe/Monitor - call loggingService.logWarning)\
        return false;\
    }\
\
    /**\
     * Subscribes a callback function to UI notification updates.\
     * @param callback The function to call when UI notifications change.\
     * @returns A function to unsubscribe the callback.\
     */\
    subscribeToUiNotifications(callback: (notifications: Notification[]) => void): () => void {\
        this.uiNotificationListeners.push(callback);\
        // Immediately call the callback with the current state\
        callback(this.uiNotifications.filter(n => !n.isRead)); // Pass current UNREAD notifications\
        // Return an unsubscribe function\
        return () => {\
            this.uiNotificationListeners = this.uiNotificationListeners.filter(listener => listener !== callback);\
        };\
    }\
\
    /**\
     * Notifies all registered UI notification listeners.\
     */\
    private notifyUiListeners(): void {\
        const currentNotifications = this.uiNotifications.filter(n => !n.isRead); // Only send unread for simplicity\
        this.uiNotificationListeners.forEach(listener => {\
            try {\
                listener(currentNotifications);\
            } catch (error) {\
                console.error('[NotificationService] Error in UI notification listener:', error);\
                // TODO: Log error using LoggingService\
            }\
        });\
    }\
\
    // TODO: Implement methods for deleting notifications, marking all as read, etc.\
    // TODO: Implement handlers for specific system events to trigger notifications\
    // private handleNewKnowledgeEvent(payload: any): void { ... call sendNotification ... }\
    // private handleTaskCompletedEvent(payload: any): void { ... call sendNotification ... }\
    // private handleTaskFailedEvent(payload: any): void { ... call sendNotification ... }\
    // TODO: This module is part of the Bidirectional Sync Domain (\u96d9\u5410\u540c\u6b65\u9818\u57df) for syncing notification status (read/unread).\
}\
",
      "isBinary": false,
      "fullPath": "src/modules/notifications/NotificationService.ts",
      "lastModified": 1750110857840
    },
    "src/modules/sync/SyncService.ts": {
      "name": "SyncService.ts",
      "type": "file",
      "contents": "import { SystemContext, KnowledgeRecord, ForgedAbility, Task, Rune, Goal, UserAction, SystemEvent, CloudSyncConfig, ScriptingAppWorkflow, MobileGitSyncConfig } from '../../interfaces';\nimport { SupabaseClient } from '@supabase/supabase-js';\n// import { EventBus } from '../events/EventBus'; // Dependency for events\n// import { LoggingService } from '../core/logging/LoggingService'; // Dependency\n// import { mergeCRDT } from '../core/memory/crdt-sync'; // Dependency for merging logic (if using CRDT)\n\nexport class SyncService {\n    private context: SystemContext;\n    private supabase: SupabaseClient;\n    // private eventBus: EventBus; // Access via context\n    // private loggingService: LoggingService; // Access via context\n\n    // TODO: Add state for tracking sync status per data type or device\n    // private syncStatus: Map<string, 'idle' | 'syncing' | 'error'> = new Map();\n    // private lastSyncTimestamps: Map<string, number> = new Map(); // Timestamp of last successful sync\n\n    constructor(context: SystemContext) {\n        this.context = context;\n        this.supabase = context.apiProxy.supabaseClient;\n        // this.eventBus = context.eventBus;\n        // this.loggingService = context.loggingService;\n        console.log('SyncService initialized (Placeholder).');\n\n        // TODO: Set up listeners for data changes in core modules (e.g., MemoryEngine, AuthorityForgingEngine)\n        // When data changes locally, mark it as needing sync and potentially trigger an outgoing sync.\n        // Example: this.context.eventBus.subscribe('knowledge_record_updated', (payload) => this.handleLocalDataChange('knowledge', payload));\n\n        // TODO: Set up listeners for incoming changes from external sources (e.g., Supabase Realtime, webhooks, dedicated sync channels)\n        // When data changes remotely, receive it, merge it, and update local state.\n        // Example: this.context.memoryEngine.subscribeToKnowledgeUpdates((record, type) => this.handleRemoteDataChange('knowledge', record, type));\n\n        // TODO: Implement periodic sync triggers or event-based triggers based on CloudSyncConfig.\n    }\n\n    /**\n     * Orchestrates the synchronization process for a specific data type for a user.\n     * This is a core method of the Bidirectional Sync Domain.\n     * @param dataType The type of data to sync ('knowledge', 'abilities', 'tasks', 'runes', 'user_actions', 'system_events', 'notifications', 'goals'). Required.\n     * @param userId The user ID whose data to sync. Required.\n     * @param direction Optional: 'up' (local to remote), 'down' (remote to local), or 'bidirectional' (default).\n     * @returns Promise<void>\n     */\n    async syncDataType(dataType: keyof SystemContext, userId: string, direction: 'up' | 'down' | 'bidirectional' = 'bidirectional'): Promise<void> {\n        console.log(`[SyncService] Initiating ${direction} sync for ${dataType} for user: ${userId}...`);\n        this.context.loggingService?.logInfo(`Initiating sync for ${dataType}`, { dataType, userId, direction });\n\n        if (!userId) {\n             console.error('[SyncService] Cannot sync: User ID is required.');\n             this.context.loggingService?.logError('Cannot sync: User ID is required.');\n             throw new Error('User ID is required to sync data.');\n        }\n\n        // TODO: Implement actual sync logic for each data type.\n        // This will involve:\n        // 1. Fetching local changes (if any) that haven't been synced ('up' direction).\n        // 2. Fetching remote changes (e.g., from Supabase Realtime buffer or by querying for changes since last sync) ('down' direction).\n        // 3. Merging local and remote changes (using CRDT logic if necessary for complex types).\n        // 4. Applying merged changes to the local state (e.g., updating in-memory arrays, local storage, or UI).\n        // 5. Pushing merged changes to the remote store (Supabase) ('up' direction).\n        // 6. Handling conflicts (if not using a conflict-free mechanism like CRDT).\n        // 7. Updating sync status and last sync timestamp.\n        // 8. Publishing sync events ('sync_started', 'sync_completed', 'sync_error').\n\n        // Simulate sync process\n        this.context.loggingService?.logInfo(`Simulating sync for ${dataType}`, { dataType, userId, direction });\n        // this.syncStatus.set(dataType, 'syncing'); // Update sync status\n\n        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate sync time\n        console.log(`[SyncService] Simulated ${direction} sync completed for ${dataType} for user: ${userId}.`);\n        this.context.loggingService?.logInfo(`Simulated sync completed for ${dataType}`, { dataType, userId, direction });\n\n        // this.syncStatus.set(dataType, 'idle'); // Update sync status\n        // this.lastSyncTimestamps.set(dataType, Date.now()); // Update timestamp\n\n        // TODO: Publish 'sync_completed' event (Supports Event Push - call context.eventBus.publish)\n        this.context.eventBus?.publish('sync_completed', { dataType, userId }, userId);\n    }\n\n    /**
     * Orchestrates a full sync across all relevant data types for a user.
     * @param userId The user ID. Required.
     * @returns Promise<void>
     */
    async syncAllData(userId: string): Promise<void> {
        console.log(`[SyncService] Initiating full sync for user: ${userId}...`);
        this.context.loggingService?.logInfo(`Initiating full sync for user ${userId}`, { userId });

        if (!userId) {
             console.error('[SyncService] Cannot perform full sync: User ID is required.');
             this.context.loggingService?.logError('Cannot perform full sync: User ID is required.');
             throw new Error('User ID is required to perform full sync.');
        }

        // Define the order of sync if dependencies exist (e.g., sync users before user-specific data)
        const dataTypesToSync: (keyof SystemContext)[] = [
            'memoryEngine', // Knowledge Records
            'authorityForgingEngine', // User Actions, Abilities
            'selfNavigationEngine', // Tasks, Task Steps
            'runeEngraftingCenter', // Runes
            'goalManagementService', // Goals, Key Results
            'notificationService', // Notifications
            'analyticsService', // Analytics data (might be derived, sync might push local analytics)
            // 'syncService', // Sync config itself?
            // 'securityService', // User data/settings?
        ];

        for (const dataType of dataTypesToSync) {
            try {
                // Call syncDataType for each type
                await this.syncDataType(dataType, userId, 'bidirectional');
            } catch (error: any) {
                console.error(`[SyncService] Error during sync for ${dataType}:`, error.message);
                this.context.loggingService?.logError(`Error during sync for ${dataType}`, { dataType, userId, error: error.message });
                // Decide if a single sync failure should stop the whole process
                // For now, continue with other types but log the error.
            }
        }

        console.log(`[SyncService] Full sync completed for user: ${userId}.`);
        this.context.loggingService?.logInfo(`Full sync completed for user ${userId}`, { userId });
        // TODO: Publish a 'full_sync_completed' event (Supports Event Push - call context.eventBus.publish)
        this.context.eventBus?.publish('full_sync_completed', { userId }, userId);
    }

    /**
     * Handles incoming data changes from a remote source (e.g., Supabase Realtime).
     * Part of the Bidirectional Sync Domain.
     * @param dataType The type of data that changed.
     * @param record The changed record.
     * @param changeType The type of change ('INSERT' | 'UPDATE' | 'DELETE').
     * @param userId The user ID associated with the change. Required.
     * @returns Promise<void>
     */
    async handleRemoteDataChange(dataType: keyof SystemContext, record: any, changeType: 'INSERT' | 'UPDATE' | 'DELETE', userId: string): Promise<void> {
        console.log(`[SyncService] Handling remote data change for ${dataType} (${changeType}) for user: ${userId}...`, record);
        this.context.loggingService?.logInfo(`Handling remote data change for ${dataType}`, { dataType, changeType, recordId: record?.id, userId });

        if (!userId) {
             console.error('[SyncService] Cannot handle remote change: User ID is required.');
             this.context.loggingService?.logError('Cannot handle remote change: User ID is required.');
             return;
        }

        // TODO: Implement logic to merge the remote change with the local state.
        // This might involve:
        // 1. Finding the corresponding local record.
        // 2. Applying CRDT merge logic if necessary (e.g., for text documents, lists).
        // 3. Updating the local data store (in-memory, local storage, IndexedDB).
        // 4. Notifying relevant UI components or modules about the change (e.g., via EventBus).

        // Simulate applying change
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate processing time

        console.log(`[SyncService] Simulated handling of remote change for ${dataType} (${changeType}) completed.`);
        this.context.loggingService?.logInfo(`Simulated handling remote change for ${dataType}`, { dataType, changeType, recordId: record?.id, userId });

        // TODO: Publish a generic 'data_changed' event or specific events (e.g., 'knowledge_record_realtime_updated')
        // This event can be consumed by UI components or other modules that need to react to real-time changes.
        this.context.eventBus?.publish(`${dataType}_realtime_changed`, { record, changeType, userId }, userId);
    }

    /**
     * Handles local data changes that need to be synced to the remote source.
     * Part of the Bidirectional Sync Domain.
     * @param dataType The type of data that changed locally.
     * @param payload The details of the local change.
     * @param userId The user ID associated with the change. Required.
     * @returns Promise<void>
     */
    async handleLocalDataChange(dataType: keyof SystemContext, payload: any, userId: string): Promise<void> {
        console.log(`[SyncService] Handling local data change for ${dataType} for user: ${userId}...`, payload);
        this.context.loggingService?.logInfo(`Handling local data change for ${dataType}`, { dataType, payload, userId });

        if (!userId) {
             console.error('[SyncService] Cannot handle local change: User ID is required.');
             this.context.loggingService?.logError('Cannot handle local change: User ID is required.');
             return;
        }

        // TODO: Implement logic to queue the local change for syncing or push it directly.
        // This might involve:
        // 1. Marking the local record as 'dirty' or 'needs_sync'.
        // 2. Adding the change to an outgoing sync queue.
        // 3. Triggering an 'up' sync process if the device is online and configured for immediate sync.
        // 4. Using a dedicated 'sync' Rune (e.g., Boost.Space sync methods) to push data to external platforms.

        // Simulate queuing or pushing change
        await new Promise(resolve => setTimeout(resolve, 50)); // Simulate processing time

        console.log(`[SyncService] Simulated handling of local change for ${dataType} completed.`);
        this.context.loggingService?.logInfo(`Simulated handling local change for ${dataType}`, { dataType, userId });

        // TODO: Potentially trigger an outgoing sync here if appropriate based on sync configuration
        // this.syncDataType(dataType, userId, 'up');
    }

    /**
     * Retrieves the current sync status for a data type or overall.
     * @param dataType Optional: The specific data type.
     * @returns 'idle' | 'syncing' | 'error' | 'unknown'
     */
    getSyncStatus(dataType?: keyof SystemContext): 'idle' | 'syncing' | 'error' | 'unknown' {
        // TODO: Implement actual status tracking
        // return dataType ? this.syncStatus.get(dataType) || 'unknown' : 'unknown'; // Return overall status or per type
        return 'idle'; // Simulate idle for MVP
    }

    /**
     * Retrieves the timestamp of the last successful sync for a data type.
     * @param dataType The data type.
     * @returns number | undefined Unix timestamp or undefined if never synced.
     */
    getLastSyncTimestamp(dataType: keyof SystemContext): number | undefined {
        // TODO: Implement actual timestamp tracking
        // return this.lastSyncTimestamps.get(dataType);
        return Date.now() - 60000; // Simulate last sync 1 minute ago
    }

    /**
     * Simulates syncing a Scripting.app workflow definition to an iOS device.
     * This would involve communicating with the Scripting.app environment on the device.
     * Part of the Bidirectional Sync Domain and iOS Platform Integration.
     * @param workflow The Scripting.app workflow definition. Required.
     * @param userId The user ID associated with the workflow. Required.
     * @returns Promise<void>
     */
    async syncScriptingAppWorkflow(workflow: ScriptingAppWorkflow, userId: string): Promise<void> {
        console.log(`[SyncService] Simulating syncing Scripting.app workflow \"${workflow.name}\\\" for user ${userId}...`);
        this.context.loggingService?.logInfo(`Simulating syncing Scripting.app workflow \\\"${workflow.name}\\\"`, { workflowId: workflow.id, userId });

        if (!userId) {
             console.error('[SyncService] Cannot sync Scripting.app workflow: User ID is required.');
             this.context.loggingService?.logError('Cannot sync Scripting.app workflow: User ID is required.');
             throw new Error('User ID is required to sync Scripting.app workflow.');
        }

        // TODO: Implement actual sync mechanism.
        // Possible implementations:
        // 1. Scripting CLI Sync: If the user is running the Scripting CLI on their desktop, the CLI could listen for sync events
        //    or poll the server/Supabase for new workflows associated with the user. The CLI then writes the workflow file locally.
        //    This requires the CLI to be running and authenticated.
        // 2. Custom Mobile App Component: A dedicated native iOS app component for Jun.Ai.Key could subscribe to changes
        //    (e.g., via Supabase Realtime or a dedicated WebSocket) and save the workflow file to a location Scripting.app can access (e.g., iCloud Drive).
        //    This requires a custom app component to be built and running.
        // 3. Scripting.app API: If Scripting.app provides a direct API for receiving workflow definitions, use that (less likely for local files).
        // 4. Webhook Trigger: Trigger a Scripting.app script via webhook that then pulls the workflow definition from a known location (e.g., Supabase Storage).

        // For MVP, just simulate the process.
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate sync time

        console.log(`[SyncService] Simulated syncing Scripting.app workflow \\\"${workflow.name}\\\" completed.`);
        this.context.loggingService?.logInfo(`Simulated syncing Scripting.app workflow \\\"${workflow.name}\\\" completed.`, { workflowId: workflow.id, userId });

        // TODO: Publish a 'scripting_app_workflow_synced' event (Supports Event Push - call context.eventBus.publish)
        this.context.eventBus?.publish('scripting_app_workflow_synced', { workflowId: workflow.id, userId }, userId);
    }

    /**
     * Simulates syncing a Git repository on a mobile device.
     * This would involve communicating with a mobile Git client like Working Copy or a custom app.
     * Part of the Bidirectional Sync Domain and Mobile Git Integration.
     * @param userId The user ID associated with the repo. Required.
     * @param direction The sync direction ('pull' | 'push' | 'bidirectional'). Required.
     * @param params Optional parameters (e.g., repoUrl, branch, commitMessage, fileDetails).
     * @returns Promise<any> Simulated sync result.
     */
    async syncMobileGitRepo(userId: string, direction: 'pull' | 'push' | 'bidirectional', params?: any): Promise<any> {
        console.log(`[SyncService] Simulating mobile Git sync (${direction}) for user ${userId}...`, params);
        this.context.loggingService?.logInfo(`Simulating mobile Git sync (${direction})`, { direction, params, userId });

        if (!userId) {
             console.error('[SyncService] Cannot sync mobile Git repo: User ID is required.');
             this.context.loggingService?.logError('Cannot sync mobile Git repo: User ID is required.');
             throw new Error('User ID is required to sync mobile Git repo.');
        }

        // TODO: Implement actual sync mechanism.
        // Possible implementations:
        // 1. Working Copy x-callback-urls: Trigger basic actions (pull/push) via URL schemes from a web view or native component.
        // 2. Custom Native App Component: A dedicated native iOS app component that uses a Git library (e.g., Objective-Git) and communicates with the core system (e.g., via Supabase Realtime, WebSockets, or polling).
        // 3. Scripting.app: Write Scripting.app scripts that use its Git capabilities and are triggered by Jun.Ai.Key (e.g., via webhook).
        // 4. Cloud Storage Sync: Sync files to/from cloud storage (like iCloud Drive, Dropbox) that Working Copy can access, orchestrated by Jun.Ai.Key.

        // For MVP, just simulate the process and record a dev log.
        await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate sync time

        const simulatedResult = { status: 'simulated_success', message: `Simulated mobile Git ${direction} completed.` };

        console.log(`[SyncService] Simulated mobile Git sync (${direction}) completed for user ${userId}.`);
        this.context.loggingService?.logInfo(`Simulated mobile Git sync (${direction}) completed.`, { direction, userId, result: simulatedResult });

        // Record a development log in the knowledge base (Part of 永久記憶中樞)
        // This records the *attempt* or *completion* of the sync action.
        this.context.knowledgeSync?.saveKnowledge(
            `Mobile Git Sync: ${direction} for repo ${params?.repoUrl || 'N/A'}`, // Question/Summary
            `Simulated mobile Git sync (${direction}) completed successfully for user ${userId}. Details: ${JSON.stringify(params)}.`, // Answer/Details
            userId,
            { // dev_log_details
                type: 'sync',
                repo_url: params?.repoUrl,
                sync_direction: direction,
                change_summary: simulatedResult.message,
            }
        ).catch(err => console.error('Failed to save dev log for git sync:', err));

        // TODO: Publish a 'mobile_git_synced' event (Supports Event Push - call context.eventBus.publish)
        this.context.eventBus?.publish('mobile_git_synced', { userId, direction, result: simulatedResult }, userId);

        return simulatedResult;
    }


    // TODO: Implement methods for configuring sync settings (e.g., sync frequency, wifi only, specific data types). (Uses CloudSyncConfig interface)
    // TODO: Integrate with SecurityService for permission checks on sync operations.
    // TODO: Integrate with external sync services or protocols (e.g., WebSockets, MQTT, custom APIs).
    // TODO: This module is the central orchestrator for the Bidirectional Sync Domain (雙向同步領域).
}

// Example Usage (called by EvolutionEngine, UI, CLI, or background processes):
// const syncService = new SyncService(systemContext);
// syncService.syncAllData('user-sim-123');
// syncService.syncDataType('tasks', 'user-sim-123', 'down');
// const status = syncService.getSyncStatus('knowledgeEngine');
// const lastSync = syncService.getLastSyncTimestamp('abilities');
// // Example of handling a local change (would be called by MemoryEngine after saving)
// // syncService.handleLocalDataChange('knowledge', { id: 'new-kb-1', ... }, 'user-sim-123');
// // Example of handling a remote change (would be called by MemoryEngine's realtime listener)
// // syncService.handleRemoteDataChange('knowledge', { id: 'remote-kb-1', ... }, 'UPDATE', 'user-sim-123');
// // Example of syncing a Scripting.app workflow
// // syncService.syncScriptingAppWorkflow({ id: 'wf-1', name: 'My Workflow', code: '...' }, 'user-sim-123');
// // Example of syncing a mobile Git repo
// // syncService.syncMobileGitRepo('user-sim-123', 'push', { repoUrl: 'github.com/user/repo' });