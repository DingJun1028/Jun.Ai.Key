import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css'; // Basic CSS file

// Import all core and auxiliary services
import { ApiProxy } from './proxies/apiProxy';
import { KnowledgeSync } from './modules/knowledgeSync';
import { RuneEngraftingCenter } from './core/rune-engrafting/RuneEngraftingCenter';
import { SelfNavigationEngine } from './core/self-navigation/SelfNavigationEngine';
import { AuthorityForgingEngine } from './core/authority/AuthorityForgingEngine';
import { JunAiAssistant } from './junai';
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


import { SystemContext, User } from './interfaces'; // Import interfaces and User

console.log("🚀 Jun.Ai.Key Web UI Starting...");

// Initialize all core and auxiliary services (The OmniKey's internal structure)
// Order of initialization might matter if services have dependencies

// Create a preliminary context to pass to services that need it during construction
// This helps resolve circular dependencies during initialization
const preliminaryContext: Partial<SystemContext> = {
    currentUser: null, // Initialize currentUser as null
};

// Initialize services that don't have circular dependencies or only depend on context
const loggingService = new LoggingService(preliminaryContext as SystemContext);
const cachingService = new CachingService(preliminaryContext as SystemContext);
const eventBus = new EventBus(preliminaryContext as SystemContext);
const securityService = new SecurityService(preliminaryContext as SystemContext); // Security needs context to update currentUser

// Update preliminary context with services that are now initialized
Object.assign(preliminaryContext, {
    loggingService,
    cachingService,
    eventBus,
    securityService,
});

// Initialize services that depend on the basic set
const apiProxy = new ApiProxy(preliminaryContext as SystemContext); // ApiProxy needs logging/caching

// Update preliminary context with apiProxy
Object.assign(preliminaryContext, {
    apiProxy,
});

// Initialize MemoryEngine separately as it's a core pillar and needed by KnowledgeSync
const memoryEngine = new MemoryEngine(preliminaryContext as SystemContext); // MemoryEngine needs apiProxy

// Update preliminary context with MemoryEngine
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


// Assemble the final SystemContext object with all initialized services
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
    analyticsService,
    goalManagementService,
    currentUser: null, // Will be updated by SecurityService auth listener
    memoryEngine, // Add MemoryEngine to the final context
};

// Now that all services are initialized and the context is complete,
// update the preliminary context reference to the final one.
// This ensures services initialized with the preliminary context now hold the complete one.
// This is a common pattern to handle circular dependencies during initialization.
Object.assign(preliminaryContext, systemContext);


// Expose the complete systemContext globally for simplicity in this MVP placeholder
// WARNING: Avoid doing this in production applications
declare const window: any;
window.systemContext = systemContext;

// --- Supabase Auth State Change Listener ---
// This listener updates the systemContext.currentUser whenever the auth state changes
systemContext.securityService.onAuthStateChange((user: User | null) => {
    systemContext.currentUser = user;
    if (user) {
        console.log(`[Web UI] Auth state changed: Logged in as ${user.email} (ID: ${user.id})`);
        systemContext.loggingService?.logInfo('User logged in', { userId: user.id, email: user.email });
    } else {
        console.log('[Web UI] Auth state changed: Logged out.');
        systemContext.loggingService?.logInfo('User logged out');
    }
    // The App component is designed to re-render based on systemContext.currentUser
    // No explicit ReactDOM.render call needed here.
});


// Simulate registering some basic runes on startup (Part of 符文嵌合 / 萬能代理群)
// These are now registered inside the RuneEngraftingCenter constructor
// runeEngraftingCenter.registerRune({...});


// Render the React app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);