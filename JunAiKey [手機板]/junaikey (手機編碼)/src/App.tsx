import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import KnowledgeBase from './pages/KnowledgeBase';
import Scripts from './pages/Scripts';
import Agents from './pages/Agents';
import Tasks from './pages/Tasks';
import Keyboard from './pages/Keyboard';
import Analytics from './pages/Analytics'; // Import Analytics page
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
    const unsubscribe = systemContext.securityService.onAuthStateChange((user: any) => {\
      setIsAuthenticated(user !== null);\
    });\
\
    // Check initial auth state immediately\
    setIsAuthenticated(systemContext.currentUser !== null);\
\
\
    // Cleanup subscription\
    return () => {\
      unsubscribe?.();\
    };\
  }, [systemContext?.securityService]); // Re-run effect only if systemContext or SecurityService changes\
\
\
  if (isAuthenticated === null) {\
    // Show a loading spinner while checking auth state\
    return <div className="container mx-auto p-4 text-center text-neutral-400">Loading authentication state...</div>;\
  }\
\
  return isAuthenticated ? element : <Navigate to="/auth" replace />;\
};\
\
\
function App() {\
  // Use a state variable to trigger re-render when currentUser changes\
  const [currentUser, setCurrentUser] = React.useState(systemContext?.currentUser);\
  const [isSystemContextInitialized, setIsSystemContextInitialized] = React.useState(!!systemContext);\
  const [notifications, setNotifications] = useState<Notification[]>([]); // State for UI notifications\
\
\
  React.useEffect(() => {\
      if (!systemContext) {\
          // System context is not ready yet\
          return;\
      }\
      setIsSystemContextInitialized(true);\
\
      if (!systemContext.securityService) {\
          console.error("SecurityService not initialized in App.tsx");\
          return;\
      }\
      // Subscribe to auth state changes to update the component's state\
      const unsubscribeAuth = systemContext.securityService.onAuthStateChange((user: any) => {\
          setCurrentUser(user);\
      });\
\
      // Initial check\
      setCurrentUser(systemContext.currentUser);\
\
      // Subscribe to UI notifications\
      let unsubscribeNotifications: (() => void) | undefined;\
      if (systemContext.notificationService) {\
           unsubscribeNotifications = systemContext.notificationService.subscribeToUiNotifications((newNotifications: Notification[]) => {\
               setNotifications(newNotifications);\
           });\
      }\
\
\
      // Cleanup subscriptions\
      return () => {\
          unsubscribeAuth?.();\
          unsubscribeNotifications?.();\
      };\
  }, [systemContext]); // Re-run effect when systemContext changes\
\
\
  const handleLogout = async () => {\
      if (systemContext?.securityService) {\
          await systemContext.securityService.logout();\
          // currentUser state will be updated by the listener\
      }\
  };\
\
   const handleDismissNotification = async (notificationId: string) => {\
       if (systemContext?.notificationService) {\
           await systemContext.notificationService.markAsRead(notificationId);\
           // Notification state will be updated by the listener\
       }\
   };\
\
\
  // Show a loading state while the system context is being initialized\
  if (!isSystemContextInitialized) {\
      return <div className="container mx-auto p-4 text-center text-neutral-400">Initializing system...</div>;\
  }\
\
\
  return (\
    <Router>\
      <div className="App bg-neutral-900 text-white min-h-screen"> {/* Apply dark background */}\
        {/* Conditional Navigation Bar */}\
        {currentUser && (\
            <nav className="App-nav bg-neutral-800 shadow-lg"> {/* Apply dark theme styles */}\
              <ul className="flex justify-center p-4 space-x-6"> {/* Use flex and space-x for layout */}\
                <li><Link to="/" className="text-blue-300 hover:text-blue-100 transition">Dashboard</Link></li>\
                <li><Link to="/knowledge" className="text-blue-300 hover:text-blue-100 transition">Knowledge Base</Link></li>\
                <li><Link to="/scripts" className="text-blue-300 hover:text-blue-100 transition">Scripts</Link></li>\
                <li><Link to="/agents" className="text-blue-300 hover:text-blue-100 transition">Agents</Link></li>\
                <li><Link to="/tasks" className="text-blue-300 hover:text-blue-100 transition">Tasks</Link></li>\
                <li><Link to="/analytics" className="text-blue-300 hover:text-blue-100 transition">Analytics</Link></li> {/* Added Analytics Link */}\
                <li><Link to="/keyboard" className="text-blue-300 hover:text-blue-100 transition">Keyboard UI</Link></li>\
                {/* Add more links as needed */}\
              </ul>\
              <div className="flex justify-end px-4 py-2 text-sm text-neutral-400">\
                  <span>Logged in as: {currentUser.email}</span>\
                  <button onClick={handleLogout} className="ml-4 text-red-400 hover:text-red-200 transition">Logout</button>\
              </div>\
            </nav>\
        )}\
\
        {/* Notification Display Area */}\
        {notifications.length > 0 && currentUser && (\
            <div className="fixed top-4 right-4 z-50 w-80 space-y-3">\
                {notifications.map(notification => (\
                    <div\
                        key={notification.id}\
                        className={`p-4 rounded-md shadow-lg text-sm flex items-start justify-between gap-4\
                            ${notification.type === 'success' ? 'bg-green-800/90 border border-green-600 text-green-100'\
                            : notification.type === 'error' ? 'bg-red-800/90 border border-red-600 text-red-100'\
                            : notification.type === 'warning' ? 'bg-yellow-800/90 border border-yellow-600 text-yellow-100'\
                            : 'bg-blue-800/90 border border-blue-600 text-blue-100'}\
                        `}\
                    >\
                        <div className="flex-1">\
                            <p className="font-semibold">{notification.type.toUpperCase()} Notification</p>\
                            <p>{notification.message}</p>\
                            {/* TODO: Display details or action links if available */}\
                        </div>\
                        <button\
                            onClick={() => handleDismissNotification(notification.id)}\\
                            className="text-current opacity-70 hover:opacity-100 transition"\
                        >\
                            <XCircle size={18} />\
                        </button>\
                    </div>\
                ))}\
            </div>\
        )}\
\
\
        <main className="App-main p-4"> {/* Apply padding */}\
          <Routes>\
            {/* Public Route */}\
            <Route path="/auth" element={<Auth />} />\
\
            {/* Protected Routes */}\
            <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />\
            <Route path="/knowledge" element={<ProtectedRoute element={<KnowledgeBase />} />} />\
            <Route path="/scripts" element={<ProtectedRoute element={<Scripts />} />} />\
            <Route path="/agents" element={<ProtectedRoute element={<Agents />} />} />\
            <Route path="/tasks" element={<ProtectedRoute element={<Tasks />} />} />\
            <Route path="/analytics" element={<ProtectedRoute element={<Analytics />} />} /> {/* Added Analytics Route */}\
            <Route path="/keyboard" element={<ProtectedRoute element={<Keyboard />} />} />\
            {/* Add more protected routes as needed */}\
\
            {/* Redirect any other path to dashboard if logged in, or auth if not */}\
            {/* This catch-all should come last */}\
             <Route\
                path="*"\
                element={currentUser ? <Navigate to="/" replace /> : <Navigate to="/auth" replace />}\
            />\
          </Routes>\
        </main>\
      </div>\
    </Router>\
  );\
}\
\
export default App;\