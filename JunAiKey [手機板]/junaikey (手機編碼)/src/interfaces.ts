// src/interfaces.ts
// Define core interfaces for Jun.Ai.Key, reflecting the OmniKey concepts.
// Design Principle: Supports MECE by providing distinct interface definitions for core entities.

/**
 * Represents a user in the system.
 */
export interface User {
    id: string; // Supabase Auth user ID (uuid)
    email: string;
    // Add other user properties as needed (e.g., name, avatar, roles, settings)
    name?: string;
    avatarUrl?: string;
    role?: string; // e.g., 'authenticated', 'admin'
}


/**
 * Represents a record stored in the knowledge base (Part of 永久記憶中樞).
 * Corresponds to the Explicit Chain in Knowledge DNA.
 */
export interface KnowledgeRecord {
  id: string;
  question: string;
  answer: string;
  timestamp: string; // ISO 8601 format
  user_id?: string; // Optional: Link to user if implementing auth (matches Supabase column name)
  source?: string; // e.g., 'manual', 'ai-generated', 'web-scrape', 'dev-log' // Added 'dev-log'
  tags?: string[];
  embedding_vector?: number[]; // For vector similarity search (Implicit Chain in Knowledge DNA)
  // Optional: Add fields specific to development logs
  dev_log_details?: {
      type: 'commit' | 'file-change' | 'sync'; // Type of dev log
      repo_url?: string; // Git repository URL
      commit_hash?: string; // Commit hash
      commit_message?: string; // Commit message
      file_path?: string; // Path of the file changed
      change_summary?: string; // Summary of file changes
      sync_direction?: 'push' | 'pull'; // Sync direction
      // Add other relevant dev log metadata
  };
}

/**
 * Represents a user action captured by the system (Part of 權能鍛造 / 六式奧義: 觀察).
 * Crucial data for supporting AARRR and KPI analysis.
 */
export interface UserAction {
  id?: string; // Optional: ID for persistence
  timestamp: number; // Unix timestamp
  user_id?: string; // Optional: Associate action with a user (matches Supabase column name)
  type: string; // e.g., 'gui:click', 'cli:command', 'api:call', 'task:execute', 'kb:save', 'ability:run', 'mobile:shortcut:run', 'mobile:git:commit', 'mobile:git:push', 'web:file:save', 'cli:file:save', 'web:code:edit' // Added dev actions
  details: any; // Specific details of the action (e.g., element ID, command string, API endpoint, taskId, recordId, abilityId, shortcutName, scriptName, repoUrl, commitHash, filePath)
  context: any; // Contextual information (e.g., app name, URL, user ID, session ID, platform: 'cli' | 'web' | 'mobile')
}

/**
 * Represents a forged ability or automated script (A form of 萬能元鍵 / Part of 權能鍛造).
 * Could be represented as a step or sequence in a Workflow DAG.
 */
export interface ForgedAbility {
  id: string;
  name: string;
  description: string;
  script: string; // The code or script to execute (e.g., TypeScript code, Scripting.app code) - Could be part of a Workflow DAG definition
  trigger: any; // How this ability is triggered (e.g., { type: 'keyword', value: 'send email' }, { type: 'schedule', cron: '* * * * *' }, { type: 'event', eventType: 'new_knowledge' })
  forged_from_actions?: string[]; // Optional: IDs of UserActions that led to this (matches Supabase column name)
  creation_timestamp: number; // Matches Supabase column name
  last_used_timestamp?: number; // Useful for KPI/AARRR (Retention) (matches Supabase column name)
  user_id?: string; // Optional: Owner of the ability (matches Supabase column name)
  is_public?: boolean; // Optional: Can this ability be shared? (Supports AARRR - Referral) (matches Supabase column name)
  version?: string; // Optional: Versioning for abilities (matches Supabase column name)
  // TODO: Add permissions, execution history
  // Could potentially link to an AgentCapabilityNFT if tokenized
  // agent_capability_nft_id?: string;
}

/**
 * Represents a step within a task (Part of 自我導航).
 * A node in the Dynamic DAG Workflow Engine.
 */
export interface TaskStep {
  id: string; // Unique ID for the step within the task
  task_id: string; // Link to the parent task (matches Supabase column name)
  step_order: number; // Order of the step within the task
  description: string;
  action: { // Define the action to be performed for this step
    type: string; // e.g., 'callAPI', 'runScript', 'waitForUserInput', 'syncKnowledge', 'executeRune', 'log', 'updateGoalProgress'
    details: any; // Parameters for the action (e.g., { url, method }, { scriptId, params }, { runeId, action, params }, { krId, currentValue })
  };
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  result?: any; // Result of the action
  error?: string; // Error message if failed
  start_timestamp?: number; // Matches Supabase column name
  end_timestamp?: number; // Matches Supabase column name
  // TODO: Add retry configuration, dependencies on other steps (for DAG)
  // dependencies?: string[]; // IDs of nodes that must complete before this one
}

/**
 * Represents a task managed by the Self-Navigation engine (A form of 萬能元鍵 / Part of 自我導航).
 * Designed to support SMART goals, OKRs, and KPIs.
 * Could be represented as a Dynamic DAG Workflow.
 */
export interface Task {
  id: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'paused' | 'cancelled';
  steps: TaskStep[]; // Steps are nested here, but stored in a separate table in Supabase
  current_step_index: number; // Matches Supabase column name
  creation_timestamp: number; // Matches Supabase column name
  start_timestamp?: number; // Matches Supabase column name
  completion_timestamp?: number; // Matches Supabase column name
  user_id?: string; // Optional: Associate task with a user (matches Supabase column name)
  linked_kr_id?: string | null; // Optional: Link this task to a specific Key Result (matches Supabase column name) - Added null possibility
  // TODO: Add task history/logs, schedule, priority
}

/**
 * Represents a Rune (external capability/plugin) (A form of 萬能元鍵 / Part of 符文嵌合 / 萬能代理群 / 無限擴充).
 * Supports 5P (Product, Place) and Business Canvas (Key Resources, Key Activities, Partners).
 * Defined via a Rune DSL and executed in a WebAssembly Security Sandbox.
 */
export interface Rune {
  id: string;
  name: string;
  description: string;
  type: 'api-adapter' | 'script-plugin' | 'ui-component' | 'data-source' | 'automation-tool' | 'ai-agent' | 'device-adapter' | 'webhook-trigger'; // Added 'webhook-trigger' type for Make/Scripting.app
  manifest: RuneManifest; // Configuration/metadata for the rune (e.g., available actions, required params, UI schema) - Defined by Rune DSL
  // Actual implementation details (e.g., code, API endpoint, function reference)
  // The structure of 'implementation' depends on the 'type'
  implementation: any; // This would be the actual code/config to run the rune (not stored in DB for security/complexity) - Executed in WASM Sandbox
  version: string;
  author_id?: string; // Optional: Community author (Supports Business Canvas - Partners, 5P - People) (matches Supabase column name)
  installation_timestamp?: number; // Matches Supabase column name
  is_enabled?: boolean; // Can be enabled/disabled by user (matches Supabase column name)
  configuration?: any; // User-specific configuration (e.g., API keys, credentials - store securely!)\
  user_id?: string; // Optional: Link to user if this is a user-specific rune (matches Supabase column name)\
  is_public?: boolean; // Optional: Can this rune be shared? (matches Supabase column name)\
  // TODO: Add rating, tags, installation_count, permissions\\\
}\\\n\\\n/**\\\n * Represents the manifest of a Rune, defining its capabilities.\\\n * Defined using a Rune DSL (Domain Specific Language).\\\n */\\\nexport interface RuneManifest {\\\n    name: string;\\\n    version: string;\\\n    description: string;\\\n    type: Rune['type'];\\\n    methods?: { // Standardized methods exposed by the rune\\\n        [methodName: string]: {\\\n            description: string;\\\n            parameters?: { // Schema for input parameters (e.g., OpenAPI/GraphQL like)\\\n                [paramName: string]: {\\\n                    type: string; // e.g., 'string', 'number', 'boolean', 'object', 'array'\\\n                    description?: string;\\\n                    required?: boolean;\\\n                    // Add validation rules, enum values, etc.\\\n                };\\\n            };\\\n            returns?: { // Schema for return value\\\n                type: string;\\\n                description?: string;\\\n                // Add structure for objects/arrays\\\n            };\\\n            // Add error types, examples, etc.\\\n        };\\\n    };\\\n    events?: { // Events the rune can publish\\\n        [eventName: string]: {\\\n            description: string;\\\n            payload?: any; // Schema for event payload\\\n        };\\\n    };\\\n    // Add other manifest details (e.g., required permissions, dependencies)\\\n}\\\n\\\n\\\n/**\\\n * Represents a generic event triggered within the system (Part of \\u516d\\u5f0f\\u5967\\u7fa9 / \\u4e8b\\u4ef6\\u7e3d\\u7dda).\\\n * Events are crucial for supporting the reactive nature of the system and can feed into analytics (AARRR, KPI).\\\n * Could be transmitted via a NATS message bus.\\\n */\\\nexport interface SystemEvent {\\\n  id?: string; // Optional: ID for persistence\\\n  timestamp: string; // ISO 8601 format (matches Supabase column name)\\\n  type: string; // e.g., 'task_completed', 'ability_forged', 'rune_installed', 'data_synced', 'sync_status_update', 'mobile_git_sync_status'\\\n  payload: any; // Event-specific data\\\n  user_id?: string; // Optional: User who triggered the event (matches Supabase column name)\\\n  context?: any; // Optional: Contextual information\\\n  severity?: string; // Optional: 'info', 'warning', 'error' (matches Supabase column name)\\\n}\\\n\\\n/**\\\n * Payload structure for the 'sync_status_update' event.\\\n */\\\nexport interface SyncStatusUpdatePayload {\\\n    dataType: keyof SystemContext | 'system'; // The data type being synced, or 'system' for overall status\\\n    userId: string; // The user ID whose data is being synced\\\n    status: 'idle' | 'syncing' | 'error'; // The current status\\\n    step: string; // A description of the current step (e.g., \\\\\\\\\\\\\\\"Fetching data...\\\\\\\\\\\\\\\", \\\\\\\\\\\\\\\"Merging changes...\\\\\\\\\\\\\\\", \\\\\\\\\\\\\\\"Completed successfully.\\\\\\\\\\\\\\\")\\\n    timestamp?: number; // Optional: Timestamp of the update\\\n}\\\n\\\n\\\n/**\\\n * Represents a notification sent to a user (Part of \\u901a\\u77e5\\u670d\\u52d9).\\\n */\\\nexport interface Notification {\\\n    id: string;\\\n    user_id?: string; // Target user\\\n    type: 'info' | 'warning' | 'error' | 'success';\\\n    message: string;\\\n    details?: any;\\\n    timestamp: string; // ISO 8601\\\n    is_read: boolean;\\\n    channel: 'ui' | 'email' | 'webhook' | 'push'; // Delivery channel\\\n    // TODO: Add action_link, icon, expiry\\\n}\\\n\\\n/**\\\n * Represents a user goal (SMART or OKR) (Part of \\u76ee\\u6a19\\u7ba1\\u7406\\u670d\\u52d9).\\\n */\\\nexport interface Goal {\\\n    id: string;\\\n    user_id: string; // Link to user\\\n    description: string; // The main objective\\\n    type: 'smart' | 'okr';\\\n    status: 'pending' | 'in-progress' | 'completed' | 'cancelled';\\\n    creation_timestamp: number;\\\n    target_completion_date?: string; // ISO 8601 date string\\\n    // For OKRs, might have nested Key Results or link to Tasks\\\n    key_results?: KeyResult[]; // Nested here, but stored in separate table\\\n    // TODO: Add metrics, progress tracking fields, parent_goal_id for nested goals\\\n}\\\n\\\n/**\\\n * Represents a Key Result for an OKR goal (Part of \\u76ee\\u6a\u6a19\u7ba1\u7406\u670d\u52d9).\n */\nexport interface KeyResult {\n    id: string;\n    goal_id: string; // Link to the parent goal\n    description: string; // The measurable result\n    target_value: number; // Target value\n    current_value: number;\n    unit: string; // e.g., 'count', 'percentage', 'dollars'\n    status: 'on-track' | 'at-risk' | 'completed';
    linked_task_ids?: string[] | null; // Optional: Link to specific tasks that contribute to this KR
}

// --- Interfaces for 萬能捷徑系統 Concepts ---

/**
 * Represents a tag from Natural Language Processing.
 */
export interface NLTag {
    token: string; // The word or punctuation
    tag: string; // The part of speech tag (e.g., 'Noun', 'Verb')
    lemma?: string; // The base form of the word
    // Add other NLP attributes as needed
}

/**
 * Represents the parsed intent and parameters from user input.
 */
export interface ActionIntent {
    action: string; // The main action identified (e.g., 'create_task', 'send_email', 'search_kb')
    parameters: any; // Extracted parameters (e.g., { description: '...', recipient: '...' })
    confidence?: number; // Confidence score of the parsing
    // Add other intent attributes
}

/**
 * Represents a step in a Shortcut Workflow (external representation).
 */
export interface ShortcutAction {
    type: string; // e.g., 'get-text', 'send-message', 'call-webhook'
    parameters: any; // Parameters for the action
    description: string; // Human-readable description
    // Add schema for parameters/returns if needed
}

/**
 * Represents an external Shortcut Workflow structure.
 */
export interface ScriptingAppWorkflow {
    id?: string; // Optional ID
    name: string;
    description?: string;
    code?: string; // The TypeScript/TSX code
    actions?: ShortcutAction[]; // A sequence of actions (alternative representation)
    // Add trigger, configuration, etc.
}

/**
 * Represents a wrapped SwiftUI UI component exposed by Scripting.app.
 * This is a conceptual interface for how Jun.Ai.Key might understand Scripting.app's UI capabilities.
 */
export interface ScriptingAppUIComponent {
    type: string; // e.g., 'VStack', 'HStack', 'Text', 'Button', 'List'
    properties: any; // Props/modifiers for the component
    children?: ScriptingAppUIComponent[]; // Nested components
    // Add event handlers, layout info, etc.
}

/**
 * Configuration for Cloud Synchronization.
 */
export interface CloudSyncConfig {
    devices: string[]; // List of device identifiers
    triggers: string[]; // List of trigger types (e.g., 'wifi', 'location', 'time', 'event')
    // Add other sync configuration
}

// --- Placeholder Interfaces for PRD Concepts ---

/**
 * Represents the dual-chain structure of Knowledge DNA.
 */
export interface KnowledgeDNA {
    explicit_chain: KnowledgeRecord; // Structured data
    implicit_chain: { // Neural representation
        embedding: number[]; // Vector embedding
        // Add other neural representations
    };
    // Add links to related KnowledgeDNA nodes
    related_knowledge_ids?: string[];
}

/**
 * Represents a node in a Dynamic DAG Workflow.
 */
export interface WorkflowDAGNode {
    id: string;
    type: 'task_step' | 'decision' | 'parallel' | 'sub_workflow';
    details: any; // Corresponds to TaskStep action or decision logic
    dependencies: string[]; // IDs of nodes that must complete before this one
    // Add error handling, retry logic specific to this node
}

/**
 * Represents a Dynamic DAG Workflow.
 */
export interface WorkflowDAG {
    id: string;
    name: string;
    description: string;
    nodes: WorkflowDAGNode[];
    entry_node_id: string; // The starting node
    // Add overall workflow status, history, triggers
}

/**
 * Placeholder for a Rune Manifest Schema definition.
 * Defines the structure and validation rules for Rune manifests.
 */
export interface RuneManifestSchema {
    $schema: string; // JSON Schema version
    title: string;
    description: string;
    type: 'object';
    properties: {
        name: { type: 'string' };
        version: { type: 'string' };
        description: { type: 'string' };
        type: { type: 'string', enum: Rune['type'][] };
        methods?: { // Schema for the methods property
            type: 'object';
            patternProperties: {
                "^[a-zA-Z_][a-zA-Z0-9_]*$": { // Method names must be valid identifiers
                    $ref: '#/definitions/methodDefinition';
                };
            };
            additionalProperties: false;
        };
        events?: { // Schema for the events property
             type: 'object';
            patternProperties: {
                "^[a-zA-Z_][a-zA-Z0-9_]*$": { // Event names must be valid identifiers
                    $ref: '#/definitions/eventDefinition';
                };
            };
            additionalProperties: false;
        };
        // Add other standard rune properties
    };
    required: ['name', 'version', 'description', 'type'];
    definitions: {
        methodDefinition: {
            type: 'object';
            properties: {
                description: { type: 'string' };
                parameters: { $ref: '#/definitions/parameterSchema' };
                returns: { type: 'object' }; // Simple placeholder, could be more detailed schema
            };
            required: ['description'];
        };
         eventDefinition: {
            type: 'object';
            properties: {
                description: { type: 'string' };
                payload: { type: 'object' }; // Simple placeholder, could be more detailed schema
            };
             required: ['description'];
        };
        parameterSchema: { type: 'object', additionalProperties: { type: 'object', properties: { type: { type: 'string' }, description: { type: 'string' }, required: { type: 'boolean' } }, required: ['type'] } };
    };
}


/**
 * Placeholder for an Agent Capability NFT.
 */
export interface AgentCapabilityNFT {
    id: string; // Token ID
    owner_id: string; // User ID
    ability_id?: string; // Link to a ForgedAbility
    rune_id?: string; // Link to a Rune
    // Add blockchain details, metadata, etc.
}

/**
 * Placeholder for a Smart Contract interaction.
 */
export interface SmartContract {
    address: string;
    abi: any; // Contract ABI
    // Add methods for interacting with the contract (e.g., call, send transaction)
}

/**
 * Placeholder for a Zero-Knowledge Proof.
 */
export interface ZKProof {
    proof: any; // The proof data
    public_inputs: any; // Public inputs used to generate the proof
    verification_key: any; // Key needed to verify the proof
}

/**
 * Represents a detected pattern in user actions.
 */
export interface AutomationPattern {
    id: string;
    user_id: string;
    sequence: UserAction['type'][]; // Sequence of action types
    frequency: number; // How often this sequence occurred
    score: number; // Suitability score for automation
    // Add context, variations, etc.
    pattern_type?: 'single_action_frequency' | 'sequential_actions' | 'app_specific_actions' | 'dev_workflow_actions'; // Added pattern type
    details?: any; // Added details for pattern context (e.g., action type, app name)
}

/**
 * Represents insights generated by the Evolution Engine.
 */
export interface EvolutionaryInsight {
    id: string;
    user_id: string;
    timestamp: number;
    type: 'automation_opportunity' | 'task_failure_diagnosis' | 'skill_suggestion' | 'optimization_recommendation' | 'scripting_app_suggestion' | 'dev_workflow_suggestion' | 'novel_combination_suggestion'; // Added novel_combination_suggestion
    details: any; // Specific details about the insight
    dismissed?: boolean; // Added: Flag to indicate if the insight has been dismissed by the user
    // Add links to relevant actions, tasks, abilities, runes
}

// --- Interfaces for Scripting.app Concepts ---
// Based on the user's analysis

/**
 * Represents a potential action that can be performed via Scripting.app.
 * This could be a wrapped SwiftUI component interaction or a native SDK call.
 */
export interface ScriptingAppAction {
    type: string; // e.g., 'showUI', 'getClipboard', 'saveFile', 'triggerShortcut'
    parameters: any; // Parameters for the action (e.g., { uiDefinition: {...} }, { filePath: '...', content: '...' })
    description: string; // Human-readable description
    // Add schema for parameters/returns if needed
}

/**
 * Represents a Scripting.app workflow or script definition.
 * This could be the TypeScript/TSX code itself or a structured definition.
 */
export interface ScriptingAppWorkflow {
    id?: string; // Optional ID
    name: string;
    description?: string;
    code?: string; // The TypeScript/TSX code
    actions?: ShortcutAction[]; // A sequence of actions (alternative representation)
    // Add trigger, configuration, etc.
}

/**
 * Represents a wrapped SwiftUI UI component exposed by Scripting.app.
 * This is a conceptual interface for how Jun.Ai.Key might understand Scripting.app's UI capabilities.
 */
export interface ScriptingAppUIComponent {
    type: string; // e.g., 'VStack', 'HStack', 'Text', 'Button', 'List'
    properties: any; // Props/modifiers for the component
    children?: ScriptingAppUIComponent[]; // Nested components
    // Add event handlers, layout info, etc.
}

/**
 * Configuration for a Mobile Git Sync Rune.
 */
export interface MobileGitSyncConfig {
    repo_url: string; // URL of the Git repository (e.g., GitHub URL)
    local_path?: string; // Optional: Local path on the mobile device
    branch?: string; // Optional: Branch to sync
    // Add authentication details (e.g., SSH key ID, token reference) - store securely!
    auth_method: 'ssh' | 'token';
    auth_details: any; // Reference to secure storage for keys/tokens
    // Add sync preferences (e.g., auto-pull, auto-push, wifi-only)
    auto_sync?: boolean;
    sync_direction?: 'push' | 'pull' | 'bidirectional';
}


// Add other interfaces as needed (e.g., for Agent, Group, Settings, Permissions)

// Interface for the core system context/dependencies (The OmniKey's internal structure)
// Designed with MECE in mind for clear separation of concerns.
export interface SystemContext {
    apiProxy: ApiProxy; // Part of 萬能代理群 infrastructure
    knowledgeSync: KnowledgeSync; // Interacts with MemoryEngine (永久記憶中樞), part of 雙向同步領域
    junaiAssistant: JunAiAssistant; // Orchestrates AI interaction, enhanced by Wisdom Secret Art
    selfNavigationEngine: SelfNavigationEngine; // Manages Tasks (自我導航), part of Six Styles
    authorityForgingEngine: AuthorityForgingEngine; // Manages Abilities (權能鍛造), part of Six Styles
    runeEngraftingCenter: RuneEngraftingCenter; // Manages Runes (符文嵌合), core of 萬能代理群 & 無限擴充
    securityService: SecurityService; // Placeholder, crucial for Eternal Palace integrity, handles Auth
    loggingService: LoggingService; // Placeholder, supports Observe/Monitor in Six Styles, KPI/AARRR
    cachingService: CachingService; // Placeholder, supports performance (indirectly KPI)
    eventBus: EventBus; // Placeholder, supports Event Push in Six Styles
    notificationService: NotificationService; // Placeholder, supports user engagement (AARRR - Activation/Retention)
    syncService: SyncService; // Placeholder, orchestrates 雙向同步領域
    wisdomSecretArt: WisdomSecretArt; // Placeholder, the Great Wisdom Precipitation Secret Art
    evolutionEngine: EvolutionEngine; // Placeholder, orchestrates learning and optimization
    analyticsService: AnalyticsService; // Placeholder, for processing data for SWOT, AARRR, KPI
    goalManagementService: GoalManagementService; // Placeholder, manages user goals
    currentUser: User | null; // The currently authenticated user
    memoryEngine: MemoryEngine; // Add MemoryEngine to context
    // Add other core modules here
}

// Import classes for SystemContext type hinting (avoid circular dependencies if possible)
import { ApiProxy } from './proxies/apiProxy';
import { KnowledgeSync } from './modules/knowledgeSync';
import { JunAiAssistant } from './junai';
import { SelfNavigationEngine } from './core/self-navigation/SelfNavigationEngine';
import { AuthorityForgingEngine } from './core/authority/AuthorityForgingEngine';
import { RuneEngraftingCenter } from './core/rune-engrafting/RuneEngraftingCenter';
// Import placeholder services
import { LoggingService } from './core/logging/LoggingService';
import { CachingService } from './core/caching/CachingService';
import { SecurityService } from './core/security/SecurityService';
import { EventBus } from './modules/events/EventBus';
import { NotificationService } from './modules/notifications/NotificationService';
import { SyncService } from './modules/sync/SyncService';
import { WisdomSecretArt } from './core/wisdom/WisdomSecretArt';
import { EvolutionEngine } from './core/evolution/EvolutionEngine';
import { AnalyticsService } from './modules/analytics/AnalyticsService';
import { GoalManagementService } from './core/goal-management/GoalManagementService';
import { MemoryEngine } from './core/memory/MemoryEngine'; // Import MemoryEngine