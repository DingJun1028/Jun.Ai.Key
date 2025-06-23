import React, { useEffect, useState } from 'react';
import { AnalyticsService } from '../modules/analytics/AnalyticsService';
import { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine';
import { UserAction, KnowledgeRecord, Task, Rune } from '../interfaces'; // Import relevant interfaces for counts
import { BarChart2, CheckCircle, XCircle, Zap, BookOpen, ListTodo } from 'lucide-react'; // Import icons

// Access core modules from the global window object (for MVP simplicity)
// In a real app, use React Context or dependency injection
declare const window: any;
const analyticsService: AnalyticsService = window.systemContext?.analyticsService; // The Analytics Service (分析服務)
const authorityForgingEngine: AuthorityForgingEngine = window.systemContext?.authorityForgingEngine; // The Authority Forging (權能鍛造) pillar
const systemContext: any = window.systemContext; // Access the full context for currentUser
const memoryEngine: any = window.systemContext?.memoryEngine; // Access MemoryEngine for counts
const selfNavigationEngine: any = window.systemContext?.selfNavigationEngine; // Access SelfNavigationEngine for counts
const runeEngraftingCenter: any = window.systemContext?.runeEngraftingCenter; // Access RuneEngraftingCenter for counts


const Analytics: React.FC = () => {
  const [kpis, setKpis] = useState<any>(null);
  const [basicStats, setBasicStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyticsData = async () => {
    const userId = systemContext?.currentUser?.id;
    if (!analyticsService || !userId) {
      setError("AnalyticsService module not initialized or user not logged in.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Fetch simulated KPIs for the user
      const userKpis = await analyticsService.calculateKPIs('all', userId); // Calculate KPIs for all time for the user
      setKpis(userKpis);

      // Fetch basic counts (simulated or actual if methods exist)
      // Note: These methods might not exist or be fully implemented yet,
      // using placeholders or existing methods that fetch all data.
      const totalKnowledgeRecords = (await memoryEngine?.getAllKnowledgeForUser(userId))?.length || 0;
      const totalTasks = (await selfNavigationEngine?.getTasks(userId))?.length || 0;
      const totalRunes = (await runeEngraftingCenter?.listRunes(undefined, userId))?.length || 0;
      // Counting user actions requires a method in AuthorityForgingEngine or AnalyticsService
      // For now, simulate a count or use getRecentActions length as a proxy
      const totalUserActions = (await authorityForgingEngine?.getRecentActions(userId, 1000))?.length || 0; // Get up to 1000 recent actions

      setBasicStats({
          totalKnowledgeRecords,
          totalTasks,
          totalRunes,
          totalUserActions,
      });


    } catch (err: any) {
      console.error('Error fetching analytics data:', err);
      setError(`Failed to load analytics data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data when the component mounts or when the user changes
    if (systemContext?.currentUser?.id) {
      fetchAnalyticsData();
    }

    // TODO: Subscribe to relevant events (e.g., task_completed, rune_executed) to update stats in realtime
    // analyticsService?.subscribeToUpdates((data) => { ... update state ... });

  }, [systemContext?.currentUser?.id, analyticsService, memoryEngine, selfNavigationEngine, runeEngraftingCenter, authorityForgingEngine]); // Re-run effect when user ID or relevant services change


   // Ensure user is logged in before rendering content
  if (!systemContext?.currentUser) {
       // This case should ideally be handled by ProtectedRoute, but as a fallback:\
       return (\
            <div className="container mx-auto p-4 flex justify-center">\
               <div className="bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300">\
                   <p>Please log in to view your analytics.</p>\
               </div>\
            </div>\
       );\
  }\


  return (
    <div className="container mx-auto p-4">
      <div className="bg-neutral-800/50 p-6 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-blue-400 mb-6">Analytics & KPIs (分析服務)</h2>
        <p className="text-neutral-300 mb-8">Gain insights into your system usage, performance, and automation effectiveness.</p>

        {loading ? (
          <div className="text-neutral-400">Loading analytics data...</div>
        ) : error ? (
          <div className="bg-red-800/30 border border-red-600 text-red-300 p-6 rounded-lg shadow-xl">
              <h3 className="text-2xl font-bold mb-4">Analytics Load Error</h3>
              <p>Error: {error}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Basic Statistics */}
            <div className="p-4 bg-neutral-700/50 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-300 mb-3">Basic Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-3 bg-neutral-600/50 rounded-md flex items-center gap-3">
                        <BookOpen size={24} className="text-green-400"/>
                        <div>
                            <p className="text-neutral-300 text-sm font-semibold">Knowledge Records</p>
                            <p className="text-neutral-100 text-lg font-bold">{basicStats?.totalKnowledgeRecords ?? 'N/A'}</p>
                        </div>
                    </div>
                     <div className="p-3 bg-neutral-600/50 rounded-md flex items-center gap-3">
                        <ListTodo size={24} className="text-blue-400"/>
                        <div>
                            <p className="text-neutral-300 text-sm font-semibold">Tasks Created</p>
                            <p className="text-neutral-100 text-lg font-bold">{basicStats?.totalTasks ?? 'N/A'}</p>
                        </div>
                    </div>
                     <div className="p-3 bg-neutral-600/50 rounded-md flex items-center gap-3">
                        <Zap size={24} className="text-purple-400"/>
                        <div>
                            <p className="text-neutral-300 text-sm font-semibold">Runes Available</p>
                            <p className="text-neutral-100 text-lg font-bold">{basicStats?.totalRunes ?? 'N/A'}</p>
                        </div>
                    </div>
                     <div className="p-3 bg-neutral-600/50 rounded-md flex items-center gap-3">
                        <BarChart2 size={24} className="text-orange-400"/>
                        <div>
                            <p className="text-neutral-300 text-sm font-semibold">User Actions Logged (Recent)</p>
                            <p className="text-neutral-100 text-lg font-bold">{basicStats?.totalUserActions ?? 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Performance Indicators (KPIs) */}
            <div className="p-4 bg-neutral-700/50 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-300 mb-3">Key Performance Indicators (KPIs)</h3>
                 {kpis ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="p-3 bg-neutral-600/50 rounded-md flex items-center gap-3">
                             <CheckCircle size={24} className="text-green-400"/>
                             <div>
                                 <p className="text-neutral-300 text-sm font-semibold">Task Completion Rate</p>
                                 <p className="text-neutral-100 text-lg font-bold">{kpis.taskCompletionRate?.toFixed(1) ?? 'N/A'}%</p>
                             </div>
                         </div>
                          <div className="p-3 bg-neutral-600/50 rounded-md flex items-center gap-3">
                             <Zap size={24} className="text-purple-400"/>
                             <div>
                                 <p className="text-neutral-300 text-sm font-semibold">Rune Execution Success Rate</p>
                                 <p className="text-neutral-100 text-lg font-bold">{kpis.runeExecutionSuccessRate?.toFixed(1) ?? 'N/A'}%</p>
                             </div>
                         </div>
                          <div className="p-3 bg-neutral-600/50 rounded-md flex items-center gap-3">
                             <ListTodo size={24} className="text-blue-400"/>
                             <div>
                                 <p className="text-neutral-300 text-sm font-semibold">Average Task Duration</p>
                                 <p className="text-neutral-100 text-lg font-bold">{kpis.averageTaskDuration?.toFixed(1) ?? 'N/A'}s</p>
                             </div>
                         </div>
                          <div className="p-3 bg-neutral-600/50 rounded-md flex items-center gap-3">
                             <BookOpen size={24} className="text-green-400"/>
                             <div>
                                 <p className="text-neutral-300 text-sm font-semibold">Knowledge Records Added</p>
                                 <p className="text-neutral-100 text-lg font-bold">{kpis.knowledgeRecordsAdded ?? 'N/A'}</p>
                             </div>
                         </div>
                         {/* TODO: Add more KPIs */}
                     </div>
                 ) : (
                     <p className="text-neutral-400">No KPI data available yet.</p>
                 )}
                 <small className="text-neutral-400 text-xs block mt-4">Timeframe: {kpis?.timeframe || 'N/A'}</small>
            </div>

            {/* TODO: Add sections for AARRR funnel, SWOT insights, etc. */}
             <div className="p-4 bg-neutral-700/50 rounded-lg">
                 <h3 className="text-xl font-semibold text-blue-300 mb-3">Advanced Insights (TODO)</h3>
                 <p className="text-neutral-400">Sections for AARRR funnel analysis, SWOT insights, and evolutionary recommendations will be added here.</p>
             </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Analytics;