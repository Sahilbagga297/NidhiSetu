import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Camera, Mic, Users, Settings, Activity } from 'lucide-react';
import Dashboard from '../pages/Dashboard';
import FaceVerification from './FaceVerification';
import VoiceVerification from './VoiceVerification';
import LivenessDetection from './LivenessDetection';
import UsageTracking from './UsageTracking';
import SecuritySettings from './SecuritySettings';

function BiometricVerification() {
  const { user: authUser, setFaceVerificationStatus, faceVerified } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('face'); // Start with face verification tab
  const [user, setUser] = useState({
    id: authUser?.id || 'demo_user',
    name: authUser?.name || 'Demo User',
    verificationCount: 0,
    lastResetDate: new Date().toDateString()
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Update user with auth data
    if (authUser) {
      setUser(prevUser => ({
        ...prevUser,
        id: authUser.id,
        name: authUser.name
      }));
    }

    // Load user data and check for daily reset
    const savedUser = localStorage.getItem('biometric_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      const today = new Date().toDateString();

      if (userData.lastResetDate !== today) {
        // Reset daily count
        userData.verificationCount = 0;
        userData.lastResetDate = today;
      }

      setUser(prevUser => ({
        ...prevUser,
        verificationCount: userData.verificationCount,
        lastResetDate: userData.lastResetDate
      }));
    }
  }, [authUser]);

  useEffect(() => {
    // Save user data to localStorage
    localStorage.setItem('biometric_user', JSON.stringify(user));
  }, [user]);

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'face', label: 'Face Verification', icon: Camera },
    { id: 'voice', label: 'Voice Verification', icon: Mic },
    { id: 'liveness', label: 'Liveness Detection', icon: Shield },
    { id: 'usage', label: 'Usage Tracking', icon: Users },
    { id: 'settings', label: 'Security Settings', icon: Settings },
  ];

  // Handle face verification success
  const handleFaceVerificationSuccess = () => {
    setFaceVerificationStatus(true);
    // Don't navigate immediately, let user manually navigate to dashboard
    alert('Face verification successful! You can now access the dashboard.');
  };

  // Handle tab change with face verification check
  const handleTabChange = (tabId) => {
    if (tabId === 'dashboard' && !faceVerified) {
      alert('Please complete face verification first to access the dashboard.');
      return;
    }
    setActiveTab(tabId);
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'face':
        return (
          <FaceVerification
            user={user}
            setUser={setUser}
            onVerificationSuccess={handleFaceVerificationSuccess}
          />
        );
      case 'voice':
        return <VoiceVerification user={user} setUser={setUser} />;
      case 'liveness':
        return <LivenessDetection user={user} setUser={setUser} />;
      case 'usage':
        return <UsageTracking user={user} />;
      case 'settings':
        return <SecuritySettings user={user} setUser={setUser} />;
      default:
        return <Dashboard user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 p-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-white">BiometricAuth</h1>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-white p-2 rounded-lg hover:bg-slate-700/50"
        >
          {isSidebarOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-800/95 backdrop-blur-xl border-r border-slate-700/50 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:bg-slate-800/50
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 hidden md:block">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">BiometricAuth</h1>
              <p className="text-sm text-slate-400">Advanced Security</p>
            </div>
          </div>
        </div>

        <nav className="px-4 space-y-2 mt-4 md:mt-0">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isDisabled = item.id === 'dashboard' && !faceVerified;
            return (
              <button
                key={item.id}
                onClick={() => {
                  handleTabChange(item.id);
                  setIsSidebarOpen(false); // Close sidebar on mobile when item clicked
                }}
                disabled={isDisabled}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isDisabled
                  ? 'text-slate-500 cursor-not-allowed opacity-50'
                  : activeTab === item.id
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {isDisabled && (
                  <span className="text-xs text-slate-500 ml-auto">🔒</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 w-64 p-4 border-t border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <p className="text-white font-medium">{user.name}</p>
              <p className="text-sm text-slate-400">
                {user.verificationCount}/5 verifications today
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto h-[calc(100vh-64px)] md:h-screen">
        {renderActiveComponent()}
      </div>
    </div>
  );
}

export default BiometricVerification;
