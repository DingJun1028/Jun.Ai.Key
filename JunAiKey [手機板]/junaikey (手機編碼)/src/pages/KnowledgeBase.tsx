import React, { useEffect, useState } from 'react';
import { KnowledgeSync } from '../modules/knowledgeSync';
import { KnowledgeRecord } from '../interfaces';
import ReactMarkdown from 'react-markdown'; // For rendering markdown

// Access core modules from the global window object (for MVP simplicity)
// In a real app, use React Context or dependency injection
declare const window: any;
const knowledgeSync: KnowledgeSync = window.systemContext?.knowledgeSync; // Interacts with MemoryEngine (永久記憶)
const authorityForgingEngine: any = window.systemContext?.authorityForgingEngine; // Use any for simplicity (權能冶煉)
const systemContext: any = window.systemContext; // Access the full context for currentUser


const KnowledgeBase: React.FC = () => {
  const [knowledgeRecords, setKnowledgeRecords] = useState<KnowledgeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [editingRecord, setEditingRecord] = useState<KnowledgeRecord | null>(null);


  const fetchKnowledge = async (query = '') => {
     const userId = systemContext?.currentUser?.id;
     if (!knowledgeSync || !userId) {
        setError("KnowledgeSync module not initialized or user not logged in.");
        setLoading(false);
        return;
    }
    setLoading(true);
    setError(null);
    try {
      // Uses MemoryEngine via KnowledgeSync
      const records = query
        ? await knowledgeSync.searchKnowledge(query, userId) // Pass userId
        : await knowledgeSync.getAllKnowledgeForUser(userId); // Fetch all if no search term, pass userId
      setKnowledgeRecords(records);
    } catch (err: any) {
      console.error('Error fetching knowledge:', err);
      setError(`Failed to load knowledge records: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data when the component mounts or when the user changes
    if (systemContext?.currentUser?.id) {
        fetchKnowledge(); // Fetch all on initial load for the current user
    }

    // TODO: Subscribe to realtime updates (Part of 雙向同步領域)
    // const subscription = knowledgeSync?.subscribeToKnowledgeUpdates((record, type) => {
    //     console.log('KnowledgeBase received realtime update:', type, record);
    //     // Simple approach: refetch all data on any change
    //     fetchKnowledge(searchTerm); // Refetch with current search term
    //     // More complex: merge changes into existing state using CRDT logic
    // });

    // return () => {
    //     // Unsubscribe on component unmount
    //     // knowledgeSync?.unsubscribeFromKnowledgeUpdates(subscription);
    // };

  }, [searchTerm, systemContext?.currentUser?.id]); // Refetch when search term or user changes

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
     const userId = systemContext?.currentUser?.id;
     if (!userId) return; // Should be protected by route, but safety check

    // searchTerm state update already triggers fetch via useEffect
     // Simulate recording user action (Part of 六式奧義: 觀察)
    authorityForgingEngine?.recordAction({
        type: 'web:kb:search',
        details: { query: searchTerm },
        context: { platform: 'web', page: 'knowledge' },
        user_id: userId, // Associate action with user
    });
  };

  const handleSaveKnowledge = async (e: React.FormEvent) => {
      e.preventDefault();
       const userId = systemContext?.currentUser?.id;
       if (!knowledgeSync || !userId) {
            setError("KnowledgeSync module not initialized or user not logged in.");
            return;
        }
      if (!newQuestion.trim() || !newAnswer.trim()) {
          alert('Please enter both question and answer.');
          return;
      }

      setIsSaving(true);
      setError(null);
      try {
          // Uses MemoryEngine via KnowledgeSync
          const savedRecord = await knowledgeSync.saveKnowledge(newQuestion, newAnswer, userId); // Pass userId
          if (savedRecord) {
              console.log('New record saved:', savedRecord);
              setNewQuestion('');
              setNewAnswer('');
              // Refetch data to update the list
              fetchKnowledge(searchTerm); // Refetch with current search term
               // Simulate recording user action (Part of 六式奧義: 觀察)
                authorityForgingEngine?.recordAction({
                    type: 'web:kb:save',
                    details: { recordId: savedRecord.id, question: savedRecord.question },
                    context: { platform: 'web', page: 'knowledge' },
                    user_id: userId, // Associate action with user
                });
          } else {
               setError('Failed to save knowledge record.');
          }
      } catch (err: any) {
          console.error('Error saving knowledge:', err);
          setError(`Failed to save knowledge record: ${err.message}`);
      } finally {
          setIsSaving(false);
      }
  };

  const handleEditClick = (record: KnowledgeRecord) => {
      setEditingRecord(record);
      setNewQuestion(record.question);
      setNewAnswer(record.answer);
  };

  const handleUpdateKnowledge = async (e: React.FormEvent) => {
      e.preventDefault();
       const userId = systemContext?.currentUser?.id;
      if (!knowledgeSync || !editingRecord || !userId) return; // Safety checks

      if (!newQuestion.trim() || !newAnswer.trim()) {
          alert('Please enter both question and answer.');
          return;
      }

      setIsSaving(true);
      setError(null);
      try {
          // Uses MemoryEngine via KnowledgeSync
          const updatedRecord = await knowledgeSync.updateKnowledge(editingRecord.id, {
              question: newQuestion,
              answer: newAnswer,
          }, userId); // Pass userId
          if (updatedRecord) {
              console.log('Record updated:', updatedRecord);
              setEditingRecord(null);
              setNewQuestion('');
              setNewAnswer('');
              fetchKnowledge(searchTerm); // Refetch data
               // Simulate recording user action (Part of 六式奧義: 觀察)
                authorityForgingEngine?.recordAction({
                    type: 'web:kb:update',
                    details: { recordId: updatedRecord.id, question: updatedRecord.question },
                    context: { platform: 'web', page: 'knowledge' },
                    user_id: userId, // Associate action with user
                });
          } else {
              setError('Failed to update knowledge record.');
          }
      } catch (err: any) {
          console.error('Error updating knowledge:', err);
          setError(`Failed to update knowledge record: ${err.message}`);
      } finally {
          setIsSaving(false);
      }
  };

  const handleDeleteKnowledge = async (recordId: string) => {
       const userId = systemContext?.currentUser?.id;
      if (!knowledgeSync || !userId || !confirm(`Are you sure you want to delete record ${recordId}?`)) return; // Safety checks

      setError(null);
      try {
          // Uses MemoryEngine via KnowledgeSync
          const success = await knowledgeSync.deleteKnowledge(recordId, userId); // Pass userId
          if (success) {
              console.log('Record deleted:', recordId);
              fetchKnowledge(searchTerm); // Refetch data
               // Simulate recording user action (Part of 六式奧義: 觀察)
                authorityForgingEngine?.recordAction({
                    type: 'web:kb:delete',
                    details: { recordId: recordId },
                    context: { platform: 'web', page: 'knowledge' },
                    user_id: userId, // Associate action with user
                });
          } else {
              setError('Failed to delete knowledge record.');
          }
      } catch (err: any) {
          console.error('Error deleting knowledge:', err);
          setError(`Failed to delete knowledge record: ${err.message}`);
      }
  };

   // Ensure user is logged in before rendering content
  if (!systemContext?.currentUser) {
       // This case should ideally be handled by ProtectedRoute, but as a fallback:
       return (
            <div className="container mx-auto p-4 flex justify-center">
               <div className="bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300">
                   <p>Please log in to view your knowledge base.</p>
               </div>
            </div>
       );
  }


  return (
    <div className="container mx-auto p-4">
      <div className="bg-neutral-800/50 p-6 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-blue-400 mb-6">Knowledge Base (永久記憶)</h2>
        <p className="text-neutral-300 mb-8">Store, search, and manage your knowledge records. This is a core part of your OmniKey's memory.</p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8 p-4 bg-neutral-700/50 rounded-lg">
          <h3 className="text-xl font-semibold text-blue-300 mb-3">Search Knowledge</h3>
          <div className="flex gap-4">
            <input
              id="search"
              type="text"
              className="flex-grow p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search questions or answers..."
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Search
            </button>
             {searchTerm && (
                <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition"
                >
                    Clear
                </button>
             )}
          </div>
           {/* TODO: Add Semantic Search option (Part of 智慧沉澱秘術) */}
        </form>

        {/* Add/Edit Form */}
        <div className="mb-8 p-4 bg-neutral-700/50 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-300 mb-3">{editingRecord ? 'Edit Knowledge Record' : 'Add New Knowledge'}</h3>
             <form onSubmit={editingRecord ? handleUpdateKnowledge : handleSaveKnowledge}>
                <div className="mb-4">
                    <label htmlFor="question" className="block text-neutral-300 text-sm font-semibold mb-2">Question:</label>
                    <input
                        id="question"
                        type="text"
                        className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="Enter question"
                        disabled={isSaving}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="answer" className="block text-neutral-300 text-sm font-semibold mb-2">Answer:</label>
                     <textarea
                        id="answer"
                        className="w-full p-2 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                        placeholder="Enter answer (Markdown supported)"
                        rows={6}
                        disabled={isSaving}
                     />
                </div>
                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSaving || !newQuestion.trim() || !newAnswer.trim()}
                    >
                        {isSaving ? (editingRecord ? 'Updating...' : 'Saving...') : (editingRecord ? 'Update Knowledge' : 'Save Knowledge')}
                    </button>
                    {editingRecord && (
                        <button
                            type="button"
                            onClick={() => { setEditingRecord(null); setNewQuestion(''); setNewAnswer(''); }}
                            className="px-6 py-2 bg-neutral-600 text-white font-semibold rounded-md hover:bg-neutral-700 transition"
                            disabled={isSaving}
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>
           </form>
        </div>


        {/* Knowledge List */}
        <div className="p-4 bg-neutral-700/50 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-300 mb-3">
                {searchTerm ? `Search Results for \"${searchTerm}\"` : 'All Knowledge Records'}
            </h3>
            {loading ? (
              <p className="text-neutral-400">Loading knowledge records...</p>
            ) : error ? (
              <p className="text-red-400">Error: {error}</p>
            ) : knowledgeRecords.length === 0 ? (
              <p className="text-neutral-400">{searchTerm ? 'No records found matching your search.' : 'No records in the knowledge base yet.'}</p>
            ) : (
              <ul className="space-y-4">
                {knowledgeRecords.map((record) => (
                  <li key={record.id} className="bg-neutral-600/50 p-4 rounded-md border-l-4 border-blue-500">
                    <h4 className="font-semibold text-blue-200 mb-1">Q: {record.question}</h4>
                    <div className="text-neutral-300 text-sm prose prose-invert max-w-none"> {/* Use prose for markdown styling */}
                        <ReactMarkdown>{record.answer}</ReactMarkdown>
                    </div>
                    <small className="text-neutral-400 text-xs block mt-2">
                        ID: {record.id} | Created: {new Date(record.timestamp).toLocaleString()}
                         {record.source && ` | Source: ${record.source}`}
                         {record.dev_log_details && ` | Dev Log Type: ${record.dev_log_details.type}`}
                    </small>
                    <div className="mt-3 flex gap-2">
                        <button
                            className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
                            onClick={() => handleEditClick(record)}
                        >
                            Edit
                        </button>
                         <button
                            className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition"
                            onClick={() => handleDeleteKnowledge(record.id)}
                        >
                            Delete
                        </button>
                         {/* TODO: Add Copy button (Part of 六式奧義: 觀察 - record action) */}
                    </div>
                  </li>
                ))}
              </ul>
            )}
        </div>

      </div>
    </div>
  );
};

export default KnowledgeBase;