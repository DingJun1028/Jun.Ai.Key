import React, { useEffect, useState } from 'react';
import { SyncService } from '../modules/sync/SyncService';
import { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine';
import { KnowledgeSync } from '../modules/knowledgeSync'; // To fetch dev logs
import { KnowledgeRecord } from '../interfaces'; // For dev logs type
import { RefreshCcw, GitPullRequest, GitPush } from 'lucide-react'; // Import icons

// Access core modules from the global window object (for MVP simplicity)
// In a real app, use React Context or dependency injection
declare const window: any;
const syncService: SyncService = window.systemContext?.syncService; // The Sync Service (同步服務)
const authorityForgingEngine: AuthorityForgingEngine = window.systemContext?.authorityForgingEngine; // The Authority Forging (權能鍛造) pillar
const knowledgeSync: KnowledgeSync = window.systemContext?.knowledgeSync; // The Knowledge Sync (知識同步) module
const systemContext: any = window.systemContext; // Access the full context for currentUser

// Define data types relevant to sync status display
const SYNC_DATA_TYPES = [
    'memoryEngine', // Knowledge Records
    'authorityForgingEngine', // User Actions, Abilities
    'selfNavigationEngine', // Tasks, Task Steps
    'runeEngraftingCenter', // Runes
    'goalManagementService', // Goals, Key Results
    'notificationService', // Notifications
    'analyticsService', // Analytics data
] as const; // Use 'as const' to create a tuple of literal strings

type SyncDataType = typeof SYNC_DATA_TYPES[number];


const Dashboard: React.FC = () => {
  const [overallSyncStatus, setOverallSyncStatus] = useState<'idle' | 'syncing' | 'error' | 'unknown'>('unknown');
  const [moduleSyncStatuses, setModuleSyncStatuses] = useState<Record<SyncDataType, { status: 'idle' | 'syncing' | 'error' | 'unknown', timestamp?: number }>>(() => {
      const initialStatuses: any = {};
      SYNC_DATA_TYPES.forEach(type => {
          initialStatuses[type] = { status: 'unknown', timestamp: undefined };
      });
      return initialStatuses;
  });
  const [recentDevLogs, setRecentDevLogs] = useState<KnowledgeRecord[]>([]);
  const [loadingDevLogs, setLoadingDevLogs] = useState(true);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [isSimulatingGit, setIsSimulatingGit] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const updateSyncStatuses = () => {
      if (syncService) {
          setOverallSyncStatus(syncService.getSyncStatus('system') || 'unknown');
          const updatedModuleStatuses: any = {};
          SYNC_DATA_TYPES.forEach(type => {
              updatedModuleStatuses[type] = {
                  status: syncService.getSyncStatus(type) || 'unknown',
                  timestamp: syncService.getLastSyncTimestamp(type),
              };
          });
          setModuleSyncStatuses(updatedModuleStatuses);
      } else {
          setOverallSyncStatus('unknown');
          const updatedModuleStatuses: any = {};
           SYNC_DATA_TYPES.forEach(type => {
              updatedModuleStatuses[type] = { status: 'unknown', timestamp: undefined };
          });
          setModuleSyncStatuses(updatedModuleStatuses);
      }
  };

  const fetchRecentDevLogs = async () => {
      const userId = systemContext?.currentUser?.id;
      if (!knowledgeSync || !userId) {
          // setError("KnowledgeSync module not initialized or user not logged in."); // Don't set error for just logs
          setLoadingDevLogs(false);
          return;
      }
      setLoadingDevLogs(true);
      try {
          // Fetch all knowledge records for the user and filter for dev logs
          const allRecords = await knowledgeSync.getAllKnowledgeForUser(userId); // Pass userId
          const devLogs = allRecords.filter(record => record.source === 'dev-log');
          // Sort by timestamp descending
          devLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          setRecentDevLogs(devLogs.slice(0, 10)); // Show only the 10 most recent
      } catch (err: any) {
          console.error('Error fetching dev logs:', err);
          // setError(`Failed to load development logs: ${err.message}`); // Don't set error for just logs
      } finally {
          setLoadingDevLogs(false);
      }
  };


  useEffect(() => {
    // Fetch initial data and set up listeners when the component mounts or user changes
    if (systemContext?.currentUser?.id) {
      updateSyncStatuses(); // Initial sync status check
      fetchRecentDevLogs(); // Fetch initial dev logs

      // Subscribe to sync status changes
      let unsubscribeSync: (() => void) | undefined;
      if (syncService) {
           // Assuming SyncService has a way to subscribe to status changes
           // This is a placeholder subscription model
           // TODO: Implement actual subscription in SyncService
           unsubscribeSync = syncService.context.eventBus?.subscribe('sync_completed', (payload: any) => {
               if (payload.userId === systemContext?.currentUser?.id) {
                   console.log('Dashboard received sync_completed event.');
                   updateSyncStatuses(); // Update all statuses on any sync completion
                   // If knowledge sync completed, refetch dev logs
                   if (payload.dataType === 'memoryEngine' || payload.dataType === 'system') {
                       fetchRecentDevLogs();
                   }
               }
           });
            syncService.context.eventBus?.subscribe('sync_error', (payload: any) => {
               if (payload.userId === systemContext?.currentUser?.id) {
                   console.log('Dashboard received sync_error event.');
                   updateSyncStatuses(); // Update all statuses on any sync error
               }
           });
             syncService.context.eventBus?.subscribe('sync_started', (payload: any) => {
               if (payload.userId === systemContext?.currentUser?.id) {
                   console.log('Dashboard received sync_started event.');
                   updateSyncStatuses(); // Update all statuses on any sync start
               }
           });
            // Listen for mobile git sync events specifically to refetch dev logs
             syncService.context.eventBus?.subscribe('mobile_git_synced', (payload: any) => {
                if (payload.userId === systemContext?.currentUser?.id) {
                    console.log('Dashboard received mobile_git_synced event.');
                    fetchRecentDevLogs(); // Refetch dev logs after git sync
                }
             });
      }

      // TODO: Subscribe to new dev log entries if KnowledgeSync supports realtime updates or events
      // knowledgeSync?.subscribeToKnowledgeUpdates((record, type) => {
      //     if (record.source === 'dev-log' && (type === 'INSERT' || type === 'UPDATE')) {
      //         fetchRecentDevLogs(); // Refetch logs on new/updated dev log
      //     }
      // });


      return () => {
        // Unsubscribe on component unmount
        unsubscribeSync?.(); // Unsubscribe from sync events
      };

    } else {
        // Reset state if user logs out
        setOverallSyncStatus('unknown');
        const initialStatuses: any = {};
           SYNC_DATA_TYPES.forEach(type => {
              initialStatuses[type] = { status: 'unknown', timestamp: undefined };
          });
        setModuleSyncStatuses(initialStatuses);
        setRecentDevLogs([]);
        setLoadingDevLogs(false);
        setIsSyncingAll(false);
        setIsSimulatingGit(false);
        setError(null);
    }

  }, [systemContext?.currentUser?.id, syncService, knowledgeSync]); // Re-run effect when user ID, syncService, or knowledgeSync changes


  const handleSyncAll = async () => {
      const userId = systemContext?.currentUser?.id;
      if (!syncService || !userId) {
          alert("SyncService module not initialized or user not logged in.");
          return;
      }
      console.log(`Attempting to sync all data for user: ${userId}`);
       // Simulate recording user action (Part of 六式奧義: 觀察)
        authorityForgingEngine?.recordAction({
            type: 'web:dashboard:sync_all',
            details: {},
            context: { platform: 'web', page: 'dashboard' },
            user_id: userId, // Associate action with user
        });

      setIsSyncingAll(true);
      setError(null);
      try {
          // Trigger full sync (Part of 雙向同步領域)
          await syncService.syncAllData(userId); // Pass user ID
          // Status and logs will be updated by listeners
      } catch (err: any) {
          console.error('Error during full sync:', err);
          // Error is already set by updateSyncStatuses on sync_error event
          // setError(`Full sync failed: ${err.message}`);
      } finally {
          setIsSyncingAll(false);
      }
  };

   const handleSimulateGit = async (direction: 'pull' | 'push') => {
       const userId = systemContext?.currentUser?.id;
       if (!syncService || !userId) {
           alert("SyncService module not initialized or user not logged in.");
           return;
       }
       console.log(`Attempting to simulate Git ${direction} for user: ${userId}`);
        // Simulate recording user action (Part of 六式奧義: 觀察)
        authorityForgingEngine?.recordAction({
            type: `web:dashboard:simulate_git_${direction}`,
            details: { direction },
            context: { platform: 'web', page: 'dashboard' },
            user_id: userId, // Associate action with user
        });

       setIsSimulatingGit(true); // Use a single state for simplicity, or separate states for pull/push
       setError(null);
       try {
           // Trigger simulated mobile Git sync via SyncService (Part of 雙向同步領域)
           // The SyncService will record a dev log in the KB
           await syncService.syncMobileGitRepo(userId, direction, { repoUrl: 'simulated/mobile/repo' }); // Pass user ID and simulated details
           // Dev logs will be refetched by the listener
       } catch (err: any) {
           console.error(`Error simulating Git ${direction}:`, err);
           setError(`Simulated Git ${direction} failed: ${err.message}`);
       } finally {
           setIsSimulatingGit(false);
       }
   };


  // Ensure user is logged in before rendering content
  if (!systemContext?.currentUser) {
       // This case should ideally be handled by ProtectedRoute, but as a fallback:
       return (
            <div className="container mx-auto p-4 flex justify-center">
               <div className="bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300">
                   <p>Please log in to view the dashboard.</p>
               </div>
            </div>
       );
  }


  return (
    <div className="container mx-auto p-4">
      <div className="bg-neutral-800/50 p-6 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-blue-400 mb-6">Dashboard</h2>
        <p className="text-neutral-300 mb-8">Overview of your Jun.Ai.Key system status and recent activity.</p>

        {/* Overall Synchronization Status */}
        <div className="mb-8 p-4 bg-neutral-700/50 rounded-lg flex justify-between items-center">
            <div>
                <h3 className="text-xl font-semibold text-blue-300 mb-1">Overall Synchronization Status</h3>
                <p className="text-neutral-300 text-sm">
                    Status: <span className={overallSyncStatus === 'syncing' ? 'text-yellow-400' : overallSyncStatus === 'error' ? 'text-red-400' : overallSyncStatus === 'idle' ? 'text-green-400' : 'text-neutral-400'}>{overallSyncStatus.toUpperCase()}</span>
                </p>
                 {moduleSyncStatuses['system']?.timestamp && ( // Use system timestamp for overall
                    <p className="text-neutral-400 text-xs">
                        Last Synced: {new Date(moduleSyncStatuses['system'].timestamp).toLocaleString()}
                    </p>
                )}
            </div>
             <button
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSyncAll}
                disabled={isSyncingAll || overallSyncStatus === 'syncing'}
             >
                 <RefreshCcw size={18} className={`inline-block mr-1 ${isSyncingAll || overallSyncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                 {isSyncingAll ? 'Syncing All...' : 'Sync All Data Now'}
             </button>
        </div>

         {/* Module Synchronization Statuses */}
         <div className="mb-8 p-4 bg-neutral-700/50 rounded-lg">
             <h3 className="text-xl font-semibold text-blue-300 mb-3">Module Synchronization Statuses</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {SYNC_DATA_TYPES.map(type => (
                     <div key={type} className="p-3 bg-neutral-600/50 rounded-md">
                         <p className="text-neutral-300 text-sm font-semibold mb-1">
                             {/* Display user-friendly names for data types */}
                             {type === 'memoryEngine' ? 'Knowledge Base' :
                              type === 'authorityForgingEngine' ? 'Scripts & Abilities' :
                              type === 'selfNavigationEngine' ? 'Tasks' :
                              type === 'runeEngraftingCenter' ? 'Agents & Runes' :
                              type === 'goalManagementService' ? 'Goals' :
                              type === 'notificationService' ? 'Notifications' :
                              type === 'analyticsService' ? 'Analytics' :
                              type}
                         </p>
                         <p className="text-neutral-400 text-xs">
                             Status: <span className={moduleSyncStatuses[type]?.status === 'syncing' ? 'text-yellow-400' : moduleSyncStatuses[type]?.status === 'error' ? 'text-red-400' : moduleSyncStatuses[type]?.status === 'idle' ? 'text-green-400' : 'text-neutral-400'}>{moduleSyncStatuses[type]?.status.toUpperCase() || 'UNKNOWN'}</span>
                         </p>
                         {moduleSyncStatuses[type]?.timestamp && (
                             <p className="text-neutral-400 text-xs">
                                 Last Synced: {new Date(moduleSyncStatuses[type].timestamp).toLocaleString()}
                             </p>
                         )}
                     </div>
                 ))}
             </div>
         </div>


        {/* Simulated Git Sync */}
        <div className="mb-8 p-4 bg-neutral-700/50 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-300 mb-3">Simulated Mobile Git Sync</h3>
            <p className="text-neutral-300 text-sm mb-4">Simulate synchronizing your mobile Git repository. This action is recorded as a development log.</p>
            <div className="flex gap-4">
                <button
                    className="flex-1 px-6 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleSimulateGit('pull')}
                    disabled={isSimulatingGit}
                >
                    <GitPullRequest size={18} className={`inline-block mr-1 ${isSimulatingGit ? 'animate-pulse' : ''}`} />
                    {isSimulatingGit ? 'Pulling...' : 'Simulate Git Pull'}
                </button>
                 <button
                    className="flex-1 px-6 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleSimulateGit('push')}
                    disabled={isSimulatingGit}
                >
                    <GitPush size={18} className={`inline-block mr-1 ${isSimulatingGit ? 'animate-pulse' : ''}`} />
                    {isSimulatingGit ? 'Pushing...' : 'Simulate Git Push'}
                </button>
            </div>
             {error && isSimulatingGit === false && ( // Show simulation error only after it finishes
                 <p className="text-red-400 text-sm mt-4">Error: {error}</p>
             )}
        </div>


        {/* Recent Development Logs */}
        <div className="p-4 bg-neutral-700/50 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-300 mb-3">Recent Development Logs</h3>
            {loadingDevLogs ? (
                <p className="text-neutral-400">Loading development logs...</p>
            ) : recentDevLogs.length === 0 ? (
                <p className="text-neutral-400">No recent development logs found.</p>
            ) : (
                <ul className="space-y-3">
                    {recentDevLogs.map(log => (
                        <li key={log.id} className="bg-neutral-600/50 p-3 rounded-md border-l-4 border-orange-500">
                            <p className="text-sm font-semibold text-orange-200 mb-1">{log.question}</p>
                            <p className="text-neutral-300 text-sm">{log.answer.substring(0, 150)}{log.answer.length > 150 ? '...' : ''}</p>
                            <small className="text-neutral-400 text-xs block mt-1">
                                Timestamp: {new Date(log.timestamp).toLocaleString()}
                                {log.dev_log_details?.type && ` | Type: ${log.dev_log_details.type}`}
                                {log.dev_log_details?.repo_url && ` | Repo: ${log.dev_log_details.repo_url}`}
                            </small>
                        </li>
                    ))}
                </ul>
            )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;