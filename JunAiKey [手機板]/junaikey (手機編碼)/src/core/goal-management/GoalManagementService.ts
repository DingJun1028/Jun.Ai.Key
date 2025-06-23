// src/core/goal-management/GoalManagementService.ts
// 目標管理服務 (Goal Management Service) - 輔助模組
// Handles defining, tracking, and reporting on user goals (SMART, OKR).
// Integrates with Self-Navigation (Tasks) and Analytics.
// Design Principle: Provides structure for user objectives, supporting SMART and OKR frameworks.

import { SupabaseClient } from '@supabase/supabase-js'; // For persistence
import { SystemContext, Goal, KeyResult } from '../../interfaces'; // Dependency on interfaces
// import { AnalyticsService } from '../../modules/analytics/AnalyticsService'; // Dependency for tracking progress
// import { LoggingService } from '../logging/LoggingService'; // Dependency
// import { EventBus } from '../../modules/events/EventBus'; // Dependency


export class GoalManagementService {
    private supabase: SupabaseClient; // For persisting goals
    private context: SystemContext;
    // private analyticsService: AnalyticsService; // Access via context
    // private loggingService: LoggingService; // Access via context
    // private eventBus: EventBus; // Access via context


    constructor(context: SystemContext) {
        this.context = context;
        this.supabase = context.apiProxy.supabaseClient; // Use the Supabase client from ApiProxy
        // this.analyticsService = context.analyticsService;
        // this.loggingService = context.loggingService;
        // this.eventBus = context.eventBus;
        console.log('GoalManagementService initialized.');

        // TODO: Load existing goals from persistence on startup (Supports Bidirectional Sync Domain)
        // TODO: Subscribe to relevant events (e.g., 'task_completed', 'user_action') to update progress (Supports Event Push)
        // Example: this.context.eventBus.subscribe('task_completed', (payload) => this.handleTaskCompleted(payload));
    }

    /**
     * Creates a new goal (SMART or OKR) for a specific user in Supabase.
     * @param goalDetails The details of the goal (without id, status, creation_timestamp, key_results, linked_task_ids). Required.
     * @param keyResults Optional key results for OKR goals (without id, goal_id, status, current_value).
     * @param userId The user ID to associate the goal with. Required.
     * @returns Promise<Goal | null> The created goal or null on failure.
     */
    async createGoal(goalDetails: Omit<Goal, 'id' | 'status' | 'creation_timestamp' | 'key_results'>, keyResults: Omit<KeyResult, 'id' | 'goal_id' | 'status' | 'current_value' | 'linked_task_ids'>[] = [], userId: string): Promise<Goal | null> {
        console.log('Creating goal in Supabase:', goalDetails.description, 'for user:', userId);
        this.context.loggingService?.logInfo('Attempting to create goal', { description: goalDetails.description, userId });

        if (!userId) {
            console.error('[GoalManagementService] Cannot create goal: User ID is required.');
            this.context.loggingService?.logError('Cannot create goal: User ID is required.');
            throw new Error('User ID is required to create a goal.');
        }

        // Create the goal first to get its ID
        const newGoalData: Omit<Goal, 'id' | 'key_results' | 'creation_timestamp'> = {
            ...goalDetails,
            status: 'pending', // Initial status
            user_id: userId, // Associate with user
            linked_task_ids: [], // Initialize empty array
        };

        try {
            // Persist goal to Supabase (Supports Bidirectional Sync Domain)
            const { data: goalResult, error: goalError } = await this.supabase
                .from('goals')
                .insert([newGoalData])
                .select() // Select the inserted data to get the generated ID and timestamp
                .single(); // Expecting a single record back

            if (goalError) {
                console.error('Error creating goal in Supabase:', goalError);
                this.context.loggingService?.logError('Failed to create goal', { description: goalDetails.description, userId: userId, error: goalError.message });
                throw goalError; // Re-throw the error
            }

            const newGoal = goalResult as Goal;
            console.log('Goal created:', newGoal.id, '-', newGoal.description, 'for user:', newGoal.user_id);


            // Now create the key results, linking them to the new goal ID
            const newKeyResultsData = keyResults.map(kr => ({
                ...kr,
                goal_id: newGoal.id, // Link to the parent goal
                current_value: 0, // Initial value is 0
                status: 'on-track', // Initial status
                linked_task_ids: [], // Initialize empty array
            }));

            if (newKeyResultsData.length > 0) {
                 const { data: krsResult, error: krsError } = await this.supabase
                    .from('key_results')
                    .insert(newKeyResultsData)
                    .select(); // Select the inserted key results

                if (krsError) {
                    console.error('Error creating key results in Supabase:', krsError);
                     // TODO: Decide how to handle goal creation if KRs fail (e.g., delete the goal)
                     this.context.loggingService?.logError('Failed to create key results', { goalId: newGoal.id, userId: userId, error: krsError.message });
                     // For now, just throw, leaving the goal without KRs
                     throw krsError; // Re-throw the error
                }
                 // Attach the created key results to the goal object
                newGoal.key_results = krsResult as KeyResult[];
            } else {
                 newGoal.key_results = []; // Goal has no key results
            }


            // TODO: Publish a 'goal_created' event (part of Six Styles/EventBus - call context.eventBus.publish)
            this.context.eventBus?.publish('goal_created', newGoal, userId); // Include userId in event

            this.context.loggingService?.logInfo(`Goal created: ${newGoal.id}`, { description: newGoal.description, userId: userId });

            return newGoal;

        } catch (error: any) {
            console.error('Failed to create goal:', error);
            this.context.loggingService?.logError('Failed to create goal', { description: goalDetails.description, userId: userId, error: error.message });
            return null; // Return null on failure
        }
    }

    /**
     * Retrieves goals for a specific user from Supabase, including their key results.
     * @param userId The user ID. Required.
     * @param status Optional: Filter by status.
     * @returns Promise<Goal[]> An array of Goal objects.
     */
    async getGoals(userId: string, status?: Goal['status']): Promise<Goal[]> {
        console.log('Retrieving goals from Supabase for user:', userId, 'status:', status || 'all');
        this.context.loggingService?.logInfo('Attempting to fetch goals', { userId, status });

        if (!userId) {
            console.warn('[GoalManagementService] Cannot retrieve goals: User ID is required.');
            this.context.loggingService?.logWarning('Cannot retrieve goals: User ID is required.');
            return []; // Return empty if no user ID
        }
        try {
            // Fetch goals from Supabase, filtered by user_id, and join with key_results
            let dbQuery = this.supabase
                .from('goals')
                .select('*, key_results(*)') // Select goal fields and all related key_results
                .eq('user_id', userId);

            if (status) {
                dbQuery = dbQuery.eq('status', status);
            }

            dbQuery = dbQuery.order('creation_timestamp', { ascending: false } as any); // Order goals by creation time

            const { data, error } = await dbQuery;

            if (error) { throw error; }

            // Supabase join returns nested objects
            const goals = data as Goal[];

            console.log(`Fetched ${goals.length} goals for user ${userId}.`);
            this.context.loggingService?.logInfo(`Fetched ${goals.length} goals successfully.`, { userId });

            return goals;

        } catch (error: any) {
            console.error('Error fetching goals from Supabase:', error);
            this.context.loggingService?.logError('Failed to fetch goals', { userId: userId, status: status, error: error.message });
            return [];
        }
    }

    /**
     * Retrieves a specific goal by ID for a specific user from Supabase, including its key results.
     * @param goalId The ID of the goal. Required.
     * @param userId The user ID for verification. Required.
     * @returns Promise<Goal | undefined> The Goal object or undefined.
     */
    async getGoalById(goalId: string, userId: string): Promise<Goal | undefined> {
        console.log('Retrieving goal by ID from Supabase:', goalId, 'for user:', userId);
        this.context.loggingService?.logInfo(`Attempting to fetch goal ${goalId}`, { id: goalId, userId });

         if (!userId) {
             console.warn('[GoalManagementService] Cannot retrieve goal: User ID is required.');
             this.context.loggingService?.logWarning('Cannot retrieve goal: User ID is required.');
             return undefined;
         }
        try {
            // Fetch goal from Supabase by ID and user_id, and join with key_results
              const { data, error } = await this.supabase
                  .from('goals')
                  .select('*, key_results(*)') // Select goal fields and all related key_results
                  .eq('id', goalId)
                  .eq('user_id', userId) // Ensure ownership
                  .single();

              if (error) { throw error; }
              if (!data) { return undefined; } // Goal not found or doesn't belong to user

              const goal = data as Goal;

              console.log(`Fetched goal ${goalId} for user ${userId}.`);
              this.context.loggingService?.logInfo(`Fetched goal ${goalId} successfully.`, { id: goalId, userId: userId });

              return goal;

        } catch (error: any) {
            console.error(`Error fetching goal ${goalId} from Supabase:`, error);
            this.context.loggingService?.logError(`Failed to fetch goal ${goalId}`, { id: goalId, userId: userId, error: error.message });
            return undefined;
        }
    }


    /**
     * Updates an existing goal for a specific user in Supabase.
     * Note: This method is primarily for updating goal-level fields (description, type, status, target_completion_date).
     * Updating key results requires separate methods.
     * @param goalId The ID of the goal. Required.
     * @param updates The updates to apply. Required.
     * @param userId The user ID for verification. Required.
     * @returns Promise<Goal | undefined> The updated Goal or undefined if not found or user mismatch.
     */
    async updateGoal(goalId: string, updates: Partial<Omit<Goal, 'id' | 'user_id' | 'creation_timestamp' | 'key_results'>>, userId: string): Promise<Goal | undefined> {
        console.log(`Updating goal ${goalId} in Supabase for user ${userId}...`, updates);
        this.context.loggingService?.logInfo(`Attempting to update goal ${goalId}`, { id: goalId, updates, userId });

         if (!userId) {
             console.warn('[GoalManagementService] Cannot update goal: User ID is required.');
             this.context.loggingService?.logWarning('Cannot update goal: User ID is required.');
             return undefined;
         }

        try {
            // Persist update to Supabase (Supports Bidirectional Sync Domain)
            // Filter by ID and user_id to ensure ownership
              const { data, error } = await this.supabase
                  .from('goals')
                  .update(updates)
                  .eq('id', goalId)
                  .eq('user_id', userId) // Ensure ownership
                  .select('*, key_results(*)') // Select updated goal and its key results
                  .single();

              if (error) { throw error; }
              if (!data) { // Should not happen if RLS is correct and ID/user_id match
                   console.warn(`Goal ${goalId} not found or does not belong to user ${userId} for update.`);
                   this.context.loggingService?.logWarning(`Goal not found or user mismatch for update: ${goalId}`, { userId });
                   return undefined;
              }

              const updatedGoal = data as Goal;

            console.log(`Goal ${goalId} updated in Supabase.`);
            // TODO: Trigger an event indicating a goal has been updated (part of Six Styles/EventBus)
            this.context.eventBus?.publish('goal_updated', updatedGoal, userId); // Include userId in event
            this.context.loggingService?.logInfo(`Goal updated successfully: ${goalId}`, { id: goalId, userId: userId });

            return updatedGoal;

        } catch (error: any) {
            console.error(`Failed to update goal ${goalId}:`, error);
            this.context.loggingService?.logError(`Failed to update goal ${goalId}`, { id: goalId, updates, userId: userId, error: error.message });
            throw error; // Re-throw the error
        }
    }

    /**
     * Deletes a goal for a specific user from Supabase.
     * This will also cascade delete associated key_results due to foreign key constraint.
     * @param goalId The ID of the goal. Required.
     * @param userId The user ID for verification. Required.
     * @returns Promise<boolean> True if deletion was successful, false otherwise.
     */
    async deleteGoal(goalId: string, userId: string): Promise<boolean> {
        console.log(`Deleting goal ${goalId} from Supabase for user ${userId}...`);
        this.context.loggingService?.logInfo(`Attempting to delete goal ${goalId}`, { id: goalId, userId });

         if (!userId) {
             console.warn('[GoalManagementService] Cannot delete goal: User ID is required.');
             this.context.loggingService?.logWarning('Cannot delete goal: User ID is required.');
             return false; // Return false if no user ID
         }

        try {
            // Persist deletion to Supabase (Supports Bidirectional Sync Domain)
            // Filter by ID and user_id to ensure ownership
              const { count, error } = await this.supabase
                  .from('goals')
                  .delete()
                  .eq('id', goalId)
                  .eq('user_id', userId)
                  .select('id', { count: 'exact' }); // Select count to check if a row was deleted

              if (error) { throw error; }

              const deleted = count !== null && count > 0; // Check if count is greater than 0

              if (deleted) {
                  console.log(`Goal ${goalId} deleted from Supabase.`);
                  // TODO: Trigger an event indicating a goal has been deleted (part of Six Styles/EventBus)
                  this.context.eventBus?.publish('goal_deleted', { goalId: goalId, userId: userId }, userId); // Include userId in event
                  this.context.loggingService?.logInfo(`Goal deleted successfully: ${goalId}`, { id: goalId, userId: userId });
              } else {
                  console.warn(`Goal not found for deletion or user mismatch: ${goalId}`);
                  this.context.loggingService?.logWarning(`Goal not found for deletion or user mismatch: ${goalId}`, { id: goalId, userId });
              }
              return deleted;

        } catch (error: any) {
            console.error(`Failed to delete goal ${goalId}:`, error);
            this.context.loggingService?.logError(`Failed to delete goal ${goalId}`, { id: goalId, userId: userId, error: error.message });
            return false; // Return false on failure
        }
    }

    /**
     * Updates the progress of a Key Result for a specific user in Supabase.
     * This might be triggered by task completion, user action, or manual input.
     * @param krId The ID of the Key Result. Required.
     * @param currentValue The new current value. Required.
     * @param userId The user ID for verification (checks parent goal ownership). Required.
     * @returns Promise<KeyResult | null> The updated KR or null if not found or user mismatch.
     */
    async updateKeyResultProgress(krId: string, currentValue: number, userId: string): Promise<KeyResult | null> {
        console.log(`[GoalManagementService] Updating KR ${krId} progress to ${currentValue} in Supabase for user ${userId}...`);
        this.context.loggingService?.logInfo(`Attempting to update KR ${krId} progress`, { id: krId, currentValue, userId });

         if (!userId) {
             console.warn('[GoalManagementService] Cannot update KR progress: User ID is required.');
             this.context.loggingService?.logWarning('Cannot update KR progress: User ID is required.');
             return null;
         }

        try {
            // Fetch the KR first to get its goal_id and verify user ownership via the goal
            const { data: krData, error: fetchError } = await this.supabase
                .from('key_results')
                .select('*, goals(user_id)') // Select KR and join with parent goal to get user_id
                .eq('id', krId)
                .single();

            if (fetchError) { throw fetchError; }
            if (!krData || (krData.goals as any)?.user_id !== userId) { // Check if KR exists and parent goal belongs to user
                console.warn(`Key Result ${krId} not found or parent goal does not belong to user ${userId} for update.`);
                this.context.loggingService?.logWarning(`Key Result not found or user mismatch for update: ${krId}`, { userId });
                return null;
            }

            // Determine new status based on current and target values
            const targetValue = krData.target_value;
            let newStatus: KeyResult['status'] = 'on-track';
            if (currentValue >= targetValue) {
                newStatus = 'completed';
            } else if (targetValue > 0 && currentValue / targetValue > 0.75) { // Example threshold
                newStatus = 'on-track';
            } else {
                newStatus = 'at-risk';
            }


            // Now update the Key Result in Supabase
            const { data: updatedKrData, error: updateError } = await this.supabase
                .from('key_results')
                .update({ current_value: currentValue, status: newStatus } as Partial<KeyResult>) // Cast to Partial<KeyResult>
                .eq('id', krId)
                .select() // Select the updated KR data
                .single();

            if (updateError) { throw updateError; }
            if (!updatedKrData) { // Should not happen if the first fetch succeeded
                 console.error(`Failed to retrieve updated KR data for ${krId}.`);
                 this.context.loggingService?.logError(`Failed to retrieve updated KR data: ${krId}`, { userId });
                 return null;
            }

            const updatedKr = updatedKrData as KeyResult;

            console.log(`Key Result ${krId} progress updated in Supabase.`);
            // TODO: Log KR progress update (Supports Observe/Monitor, KPI - call loggingService.logInfo)
            this.context.loggingService?.logInfo('Key Result progress updated', { krId: updatedKr.id, goalId: updatedKr.goal_id, currentValue: updatedKr.current_value, status: updatedKr.status, userId: userId });
            // Publish 'key_result_updated' event (Supports Event Push - call eventBus.publish)
            this.context.eventBus?.publish('key_result_updated', updatedKr, userId); // Include userId in event


            // Optional: Check if the parent goal is now completed based on KR status
            // This is more complex and might involve fetching all KRs for the goal
            // and checking if all are 'completed'. Can be done asynchronously or via trigger.
            // For MVP, we won't automatically update goal status here.

            return updatedKr;

        } catch (error: any) {
            console.error(`Failed to update KR ${krId} progress:`, error);
            this.context.loggingService?.logError(`Failed to update KR ${krId} progress`, { id: krId, currentValue, userId: userId, error: error.message });
            throw error; // Re-throw the error
        }
    }

    /**
     * Links a task to a specific Key Result.
     * Adds the task ID to the KR's `linked_task_ids` array.
     * @param krId The ID of the Key Result. Required.
     * @param taskId The ID of the task to link. Required.
     * @param userId The user ID for verification. Required.
     * @returns Promise<KeyResult | undefined> The updated KR or undefined.
     */
    async linkTaskToKeyResult(krId: string, taskId: string, userId: string): Promise<KeyResult | undefined> {
        console.log(`[GoalManagementService] Linking task ${taskId} to KR ${krId} for user ${userId}...`);
        this.context.loggingService?.logInfo(`Attempting to link task ${taskId} to KR ${krId}`, { taskId, krId, userId });

        if (!userId) {
            console.warn('[GoalManagementService] Cannot link task to KR: User ID is required.');
            this.context.loggingService?.logWarning('Cannot link task to KR: User ID is required.');
            return undefined;
        }

        try {
            // Fetch the KR first to get its current linked_task_ids and verify user ownership via the goal
            const { data: krData, error: fetchError } = await this.supabase
                .from('key_results')
                .select('linked_task_ids, goals(user_id)') // Select current linked_task_ids and join with parent goal to get user_id
                .eq('id', krId)
                .single();

            if (fetchError) { throw fetchError; }
            if (!krData || (krData.goals as any)?.user_id !== userId) { // Check if KR exists and parent goal belongs to user
                console.warn(`Key Result ${krId} not found or parent goal does not belong to user ${userId} for linking task.`);
                this.context.loggingService?.logWarning(`Key Result not found or user mismatch for linking task: ${krId}`, { userId });
                return undefined;
            }

            const currentLinkedTaskIds = krData.linked_task_ids || [];
            // Add the task ID if it's not already present
            if (!currentLinkedTaskIds.includes(taskId)) {
                 const newLinkedTaskIds = [...currentLinkedTaskIds, taskId];

                 // Update the KR's linked_task_ids array in Supabase
                 const { data: updatedKrData, error: updateError } = await this.supabase
                     .from('key_results')
                     .update({ linked_task_ids: newLinkedTaskIds } as Partial<KeyResult>)
                     .eq('id', krId)
                     .select()
                     .single();

                 if (updateError) { throw updateError; }
                 if (!updatedKrData) {
                     console.error(`Failed to retrieve updated KR data for ${krId} after linking task.`);
                     this.context.loggingService?.logError(`Failed to retrieve updated KR data after linking task: ${krId}`, { userId });
                     return undefined;
                 }

                 const updatedKr = updatedKrData as KeyResult;

                 console.log(`Task ${taskId} linked to KR ${krId} in Supabase.`);
                 // Publish event
                 this.context.eventBus?.publish('kr_linked_to_task', { krId, taskId, userId }, userId);
                 this.context.loggingService?.logInfo(`KR linked to task: ${krId} <- ${taskId}`, { krId, taskId, userId });

                 return updatedKr;

            } else {
                 console.warn(`Task ${taskId} is already linked to KR ${krId}.`);
                 this.context.loggingService?.logWarning(`Task already linked to KR: ${krId} <- ${taskId}`, { krId, taskId, userId });
                 // Optionally return the existing KR
                 return krData as KeyResult;
            }

        } catch (error: any) {
            console.error(`Failed to link task ${taskId} to KR ${krId}:`, error);
            this.context.loggingService?.logError(`Failed to link task from KR`, { taskId, krId, userId, error: error.message });
            throw error; // Re-throw
        }
    }

    /**
     * Unlinks a task from a Key Result.
     * Removes the task ID from the KR's `linked_task_ids` array.
     * @param krId The ID of the Key Result. Required.
     * @param taskId The ID of the task to unlink. Required.
     * @param userId The user ID for verification. Required.
     * @returns Promise<KeyResult | undefined> The updated KR or undefined.
     */
    async unlinkTaskFromKeyResult(krId: string, taskId: string, userId: string): Promise<KeyResult | undefined> {
        console.log(`[GoalManagementService] Unlinking task ${taskId} from KR ${krId} for user ${userId}...`);
        this.context.loggingService?.logInfo(`Attempting to unlink task ${taskId} from KR ${krId}`, { taskId, krId, userId });

        if (!userId) {
            console.warn('[GoalManagementService] Cannot unlink task from KR: User ID is required.');
            this.context.loggingService?.logWarning('Cannot unlink task from KR: User ID is required.');
            return undefined;
        }

        try {
            // Fetch the KR first to get its current linked_task_ids and verify user ownership via the goal
            const { data: krData, error: fetchError } = await this.supabase
                .from('key_results')
                .select('linked_task_ids, goals(user_id)') // Select current linked_task_ids and join with parent goal to get user_id
                .eq('id', krId)
                .single();

            if (fetchError) { throw fetchError; }
            if (!krData || (krData.goals as any)?.user_id !== userId) { // Check if KR exists and parent goal belongs to user
                console.warn(`Key Result ${krId} not found or parent goal does not belong to user ${userId} for unlinking task.`);
                this.context.loggingService?.logWarning(`Key Result not found or user mismatch for unlinking task: ${krId}`, { userId });
                return undefined;
            }

            const currentLinkedTaskIds = krData.linked_task_ids || [];
            // Remove the task ID if it's present
            if (currentLinkedTaskIds.includes(taskId)) {
                 const newLinkedTaskIds = currentLinkedTaskIds.filter(id => id !== taskId);

                 // Update the KR's linked_task_ids array in Supabase
                 const { data: updatedKrData, error: updateError } = await this.supabase
                     .from('key_results')
                     .update({ linked_task_ids: newLinkedTaskIds } as Partial<KeyResult>)
                     .eq('id', krId)
                     .select()
                     .single();

                 if (updateError) { throw updateError; }
                 if (!updatedKrData) {
                     console.error(`Failed to retrieve updated KR data for ${krId} after unlinking task.`);
                     this.context.loggingService?.logError(`Failed to retrieve updated KR data after unlinking task: ${krId}`, { userId });
                     return undefined;
                 }

                 const updatedKr = updatedKrData as KeyResult;

                 console.log(`Task ${taskId} unlinked from KR ${krId} in Supabase.`);
                 // Publish event
                 this.context.eventBus?.publish('kr_unlinked_from_task', { krId, taskId, userId }, userId);
                 this.context.loggingService?.logInfo(`KR unlinked from task: ${krId} <- ${taskId}`, { krId, taskId, userId });

                 return updatedKr;

            } else {
                 console.warn(`Task ${taskId} is not linked to KR ${krId}.`);
                 this.context.loggingService?.logWarning(`Task not linked to KR: ${krId} <- ${taskId}`, { krId, taskId, userId });
                 // Optionally return the existing KR
                 return krData as KeyResult;
            }

        } catch (error: any) {
            console.error(`Failed to unlink task ${taskId} from KR ${krId}:`, error);
            this.context.loggingService?.logError(`Failed to unlink task from KR`, { taskId, krId, userId, error: error.message });
            throw error; // Re-throw
        }
    }

    /**
     * Checks if a Key Result is completed based on its current value and updates its status if necessary.
     * This method is called after a linked task completes.
     * @param krId The ID of the Key Result. Required.
     * @param taskId The ID of the task that just completed (for context/logging). Required.
     * @param userId The user ID for verification. Required.
     * @returns Promise<KeyResult | undefined> The updated KR or undefined.
     */
    async checkAndCompleteKeyResultIfTaskCompleted(krId: string, taskId: string, userId: string): Promise<KeyResult | undefined> {
        console.log(`[GoalManagementService] Checking KR ${krId} completion after task ${taskId} completed for user ${userId}...`);
        this.context.loggingService?.logInfo(`Checking KR completion after task completed`, { krId, taskId, userId });

        if (!userId) {
            console.warn('[GoalManagementService] Cannot check KR completion: User ID is required.');
            this.context.loggingService?.logWarning('Cannot check KR completion: User ID is required.');
            return undefined;
        }

        try {
            // Fetch the KR to get its details and verify user ownership
            const { data: krData, error: fetchError } = await this.supabase
                .from('key_results')
                .select('*, goals(user_id)') // Select KR and join with parent goal to get user_id
                .eq('id', krId)
                .single();

            if (fetchError) { throw fetchError; }
            if (!krData || (krData.goals as any)?.user_id !== userId) { // Check if KR exists and parent goal belongs to user
                console.warn(`Key Result ${krId} not found or parent goal does not belong to user ${userId} for completion check.`);
                this.context.loggingService?.logWarning(`Key Result not found or user mismatch for completion check: ${krId}`, { userId });
                return undefined;
            }

            const kr = krData as KeyResult;

            // Check if the KR's current value meets or exceeds the target value
            // Note: The task completion itself doesn't automatically update the KR's current_value.
            // The task must contain a step with action type 'updateGoalProgress' to do that.
            // This method only checks if the *current* value is sufficient after a linked task finishes.
            if (kr.current_value >= kr.target_value && kr.status !== 'completed') {
                console.log(`KR ${krId} reached target value (${kr.current_value}/${kr.target_value}). Marking as completed.`);
                this.context.loggingService?.logInfo(`KR reached target value. Marking as completed.`, { krId, userId });

                // Update KR status to completed in Supabase
                const { data: updatedKrData, error: updateError } = await this.supabase
                    .from('key_results')
                    .update({ status: 'completed' } as Partial<KeyResult>) // Cast to Partial<KeyResult>
                    .eq('id', krId)
                    .select() // Select the updated KR data
                    .single();

                if (updateError) { throw updateError; }
                if (!updatedKrData) {
                    console.error(`Failed to retrieve updated KR data for ${krId} after marking completed.`);
                    this.context.loggingService?.logError(`Failed to retrieve updated KR data after marking completed: ${krId}`, { userId });
                    return undefined;
                }

                const updatedKr = updatedKrData as KeyResult;

                console.log(`Key Result ${krId} status updated to completed.`);
                // Publish 'key_result_updated' event
                this.context.eventBus?.publish('key_result_updated', updatedKr, userId);
                this.context.loggingService?.logInfo(`KR status updated to completed: ${krId}`, { userId: userId });

                // TODO: Check if the parent goal is now completed if all its KRs are completed
                // This would involve fetching all KRs for kr.goal_id and checking their statuses.
                // Can be done asynchronously or via a database trigger.

                return updatedKr;

            } else {
                console.log(`KR ${krId} did not reach target value (${kr.current_value}/${kr.target_value}) or is already completed. No status update needed.`);
                this.context.loggingService?.logInfo(`KR did not reach target or already completed.`, { krId, userId });
                return kr; // Return the existing KR
            }

        } catch (error: any) {
            console.error(`Failed to check or complete KR ${krId}:`, error);
            this.context.loggingService?.logError(`Failed to check or complete KR ${krId}`, { krId, taskId, userId: userId, error: error.message });
            throw error; // Re-throw the error
        }
    }


    // TODO: Implement methods to link tasks/actions to Key Results.
    // TODO: Implement automatic progress updates based on linked tasks/actions and data from AnalyticsService.
    // TODO: Implement reporting features (e.g., generate summary of OKR progress).
    // TODO: Integrate with UI to display goals and progress.
    // TODO: This module is part of the Bidirectional Sync Domain (雙向同步領域) for persistence.
}

// Example Usage (called by EvolutionEngine, UI, CLI, or Task execution):
// const goalManagementService = new GoalManagementService(systemContext);
// goalManagementService.createGoal({ description: 'Achieve Q3 OKRs', type: 'okr', user_id: 'user-sim-123' }, [{ description: 'Increase user engagement', target_value: 100, unit: 'percentage' }], 'user-sim-123');
// goalManagementService.getGoals('user-sim-123');
// goalManagementService.updateKeyResultProgress('kr-sim-1a', 4, 'user-sim-123');
// goalManagementService.deleteGoal('goal-sim-abc', 'user-sim-123');
// goalManagementService.linkTaskToKeyResult('kr-sim-1a', 'task-sim-xyz', 'user-sim-123');
// goalManagementService.unlinkTaskFromKeyResult('kr-sim-1a', 'task-sim-xyz', 'user-sim-123');
// goalManagementService.checkAndCompleteKeyResultIfTaskCompleted('kr-sim-1a', 'task-sim-xyz', 'user-sim-123');