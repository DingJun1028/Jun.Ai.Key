import React, { useEffect, useState } from 'react';
import { GoalManagementService } from '../core/goal-management/GoalManagementService';
import { Goal, KeyResult } from '../interfaces';
import { PlusCircle, Trash2, Edit, ChevronDown, ChevronUp, Target, CheckCircle, AlertTriangle } from 'lucide-react'; // Import icons

// Access core modules from the global window object (for MVP simplicity)
// In a real app, use React Context or dependency injection
declare const window: any;
const goalManagementService: GoalManagementService = window.systemContext?.goalManagementService; // The Goal Management (目標管理) module
const authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for action recording (權能鍛造)
const systemContext: any = window.systemContext; // Access the full context for currentUser


const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingGoal, setIsCreatingGoal] = useState(false);
  const [newGoalDescription, setNewGoalDescription] = useState('');
  const [newGoalType, setNewGoalType] = useState<'smart' | 'okr'>('smart');
  const [newGoalTargetDate, setNewGoalTargetDate] = useState('');
  const [newKeyResults, setNewKeyResults] = useState<Omit<KeyResult, 'id' | 'goal_id' | 'status' | 'current_value'>[]>([]); // For new OKR KRs
  const [expandedGoals, setExpandedGoals] = useState<Record<string, boolean>>({}); // State to track expanded goals
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null); // State for editing goal
  const [editingGoalDescription, setEditingGoalDescription] = useState('');
  const [editingGoalTargetDate, setEditingGoalTargetDate] = useState('');
  const [isSavingGoal, setIsSavingGoal] = useState(false);


  const fetchGoals = async () => {
       const userId = systemContext?.currentUser?.id;
       if (!goalManagementService || !userId) {
            setError("GoalManagementService module not initialized or user not logged in.");
            setLoading(false);
            return;
        }
      setLoading(true);
      setError(null);
      try {
          // Fetch goals for the current user from Supabase (Part of 雙向同步領域)
          const userGoals = await goalManagementService.getGoals(userId); // Pass user ID
          setGoals(userGoals);
      } catch (err: any) {
          console.error('Error fetching goals:', err);
          setError(`Failed to load goals: ${err.message}`);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    // Fetch data when the component mounts or when the user changes
    if (systemContext?.currentUser?.id) {
        fetchGoals(); // Fetch all goals on initial load
    }

    // TODO: Subscribe to realtime updates for goals/key_results if stored in Supabase (Part of 雙向同步領域)
    // goalManagementService?.subscribeToGoalsUpdates((goal, type) => { ... fetchGoals() ... });
    // goalManagementService?.subscribeToKeyResultsUpdates((kr, type) => { ... fetchGoals() ... });


    // return () => {
    //     // Unsubscribe on component unmount
    //     // goalManagementService?.unsubscribeFromUpdates(subscription);
    // };

  }, [systemContext?.currentUser?.id]); // Re-run effect when user ID changes

   const handleCreateGoal = async (e: React.FormEvent) => {
       e.preventDefault();
       const userId = systemContext?.currentUser?.id;
       if (!goalManagementService || !userId) {
           alert("GoalManagementService module not initialized or user not logged in.");
           return;
       }
       if (!newGoalDescription.trim()) {
           alert('Please enter a goal description.');
           return;
       }
       if (newGoalType === 'smart' && !newGoalTargetDate) {
            alert('Please enter a target completion date for SMART goals.');
            return;
       }
        if (newGoalType === 'okr' && newKeyResults.length === 0) {
             alert('Please add at least one Key Result for OKR goals.');
             return;
        }
        // Basic validation for Key Results
        if (newGoalType === 'okr') {
            for (const kr of newKeyResults) {
                if (!kr.description.trim() || kr.target_value === undefined || kr.unit === undefined) {
                    alert('Please fill in all details for Key Results.');
                    return;
                }
            }
        }


       setIsCreatingGoal(true);
       setError(null);
       try {
           const goalDetails = {
               description: newGoalDescription,
               type: newGoalType,
               target_completion_date: newGoalType === 'smart' ? newGoalTargetDate : undefined,
           };
           // Create the goal (Part of 目標管理 / 六式奧義: 生成)
           const newGoal = await goalManagementService.createGoal(goalDetails, newKeyResults, userId); // Pass KRs and userId

           if (newGoal) {
               alert(`Goal \"${newGoal.description}\" created successfully!`);
               console.log('Created new goal:', newGoal);
               setNewGoalDescription('');
               setNewGoalType('smart');
               setNewGoalTargetDate('');
               setNewKeyResults([]);
               fetchGoals(); // Refetch goals
                // Simulate recording user action (Part of 六式奧義: 觀察)
                authorityForgingEngine?.recordAction({
                    type: 'web:goals:create',
                    details: { goalId: newGoal.id, description: newGoal.description },
                    context: { platform: 'web', page: 'goals' },
                    user_id: userId, // Associate action with user
                });
           } else {
               setError('Failed to create goal.');
           }
       } catch (err: any) {
           console.error('Error creating goal:', err);
           setError(`Failed to create goal: ${err.message}`);
       } finally {
           setIsCreatingGoal(false);
       }
   };

    const handleEditGoalClick = (goal: Goal) => {
        setEditingGoal(goal);
        setEditingGoalDescription(goal.description);
        setEditingGoalTargetDate(goal.target_completion_date || '');
        // Note: Editing Key Results is complex and not fully implemented in this MVP UI
        // For now, we only allow editing goal-level fields.
        setError(null); // Clear previous errors when starting edit
    };

    const handleUpdateGoal = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = systemContext?.currentUser?.id;
        if (!goalManagementService || !editingGoal || !userId) return; // Safety checks

        if (!editingGoalDescription.trim()) {
            alert('Please enter a goal description.');
            return;
        }
         if (editingGoal.type === 'smart' && !editingGoalTargetDate) {
            alert('Please enter a target completion date for SMART goals.');
            return;
         }


        setIsSavingGoal(true);
        setError(null);
        try {
            // Update the goal (Part of 目標管理 / 雙向同步領域)
            const updatedGoal = await goalManagementService.updateGoal(editingGoal.id, {
                description: editingGoalDescription,
                target_completion_date: editingGoal.type === 'smart' ? editingGoalTargetDate : undefined,
                // Note: Status, type, KRs, linked tasks are not editable here in MVP
            }, userId); // Pass userId

            if (updatedGoal) {
                console.log('Goal updated:', updatedGoal);
                setEditingGoal(null);
                setEditingGoalDescription('');
                setEditingGoalTargetDate('');
                fetchGoals(); // Refetch goals
                 // Simulate recording user action (Part of 六式奧義: 觀察)
                authorityForgingEngine?.recordAction({
                    type: 'web:goals:update',
                    details: { goalId: updatedGoal.id, description: updatedGoal.description },
                    context: { platform: 'web', page: 'goals' },
                    user_id: userId, // Associate action with user
                });
            } else {
                setError('Failed to update goal.');
            }
        } catch (err: any) {
            console.error('Error updating goal:', err);
            setError(`Failed to update goal: ${err.message}`);
        } finally {
            setIsSavingGoal(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingGoal(null);
        setEditingGoalDescription('');
        setEditingGoalTargetDate('');
        setError(null);
    };


   const handleDeleteGoal = async (goalId: string) => {
       const userId = systemContext?.currentUser?.id;
       if (!goalManagementService || !userId) {
           alert("GoalManagementService module not initialized or user not logged in.");
           return;
       }
       if (!confirm(`Are you sure you want to delete goal ${goalId}? This will also delete all associated Key Results.`)) return;

       setError(null);
       try {
           // Delete the goal (Part of 雙向同步領域)
           const success = await goalManagementService.deleteGoal(goalId, userId); // Pass user ID
           if (success) {
               console.log('Goal deleted:', goalId);
               fetchGoals(); // Refetch data
                // Simulate recording user action (Part of 六式奧義: 觀察)
                authorityForgingEngine?.recordAction({
                    type: 'web:goals:delete',
                    details: { goalId },
                    context: { platform: 'web', page: 'goals' },
                    user_id: userId, // Associate action with user
                });
           } else {
               setError('Failed to delete goal.');
           }
       } catch (err: any) {
           console.error('Error deleting goal:', err);
           setError(`Failed to delete goal: ${err.message}`);
       }
   };

    const handleAddKeyResult = () => {
        const newKr: Omit<KeyResult, 'id' | 'goal_id' | 'status' | 'current_value'> = {
            description: '',
            target_value: 0,
            unit: '',
        };
        setNewKeyResults([...newKeyResults, newKr]);
    };

    const handleRemoveKeyResult = (index: number) => {
        const updatedKrs = newKeyResults.filter((_, i) => i !== index);
        setNewKeyResults(updatedKrs);
    };

    const handleKeyResultChange = (index: number, field: keyof Omit<KeyResult, 'id' | 'goal_id' | 'status' | 'current_value'>, value: any) => {
        const updatedKrs = [...newKeyResults];
        (updatedKrs[index] as any)[field] = value; // Type assertion needed for dynamic field access
        setNewKeyResults(updatedKrs);
    };

    const getGoalStatusColor = (status: Goal['status']) => {
        switch (status) {
            case 'completed': return 'text-green-400';
            case 'cancelled': return 'text-neutral-400';
            case 'in-progress': return 'text-blue-400';
            case 'pending': return 'text-neutral-300';
            default: return 'text-neutral-300';
        }
    };

     const getKrStatusColor = (status: KeyResult['status']) => {
        switch (status) {
            case 'completed': return 'text-green-400';
            case 'at-risk': return 'text-red-400';
            case 'on-track': return 'text-blue-400';
            default: return 'text-neutral-300';
        }
    };


    const toggleExpandGoal = (goalId: string) => {
        setExpandedGoals(prevState => ({
            ...prevState,
            [goalId]: !prevState[goalId]
        }));
    };


   // Ensure user is logged in before rendering content
  if (!systemContext?.currentUser) {
       // This case should ideally be handled by ProtectedRoute, but as a fallback:
       return (
            <div className="container mx-auto p-4 flex justify-center">
               <div className="bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300">
                   <p>Please log in to view your goals.</p>
               </div>
            </div>
       );
  }


  return (
    <div className="container mx-auto p-4">
      <div className="bg-neutral-800/50 p-6 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-blue-400 mb-6">Goal Management (目標管理)</h2>
        <p className="text-neutral-300 mb-8">Define and track your personal goals (SMART or OKR). Link tasks to your key results.</p>

        {/* Form for creating new goals */}
        {!editingGoal && (
            <div className="mb-8 p-4 bg-neutral-700/50 rounded-lg">
                 <h3 className="text-xl font-semibold text-blue-300 mb-3">Create New Goal</h3>
                 <form onSubmit={handleCreateGoal}>
                    <div className="mb-4">
                        <label htmlFor="newGoalDescription" className="block text-neutral-300 text-sm font-semibold mb-2">Description:</label>
                        <input
                            id="newGoalDescription"
                            type="text"
                            className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newGoalDescription}
                            onChange={(e) => setNewGoalDescription(e.target.value)}
                            placeholder="Enter goal description (e.g., Become proficient in Rust)"
                            disabled={isCreatingGoal}
                            required
                        />
                    </div>
                     <div className="mb-4">
                        <label htmlFor="newGoalType" className="block text-neutral-300 text-sm font-semibold mb-2">Type:</label>
                        <select
                            id="newGoalType"
                            className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newGoalType}
                            onChange={(e) => setNewGoalType(e.target.value as 'smart' | 'okr')}
                            disabled={isCreatingGoal}
                        >
                            <option value="smart">SMART Goal</option>
                            <option value="okr">OKR (Objective & Key Results)</option>
                        </select>
                    </div>

                    {newGoalType === 'smart' && (
                        <div className="mb-4">
                            <label htmlFor="newGoalTargetDate" className="block text-neutral-300 text-sm font-semibold mb-2">Target Completion Date:</label>
                            <input
                                id="newGoalTargetDate"
                                type="date"
                                className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newGoalTargetDate}
                                onChange={(e) => setNewGoalTargetDate(e.target.value)}
                                disabled={isCreatingGoal}
                                required
                            />
                        </div>
                    )}

                    {newGoalType === 'okr' && (
                        <div className="mb-4 p-3 bg-neutral-600/50 rounded-md">
                            <h4 className="text-neutral-300 text-sm font-semibold mb-2">Key Results:</h4>
                            <ul className="space-y-3">
                                {newKeyResults.map((kr, index) => (
                                    <li key={index} className="p-3 bg-neutral-700/50 rounded-md border-l-2 border-blue-600">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-neutral-300">Key Result {index + 1}</span>
                                             <button
                                                type="button"
                                                onClick={() => handleRemoveKeyResult(index)}
                                                className="text-red-400 hover:text-red-600 transition disabled:opacity-50"
                                                disabled={isCreatingGoal}
                                             >
                                                 <MinusCircle size={18} />
                                             </button>
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor={`kr-desc-${index}`} className="block text-neutral-400 text-xs font-semibold mb-1">Description:</label>
                                            <input
                                                id={`kr-desc-${index}`}
                                                type="text"
                                                className="w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                                value={kr.description}
                                                onChange={(e) => handleKeyResultChange(index, 'description', e.target.value)}
                                                placeholder="e.g., Complete Rustlings exercises"
                                                disabled={isCreatingGoal}
                                                required
                                            />
                                        </div>
                                         <div className="grid grid-cols-3 gap-2">
                                             <div>
                                                <label htmlFor={`kr-target-${index}`} className="block text-neutral-400 text-xs font-semibold mb-1">Target Value:</label>
                                                <input
                                                    id={`kr-target-${index}`}
                                                    type="number"
                                                    step="0.1"
                                                    className="w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                                    value={kr.target_value}
                                                    onChange={(e) => handleKeyResultChange(index, 'target_value', parseFloat(e.target.value))}
                                                    disabled={isCreatingGoal}
                                                    required
                                                />
                                            </div>
                                             <div>
                                                <label htmlFor={`kr-unit-${index}`} className="block text-neutral-400 text-xs font-semibold mb-1">Unit:</label>
                                                <input
                                                    id={`kr-unit-${index}`}
                                                    type="text"
                                                    className="w-full p-1 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                                    value={kr.unit}
                                                    onChange={(e) => handleKeyResultChange(index, 'unit', e.target.value)}
                                                    placeholder="e.g., %"
                                                    disabled={isCreatingGoal}
                                                    required
                                                />
                                            </div>
                                             {/* Current Value and Status are managed by the system */}
                                         </div>
                                    </li>
                                ))}
                            </ul>
                             <button
                                type="button"
                                onClick={handleAddKeyResult}
                                className="mt-4 px-4 py-2 text-sm bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                                disabled={isCreatingGoal}
                            >
                                <PlusCircle size={16} className="inline-block mr-1"/> Add Key Result
                            </button>
                        </div>
                    )}


                    <button
                        type="submit"
                        className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isCreatingGoal || !newGoalDescription.trim() || (newGoalType === 'smart' && !newGoalTargetDate) || (newGoalType === 'okr' && newKeyResults.length === 0)}
                    >
                        {isCreatingGoal ? 'Creating...' : 'Create Goal'}
                    </button>
                     {error && isCreatingGoal === false && ( // Show create error only after it finishes
                         <p className="text-red-400 text-sm mt-4">Error: {error}</p>
                     )}
               </form>
            </div>
        )}

        {/* Form for editing a goal */}
        {editingGoal && (
             <div className="mb-8 p-4 bg-neutral-700/50 rounded-lg">
                 <h3 className="text-xl font-semibold text-blue-300 mb-3">Edit Goal: {editingGoal.description}</h3>
                 <form onSubmit={handleUpdateGoal}>
                    <div className="mb-4">
                        <label htmlFor="editingGoalDescription" className="block text-neutral-300 text-sm font-semibold mb-2">Description:</label>
                        <input
                            id="editingGoalDescription"
                            type="text"
                            className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={editingGoalDescription}
                            onChange={(e) => setEditingGoalDescription(e.target.value)}
                            placeholder="Edit goal description"
                            disabled={isSavingGoal}
                            required
                        />
                    </div>
                     {editingGoal.type === 'smart' && (
                        <div className="mb-4">
                            <label htmlFor="editingGoalTargetDate" className="block text-neutral-300 text-sm font-semibold mb-2">Target Completion Date:</label>
                            <input
                                id="editingGoalTargetDate"
                                type="date"
                                className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={editingGoalTargetDate}
                                onChange={(e) => setEditingGoalTargetDate(e.target.value)}
                                disabled={isSavingGoal}
                                required
                            />
                        </div>
                    )}
                    {/* TODO: Add UI for editing Key Results (complex: add/remove/update KRs) */}
                    {editingGoal.type === 'okr' && editingGoal.key_results && editingGoal.key_results.length > 0 && (
                         <div className="mb-4 p-3 bg-neutral-600/50 rounded-md">
                             <h4 className="text-neutral-300 text-sm font-semibold mb-2">Key Results (View Only in MVP Edit):</h4>
                             <ul className="space-y-2">
                                 {editingGoal.key_results.map((kr, index) => (
                                     <li key={kr.id} className="p-3 bg-neutral-700/50 rounded-md border-l-2 border-blue-600">
                                         <p className="text-sm font-medium text-neutral-300">KR {index + 1}: {kr.description}</p>
                                         <p className="text-neutral-400 text-xs">Progress: {kr.current_value} / {kr.target_value} {kr.unit} (<span className={getKrStatusColor(kr.status)}>{kr.status}</span>)</p>
                                         {/* TODO: Add UI to manually update KR progress */}
                                     </li>
                                 ))}
                             </ul>
                             <p className="text-neutral-400 text-xs mt-3">Editing Key Results is not yet supported in this UI.</p>
                         </div>
                    )}


                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSavingGoal || !editingGoalDescription.trim() || (editingGoal.type === 'smart' && !editingGoalTargetDate)}
                        >
                            {isSavingGoal ? 'Saving...' : 'Save Changes'}
                        </button>
                         <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition"
                            disabled={isSavingGoal}
                        >
                            Cancel
                        </button>
                    </div>
                     {error && isSavingGoal === false && ( // Show save error only after it finishes
                         <p className="text-red-400 text-sm mt-4">Error: {error}</p>
                     )}
               </form>
            </div>
        )}


        {/* Goals List */}
        <div className="p-4 bg-neutral-700/50 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-300 mb-3">Your Goals</h3>
            {goals.length === 0 ? (\
              <p className="text-neutral-400">No goals created yet. Create one using the form above.</p>\
            ) : (\
              <ul className="space-y-4">\
                {goals.map((goal) => (\
                  <li key={goal.id} className={`bg-neutral-600/50 p-4 rounded-md border-l-4 ${getGoalStatusColor(goal.status).replace('text-', 'border-')}`}>\
                    <div className="flex justify-between items-center">\
                        <h4 className={`font-semibold mb-1 ${getGoalStatusColor(goal.status)}`}>{goal.description} ({goal.type.toUpperCase()})</h4>\
                         <button onClick={() => toggleExpandGoal(goal.id)} className="text-neutral-400 hover:text-white transition">\
                            {expandedGoals[goal.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}\
                        </button>\
                    </div>\
                    <p className="text-neutral-300 text-sm">Status: <span className={getGoalStatusColor(goal.status)}>{goal.status}</span></p>\
                    {goal.type === 'smart' && goal.target_completion_date && (
                         <p className="text-neutral-300 text-sm">Target Date: {goal.target_completion_date}</p>
                    )}
                    <small className="text-neutral-400 text-xs block mt-1">Created: {new Date(goal.creation_timestamp).toLocaleString()}</small>\
\
                    {/* Key Results (Collapsible) */}\
                    {expandedGoals[goal.id] && goal.key_results && goal.key_results.length > 0 && (
                        <div className="mt-4 border-t border-neutral-600 pt-4">\
                            <h5 className="text-neutral-300 text-sm font-semibold mb-2">Key Results:</h5>\
                            <ul className="space-y-2">\
                                {goal.key_results.map((kr, index) => (\
                                    <li key={kr.id} className={`p-3 rounded-md border-l-2 ${getKrStatusColor(kr.status).replace('text-', 'border-')} bg-neutral-700/50`}>\
                                        <p className={`text-sm font-medium ${getKrStatusColor(kr.status)}`}>KR {index + 1}: {kr.description}</p>\
                                        <p className="text-neutral-400 text-xs">Progress: {kr.current_value} / {kr.target_value} {kr.unit} (<span className={getKrStatusColor(kr.status)}>{kr.status}</span>)</p>
                                         {/* TODO: Add UI to manually update KR progress */}
                                    </li>\
                                ))}\
                            </ul>\
                        </div>\
                    )}\
                     {expandedGoals[goal.id] && (!goal.key_results || goal.key_results.length === 0) && goal.type === 'okr' && (
                          <div className="mt-4 border-t border-neutral-600 pt-4">
                              <p className="text-neutral-400 text-sm">No Key Results defined for this OKR yet.</p>
                          </div>
                     )}


                    {/* Goal Actions */}\
                    <div className="mt-4 flex flex-wrap gap-2"> {/* Use flex-wrap for smaller screens */}\
                         {/* Edit Button */}\
                         <button\
                            className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"\
                            onClick={() => handleEditGoalClick(goal)}\\
                            disabled={!!editingGoal} // Disable while another goal is being edited\
                         >\\
                            <Edit size={16} className=\"inline-block mr-1\"/> Edit\\
                         </button>\\
                         {/* Delete Button */}\\
                         <button\\
                            className=\"px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"\\
                            onClick={() => handleDeleteGoal(goal.id)}\\
                            disabled={!!editingGoal} // Disable while editing\
                         >\\
                            <Trash2 size={16} className=\"inline-block mr-1\"/> Delete\\
                         </button>\\
                         {/* TODO: Add buttons for linking tasks, marking complete/cancelled, etc. */}\\
                    </div>\\
                  </li>\\
                ))}\\
              </ul>\\
            )}\\
        </div>\\
\\
      </div>\\
    </div>\\
  );\\
};\\
\\
export default Goals;\\
",
      "isBinary": false,
      "fullPath": "src/pages/Goals.tsx",
      "lastModified": 1750140234889
    },

  <bindAction type="file" filePath="src/App.tsx">
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import KnowledgeBase from './pages/KnowledgeBase';
import Scripts from './pages/Scripts';
import Agents from './pages/Agents';
import Tasks from './pages/Tasks';
import Keyboard from './pages/Keyboard';
import Analytics from './pages/Analytics'; // Import Analytics page
import Goals from './pages/Goals'; // Import Goals page
import Auth from './pages/Auth'; // Import Auth page
import './App.css';
import { SystemContext, Notification } from './interfaces'; // Import SystemContext and Notification
import { XCircle } from 'lucide-react'; // Import icon for notifications


// Access systemContext from the global window object (for MVP simplicity)
declare const window: any;
const systemContext: SystemContext = window.systemContext;


// ProtectedRoute component to check authentication
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  // Use a state variable to track auth status and trigger re-renders
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null); // Use null for initial loading state

  React.useEffect(() => {
    if (!systemContext?.securityService) {
        console.error("SecurityService not initialized in ProtectedRoute.");
        setIsAuthenticated(false); // Assume not authenticated if service isn't ready
        return;
    }

    // Subscribe to auth state changes
    const unsubscribe = systemContext.securityService.onAuthStateChange((user: any) => {
      setIsAuthenticated(user !== null);
    });

    // Check initial auth state immediately
    setIsAuthenticated(systemContext.currentUser !== null);


    // Cleanup subscription
    return () => {
      unsubscribe?.();
    };
  }, [systemContext?.securityService]); // Re-run effect only if systemContext or SecurityService changes


  if (isAuthenticated === null) {
    // Show a loading spinner while checking auth state
    return <div className="container mx-auto p-4 text-center text-neutral-400">Loading authentication state...</div>;
  }

  return isAuthenticated ? element : <Navigate to="/auth" replace />;
};


function App() {
  // Use a state variable to trigger re-render when currentUser changes
  const [currentUser, setCurrentUser] = React.useState(systemContext?.currentUser);
  const [isSystemContextInitialized, setIsSystemContextInitialized] = React.useState(!!systemContext);
  const [notifications, setNotifications] = useState<Notification[]>([]); // State for UI notifications


  React.useEffect(() => {
      if (!systemContext) {
          // System context is not ready yet
          return;
      }
      setIsSystemContextInitialized(true);

      if (!systemContext.securityService) {
          console.error("SecurityService not initialized in App.tsx");
          return;
      }
      // Subscribe to auth state changes to update the component's state
      const unsubscribeAuth = systemContext.securityService.onAuthStateChange((user: any) => {
          setCurrentUser(user);
      });

      // Initial check
      setCurrentUser(systemContext.currentUser);

      // Subscribe to UI notifications
      let unsubscribeNotifications: (() => void) | undefined;
      if (systemContext.notificationService) {
           unsubscribeNotifications = systemContext.notificationService.subscribeToUiNotifications((newNotifications: Notification[]) => {
               setNotifications(newNotifications);
           });
      }


      // Cleanup subscriptions
      return () => {
          unsubscribeAuth?.();
          unsubscribeNotifications?.();
      };
  }, [systemContext]); // Re-run effect when systemContext changes


  const handleLogout = async () => {
      if (systemContext?.securityService) {
          await systemContext.securityService.logout();
          // currentUser state will be updated by the listener
      }
  };

   const handleDismissNotification = async (notificationId: string) => {
       if (systemContext?.notificationService) {
           await systemContext.notificationService.markAsRead(notificationId);
           // Notification state will be updated by the listener
       }
   };


  // Show a loading state while the system context is being initialized
  if (!isSystemContextInitialized) {
      return <div className="container mx-auto p-4 text-center text-neutral-400">Initializing system...</div>;
  }


  return (
    <Router>
      <div className="App bg-neutral-900 text-white min-h-screen"> {/* Apply dark background */}
        {/* Conditional Navigation Bar */}
        {currentUser && (
            <nav className="App-nav bg-neutral-800 shadow-lg"> {/* Apply dark theme styles */}
              <ul className="flex justify-center p-4 space-x-6"> {/* Use flex and space-x for layout */}
                <li><Link to="/" className="text-blue-300 hover:text-blue-100 transition">Dashboard</Link></li>
                <li><Link to="/knowledge" className="text-blue-300 hover:text-blue-100 transition">Knowledge Base</Link></li>
                <li><Link to="/scripts" className="text-blue-300 hover:text-blue-100 transition">Scripts</Link></li>
                <li><Link to="/agents" className="text-blue-300 hover:text-blue-100 transition">Agents</Link></li>
                <li><Link to="/tasks" className="text-blue-300 hover:text-blue-100 transition">Tasks</Link></li>
                <li><Link to="/goals" className="text-blue-300 hover:text-blue-100 transition">Goals</Link></li> {/* Added Goals Link */}
                <li><Link to="/analytics" className="text-blue-300 hover:text-blue-100 transition">Analytics</Link></li> {/* Added Analytics Link */}
                <li><Link to="/keyboard" className="text-blue-300 hover:text-blue-100 transition">Keyboard UI</Link></li>
                {/* Add more links as needed */}
              </ul>
              <div className="flex justify-end px-4 py-2 text-sm text-neutral-400">
                  <span>Logged in as: {currentUser.email}</span>
                  <button onClick={handleLogout} className="ml-4 text-red-400 hover:text-red-200 transition">Logout</button>
              </div>
            </nav>
        )}

        {/* Notification Display Area */}
        {notifications.length > 0 && currentUser && (
            <div className="fixed top-4 right-4 z-50 w-80 space-y-3">
                {notifications.map(notification => (
                    <div
                        key={notification.id}
                        className={`p-4 rounded-md shadow-lg text-sm flex items-start justify-between gap-4
                            ${notification.type === 'success' ? 'bg-green-800/90 border border-green-600 text-green-100'
                            : notification.type === 'error' ? 'bg-red-800/90 border border-red-600 text-red-100'
                            : notification.type === 'warning' ? 'bg-yellow-800/90 border border-yellow-600 text-yellow-100'
                            : 'bg-blue-800/90 border border-blue-600 text-blue-100'}
                        `}
                    >
                        <div className="flex-1">
                            <p className="font-semibold">{notification.type.toUpperCase()} Notification</p>
                            <p>{notification.message}</p>
                            {/* TODO: Display details or action links if available */}
                        </div>
                        <button
                            onClick={() => handleDismissNotification(notification.id)}
                            className="text-current opacity-70 hover:opacity-100 transition"
                        >
                            <XCircle size={18} />
                        </button>
                    </div>
                ))}\
            </div>\
        )}\
\
\
        <main className=\"App-main p-4\"> {/* Apply padding */}\
          <Routes>\
            {/* Public Route */}\
            <Route path=\"/auth\" element={<Auth />} />\
\
            {/* Protected Routes */}\
            <Route path=\"/\" element={<ProtectedRoute element={<Dashboard />} />} />\
            <Route path=\"/knowledge\" element={<ProtectedRoute element={<KnowledgeBase />} />} />\
            <Route path=\"/scripts\" element={<ProtectedRoute element={<Scripts />} />} />\
            <Route path=\"/agents\" element={<ProtectedRoute element={<Agents />} />} />\
            <Route path=\"/tasks\" element={<ProtectedRoute element={<Tasks />} />} />\
            <Route path=\"/goals\" element={<ProtectedRoute element={<Goals />} />} /> {/* Added Goals Route */}\
            <Route path=\"/analytics\" element={<ProtectedRoute element={<Analytics />} />} /> {/* Added Analytics Route */}\
            <Route path=\"/keyboard\" element={<ProtectedRoute element={<Keyboard />} />} />\
            {/* Add more protected routes as needed */}\
\
            {/* Redirect any other path to dashboard if logged in, or auth if not */}\
            {/* This catch-all should come last */}\
             <Route\
                path=\"*\"\
                element={currentUser ? <Navigate to=\"/\" replace /> : <Navigate to=\"/auth\" replace />}\
            />\
          </Routes>\
        </main>\
      </div>\
    </Router>\
  );\
}\
\nexport default App;\
",
      "isBinary": false,
      "fullPath": "src/App.tsx",
      "lastModified": 1750140236689
    },

  <bindAction type="file" filePath="src/modules/sync/SyncService.ts">
import { SystemContext, KnowledgeRecord, ForgedAbility, Task, Rune, Goal, UserAction, SystemEvent, CloudSyncConfig, ScriptingAppWorkflow, MobileGitSyncConfig } from '../../interfaces';
import { SupabaseClient } from '@supabase/supabase-js';
// import { EventBus } from '../events/EventBus'; // Dependency for events
// import { LoggingService } from '../core/logging/LoggingService'; // Dependency
// import { mergeCRDT } from '../core/memory/crdt-sync'; // Dependency for merging logic (if using CRDT)

// Define types for tracking sync status
type SyncStatus = 'idle' | 'syncing' | 'error';
type DataType = keyof SystemContext; // Use keyof SystemContext to represent data types managed by services

export class SyncService {
    private context: SystemContext;
    private supabase: SupabaseClient;
    // private eventBus: EventBus; // Access via context
    // private loggingService: LoggingService; // Access via context

    // State for tracking sync status per data type
    private syncStatus: Map<DataType | 'system', SyncStatus> = new Map(); // Added 'system' for overall status
    private lastSyncTimestamps: Map<DataType | 'system', number> = new Map(); // Timestamp of last successful sync

    constructor(context: SystemContext) {
        this.context = context;
        this.supabase = context.apiProxy.supabaseClient;
        // this.eventBus = context.eventBus;
        // this.loggingService = context.loggingService;
        console.log('SyncService initialized.');

        // Initialize sync status for relevant data types and overall system
        const relevantDataTypes: (DataType | 'system')[] = [
            'system', // Overall system sync status
            'memoryEngine', // Knowledge Records
            'authorityForgingEngine', // User Actions, Abilities
            'selfNavigationEngine', // Tasks, Task Steps
            'runeEngraftingCenter', // Runes
            'goalManagementService', // Goals, Key Results
            'notificationService', // Notifications
            'analyticsService', // Analytics data (might be derived, sync might push local analytics)
        ];
        relevantDataTypes.forEach(type => {
            this.syncStatus.set(type, 'idle');
            // Load last sync timestamp from persistence if available (TODO)
            this.lastSyncTimestamps.set(type, Date.now() - Math.floor(Math.random() * 600000) - 60000); // Simulate random last sync time within last 11 mins
        });


        // TODO: Set up listeners for data changes in core modules (e.g., MemoryEngine, AuthorityForgingEngine)
        // When data changes locally, mark it as needing sync and potentially trigger an outgoing sync.
        // Example: this.context.eventBus.subscribe('knowledge_record_updated', (payload) => this.handleLocalDataChange('memoryEngine', payload));

        // TODO: Set up listeners for incoming changes from external sources (e.g., Supabase Realtime, webhooks, dedicated sync channels)
        // When data changes remotely, receive it, merge it, and update local state.
        // Example: this.context.memoryEngine.subscribeToKnowledgeUpdates((record, type) => this.handleRemoteDataChange('memoryEngine', record, type));

        // TODO: Implement periodic sync triggers or event-based triggers based on CloudSyncConfig.
    }

    /**
     * Public method to trigger synchronization for a specific data type from UI/other modules.
     * @param dataType The type of data to sync. Required.
     * @param userId The user ID. Required.
     * @param direction Optional: 'up', 'down', or 'bidirectional' (default).
     * @returns Promise<void>
     */
    async triggerDataTypeSync(dataType: DataType, userId: string, direction: 'up' | 'down' | 'bidirectional' = 'bidirectional'): Promise<void> {
        console.log(`[SyncService] Triggering sync for ${dataType} for user: ${userId}...`);
        this.context.loggingService?.logInfo(`Triggering sync for ${dataType}`, { dataType, userId, direction });

        if (!userId) {
             console.error('[SyncService] Cannot trigger sync: User ID is required.');
             this.context.loggingService?.logError('Cannot trigger sync: User ID is required.');
             throw new Error('User ID is required to trigger sync.');
        }

        // Prevent triggering sync if already syncing this type
        if (this.syncStatus.get(dataType) === 'syncing') {
            console.warn(`[SyncService] Sync for ${dataType} is already in progress.`);
            this.context.loggingService?.logWarning(`Sync for ${dataType} already in progress.`, { dataType, userId });
            return;
        }

        // Use a separate async function to perform the sync logic
        // This allows the trigger method to return immediately while sync runs in the background
        this.syncDataType(dataType, userId, direction).catch(error => {
            console.error(`[SyncService] Sync process failed for ${dataType}:`, error);
            // Error is already handled and event published within syncDataType
        });
    }


    /**
     * Orchestrates the synchronization process for a specific data type for a user.
     * This is a core method of the Bidirectional Sync Domain.
     * @param dataType The type of data to sync ('memoryEngine', 'authorityForgingEngine', etc.). Required.
     * @param userId The user ID whose data to sync. Required.
     * @param direction Optional: 'up' (local to remote), 'down' (remote to local), or 'bidirectional' (default).
     * @returns Promise<void>
     */
    private async syncDataType(dataType: DataType, userId: string, direction: 'up' | 'down' | 'bidirectional' = 'bidirectional'): Promise<void> {
        console.log(`[SyncService] Performing ${direction} sync for ${dataType} for user: ${userId}...`);
        this.context.loggingService?.logInfo(`Performing sync for ${dataType}`, { dataType, userId, direction });

        // Update sync status
        this.syncStatus.set(dataType, 'syncing');
        // Notify UI listeners about status change
        this.context.eventBus?.publish('sync_started', { dataType, userId }, userId);


        try {
            // --- Simulate Sync Logic for Different Data Types ---
            // In a real implementation, this would involve fetching data from local storage/memory,
            // comparing with remote data (from Supabase), merging, and pushing changes.

            let simulatedFetchCount = 0;
            let simulatedPushCount = 0;
            let simulatedError = false;
            let simulatedSteps: string[] = [];

            switch (dataType) {
                case 'memoryEngine':
                    simulatedSteps = ['Fetching KB data...', 'Processing local changes...', 'Merging changes...', 'Pushing updates...', 'Indexing...'];
                    break;
                case 'authorityForgingEngine':
                    simulatedSteps = ['Fetching Abilities...', 'Analyzing local actions...', 'Identifying patterns...', 'Suggesting new Abilities...'];
                    break;
                case 'selfNavigationEngine':
                    simulatedSteps = ['Fetching Tasks...', 'Updating task statuses...', 'Processing task history...'];
                    break;
                case 'runeEngraftingCenter':
                    simulatedSteps = ['Fetching Runes...', 'Checking for updates...', 'Applying configurations...'];
                    break;
                case 'goalManagementService':
                    simulatedSteps = ['Fetching Goals...', 'Updating progress...', 'Checking deadlines...'];
                    break;
                case 'notificationService':
                    simulatedSteps = ['Fetching Notifications...', 'Marking as read...', 'Archiving old notifications...'];
                    break;
                case 'analyticsService':
                    simulatedSteps = ['Fetching User Actions...', 'Calculating metrics...', 'Generating reports...'];
                    break;
                default:
                    simulatedSteps = ['Syncing data...'];
            }


            for (const step of simulatedSteps) {
                 this.context.eventBus?.publish('sync_status_update', { dataType, userId, status: 'syncing', step }, userId);
                 await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100)); // Simulate step time
                 if (Math.random() < 0.02) { // 2% chance of error on any step
                     simulatedError = true;
                     throw new Error(`Simulated error during step: "${step}"`);
                 }
            }


            await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200)); // Simulate final processing time


            if (simulatedError) {
                 throw new Error(`Simulated sync error during ${direction} sync for ${dataType}.`);
            }


            console.log(`[SyncService] Simulated ${direction} sync completed for ${dataType} for user: ${userId}.`);
            this.context.loggingService?.logInfo(`Simulated sync completed for ${dataType}`, { dataType, userId, direction });

            // Update sync status and timestamp on success
            this.syncStatus.set(dataType, 'idle');
            this.lastSyncTimestamps.set(dataType, Date.now());
            // TODO: Persist last sync timestamp (Supports Bidirectional Sync Domain)
            // Notify UI listeners about status/timestamp change
            this.context.eventBus?.publish('sync_completed', { dataType, userId }, userId);
            this.context.eventBus?.publish('sync_status_update', { dataType, userId, status: 'idle', step: 'Completed successfully.' }, userId);


        } catch (error: any) {
            console.error(`[SyncService] Error during sync for ${dataType}:`, error.message);
            this.context.loggingService?.logError(`Error during sync for ${dataType}`, { dataType, userId, error: error.message });

            // Update sync status on error
            this.syncStatus.set(dataType, 'error');
            // Notify UI listeners about status change
            this.context.eventBus?.publish('sync_error', { dataType, userId, error: error.message }, userId);
            this.context.eventBus?.publish('sync_status_update', { dataType, userId, status: 'error', step: `Failed: ${error.message}` }, userId);


            throw error; // Re-throw the error
        }
    }

    /**
     * Helper to get the Supabase table name for a given data type.
     * @param dataType The data type.
     * @returns The corresponding Supabase table name.
     */
    private getSupabaseTableName(dataType: DataType): string {
        switch (dataType) {
            case 'memoryEngine': return 'knowledge_records';
            case 'authorityForgingEngine': return 'abilities'; // Assuming abilities table for simplicity
            case 'selfNavigationEngine': return 'tasks'; // Assuming tasks table
            case 'runeEngraftingCenter': return 'runes';
            case 'goalManagementService': return 'goals'; // Assuming goals table
            case 'notificationService': return 'notifications';
            case 'analyticsService': return 'user_actions'; // Using user_actions as a proxy for analytics data source
            default: return ''; // Should not happen for defined types
        }
    }


    /**
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
        const dataTypesToSync: DataType[] = [
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

        let overallStatus: SyncStatus = 'idle';
        this.syncStatus.set('system', 'syncing'); // Indicate overall system sync is happening
        // Notify UI listeners about overall status change
        this.context.eventBus?.publish('sync_started', { dataType: 'system', userId }, userId);
        this.context.eventBus?.publish('sync_status_update', { dataType: 'system', userId, status: 'syncing', step: 'Starting full sync...' }, userId);


        try {
            for (const dataType of dataTypesToSync) {
                try {
                    // Call syncDataType for each type
                    // We await each one to simulate sequential sync, but they could be parallelized
                    await this.syncDataType(dataType, userId, 'bidirectional');
                } catch (error: any) {
                    console.error(`[SyncService] Error during sync for ${dataType}:`, error.message);
                    this.context.loggingService?.logError(`Error during sync for ${dataType}`, { dataType, userId, error: error.message });
                    // If any data type fails, the overall sync is an error
                    overallStatus = 'error';
                    // Decide if a single sync failure should stop the whole process
                    // For now, continue with other types but log the error.
                }
            }

            if (overallStatus !== 'error') {
                 overallStatus = 'idle'; // If no individual errors, overall is idle/successful
                 console.log(`[SyncService] Full sync completed for user: ${userId}.`);
                 this.context.loggingService?.logInfo(`Full sync completed for user ${userId}`, { userId });
                 // Publish a 'full_sync_completed' event
                 this.context.eventBus?.publish('full_sync_completed', { userId }, userId);
                 this.context.eventBus?.publish('sync_completed', { dataType: 'system', userId }, userId); // Also publish system completed
                 this.context.eventBus?.publish('sync_status_update', { dataType: 'system', userId, status: 'idle', step: 'Full sync completed successfully.' }, userId);

            } else {
                 console.error(`[SyncService] Full sync completed with errors for user: ${userId}.`);
                 this.context.loggingService?.logError(`Full sync completed with errors for user ${userId}`, { userId });
                 // Publish a 'full_sync_error' event
                 this.context.eventBus?.publish('full_sync_error', { userId }, userId);
                 this.context.eventBus?.publish('sync_error', { dataType: 'system', userId, error: 'Full sync completed with errors.' }, userId); // Also publish system error
                 this.context.eventBus?.publish('sync_status_update', { dataType: 'system', userId, status: 'error', step: 'Full sync completed with errors.' }, userId);
            }


        } catch (error: any) {
             console.error(`[SyncService] Unexpected error during full sync for user ${userId}:`, error.message);
             this.context.loggingService?.logError(`Unexpected error during full sync for user ${userId}`, { userId, error: error.message });
             overallStatus = 'error';
             // Publish a 'full_sync_error' event
             this.context.eventBus?.publish('full_sync_error', { userId }, userId);
             this.context.eventBus?.publish('sync_error', { dataType: 'system', userId, error: `Unexpected error: ${error.message}` }, userId); // Also publish system error
             this.context.eventBus?.publish('sync_status_update', { dataType: 'system', userId, status: 'error', step: `Unexpected error: ${error.message}` }, userId);

             throw error; // Re-throw the error
        } finally {
             this.syncStatus.set('system', overallStatus); // Update overall system sync status
             this.lastSyncTimestamps.set('system', Date.now()); // Update overall timestamp
             // Notify UI listeners about overall status/timestamp change
             // These events are already published above, but ensure timestamp is set
        }
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
    async handleRemoteDataChange(dataType: DataType, record: any, changeType: 'INSERT' | 'UPDATE' | 'DELETE', userId: string): Promise<void> {
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

        // Publish a generic 'data_changed' event or specific events (e.g., 'knowledge_record_realtime_updated')
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
    async handleLocalDataChange(dataType: DataType, payload: any, userId: string): Promise<void> {
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
     * @param dataType Optional: The specific data type. If omitted, returns overall system status.
     * @returns 'idle' | 'syncing' | 'error' | 'unknown'
     */
    getSyncStatus(dataType?: DataType | 'system'): SyncStatus | 'unknown' {
        // Return the actual status from the map
        return this.syncStatus.get(dataType || 'system') || 'unknown';
    }

    /**
     * Retrieves the timestamp of the last successful sync for a data type.
     * @param dataType The data type.
     * @returns number | undefined Unix timestamp or undefined if never synced.
     */
    getLastSyncTimestamp(dataType: DataType | 'system'): number | undefined {
        // Return the actual timestamp from the map
        return this.lastSyncTimestamps.get(dataType);
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
        console.log(`[SyncService] Simulating syncing Scripting.app workflow \\\"${workflow.name}\\\" for user ${userId}...`);
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

        // --- Enhanced Simulation Steps ---
        let simulatedResult: any = { status: 'simulated_success', message: `Simulated mobile Git ${direction} completed.` };
        const repoUrl = params?.repoUrl || 'N/A';
        const commitMessage = params?.commitMessage || 'Automated commit from Jun.Ai.Key';

        // Simulate sync status update for UI
        this.context.eventBus?.publish('mobile_git_sync_status', { userId, status: 'syncing', direction, step: 'Starting...' }, userId);

        try {
            // Simulate checking status first
            console.log(`[SyncService] Simulating Git Status for ${repoUrl}...`);
            this.context.loggingService?.logInfo(`Simulating Git Status for ${repoUrl}`, { userId, repoUrl });
            this.context.eventBus?.publish('mobile_git_sync_status', { userId, status: 'syncing', direction, step: 'Checking status...' }, userId);
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate status time
            console.log(`[SyncService] Simulated Git Status complete.`);
            this.context.loggingService?.logInfo(`Simulated Git Status complete.`, { userId, repoUrl });
            // Simulate status output
            const statusOutput = 'Simulated git status: Working tree clean'; // Or 'Changes not staged for commit', etc.
            simulatedResult.status_output = statusOutput;

            // Simulate potential failure during status check
            if (Math.random() < 0.05) { // 5% chance of failure
                 throw new Error('Simulated network error during status check.');
            }


            if (direction === 'pull' || direction === 'bidirectional') {
                console.log(`[SyncService] Simulating Git Pull for ${repoUrl}...`);
                this.context.loggingService?.logInfo(`Simulating Git Pull for ${repoUrl}`, { userId, repoUrl });
                this.context.eventBus?.publish('mobile_git_sync_status', { userId, status: 'syncing', direction, step: 'Pulling changes...' }, userId);
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate pull time
                console.log(`[SyncService] Simulated Git Pull complete.`);
                this.context.loggingService?.logInfo(`Simulated Git Pull complete.`, { userId, repoUrl });

                // Simulate potential failure during pull
                if (Math.random() < 0.1) { // 10% chance of failure
                     throw new Error('Simulated merge conflict during pull.');
                }

                // Record pull log
                 this.context.knowledgeSync?.saveKnowledge(
                    `Mobile Git Pull: ${repoUrl}`, // Question/Summary
                    `Simulated mobile Git pull completed successfully for user ${userId}.`, // Answer/Details
                    userId,
                    { type: 'sync', repo_url: repoUrl, sync_direction: 'pull', change_summary: 'Simulated pull completed.' }
                ).catch(err => console.error('Failed to save dev log for git pull:', err));
            }

            if (direction === 'push' || direction === 'bidirectional') {
                 // Simulate commit before push if commitMessage is provided
                 if (commitMessage) { // Always simulate commit before push in this simulation
                     console.log(`[SyncService] Simulating Git Commit with message: \\\"${commitMessage}\\\" for ${repoUrl}...`);
                     this.context.loggingService?.logInfo(`Simulating Git Commit for ${repoUrl}`, { userId, repoUrl, commitMessage });
                     this.context.eventBus?.publish('mobile_git_sync_status', { userId, status: 'syncing', direction, step: 'Committing changes...' }, userId);
                     await new Promise(resolve => setTimeout(resolve, 500)); // Simulate commit time
                     console.log(`[SyncService] Simulated Git Commit complete.`);
                     this.context.loggingService?.logInfo(`Simulated Git Commit complete.`, { userId, repoUrl });

                     // Simulate potential failure during commit
                     if (Math.random() < 0.05) { // 5% chance of failure
                          throw new Error('Simulated commit failed due to invalid changes.');
                     }

                     // Record commit log
                      this.context.knowledgeSync?.saveKnowledge(
                         `Mobile Git Commit: ${repoUrl}`, // Question/Summary
                         `Simulated mobile Git commit completed successfully for user ${userId}. Message: \\\"${commitMessage}\\\".`, // Answer/Details
                         userId,
                         { type: 'commit', repo_url: repoUrl, commit_message: commitMessage }
                     ).catch(err => console.error('Failed to save dev log for git commit:', err));
                 }


                console.log(`[SyncService] Simulating Git Push for ${repoUrl}...`);
                this.context.loggingService?.logInfo(`Simulating Git Push for ${repoUrl}`, { userId, repoUrl });
                this.context.eventBus?.publish('mobile_git_sync_status', { userId, status: 'syncing', direction, step: 'Pushing changes...' }, userId);
                await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate push time
                console.log(`[SyncService] Simulated Git Push complete.`);
                this.context.loggingService?.logInfo(`Simulated Git Push complete.`, { userId, repoUrl });

                 // Simulate potential failure during push
                 if (Math.random() < 0.1) { // 10% chance of failure
                      throw new Error('Simulated authentication error during push.');
                 }

                 // Record push log
                 this.context.knowledgeSync?.saveKnowledge(
                    `Mobile Git Push: ${repoUrl}`, // Question/Summary
                    `Simulated mobile Git push completed successfully for user ${userId}.`, // Answer/Details
                    userId,
                    { type: 'sync', repo_url: repoUrl, sync_direction: 'push', change_summary: 'Simulated push completed.' }
                ).catch(err => console.error('Failed to save dev log for git push:', err));
            }

            // Update final simulated result message
            simulatedResult.message = `Simulated mobile Git ${direction} completed successfully for ${repoUrl}.`;
            this.context.eventBus?.publish('mobile_git_sync_status', { userId, status: 'idle', direction, step: 'Completed successfully.' }, userId);


        } catch (error: any) {
            console.error(`[SyncService] Error during simulated mobile Git sync (${direction}):`, error.message);
            this.context.loggingService?.logError(`Error during simulated mobile Git sync (${direction})`, { direction, userId, error: error.message });
            simulatedResult = { status: 'simulated_error', message: `Simulated mobile Git ${direction} failed: ${error.message}` };

             // Record failure log
             this.context.knowledgeSync?.saveKnowledge(
                `Mobile Git Sync Failed: ${direction} for repo ${repoUrl}`, // Question/Summary
                `Simulated mobile Git sync (${direction}) failed for user ${userId}. Error: ${error.message}.`, // Answer/Details
                userId,
                { type: 'sync', repo_url: repoUrl, sync_direction: direction, change_summary: `Failed: ${error.message}` }
            ).catch(err => console.error('Failed to save dev log for git sync failure:', err));

            this.context.eventBus?.publish('mobile_git_sync_status', { userId, status: 'error', direction, step: `Failed: ${error.message}` }, userId);

            throw error; // Re-throw the error
        }


        console.log(`[SyncService] Simulated mobile Git sync (${direction}) completed for user ${userId}. Result:`, simulatedResult);
        this.context.loggingService?.logInfo(`Simulated mobile Git sync (${direction}) completed.`, { direction, userId, result: simulatedResult });


        // TODO: Publish a 'mobile_git_synced' event (Supports Event Push - call context.eventBus.publish)
        this.context.eventBus?.publish('mobile_git_synced', { userId, direction, result: simulatedResult }, userId);

        return simulatedResult;
    }


    // TODO: Implement methods for configuring sync settings (e.g., sync frequency, wifi only, specific data types). (Uses CloudSyncConfig interface)
    // TODO: Integrate with SecurityService for permission checks on sync operations.
    // TODO: Integrate with external sync services or protocols (e.g., WebSockets, MQTT, custom APIs).
    // TODO: This module is the central orchestrator for the Bidirectional Sync Domain (雙向同步領域).
    // TODO: Add methods to subscribe to sync status changes for UI updates.
}

// Example Usage (called by EvolutionEngine, UI, CLI, or background processes):
// const syncService = new SyncService(systemContext);
// syncService.syncAllData('user-sim-123');
// syncService.triggerDataTypeSync('tasks', 'user-sim-123', 'down'); // Use the new public method
// const status = syncService.getSyncStatus('memoryEngine');
// const lastSync = syncService.getLastSyncTimestamp('abilities');
// // Example of handling a local change (would be called by MemoryEngine after saving)
// // syncService.handleLocalDataChange('memoryEngine', { id: 'new-kb-1', ... }, 'user-sim-123');
// // Example of handling a remote change (would be called by MemoryEngine's realtime listener)
// // syncService.handleRemoteDataChange('memoryEngine', { id: 'remote-kb-1', ... }, 'UPDATE', 'user-sim-123');
// // Example of syncing a Scripting.app workflow
// // syncService.syncScriptingAppWorkflow({ id: 'wf-1', name: 'My Workflow', code: '...' }, 'user-sim-123');
// // Example of syncing a mobile Git repo
// // syncService.syncMobileGitRepo('user-sim-123', 'push', { repoUrl: 'github.com/user/repo' });