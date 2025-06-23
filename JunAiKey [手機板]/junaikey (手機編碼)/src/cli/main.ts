// src/cli/main.ts
// Command Line Interface entry point for Jun.Ai.Key
// Provides a text-based interface to interact with the system.

import { Command } from 'commander';
import readline from 'readline';
import dotenv from 'dotenv';

// Import all core and auxiliary services
import { ApiProxy } from '../proxies/apiProxy';
import { KnowledgeSync } from '../modules/knowledgeSync';
import { RuneEngraftingCenter } from '../core/rune-engrafting/RuneEngraftingCenter';
import { SelfNavigationEngine } from '../core/self-navigation/SelfNavigationEngine';
import { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine';
import { JunAiAssistant } from '../junai';
import { LoggingService } from '../core/logging/LoggingService';
import { CachingService } from '../core/caching/CachingService';
import { SecurityService } from '../core/security/SecurityService';
import { EventBus } from '../modules/events/EventBus';
import { NotificationService } from '../modules/notifications/NotificationService';
import { SyncService } from '../modules/sync/SyncService';
import { WisdomSecretArt } from '../core/wisdom/WisdomSecretArt';
import { EvolutionEngine } from '../core/evolution/EvolutionEngine';
import { AnalyticsService } from '../modules/analytics/AnalyticsService';
import { GoalManagementService } from '../core/goal-management/GoalManagementService';
import { MemoryEngine } from '../core/memory/MemoryEngine'; // Import MemoryEngine


import { SystemContext, User } from '../interfaces'; // Import interfaces and User

dotenv.config(); // Load environment variables from .env file

console.log("🚀 Jun.Ai.Key CLI Starting...");

// Initialize all core and auxiliary services (The OmniKey's internal structure)
// Use the same initialization pattern as main.tsx to handle dependencies

const preliminaryContext: Partial<SystemContext> = {
    currentUser: null, // Initialize currentUser as null
};

const loggingService = new LoggingService(preliminaryContext as SystemContext);
const cachingService = new CachingService(preliminaryContext as SystemContext);
const eventBus = new EventBus(preliminaryContext as SystemContext);
const securityService = new SecurityService(preliminaryContext as SystemContext); // Security needs context to update currentUser

Object.assign(preliminaryContext, {
    loggingService,
    cachingService,
    eventBus,
    securityService,
});

const apiProxy = new ApiProxy(preliminaryContext as SystemContext);

Object.assign(preliminaryContext, {
    apiProxy,
});

const memoryEngine = new MemoryEngine(preliminaryContext as SystemContext);

Object.assign(preliminaryContext, {
    memoryEngine,
});


// Now initialize services that depend on apiProxy, memoryEngine, or other core services
// Pass the preliminaryContext which now contains the essential services
const knowledgeSync = new KnowledgeSync(preliminaryContext as SystemContext); // KnowledgeSync needs apiProxy, logging, eventBus, memoryEngine
const runeEngraftingCenter = new RuneEngraftingCenter(preliminaryContext as SystemContext); // RuneEngraftingCenter needs logging/eventBus/apiProxy
const selfNavigationEngine = new SelfNavigationEngine(preliminaryContext as SystemContext); // SelfNavigationEngine needs runeEngraftingCenter, logging/eventBus/apiProxy/auth/memory/etc.
const authorityForgingEngine = new AuthorityForgingEngine(preliminaryContext as SystemContext); // AuthorityForgingEngine needs logging/eventBus/wisdom/apiProxy/auth/memory/etc.
const wisdomSecretArt = new WisdomSecretArt(preliminaryContext as SystemContext); // WisdomSecretArt needs apiProxy, memory, etc.
const evolutionEngine = new EvolutionEngine(preliminaryContext as SystemContext); // EvolutionEngine needs wisdom, analytics, eventBus, etc.
const analyticsService = new AnalyticsService(preliminaryContext as SystemContext); // AnalyticsService needs logging/apiProxy/auth/etc.
const goalManagementService = new GoalManagementService(preliminaryContext as SystemContext); // GoalManagementService needs logging/eventBus/analytics/apiProxy/auth/etc.
const notificationService = new NotificationService(preliminaryContext as SystemContext); // NotificationService needs eventBus/logging/apiProxy/auth/etc.
const syncService = new SyncService(preliminaryContext as SystemContext); // SyncService needs all data modules, eventBus, logging


// Assemble the final SystemContext object
const systemContext: SystemContext = {
    apiProxy,
    knowledgeSync,
    junaiAssistant: new JunAiAssistant(preliminaryContext as SystemContext), // JunAiAssistant needs apiProxy, knowledgeSync, wisdom, runes
    selfNavigationEngine,
    authorityForgingEngine,
    runeEngraftingCenter,
    loggingService,
    cachingService,
    securityService,
    eventBus,
    notificationService,
    syncService,
    wisdomSecretArt,
    evolutionEngine,
    analyticsService,
    goalManagementService,
    currentUser: null, // Will be updated by SecurityService auth listener
    memoryEngine,
};

// Update the preliminary context reference to the final one
Object.assign(preliminaryContext, systemContext);


// --- Supabase Auth State Change Listener for CLI ---
// This listener updates the systemContext.currentUser whenever the auth state changes
systemContext.securityService.onAuthStateChange((user: User | null) => {
    systemContext.currentUser = user;
    if (user) {
        console.log(`[CLI] Auth state changed: Logged in as ${user.email} (ID: ${user.id})`);
        systemContext.loggingService?.logInfo('User logged in via CLI', { userId: user.id, email: user.email });
    } else {
        console.log('[CLI] Auth state changed: Logged out.');
        systemContext.loggingService?.logInfo('User logged out via CLI');
    }
    // In CLI, we might not need to re-render UI, but we need the user context for commands
});


// --- CLI Commands --- (Using Commander.js)

const program = new Command();

program
  .name('junai')
  .description('Jun.Ai.Key CLI - Your OmniKey interface')
  .version('0.1.0');

// Middleware to check authentication before executing commands that require it
const requireAuth = (fn: (...args: any[]) => Promise<void>) => {
    return async (...args: any[]) => {
        const user = systemContext.securityService.getCurrentUser();
        if (!user) {
            console.error("Error: You must be logged in to run this command. Use 'junai auth login'.");
            systemContext.loggingService?.logError('Command requires authentication', { command: program.args.join(' '), userId: user?.id });
            process.exit(1); // Exit with error code
        }
        // Pass the user ID as the last argument to the command handler
        await fn(...args, user.id);
    };
};


// Auth Commands
program
  .command('auth <command>')
  .description('Manage authentication (login, logout, signup)')
  .argument('<command>', 'login, logout, or signup')
  .action(async (command: string) => {
    if (!systemContext.securityService) {
        console.error("Error: SecurityService module not initialized.");
        process.exit(1);
    }
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const question = (query: string) => new Promise<string>((resolve) => rl.question(query, resolve));

    try {
        if (command === 'login') {
            const email = await question('Enter email: ');
            const password = await question('Enter password: ');
            rl.close();
            await systemContext.securityService.login(email, password);
            // Auth listener will log success/failure
        } else if (command === 'logout') {
            rl.close();
            await systemContext.securityService.logout();
            // Auth listener will log success
        } else if (command === 'signup') {
            const email = await question('Enter email: ');
            const password = await question('Enter password: ');
            rl.close();
            await systemContext.securityService.signup(email, password);
            // Signup method logs success/failure
        } else {
            console.error(`Error: Unknown auth command: ${command}`);
            rl.close();
            process.exit(1);
        }
    } catch (error: any) {
        console.error('Auth command failed:', error.message);
        rl.close();
        process.exit(1);
    }
  });


// Knowledge Base Commands
program
  .command('kb <command>')
  .description('Manage knowledge base (add, search, list)')
  .argument('<command>', 'add, search, or list')
  .argument('[...args]', 'Arguments for the command')
  .action(requireAuth(async (command: string, args: string[], userId: string) => { // Added userId
    if (!systemContext.knowledgeSync) {
        console.error("Error: KnowledgeSync module not initialized.");
        process.exit(1);
    }
    try {
        if (command === 'add') {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            const question = await new Promise<string>((resolve) => rl.question('Enter question: ', resolve));
            const answer = await new Promise<string>((resolve) => rl.question('Enter answer: ', resolve));
            rl.close();
            if (!question || !answer) {
                console.error("Error: Question and answer are required.");
                process.exit(1);
            }
            // Pass user ID to saveKnowledge
            const record = await systemContext.knowledgeSync.saveKnowledge(question, answer, userId); // Pass userId
            console.log('Knowledge record added:', record?.id);
        } else if (command === 'search') {
            const query = args.join(' ');
            if (!query) {
                console.error("Error: Search query is required.");
                process.exit(1);
            }
            // Pass user ID to searchKnowledge
            const records = await systemContext.knowledgeSync.searchKnowledge(query, userId); // Pass userId
            console.log(`Found ${records.length} records:`);
            records.forEach(record => {
                console.log(`--- ID: ${record.id} ---`);
                console.log(`Q: ${record.question}`);
                console.log(`A: ${record.answer.substring(0, 200)}...`);
            });
        } else if (command === 'list') {
             // Pass user ID to getAllKnowledgeForUser
            const records = await systemContext.knowledgeSync.getAllKnowledgeForUser(userId); // Pass userId
            console.log(`All records (${records.length}):`);
             records.forEach(record => {
                console.log(`--- ID: ${record.id} ---`);
                console.log(`Q: ${record.question}`);
                console.log(`A: ${record.answer.substring(0, 200)}...`);
            });
        } else {
            console.error(`Error: Unknown kb command: ${command}`);
            process.exit(1);
        }
    } catch (error: any) {
        console.error('KB command failed:', error.message);
        process.exit(1);
    }
  }));


// Task Commands
program
  .command('task <command>')
  .description('Manage tasks (create, list, start, pause, resume, cancel)')
  .argument('<command>', 'create, list, start, pause, resume, or cancel')
  .argument('[...args]', 'Arguments for the command (e.g., task description, task ID)')
  .action(requireAuth(async (command: string, args: string[], userId: string) => { // Added userId
    if (!systemContext.selfNavigationEngine) {
        console.error("Error: SelfNavigationEngine module not initialized.");
        process.exit(1);
    }
    try {
        if (command === 'create') {
            const description = args.join(' ');
            if (!description) {
                console.error("Error: Task description is required.");
                process.exit(1);
            }
            // Define some example steps for the task (can be more complex later)
            const steps = [
                { description: 'Log start', action: { type: 'log', details: { message: `Starting task: ${description}` } } },
                { description: 'Simulate step 1', action: { type: 'callAPI', details: { url: 'https://example.com/step1' } } },
                { description: 'Simulate step 2', action: { type: 'runScript', details: { scriptId: 'example-script-rune' } } }, // Example using a script/ability
                { description: 'Log end', action: { type: 'log', details: { message: `Task completed: ${description}` } } },
            ];
            // Pass user ID to createTask
            const task = await systemContext.selfNavigationEngine.createTask(description, steps, userId); // Pass userId
            console.log('Task created:', task?.id, '-', task?.description);
        } else if (command === 'list') {
             // Pass user ID to getTasks
            const tasks = await systemContext.selfNavigationEngine.getTasks(userId); // Pass userId
            console.log(`Your tasks (${tasks.length}):`);
            tasks.forEach(task => {
                console.log(`--- ID: ${task.id} ---`);
                console.log(`Description: ${task.description}`);
                console.log(`Status: ${task.status}`);
                console.log(`Progress: Step ${task.current_step_index}/${task.steps.length}`);
                console.log(`Created: ${new Date(task.creation_timestamp).toLocaleString()}`);
                if (task.start_timestamp) console.log(`Started: ${new Date(task.start_timestamp).toLocaleString()}`);
                if (task.completion_timestamp) console.log(`Finished: ${new Date(task.completion_timestamp).toLocaleString()}`);
                console.log('Steps:');
                task.steps.forEach(step => {
                    console.log(`  - Step ${step.step_order + 1} (${step.status}): ${step.description} (Action: ${step.action.type})`);
                    if (step.error) console.error(`    Error: ${step.error}`);
                });
            });
        } else if (command === 'start') {
            const taskId = args[0];
            if (!taskId) {
                console.error("Error: Task ID is required.");
                process.exit(1);
            }
            // Pass user ID to startTask
            await systemContext.selfNavigationEngine.startTask(taskId, userId); // Pass userId
            console.log(`Task ${taskId} started.`);
        } else if (command === 'pause') {
            const taskId = args[0];
            if (!taskId) {
                console.error("Error: Task ID is required.");
                process.exit(1);
            }
            // Pass user ID to pauseTask
            await systemContext.selfNavigationEngine.pauseTask(taskId, userId); // Pass userId
            console.log(`Task ${taskId} paused.`);
        } else if (command === 'resume') {
            const taskId = args[0];
            if (!taskId) {
                console.error("Error: Task ID is required.");
                process.exit(1);
            }
            // Pass user ID to resumeTask
            await systemContext.selfNavigationEngine.resumeTask(taskId, userId); // Pass userId
            console.log(`Task ${taskId} resumed.`);
        } else if (command === 'cancel') {
            const taskId = args[0];
            if (!taskId) {
                console.error("Error: Task ID is required.");
                process.exit(1);
            }
            // Pass user ID to cancelTask
            await systemContext.selfNavigationEngine.cancelTask(taskId, userId); // Pass userId
            console.log(`Task ${taskId} cancelled.`);
        } else {
            console.error(`Error: Unknown task command: ${command}`);
            process.exit(1);
        }
    } catch (error: any) {
        console.error('Task command failed:', error.message);
        process.exit(1);
    }
  }));


// Rune Commands
program
  .command('rune <command>')
  .description('Manage runes (list, execute)')
  .argument('<command>', 'list or execute')
  .argument('[...args]', 'Arguments for the command (e.g., rune ID, action name, params)')
  .action(requireAuth(async (command: string, args: string[], userId: string) => { // Added userId
    if (!systemContext.runeEngraftingCenter) {
        console.error("Error: RuneEngraftingCenter module not initialized.");
        process.exit(1);
    }
    try {
        if (command === 'list') {
             const typeFilter = args[0]; // Optional type filter
             // Pass user ID to listRunes
            const runes = await systemContext.runeEngraftingCenter.listRunes(typeFilter as any, userId); // Pass user ID
            console.log(`Available runes (${runes.length}):`);
            runes.forEach(rune => {
                console.log(`--- ID: ${rune.id} ---`);
                console.log(`Name: ${rune.name}`);
                console.log(`Type: ${rune.type}`);
                console.log(`Version: ${rune.version}`);
                console.log(`Description: ${rune.description}`);
                console.log(`Public: ${rune.is_public}`);
                console.log(`User: ${rune.user_id || 'N/A'}`);
                if (rune.manifest?.methods) {
                    console.log('Methods:');
                    Object.keys(rune.manifest.methods).forEach(methodName => console.log(`  - ${methodName}`));
                }
            });
        } else if (command === 'execute') {
            const runeId = args[0];
            const actionName = args[1];
            const params = args[2] ? JSON.parse(args[2]) : {}; // Simple JSON parsing for params
            if (!runeId || !actionName) {
                console.error("Error: Rune ID and action name are required.");
                process.exit(1);
            }
            // Pass user ID to executeRuneAction
            const result = await systemContext.runeEngraftingCenter.executeRuneAction(runeId, actionName, params, userId); // Pass user ID
            console.log(`Rune action executed. Result:`, result);
        } else {
            console.error(`Error: Unknown rune command: ${command}`);
            process.exit(1);
        }
    } catch (error: any) {
        console.error('Rune command failed:', error.message);
        process.exit(1);
    }
  }));

// Evolution Commands
program
  .command('evolve')
  .description('Trigger an evolution cycle for the current user')
  .action(requireAuth(async (userId: string) => { // Added userId
      if (!systemContext.evolutionEngine) {
          console.error("Error: EvolutionEngine module not initialized.");
          process.exit(1);
      }
      try {
          console.log(`Triggering evolution cycle for user: ${userId}...`);
          // Pass user ID to runEvolutionCycle
          const insights = await systemContext.evolutionEngine.runEvolutionCycle(userId); // Pass user ID
          console.log(`Evolution cycle completed. Generated ${insights.length} insights:`);
          insights.forEach(insight => {
              console.log(`--- Insight Type: ${insight.type} ---`);
              console.log(`Details: ${JSON.stringify(insight.details)}`);
              console.log(`Timestamp: ${new Date(insight.timestamp).toLocaleString()}`);
          });
      } catch (error: any) {
          console.error('Evolution command failed:', error.message);
          process.exit(1);
      }
  }));

// Sync Commands
program
  .command('sync <command>')
  .description('Manage synchronization (all, data-type, mobile-git)')
  .argument('<command>', 'all, data-type, or mobile-git')
  .argument('[...args]', 'Arguments for the command')
  .action(requireAuth(async (command: string, args: string[], userId: string) => { // Added userId
      if (!systemContext.syncService) {
          console.error("Error: SyncService module not initialized.");
          process.exit(1);
      }
      try {
          if (command === 'all') {
              console.log(`Initiating full sync for user: ${userId}...`);
              // Pass user ID to syncAllData
              await systemContext.syncService.syncAllData(userId); // Pass userId
              console.log('Full sync completed.');
          } else if (command === 'data-type') {
              const dataType = args[0];
              const direction = args[1] as 'up' | 'down' | 'bidirectional' || 'bidirectional';
              if (!dataType) {
                  console.error("Error: Data type is required for 'data-type' sync.");
                  process.exit(1);
              }
              // Pass user ID and direction to syncDataType
              await systemContext.syncService.syncDataType(dataType as any, userId, direction); // Pass userId
              console.log(`${direction} sync completed for data type: ${dataType}.`);
          } else if (command === 'mobile-git') {
               const direction = args[0] as 'pull' | 'push' | 'bidirectional';
               if (!direction) {
                   console.error("Error: Direction ('pull', 'push', or 'bidirectional') is required for 'mobile-git' sync.");
                   process.exit(1);
               }
               // Pass user ID and direction to syncMobileGitRepo
               await systemContext.syncService.syncMobileGitRepo(userId, direction); // Pass userId
               console.log(`Mobile Git sync (${direction}) initiated.`);
          } else {
              console.error(`Error: Unknown sync command: ${command}`);
              process.exit(1);
          }
      } catch (error: any) {
          console.error('Sync command failed:', error.message);
          process.exit(1);
      }
  }));


// Parse arguments and run the CLI
program.parse(process.argv);

// If no command is given, display help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}