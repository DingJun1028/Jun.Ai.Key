// src/core/self-navigation/SelfNavigationEngine.ts
// 自我導航引擎 (Self-Navigation Engine) - 核心模組
// Manages tasks, workflows, and goals, orchestrating the execution of Abilities and Runes.
// Corresponds to the Dynamic DAG Workflow Engine concept.
// Design Principle: Guides the system's actions towards user objectives.

import { Task, TaskStep, Rune, SystemContext } from '../../interfaces';
import { SupabaseClient } from '@supabase/supabase-js';
// import { RuneEngraftingCenter } from '../rune-engrafting/RuneEngraftingCenter'; // Dependency
// import { LoggingService } from '../logging/LoggingService'; // Dependency
// import { EventBus } from '../../modules/events/EventBus'; // Dependency
// import { EvolutionEngine } from '../evolution/EvolutionEngine'; // Dependency for task failure handling
// import { GoalManagementService } from '../goal-management/GoalManagementService'; // Dependency


export class SelfNavigationEngine {
  // private tasks: Task[] = []; // List of tasks being managed (in-memory for MVP) - Now fetched from Supabase
  private context: SystemContext;
  private supabase: SupabaseClient;
  // private runeEngraftingCenter: RuneEngraftingCenter; // Access via context
  // private loggingService: LoggingService; // Access via context
  // private eventBus: EventBus; // Access via context
  // private evolutionEngine: EvolutionEngine; // Access via context
  // private goalManagementService: GoalManagementService; // Access via context


  // Map to hold ongoing task execution promises/loops (for in-progress tasks)
  private activeTaskExecutions: Map<string, Promise<void>> = new Map();


  constructor(context: SystemContext) {
    this.context = context;
    this.supabase = context.apiProxy.supabaseClient; // Use the Supabase client from ApiProxy
    // this.runeEngraftingCenter = context.runeEngraftingCenter;
    // this.loggingService = context.loggingService;
    // this.eventBus = context.eventBus;
    // this.evolutionEngine = context.evolutionEngine;
    // this.goalManagementService = context.goalManagementService;
    console.log('SelfNavigationEngine initialized.');

    // TODO: Load initial data (in-progress/paused tasks) from persistence on startup (Supports Bidirectional Sync Domain)
    // And potentially resume their execution loops.
    // This might involve fetching all tasks for the current user on auth state change.
  }

  /**
   * Creates a new task for a specific user in Supabase.
   * Part of the Self-Navigation process. Tasks can represent SMART goals or OKR Key Results.
   * @param description A description of the task. Required.
   * @param steps The steps involved in the task (without status, id, task_id, step_order). Required.
   * @param userId The user ID to associate the task with. Required.
   * @param linkedKrId Optional ID of a Key Result to link this task to.
   * @returns Promise<Task | null> The newly created Task object or null if creation failed.
   */
  async createTask(description: string, steps: Omit<TaskStep, 'status' | 'id' | 'task_id' | 'step_order'>[], userId: string, linkedKrId?: string | null): Promise<Task | null> {
    console.log('Creating task in Supabase:', description, 'for user:', userId, 'linked to KR:', linkedKrId);
    this.context.loggingService?.logInfo('Attempting to create task', { description, userId, linkedKrId });

    if (!userId) {
        console.error('[SelfNavigationEngine] Cannot create task: User ID is required.');
        this.context.loggingService?.logError('Cannot create task: User ID is required.');
        throw new Error('User ID is required to create a task.');
    }

    // Create the task first to get its ID
    const newTaskData: Omit<Task, 'id' | 'steps' | 'creation_timestamp' | 'start_timestamp' | 'completion_timestamp' | 'current_step_index'> = {
      description,
      status: 'pending',
      user_id: userId, // Associate with user
      linked_kr_id: linkedKrId || null, // Link to KR if provided, default to null
    };

    try {
        // Persist task to Supabase (Supports Bidirectional Sync Domain)
        const { data: taskResult, error: taskError } = await this.supabase
            .from('tasks')
            .insert([newTaskData])
            .select() // Select the inserted data to get the generated ID and timestamp
            .single(); // Expecting a single record back

        if (taskError) {
            console.error('Error creating task in Supabase:', taskError);
            this.context.loggingService?.logError('Failed to create task', { description: description, userId: userId, error: taskError.message });
            throw taskError; // Re-throw the error
        }

        const newTask = taskResult as Task;
        console.log('Task created:', newTask.id, '-', newTask.description, 'for user:', newTask.user_id);


        // Now create the steps, linking them to the new task ID
        const newStepsData = steps.map((step, index) => ({
            ...step,
            task_id: newTask.id, // Link to the parent task
            step_order: index, // Assign order
            status: 'pending', // Initial status
        }));

        if (newStepsData.length > 0) {
             const { data: stepsResult, error: stepsError } = await this.supabase
                .from('task_steps')
                .insert(newStepsData)
                .select(); // Select the inserted steps

            if (stepsError) {
                console.error('Error creating task steps in Supabase:', stepsError);
                 // TODO: Decide how to handle task creation if steps fail (e.g., delete the task)
                 this.context.loggingService?.logError('Failed to create task steps', { taskId: newTask.id, userId: userId, error: stepsError.message });
                 // For now, just throw, leaving the task without steps
                 throw stepsError; // Re-throw the error
            }
             // Attach the created steps to the task object
            newTask.steps = stepsResult as TaskStep[];
        } else {
             newTask.steps = []; // Task has no steps
        }

        // If linked to a KR, update the KR's linked_task_ids
        if (linkedKrId && this.context.goalManagementService) {
            try {
                await this.context.goalManagementService.linkTaskToKeyResult(linkedKrId, newTask.id, userId);
                console.log(`Task ${newTask.id} linked to KR ${linkedKrId}.`);
                this.context.loggingService?.logInfo(`Task linked to KR ${linkedKrId}`, { taskId: newTask.id, krId: linkedKrId, userId });
            } catch (linkError: any) {
                console.error(`Error linking task ${newTask.id} to KR ${linkedKrId}:`, linkError.message);
                this.context.loggingService?.logError(`Failed to link task to KR`, { taskId: newTask.id, krId: linkedKrId, userId, error: linkError.message });
                // Decide if task creation should fail if linking fails. For now, log error and continue.
            }
        }


        // Publish a 'task_created' event (part of Six Styles/EventBus - call context.eventBus.publish)
        this.context.eventBus?.publish('task_created', newTask, userId); // Include userId in event

        this.context.loggingService?.logInfo(`Task created: ${newTask.id}`, { description: newTask.description, userId: userId });

        return newTask;

    } catch (error: any) {
        console.error('Failed to create task:', error);
        this.context.loggingService?.logError('Failed to create task', { description: description, userId: userId, error: error.message });
        return null; // Return null on failure
    }
  }

  /**
   * Starts the execution of a task for a specific user.
   * Part of the Self-Navigation process (Six Styles: 行動).
   * @param taskId The ID of the task to start. Required.
   * @param userId The user ID for permission checks. Required.
   */
  async startTask(taskId: string, userId: string): Promise<void> {
    console.log(`Attempting to start task: ${taskId} for user ${userId}`);
    this.context.loggingService?.logInfo(`Attempting to start task: ${taskId}`, { id: taskId, userId: userId });

    if (!userId) {
        console.error('[SelfNavigationEngine] Cannot start task: User ID is required.');
        this.context.loggingService?.logError('Cannot start task: User ID is required.');
        throw new Error('User ID is required to start a task.');
    }

    // Use the getter which includes user verification and fetches steps
    const task = await this.getTaskById(taskId, userId); // Await fetching from persistence (Supports Bidirectional Sync Domain)
    if (!task) {
      // getTaskById already logs warning/error
      throw new Error(`Task not found or does not belong to user: ${taskId}`);
    }

    if (task.status !== 'pending' && task.status !== 'paused' && task.status !== 'failed') { // Allow starting failed tasks to retry
      console.warn(`Task ${taskId} is not pending, paused, or failed (status: ${task.status}). Skipping start.`);
      this.context.loggingService?.logWarning(`Attempted to start non-pending/paused/failed task: ${taskId}`, { id: taskId, status: task.status, userId: userId });
      return;
    }

    // Prevent starting if already active in this instance (important for distributed execution)
    if (this.activeTaskExecutions.has(taskId)) {
         console.warn(`Task ${taskId} is already running in this instance. Skipping start.`);
         this.context.loggingService?.logWarning(`Attempted to start already running task: ${taskId}`, { id: taskId, userId: userId });
         return;
    }


    // Update task status and start timestamp in Supabase
    const updates: Partial<Task> = {
        status: 'in-progress',
    };
    if (task.status === 'pending') { // Set start timestamp only on first start
        updates.start_timestamp = new Date().toISOString() as any; // Supabase expects ISO string
        updates.current_step_index = 0; // Reset step index for new tasks
    } else if (task.status === 'failed') {
         // If retrying a failed task, keep the current_step_index
         // Optionally, reset step status to pending for steps from current_step_index onwards
         const stepsToReset = task.steps.slice(task.current_step_index);
         if (stepsToReset.length > 0) {
             try {
                 const { error: resetError } = await this.supabase
                     .from('task_steps')
                     .update({ status: 'pending', start_timestamp: null, end_timestamp: null, result: null, error: null } as Partial<TaskStep>)
                     .in('id', stepsToReset.map(step => step.id));
                 if (resetError) console.error('Error resetting failed task steps:', resetError);
                 else console.log(`Reset ${stepsToReset.length} steps for failed task ${taskId}.`);
             } catch (err) {
                 console.error('Unexpected error resetting failed task steps:', err);
             }
         }
    }


    try {
        const { data, error } = await this.supabase
            .from('tasks')
            .update(updates)
            .eq('id', taskId)
            .eq('user_id', userId) // Ensure ownership
            .select('*, task_steps(*)') // Select updated task data including steps
            .single();

        if (error) throw error;
        if (!data) throw new Error('Task not found or user mismatch during update.');

        // Update the in-memory task object with the changes and sort steps
        const updatedTask = data as Task;
        updatedTask.steps = updatedTask.steps.sort((a, b) => a.step_order - b.step_order);
        Object.assign(task, updatedTask); // Update the original task object reference


        console.log('Task started:', taskId, 'for user:', userId);
        // Publish a 'task_started' event (part of Six Styles/EventBus - call context.eventBus.publish)
        this.context.eventBus?.publish('task_started', task, userId); // Include userId in event
        this.context.loggingService?.logInfo(`Task started: ${task.id}`, { description: task.description, userId: userId });


        // Start the asynchronous step execution loop
        const executionPromise = this.executeTaskSteps(task, userId);
        this.activeTaskExecutions.set(taskId, executionPromise);

        // Handle the promise resolution (completion or failure)
        executionPromise.then(() => {
            console.log(`Task execution promise resolved for ${taskId}.`);
            this.activeTaskExecutions.delete(taskId);
        }).catch((err) => {
            console.error(`Task execution promise rejected for ${taskId}:`, err);
            this.activeTaskExecutions.delete(taskId);
            // Task failure is handled within executeTaskSteps, but catch here for cleanup
        });


    } catch (error: any) {
        console.error('Failed to start task or update initial status:', error.message);
        this.context.loggingService?.logError('Failed to start task or update initial status', { taskId, userId, error: error.message });
        throw error; // Re-throw the error
    }
  }

  /**
   * Executes the steps of a task sequentially.
   * This is the core execution loop for a task.
   * @param task The task object to execute. Required.
   * @param userId The user ID for permission checks. Required.
   * @returns Promise<void> Resolves when the task completes or rejects if it fails.
   */
  private async executeTaskSteps(task: Task, userId: string): Promise<void> {
      console.log(`Executing steps for task: ${task.id} starting from step ${task.current_step_index}`);
      this.context.loggingService?.logInfo(`Executing task steps: ${task.id}`, { taskId: task.id, startStep: task.current_step_index, userId: userId });

      // Re-fetch the task state periodically or listen for realtime updates
      // to detect external pause/cancel requests.
      // For MVP, we'll rely on checking status before each step.

      for (let i = task.current_step_index; i < task.steps.length; i++) {
          const currentStep = task.steps[i];

          // Check task status before executing the next step
          const latestTaskState = await this.getTaskById(task.id, userId); // Await fetching latest state
          if (!latestTaskState || latestTaskState.status !== 'in-progress') {
              console.log(`Task ${task.id} status changed to ${latestTaskState?.status || 'unknown'}. Stopping execution.`);
              this.context.loggingService?.logInfo(`Task execution stopped due to status change: ${task.id}`, { status: latestTaskState?.status, userId: userId });
              // The status update (paused/cancelled/failed) is handled by other methods
              return; // Stop the loop
          }

          // Ensure the current step index is still correct
          if (latestTaskState.current_step_index !== i) {
               console.warn(`Task ${task.id} step index mismatch. Expected ${i}, got ${latestTaskState.current_step_index}. Adjusting.`);
               // Adjust the loop index to match the latest state if necessary
               i = latestTaskState.current_step_index - 1; // -1 because the loop will increment it
               continue; // Go to the next iteration which will start at the correct step
          }

          // Update step status to in-progress in Supabase
          try {
              const { data: stepInProgressData, error: stepInProgressError } = await this.supabase
                  .from('task_steps')
                  .update({ status: 'in-progress', start_timestamp: new Date().toISOString() } as Partial<TaskStep>) // Cast to Partial<TaskStep>, Supabase expects ISO string
                  .eq('id', currentStep.id)
                  .eq('task_id', task.id) // Ensure step belongs to task
                  .select()
                  .single();

              if (stepInProgressError) { throw stepInProgressError; }
              if (!stepInProgressData) { throw new Error('Step not found or task mismatch during update.'); }

              // Update the in-memory step object with the changes
              Object.assign(currentStep, stepInProgressData);

              console.log(`Executing step ${i + 1}/${task.steps.length}: ${currentStep.description}`);
              // Publish a 'task_step_started' event (part of Six Styles/EventBus - call context.eventBus.publish)
              this.context.eventBus?.publish('task_step_started', { ...currentStep, task_id: task.id, user_id: userId }, userId); // Include userId in event
              this.context.loggingService?.logInfo(`Task step started: ${task.id}/${currentStep.id}`, { description: currentStep.description, userId: userId });

          } catch (error: any) {
               console.error(`Error marking step ${currentStep.id} as in-progress in Supabase:`, error.message);
               this.context.loggingService?.logError('Error marking step as in-progress', { taskId: task.id, stepId: currentStep.id, userId, error: error.message });
               // Decide how to handle this error - maybe fail the task?
               // For now, proceed but log error
          }


          try {
              // Execute the action defined in the step (Six Styles: 行動, leverages 萬能代理群)
              // Pass user ID to the action execution context
              const actionResult = await this.executeStepAction(currentStep.action, userId, task); // Pass task object

              // Update step status and result to completed in Supabase
              const { data: stepCompletedData, error: stepCompletedError } = await this.supabase
                  .from('task_steps')
                  .update({ status: 'completed', result: actionResult, end_timestamp: new Date().toISOString() } as Partial<TaskStep>) // Cast to Partial<TaskStep>, Supabase expects ISO string
                  .eq('id', currentStep.id)
                  .eq('task_id', task.id)
                  .select()
                  .single();

              if (stepCompletedError) { throw stepCompletedError; }
              if (!stepCompletedData) { throw new Error('Step not found or task mismatch during update.'); }

              // Update the in-memory step object
              Object.assign(currentStep, stepCompletedData);

              console.log(`Step ${i + 1} completed.`);
              // Publish a 'task_step_completed' event (part of Six Styles/EventBus)
              this.context.eventBus?.publish('task_step_completed', { ...currentStep, task_id: task.id, user_id: userId }, userId); // Include userId in event
              this.context.loggingService?.logInfo(`Task step completed: ${task.id}/${currentStep.id}`, { userId: userId });

              // Increment current_step_index in Supabase ONLY AFTER successful step completion
              const { data: taskProgressData, error: taskProgressError } = await this.supabase
                  .from('tasks')
                  .update({ current_step_index: i + 1 } as Partial<Task>) // Cast to Partial<Task>
                  .eq('id', task.id)
                  .eq('user_id', userId)
                  .select() // Select updated task data
                  .single();

              if (taskProgressError) { throw taskProgressError; }
              if (!taskProgressData) { throw new Error('Task not found or user mismatch during progress update.'); }

              // Update the in-memory task object
              Object.assign(task, taskProgressData);


              // Add a small delay before the next step (simulate processing time)
              await new Promise(resolve => setTimeout(resolve, 100));

          } catch (error: any) {
              console.error(`Step ${i + 1} failed:`, error.message);
              this.context.loggingService?.logError(`Task step failed: ${task.id}/${currentStep.id}`, { error: error.message, userId: userId });

              // Update step status and error to failed in Supabase
              const { data: stepFailedData, error: stepFailedError } = await this.supabase
                  .from('task_steps')
                  .update({ status: 'failed', error: error.message, end_timestamp: new Date().toISOString() } as Partial<TaskStep>) // Cast to Partial<TaskStep>, Supabase expects ISO string
                  .eq('id', currentStep.id)
                  .eq('task_id', task.id)
                  .select()
                  .single();

              if (stepFailedError) {
                   console.error('Error marking step as failed in Supabase:', stepFailedError);
                   this.context.loggingService?.logError('Error marking step as failed', { taskId: task.id, stepId: currentStep.id, userId, error: stepFailedError.message });
              } else {
                   // Update the in-memory step object
                   Object.assign(currentStep, stepFailedData);
              }

              // Update task status to failed in Supabase
               const { data: taskFailedData, error: taskFailedError } = await this.supabase
                  .from('tasks')
                  .update({ status: 'failed', completion_timestamp: new Date().toISOString() } as Partial<Task>) // Cast to Partial<Task>, Supabase expects ISO string
                  .eq('id', task.id)
                  .eq('user_id', userId)
                  .select()
                  .single();

              if (taskFailedError) {
                   console.error('Error marking task as failed in Supabase:', taskFailedError);
                   this.context.loggingService?.logError('Error marking task as failed', { taskId: task.id, userId, error: taskFailedError.message });
              } else {
                   // Update the in-memory task object
                   Object.assign(task, taskFailedData);
                   console.log('Task failed:', task.id, 'for user:', userId);
                   // Publish event for task failure (part of Six Styles/EventBus - call context.eventBus.publish)
                   this.context.eventBus?.publish('task_failed', task, userId); // Include userId in event
                    // Trigger EvolutionEngine to handle task failure for learning (call context.evolutionEngine.handleTaskFailureForEvolution)
                    this.context.evolutionEngine?.handleTaskFailureForEvolution({
                        taskId: task.id,
                        stepId: currentStep.id,
                        error: error.message,
                        userId: userId,
                    });
              }

              // Stop execution on failure
              throw error; // Re-throw the error to break the loop and be caught by the initial promise handler
          }
      }

      // If the loop completes without throwing, the task is completed
      // Update status to completed in Supabase
      try {
          const { data: completedTaskData, error: completedError } = await this.supabase
              .from('tasks')
              .update({ status: 'completed', completion_timestamp: new Date().toISOString() } as Partial<Task>) // Cast to Partial<Task>, Supabase expects ISO string
              .eq('id', task.id)
              .eq('user_id', userId)
              .select()
              .single();

          if (completedError) {
               console.error('Error marking task as completed in Supabase:', completedError);
               this.context.loggingService?.logError('Error marking task as completed', { taskId: task.id, userId, error: completedError.message });
               throw completedError; // Re-throw
          } else {
               // Update the in-memory task object
               Object.assign(task, completedTaskData);
               console.log('Task completed:', task.id, 'for user:', userId);
               // Publish event for task completion (part of Six Styles/EventBus - call context.eventBus.publish)
               this.context.eventBus?.publish('task_completed', task, userId); // Include userId in event
               this.context.loggingService?.logInfo(`Task completed: ${task.id}`, { userId: userId });

               // --- New: Check and update linked KR if task completed ---
               if (task.linked_kr_id && this.context.goalManagementService) {
                   console.log(`Task ${task.id} linked to KR ${task.linked_kr_id}. Checking KR completion...`);
                   try {
                       // Call GoalManagementService to check and potentially complete the KR
                       await this.context.goalManagementService.checkAndCompleteKeyResultIfTaskCompleted(task.linked_kr_id, task.id, userId);
                       console.log(`Checked KR ${task.linked_kr_id} completion after task ${task.id} completed.`);
                       this.context.loggingService?.logInfo(`Checked KR completion after task completed`, { taskId: task.id, krId: task.linked_kr_id, userId });
                   } catch (krCheckError: any) {
                       console.error(`Error checking KR ${task.linked_kr_id} completion after task ${task.id} completed:`, krCheckError.message);
                       this.context.loggingService?.logError(`Error checking KR completion after task completed`, { taskId: task.id, krId: task.linked_kr_id, userId, error: krCheckError.message });
                       // Decide how to handle this error - log and continue for now.
                   }
               }
               // --- End New ---
          }

      } catch (error: any) {
          console.error('Failed to mark task as completed:', error.message);
          this.context.loggingService?.logError('Failed to mark task as completed', { taskId: task.id, userId, error: error.message });
          throw error; // Re-throw
      }
  }


  /**
   * Pauses a task for a specific user by updating its status in Supabase.
   * Part of the Self-Navigation process.
   * @param taskId The ID of the task to pause. Required.
   * @param userId The user ID for permission checks. Required.
   */
  async pauseTask(taskId: string, userId: string): Promise<void> {
      console.log(`Attempting to pause task: ${taskId} for user ${userId}`);
      this.context.loggingService?.logInfo(`Attempting to pause task: ${taskId}`, { id: taskId, userId: userId });

       if (!userId) {
           console.warn('[SelfNavigationEngine] Cannot pause task: User ID is required.');
           this.context.loggingService?.logWarning('Cannot pause task: User ID is required.');
           return;
       }

      // Use the getter which includes user verification
      const task = await this.getTaskById(taskId, userId); // Await fetching from persistence (Supports Bidirectional Sync Domain)
      if (!task) {
          // getTaskById already logs warning/error
          return;
      }
      if (task.status === 'in-progress') {
          // Update task status to paused in Supabase
          try {
              const { data, error } = await this.supabase
                  .from('tasks')
                  .update({ status: 'paused' } as Partial<Task>) // Cast to Partial<Task>
                  .eq('id', taskId)
                  .eq('user_id', userId) // Ensure ownership
                  .select() // Select updated task data
                  .single();

              if (error) throw error;
              if (!data) throw new Error('Task not found or user mismatch during update.');

              // Update the in-memory task object with the changes
              Object.assign(task, data);

              console.log(`Task ${taskId} paused.`);
              // TODO: Implement actual pause logic (e.g., signal the execution loop to stop)
              // The execution loop checks the status before each step, so updating status is sufficient for MVP.
              // Publish a 'task_paused' event (part of Six Styles/EventBus - call context.eventBus.publish)
              this.context.eventBus?.publish('task_paused', task, userId); // Include userId in event
              this.context.loggingService?.logInfo(`Task paused: ${taskId}`, { id: taskId, userId: userId });

          } catch (error: any) {
              console.error('Error pausing task in Supabase:', error.message);
              this.context.loggingService?.logError('Failed to pause task', { taskId, userId, error: error.message });
              throw error; // Re-throw for caller
          }
      } else {
          console.warn(`Task ${taskId} is not in-progress (status: ${task.status}). Cannot pause.`);
          this.context.loggingService?.logWarning(`Attempted to pause non-in-progress task: ${taskId}`, { id: taskId, status: task.status, userId: userId });
      }
  }

   /**
   * Resumes a paused task for a specific user by updating its status in Supabase.
   * Part of the Self-Navigation process.
   * @param taskId The ID of the task to resume. Required.
   * @param userId The user ID for permission checks. Required.
   */
  async resumeTask(taskId: string, userId: string): Promise<void> {
      console.log(`Attempting to resume task: ${taskId} for user ${userId}`);
      this.context.loggingService?.logInfo(`Attempting to resume task: ${taskId}`, { id: taskId, userId: userId });

       if (!userId) {
           console.warn('[SelfNavigationEngine] Cannot resume task: User ID is required.');
           this.context.loggingService?.logWarning('Cannot resume task: User ID is required.');
           return;
       }

      // Use the getter which includes user verification
      const task = await this.getTaskById(taskId, userId); // Await fetching from persistence (Supports Bidirectional Sync Domain)
      if (!task) {
          // getTaskById already logs warning/error
          return;
      }
      if (task.status === 'paused') {
          // Update task status to in-progress in Supabase
          try {
              const { data, error } = await this.supabase
                  .from('tasks')
                  .update({ status: 'in-progress' } as Partial<Task>) // Cast to Partial<Task>
                  .eq('id', taskId)
                  .eq('user_id', userId) // Ensure ownership
                  .select() // Select updated task data
                  .single();

              if (error) throw error;
              if (!data) throw new Error('Task not found or user mismatch during update.');

              // Update the in-memory task object with the changes
              Object.assign(task, data);

              console.log(`Task ${taskId} resumed.`);
              // TODO: Implement actual resume logic (e.g., restart the execution loop from current step)
              // For MVP simulation, just call startTask again (will check status and current_step_index)
              // Publish a 'task_resumed' event (part of Six Styles/EventBus - call context.eventBus.publish)
              this.context.eventBus?.publish('task_resumed', task, userId); // Include userId in event
              this.context.loggingService?.logInfo(`Task resumed: ${taskId}`, { id: taskId, userId: userId });

              // Restart the execution loop
              const executionPromise = this.executeTaskSteps(task, userId);
              this.activeTaskExecutions.set(taskId, executionPromise);

               // Handle the promise resolution (completion or failure)
              executionPromise.then(() => {
                  console.log(`Task execution promise resolved for ${taskId}.`);
                  this.activeTaskExecutions.delete(taskId);
              }).catch((err) => {
                  console.error(`Task execution promise rejected for ${taskId}:`, err);
                  this.activeTaskExecutions.delete(taskId);
                  // Task failure is handled within executeTaskSteps, but catch here for cleanup
              });

          } catch (error: any) {
              console.error('Error resuming task in Supabase:', error.message);
              this.context.loggingService?.logError('Failed to resume task', { taskId, userId, error: error.message });
              throw error; // Re-throw for caller
          }
      } else {
          console.warn(`Task ${taskId} is not paused (status: ${task.status}). Cannot resume.`);
          this.context.loggingService?.logWarning(`Attempted to resume non-paused task: ${taskId}`, { id: taskId, status: task.status, userId: userId });
      }
  }

  /**
   * Cancels a task for a specific user by updating its status in Supabase.
   * Part of the Self-Navigation process.
   * @param taskId The ID of the task to cancel. Required.
   * @param userId The user ID for permission checks. Required.
   */
  async cancelTask(taskId: string, userId: string): Promise<void> {
      console.log(`Attempting to cancel task: ${taskId} for user ${userId}`);
      this.context.loggingService?.logInfo(`Attempting to cancel task: ${taskId}`, { id: taskId, userId: userId });

       if (!userId) {
           console.warn('[SelfNavigationEngine] Cannot cancel task: User ID is required.');
           this.context.loggingService?.logWarning('Cannot cancel task: User ID is required.');
           return;
       }

      // Use the getter which includes user verification
      const task = await this.getTaskById(taskId, userId); // Await fetching from persistence (Supports Bidirectional Sync Domain)
      if (!task) {
          // getTaskById already logs warning/error
          return;
      }
      if (task.status === 'pending' || task.status === 'in-progress' || task.status === 'paused') {
          // Update task status to cancelled in Supabase
          try {
              const { data, error } = await this.supabase
                  .from('tasks')
                  .update({ status: 'cancelled', completion_timestamp: new Date().toISOString() } as Partial<Task>) // Cast to Partial<Task>, Supabase expects ISO string
                  .eq('id', taskId)
                  .eq('user_id', userId) // Ensure ownership
                  .select() // Select updated task data
                  .single();

              if (error) throw error;
              if (!data) throw new Error('Task not found or user mismatch during update.');

              // Update the in-memory task object with the changes
              Object.assign(task, data);

              console.log(`Task ${taskId} cancelled.`);
              // TODO: Implement actual cancellation logic (e.g., signal the execution loop to stop)
              // The execution loop checks the status before each step, so updating status is sufficient for MVP.
              // Publish a 'task_cancelled' event (part of Six Styles/EventBus - call context.eventBus.publish)
              this.context.eventBus?.publish('task_cancelled', task, userId); // Include userId in event
              this.context.loggingService?.logInfo(`Task cancelled: ${taskId}`, { id: taskId, userId: userId });

          } catch (error: any) {
              console.error('Error canceling task in Supabase:', error.message);
              this.context.loggingService?.logError('Failed to cancel task', { taskId, userId, error: error.message });
              throw error; // Re-throw for caller
          }
      } else {
          console.warn(`Task ${taskId} is already finished or failed (status: ${task.status}). Cannot cancel.`);
          this.context.loggingService?.logWarning(`Attempted to cancel finished/failed task: ${taskId}`, { id: taskId, status: task.status, userId: userId });
      }
  }


  /**
   * Executes the action defined for a task step.
   * This method acts as a dispatcher to other modules or runes (萬能代理群).
   * @param action The action object from the TaskStep. Required.
   * @param userId The user ID for permission checks within the action. Required.
   * @param task The parent task object. Required for context like linked_kr_id.
   * @returns Promise<any> The result of the action execution.
   */
  private async executeStepAction(action: TaskStep['action'], userId: string, task: Task): Promise<any> {
      console.log(`Executing action type: ${action.type} for user ${userId} in task ${task.id}`);
      this.context.loggingService?.logInfo(`Executing task step action: ${action.type}`, { details: action.details, taskId: task.id, userId: userId });

       if (!userId) {
           console.error('[SelfNavigationEngine] Cannot execute step action: User ID is required.');
           this.context.loggingService?.logError('Cannot execute step action: User ID is required.');
           throw new Error('User ID is required to execute step action.');
       }

      // TODO: Record action execution as a UserAction? (Part of Six Styles/Action Recording - call context.authorityForgingEngine.recordAction)
      // This should be done asynchronously to not block the task execution.
      // this.context.authorityForgingEngine?.recordAction({ type: `task:step:action:${action.type}`, details: action.details, context: { taskId: currentTask.id, stepId: currentStep.id }, user_id: userId });


      switch (action.type) {
          case 'log':
              console.log('Action [log]:', action.details.message);
              return { status: 'success', output: action.details.message };
          case 'callAPI':
              // TODO: Integrate with ApiProxy or a dedicated API integration module (Leverages 萬能代理群)
              console.log('Action [callAPI]: Simulating API call to', action.details.url);
              // Simulate failure for task-sim-3 step-y
              if (action.details.url === 'https://example.com/fail') {
                   await new Promise((_, reject) => setTimeout(() => reject(new Error('Simulated API failure')), 1500));
              }
              await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API latency
              return { status: 'simulated_success', data: { message: 'Simulated API response' } };
          case 'runScript':
              // TODO: Integrate with AuthorityForgingEngine or a dedicated scripting engine (Leverages 權能鍛造 / 萬能元鍵)
              console.log('Action [runScript]: Simulating script execution for ID', action.details.scriptId);
              // In a real app, you'd call authorityForgingEngine.executeAbility(action.details.scriptId, action.details.params, userId);
              await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate script execution time
              return { status: 'simulated_success', output: 'Simulated script output' };
          case 'executeRune':
              // Execute an action provided by a registered Rune (part of 符文嵌合/萬能代理群)
              if (!action.details.runeId || !action.details.action) {
                  throw new Error('Invalid executeRune action details: runeId and action are required.');
              }
              console.log(`Action [executeRune]: Calling rune \"${action.details.runeId}\", action \"${action.details.action}\"`);
              // Use the RuneEngraftingCenter to find and execute the rune's action
              // Pass user ID to the rune execution context
              return await this.context.runeEngraftingCenter.executeRuneAction(
                  action.details.runeId,
                  action.details.action,
                  action.details.params, // Pass parameters to the rune action
                  userId // Pass user ID
              );
          case 'waitForUserInput':
              // TODO: Implement waiting for user input (complex in automated task flow) (Part of Six Styles: 協作)
              console.log('Action [waitForUserInput]: Task is waiting for user input (simulation).');
              // This would typically pause the task and require external input to resume
              // For now, this action will just complete immediately in simulation.
              await new Promise(resolve => setTimeout(resolve, 500)); // Simulate a brief wait
              return { status: 'simulated_success', message: 'Simulated waiting for user input completed.' };
          case 'syncKnowledge':
              // TODO: Integrate with KnowledgeSync module (part of 雙向同步領域)
              console.log('Action [syncKnowledge]: Simulating knowledge sync.');
              // This might trigger a fetch/merge operation
              await new Promise(resolve => setTimeout(resolve, 500));
              return { status: 'simulated_success', message: 'Knowledge sync simulated.' };
          case 'sendNotification':
              // Send a notification using the NotificationService
              if (!action.details.message || !action.details.type || !action.details.channel) {
                   throw new Error('Invalid sendNotification action details: message, type, and channel are required.');
              }
              console.log('Action [sendNotification]: Sending notification...');
              // Pass user ID to the notification service
              await this.context.notificationService?.sendNotification({
                  user_id: userId, // Send notification to the task owner
                  type: action.details.type,
                  message: action.details.message,
                  channel: action.details.channel,
                  details: action.details.details, // Optional details
              });
              return { status: 'success', message: 'Notification sent.' };
          case 'updateGoalProgress':
              // Update progress for a linked goal/key result
              if (!action.details.krId || action.details.currentValue === undefined) {
                   throw new Error('Invalid updateGoalProgress action details: krId and currentValue are required.');
              }
              console.log(`Action [updateGoalProgress]: Updating KR ${action.details.krId} progress to ${action.details.currentValue}...`);
              // Check if the task is linked to a KR, and if the action specifies a KR ID
              // Prioritize the KR ID specified in the action details if present, otherwise use the task's linked_kr_id
              const targetKrId = action.details.krId || task.linked_kr_id;
              if (!targetKrId) {
                   throw new Error('updateGoalProgress action requires a krId in details or the task must be linked to a KR.');
              }
              if (!this.context.goalManagementService) {
                   throw new Error('GoalManagementService is not initialized.');
              }
              // Pass user ID to the goal management service
              await this.context.goalManagementService.updateKeyResultProgress(targetKrId, action.details.currentValue, userId); // Pass userId
              return { status: 'success', message: `Goal progress updated for KR ${targetKrId}.` };
          // Add other action types as needed
          default:
              console.error(`Unknown action type in task step: ${action.type}`);
              this.context.loggingService?.logError(`Unknown action type in task step: ${action.type}`, { action, taskId: task.id, userId: userId });
              throw new Error(`Unknown action type: ${action.type}`);
      }
  }


  /**
   * Retrieves all tasks for a specific user from Supabase, including their steps.
   * @param userId The user ID to filter tasks by. Required.
   * @returns Promise<Task[]> An array of Task objects.
   */
  async getTasks(userId: string): Promise<Task[]> {
    console.log('Retrieving tasks from Supabase for user:', userId);
    this.context.loggingService?.logInfo('Attempting to fetch tasks', { userId });

    if (!userId) {
        console.warn('[SelfNavigationEngine] Cannot retrieve tasks: User ID is required.');
        this.context.loggingService?.logWarning('Cannot retrieve tasks: User ID is required.');
        return []; // Return empty if no user ID
    }
    try {
        // Fetch tasks from Supabase, filtered by user_id, and join with task_steps
        const { data, error } = await this.supabase
            .from('tasks')
            .select('*, task_steps(*)') // Select task fields and all related task_steps
            .eq('user_id', userId)
            .order('creation_timestamp', { ascending: false } as any); // Order tasks by creation time, Supabase expects { ascending: boolean }

        if (error) { throw error; }

        // Supabase join returns nested objects, ensure steps are sorted by step_order
        const tasks = (data as Task[]).map(task => ({
            ...task,
            steps: task.steps.sort((a, b) => a.step_order - b.step_order)
        }));

        console.log(`Fetched ${tasks.length} tasks for user ${userId}.`);
        this.context.loggingService?.logInfo(`Fetched ${tasks.length} tasks successfully.`, { userId });

        return tasks;

    } catch (error: any) {
        console.error('Error fetching tasks from Supabase:', error);
        this.context.loggingService?.logError('Failed to fetch tasks', { userId: userId, error: error.message });
        return [];
    }
  }

  /**
   * Retrieves a specific task by ID for a specific user from Supabase, including its steps.
   * @param taskId The ID of the task. Required.
   * @param userId The user ID for verification. Required.
   * @returns Promise<Task | undefined> The Task object or undefined.
   */
  async getTaskById(taskId: string, userId: string): Promise<Task | undefined> {
      console.log('Retrieving task by ID from Supabase:', taskId, 'for user:', userId);
      this.context.loggingService?.logInfo(`Attempting to fetch task ${taskId}`, { id: taskId, userId });

       if (!userId) {
           console.warn('[SelfNavigationEngine] Cannot retrieve task: User ID is required.');
           this.context.loggingService?.logWarning('Cannot retrieve task: User ID is required.');
           return undefined;
       }
      try {
          // Fetch task from Supabase by ID and user_id, and join with task_steps
            const { data, error } = await this.supabase
                .from('tasks')
                .select('*, task_steps(*)') // Select task fields and all related task_steps
                .eq('id', taskId)
                .eq('user_id', userId) // Ensure ownership
                .single();

            if (error) { throw error; }
            if (!data) { return undefined; } // Task not found or doesn't belong to user

            // Sort steps by step_order
            const task = data as Task;
            task.steps = task.steps.sort((a, b) => a.step_order - b.step_order);

            console.log(`Fetched task ${taskId} for user ${userId}.`);
            this.context.loggingService?.logInfo(`Fetched task ${taskId} successfully.`, { id: taskId, userId: userId });

            return task;

      } catch (error: any) {
          console.error(`Error fetching task ${taskId} from Supabase:`, error);
          this.context.loggingService?.logError(`Failed to fetch task ${taskId}`, { id: taskId, userId: userId, error: error.message });
          return undefined;
      }
  }

  /**
   * Updates an existing task for a specific user in Supabase.
   * Note: This method is primarily for updating task-level fields (status, current_step_index, timestamps, linked_kr_id).
   * Updating steps requires separate methods or direct step updates.
   * @param taskId The ID of the task to update. Required.
   * @param updates The updates to apply. Required.
   * @param userId The user ID for verification. Required.
   * @returns Promise<Task | undefined> The updated Task or undefined if not found or user mismatch.
   */
  async updateTask(taskId: string, updates: Partial<Omit<Task, 'id' | 'user_id' | 'creation_timestamp' | 'steps'>>, userId: string): Promise<Task | undefined> {
      console.log(`Updating task ${taskId} in Supabase for user ${userId}...`, updates);
      this.context.loggingService?.logInfo(`Attempting to update task ${taskId}`, { id: taskId, updates, userId });

       if (!userId) {
           console.warn('[SelfNavigationEngine] Cannot update task: User ID is required.');
           this.context.loggingService?.logWarning('Cannot update task: User ID is required.');
           return undefined;
       }

      try {
          // Persist update to Supabase (Supports Bidirectional Sync Domain)
          // Filter by ID and user_id to ensure ownership
            const { data, error } = await this.supabase
                .from('tasks')
                .update(updates)
                .eq('id', taskId)
                .eq('user_id', userId) // Ensure ownership
                .select('*, task_steps(*)') // Select updated task and its steps
                .single();

            if (error) { throw error; }
            if (!data) { // Should not happen if RLS is correct and ID/user_id match
                 console.warn(`Task ${taskId} not found or does not belong to user ${userId} for update.`);
                 this.context.loggingService?.logWarning(`Task not found or user mismatch for update: ${taskId}`, { userId });
                 return undefined;
            }

            const updatedTask = data as Task;
            updatedTask.steps = updatedTask.steps.sort((a, b) => a.step_order - b.step_order); // Sort steps

            console.log(`Task ${taskId} updated in Supabase.`);
            // Trigger an event indicating a task has been updated (part of Six Styles/EventBus)
            this.context.eventBus?.publish('task_updated', updatedTask, userId); // Include userId in event
            this.context.loggingService?.logInfo(`Task updated successfully: ${taskId}`, { id: taskId, userId: userId });

            return updatedTask;

      } catch (error: any) {
          console.error(`Failed to update task ${taskId}:`, error);
          this.context.loggingService?.logError(`Failed to update task ${taskId}`, { id: taskId, updates, userId: userId, error: error.message });
          throw error; // Re-throw the error
      }
  }

   /**
   * Updates an existing task step for a specific user in Supabase.
   * @param stepId The ID of the step to update. Required.
   * @param updates The updates to apply. Required.
   * @param userId The user ID for verification (checks parent task ownership). Required.
   * @returns Promise<TaskStep | undefined> The updated TaskStep or undefined if not found or user mismatch.
   */
   async updateTaskStep(stepId: string, updates: Partial<Omit<TaskStep, 'id' | 'task_id' | 'step_order' | 'status' | 'result' | 'error' | 'start_timestamp' | 'end_timestamp'>>, userId: string): Promise<TaskStep | undefined> {
       console.log(`Updating task step ${stepId} in Supabase for user ${userId}...`, updates);
       this.context.loggingService?.logInfo(`Attempting to update task step ${stepId}`, { id: stepId, updates, userId });

        if (!userId) {
            console.warn('[SelfNavigationEngine] Cannot update task step: User ID is required.');
            this.context.loggingService?.logWarning('Cannot update task step: User ID is required.');
            return undefined;
        }

       try {
           // Fetch the step first to get its task_id and verify user ownership via the task
           const { data: stepData, error: fetchError } = await this.supabase
               .from('task_steps')
               .select('*, tasks(user_id)') // Select step and join with parent task to get user_id
               .eq('id', stepId)
               .single();

           if (fetchError) { throw fetchError; }
           if (!stepData || (stepData.tasks as any)?.user_id !== userId) { // Check if step exists and parent task belongs to user
               console.warn(`Task step ${stepId} not found or parent task does not belong to user ${userId} for update.`);
               this.context.loggingService?.logWarning(`Task step not found or user mismatch for update: ${stepId}`, { userId });
               return undefined;
           }

           // Now update the step
           const { data: updatedStepData, error: updateError } = await this.supabase
               .from('task_steps')
               .update(updates)
               .eq('id', stepId)
               .select() // Select the updated step data
               .single();

           if (updateError) { throw updateError; }
           if (!updatedStepData) { // Should not happen if the first fetch succeeded
                console.error(`Failed to retrieve updated step data for ${stepId}.`);
                this.context.loggingService?.logError(`Failed to retrieve updated step data: ${stepId}`, { userId });
                return undefined;
           }

           const updatedStep = updatedStepData as TaskStep;

           console.log(`Task step ${stepId} updated in Supabase.`);
           // Publish an event indicating a task step has been updated (part of Six Styles/EventBus)
           this.context.eventBus?.publish('task_step_updated', updatedStep, userId); // Include userId in event
           this.context.loggingService?.logInfo(`Task step updated successfully: ${stepId}`, { id: stepId, taskId: updatedStep.task_id, userId: userId });

           return updatedStep;

       } catch (error: any) {
           console.error(`Failed to update task step ${stepId}:`, error);
           this.context.loggingService?.logError(`Failed to update task step ${stepId}`, { id: stepId, updates, userId: userId, error: error.message });
           throw error; // Re-throw the error
       }
   }

    /**
     * Adds a new step to an existing task for a specific user in Supabase.
     * @param taskId The ID of the task. Required.
     * @param stepDetails The details of the new step (without status, id, task_id). Required.
     * @param userId The user ID for verification (checks parent task ownership). Required.
     * @returns Promise<TaskStep | undefined> The newly created TaskStep or undefined if not found or user mismatch.
     */
   async addTaskStep(taskId: string, stepDetails: Omit<TaskStep, 'status' | 'id' | 'task_id' | 'step_order'>, userId: string): Promise<TaskStep | undefined> {
       console.log(`Adding step to task ${taskId} in Supabase for user ${userId}...`, stepDetails);
       this.context.loggingService?.logInfo(`Attempting to add step to task ${taskId}`, { id: taskId, stepDetails, userId });

        if (!userId) {
            console.warn('[SelfNavigationEngine] Cannot add task step: User ID is required.');
            this.context.loggingService?.logWarning('Cannot add task step: User ID is required.');
            return undefined;
        }

       try {
           // Fetch the task first to get its current steps and determine the next step_order
           const task = await this.getTaskById(taskId, userId);
           if (!task) {
               console.warn(`Task ${taskId} not found or does not belong to user ${userId} for adding step.`);
               this.context.loggingService?.logWarning(`Task not found or user mismatch for adding step: ${taskId}`, { userId });
               return undefined;
           }

           const nextStepOrder = task.steps.length; // Add as the last step

           const newStepData: Omit<TaskStep, 'id' | 'status' | 'start_timestamp' | 'end_timestamp' | 'result' | 'error'> = {
               task_id: taskId,
               step_order: nextStepOrder,
               description: stepDetails.description,
               action: stepDetails.action,
           };

           // Insert the new step into Supabase
           const { data, error } = await this.supabase
               .from('task_steps')
               .insert([newStepData])
               .select() // Select the inserted data to get the generated ID
               .single();

           if (error) { throw error; }
           if (!data) { throw new Error('Failed to retrieve inserted step data.'); }

           const addedStep = data as TaskStep;

           console.log(`Task step added to task ${taskId} in Supabase: ${addedStep.id}`);
           // Publish 'task_step_added' event
           this.context.eventBus?.publish('task_step_added', addedStep, userId);
           this.context.loggingService?.logInfo(`Task step added: ${addedStep.id}`, { taskId: taskId, userId: userId });

           return addedStep;

       } catch (error: any) {
           console.error(`Failed to add task step to task ${taskId}:`, error);
           this.context.loggingService?.logError(`Failed to add task step to task ${taskId}`, { id: taskId, stepDetails, userId: userId, error: error.message });
           throw error; // Re-throw the error
       }
   }

    /**
    * Deletes a task step from an existing task for a specific user in Supabase.
    * @param stepId The ID of the step to delete. Required.
    * @param userId The user ID for verification (checks parent task ownership). Required.
    * @returns Promise<boolean> True if deletion was successful, false otherwise.
    */
   async deleteTaskStep(stepId: string, userId: string): Promise<boolean> {
       console.log(`Deleting task step ${stepId} from Supabase for user ${userId}...`);
       this.context.loggingService?.logInfo(`Attempting to delete task step ${stepId}`, { id: stepId, userId });

        if (!userId) {
            console.warn('[SelfNavigationEngine] Cannot delete task step: User ID is required.');
            this.context.loggingService?.logWarning('Cannot delete task step: User ID is required.');
            return false;
        }

       try {
           // Fetch the step first to get its task_id and verify user ownership via the task
           const { data: stepData, error: fetchError } = await this.supabase
               .from('task_steps')
               .select('task_id, tasks(user_id)') // Select task_id and join with parent task to get user_id
               .eq('id', stepId)
               .single();

           if (fetchError) { throw fetchError; }
           if (!stepData || (stepData.tasks as any)?.user_id !== userId) { // Check if step exists and parent task belongs to user
               console.warn(`Task step ${stepId} not found or parent task does not belong to user ${userId} for deletion.`);
               this.context.loggingService?.logWarning(`Task step not found or user mismatch for deletion: ${stepId}`, { userId });
               return false;
           }

           const taskId = stepData.task_id;

           // Delete the step from Supabase
           const { count, error } = await this.supabase
               .from('task_steps')
               .delete()
               .eq('id', stepId)
               // RLS should handle the user check based on task_id, but explicit check is safer
               .eq('task_id', taskId); // Ensure step belongs to the correct task

           if (error) { throw error; }

           const deleted = count !== null && count > 0; // Check if count is greater than 0

           if (deleted) {
               console.log(`Task step ${stepId} deleted from Supabase.`);
               // TODO: Reorder remaining steps in the task if necessary (complex, might need a separate function or trigger)
               // Publish 'task_step_deleted' event
               this.context.eventBus?.publish('task_step_deleted', { stepId: stepId, taskId: taskId, userId: userId }, userId);
               this.context.loggingService?.logInfo(`Task step deleted: ${stepId}`, { taskId: taskId, userId: userId });
           } else {
                console.warn(`Task step ${stepId} not found for deletion or user mismatch.`);
                this.context.loggingService?.logWarning(`Task step not found for deletion or user mismatch: ${stepId}`, { id: stepId, userId });
           }

           return deleted;

       } catch (error: any) {
           console.error(`Failed to delete task step ${stepId}:`, error);
           this.context.loggingService?.logError(`Failed to delete task step ${stepId}`, { id: stepId, userId: userId, error: error.message });
           throw error; // Re-throw the error
       }
   }

    /**
     * Links a task to a specific Key Result.
     * Updates the task's `linked_kr_id` field.
     * @param taskId The ID of the task. Required.
     * @param krId The ID of the Key Result to link to. Required.
     * @param userId The user ID for verification. Required.
     * @returns Promise<Task | undefined> The updated task or undefined.
     */
    async linkTaskToKeyResult(taskId: string, krId: string, userId: string): Promise<Task | undefined> {
        console.log(`[SelfNavigationEngine] Linking task ${taskId} to KR ${krId} for user ${userId}...`);
        this.context.loggingService?.logInfo(`Attempting to link task ${taskId} to KR ${krId}`, { taskId, krId, userId });

        if (!userId) {
            console.warn('[SelfNavigationEngine] Cannot link task to KR: User ID is required.');
            this.context.loggingService?.logWarning('Cannot link task to KR: User ID is required.');
            return undefined;
        }

        try {
            // Update the task's linked_kr_id in Supabase
            const { data, error } = await this.supabase
                .from('tasks')
                .update({ linked_kr_id: krId } as Partial<Task>)
                .eq('id', taskId)
                .eq('user_id', userId) // Ensure ownership
                .select('*, task_steps(*)')
                .single();

            if (error) { throw error; }
            if (!data) {
                console.warn(`Task ${taskId} not found or does not belong to user ${userId} for linking.`);
                this.context.loggingService?.logWarning(`Task not found or user mismatch for linking: ${taskId}`, { userId });
                return undefined;
            }

            const updatedTask = data as Task;
            updatedTask.steps = updatedTask.steps.sort((a, b) => a.step_order - b.step_order);

            console.log(`Task ${taskId} linked to KR ${krId} in Supabase.`);
            // Publish event
            this.context.eventBus?.publish('task_linked_to_kr', { taskId, krId, userId }, userId);
            this.context.loggingService?.logInfo(`Task linked to KR: ${taskId} -> ${krId}`, { taskId, krId, userId });

            // Also update the KR's linked_task_ids list via GoalManagementService
            if (this.context.goalManagementService) {
                 await this.context.goalManagementService.linkTaskToKeyResult(krId, taskId, userId);
            } else {
                 console.warn('[SelfNavigationEngine] GoalManagementService not available to update KR linked_task_ids.');
                 this.context.loggingService?.logWarning('GoalManagementService not available to update KR linked_task_ids.');
            }

            return updatedTask;

        } catch (error: any) {
            console.error(`Failed to link task ${taskId} to KR ${krId}:`, error);
            this.context.loggingService?.logError(`Failed to link task to KR`, { taskId, krId, userId, error: error.message });
            throw error; // Re-throw
        }
    }

    /**
     * Unlinks a task from a Key Result.
     * Updates the task's `linked_kr_id` field to null.
     * @param taskId The ID of the task. Required.
     * @param userId The user ID for verification. Required.
     * @returns Promise<Task | undefined> The updated task or undefined.
     */
    async unlinkTaskFromKeyResult(taskId: string, userId: string): Promise<Task | undefined> {
        console.log(`[SelfNavigationEngine] Unlinking task ${taskId} from KR for user ${userId}...`);
        this.context.loggingService?.logInfo(`Attempting to unlink task ${taskId} from KR`, { taskId, userId });

        if (!userId) {
            console.warn('[SelfNavigationEngine] Cannot unlink task from KR: User ID is required.');
            this.context.loggingService?.logWarning('Cannot unlink task from KR: User ID is required.');
            return undefined;
        }

        try {
             // Fetch the task first to get the KR ID it was linked to
            const task = await this.getTaskById(taskId, userId);
            const oldKrId = task?.linked_kr_id;

            // Update the task's linked_kr_id to null in Supabase
            const { data, error } = await this.supabase
                .from('tasks')
                .update({ linked_kr_id: null } as Partial<Task>)
                .eq('id', taskId)
                .eq('user_id', userId) // Ensure ownership
                .select('*, task_steps(*)')
                .single();

            if (error) { throw error; }
            if (!data) {
                console.warn(`Task ${taskId} not found or does not belong to user ${userId} for unlinking.`);
                this.context.loggingService?.logWarning(`Task not found or user mismatch for unlinking: ${taskId}`, { userId });
                return undefined;
            }

            const updatedTask = data as Task;
            updatedTask.steps = updatedTask.steps.sort((a, b) => a.step_order - b.step_order);

            console.log(`Task ${taskId} unlinked from KR in Supabase.`);
            // Publish event
            this.context.eventBus?.publish('task_unlinked_from_kr', { taskId, oldKrId, userId }, userId);
            this.context.loggingService?.logInfo(`Task unlinked from KR: ${taskId}`, { taskId, oldKrId, userId });

            // Also update the old KR's linked_task_ids list via GoalManagementService
            if (oldKrId && this.context.goalManagementService) {
                 await this.context.goalManagementService.unlinkTaskFromKeyResult(oldKrId, taskId, userId);
            } else if (oldKrId) {
                 console.warn('[SelfNavigationEngine] GoalManagementService not available to update old KR linked_task_ids.');
                 this.context.loggingService?.logWarning('GoalManagementService not available to update old KR linked_task_ids.');
            }

            return updatedTask;

        } catch (error: any) {
            console.error(`Failed to unlink task ${taskId} from KR:`, error);
            this.context.loggingService?.logError(`Failed to unlink task from KR`, { taskId, userId, error: error.message });
            throw error; // Re-throw
        }
    }


  // TODO: Implement task scheduling. (Part of Six Styles: 觸發)
  // TODO: Implement task history and logging (integrate with LoggingService). (Supports Observe/Monitor in Six Styles, KPI tracking)
  // TODO: Implement UI/Realtime updates for task status (integrate with EventBus/SyncService). (Supports Bidirectional Sync Domain, Event Push in Six Styles)
  // TODO: Tasks can be considered a form of "萬能元鍵" or orchestrated use of "萬能元鍵".
  // TODO: Integrate with Smart Contract Task Auction (光速協作) for task assignment/execution in a decentralized environment.
}