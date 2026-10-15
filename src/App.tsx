/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, TabType } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { LandingScreen } from './components/LandingScreen';
import { AuthModal } from './components/AuthModal';
import { OnboardingFlow } from './components/OnboardingFlow';
import { Dashboard } from './components/Dashboard';
import { CaptureModal } from './components/CaptureModal';
import { DailyCheckInModal } from './components/DailyCheckInModal';
import { HistoryView } from './components/HistoryView';
import { InsightsView } from './components/InsightsView';
import { TimelineView } from './components/TimelineView';
import { FoodPersonalizationView } from './components/FoodPersonalizationView';
import { HealthProfileView } from './components/HealthProfileView';
import { VitaAssistantModal } from './components/VitaAssistantModal';
import { EmergencyModal } from './components/EmergencyModal';
import { UserProfile, HealthReading, CheckIn } from './types';
import { DEFAULT_DEMO_USER, DEMO_READINGS, DEMO_CHECK_INS } from './data/demoData';

export default function App() {
  // App views: 'landing' | 'onboarding' | 'app'
  const [viewState, setViewState] = useState<'landing' | 'onboarding' | 'app'>('landing');
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signup' | 'signin'>('signup');
  const [captureModalOpen, setCaptureModalOpen] = useState(false);
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [vitaAssistantOpen, setVitaAssistantOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);

  // User & Data state (persisted in session storage or state)
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_DEMO_USER);
  const [readings, setReadings] = useState<HealthReading[]>(DEMO_READINGS);
  const [checkIns, setCheckIns] = useState<CheckIn[]>(DEMO_CHECK_INS);

  // Temporary signup storage between Auth and Onboarding
  const [pendingSignupName, setPendingSignupName] = useState('');
  const [pendingSignupEmail, setPendingSignupEmail] = useState('');

  // Save new reading from Capture Modal
  const handleSaveReading = (newReading: HealthReading) => {
    setReadings((prev) => [newReading, ...prev]);
  };

  // Save new check-in from Daily Check-In Modal
  const handleSaveCheckIn = (newCheckIn: CheckIn) => {
    setCheckIns((prev) => [newCheckIn, ...prev]);
  };

  // Reset to initial demo profile
  const handleResetDemo = () => {
    setUserProfile(DEFAULT_DEMO_USER);
    setReadings(DEMO_READINGS);
    setCheckIns(DEMO_CHECK_INS);
  };

  // Switch to clean user mode
  const handleSwitchToRealUser = () => {
    setUserProfile({
      name: 'New Member',
      email: 'user@example.com',
      conditions: ['hypertension'],
      familyHistory: [],
      location: 'Austin, TX',
      remindersEnabled: true,
      createdAt: new Date().toISOString(),
      streakDays: 1,
      isDemo: false,
    });
    setReadings([]);
    setCheckIns([]);
  };

  // Auth Modal Success handler
  const handleAuthSuccess = (data: { name: string; email: string }) => {
    setAuthModalOpen(false);
    if (authModalMode === 'signup') {
      setPendingSignupName(data.name);
      setPendingSignupEmail(data.email);
      setViewState('onboarding');
    } else {
      // Sign-in
      setUserProfile((prev) => ({
        ...prev,
        name: data.name,
        email: data.email,
        isDemo: false,
      }));
      setViewState('app');
    }
  };

  // Onboarding Complete handler
  const handleOnboardingComplete = (completedProfile: Partial<UserProfile>) => {
    const fullProfile: UserProfile = {
      name: completedProfile.name || pendingSignupName || 'Eleanor Vance',
      email: completedProfile.email || pendingSignupEmail || 'user@example.com',
      conditions: completedProfile.conditions || ['hypertension'],
      familyHistory: completedProfile.familyHistory || [],
      location: completedProfile.location || 'Austin, TX',
      remindersEnabled: completedProfile.remindersEnabled ?? true,
      createdAt: new Date().toISOString(),
      streakDays: 1,
      isDemo: false,
    };
    setUserProfile(fullProfile);
    setViewState('app');
    setCurrentTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-teal-100 selection:text-teal-900 flex flex-col">
      {/* 1. LANDING SCREEN */}
      {viewState === 'landing' && (
        <LandingScreen
          onGetStarted={() => {
            setAuthModalMode('signup');
            setAuthModalOpen(true);
          }}
          onAlreadyHaveAccount={() => {
            setAuthModalMode('signin');
            setAuthModalOpen(true);
          }}
          onExploreDemo={() => {
            setUserProfile(DEFAULT_DEMO_USER);
            setReadings(DEMO_READINGS);
            setCheckIns(DEMO_CHECK_INS);
            setViewState('app');
            setCurrentTab('dashboard');
          }}
        />
      )}

      {/* 2. ONBOARDING FLOW */}
      {viewState === 'onboarding' && (
        <OnboardingFlow
          initialName={pendingSignupName}
          initialEmail={pendingSignupEmail}
          onComplete={handleOnboardingComplete}
        />
      )}

      {/* 3. MAIN APPLICATION INTERFACE */}
      {viewState === 'app' && (
        <div className="flex-1 flex flex-col pb-16 md:pb-6">
          {/* Top Navbar */}
          <Navbar
            currentTab={currentTab}
            onSelectTab={(tab) => {
              if (tab === 'capture') {
                setCaptureModalOpen(true);
              } else {
                setCurrentTab(tab);
              }
            }}
            onOpenCapture={() => setCaptureModalOpen(true)}
            onOpenCheckIn={() => setCheckInModalOpen(true)}
            onOpenVitaAssistant={() => setVitaAssistantOpen(true)}
            onOpenEmergency={() => setEmergencyModalOpen(true)}
            userProfile={userProfile}
            onResetDemo={handleResetDemo}
            onSwitchToRealUser={handleSwitchToRealUser}
          />

          {/* Active Tab View */}
          <main className="flex-1">
            {currentTab === 'dashboard' && (
              <Dashboard
                userProfile={userProfile}
                readings={readings}
                checkIns={checkIns}
                onOpenCapture={() => setCaptureModalOpen(true)}
                onOpenCheckIn={() => setCheckInModalOpen(true)}
                onOpenVitaAssistant={() => setVitaAssistantOpen(true)}
                onNavigateTab={(tab) => setCurrentTab(tab)}
                onResetDemo={handleResetDemo}
              />
            )}

            {currentTab === 'history' && (
              <HistoryView
                readings={readings}
                onOpenCapture={() => setCaptureModalOpen(true)}
              />
            )}

            {currentTab === 'insights' && (
              <InsightsView
                readings={readings}
                userProfile={userProfile}
                onOpenVitaAssistant={() => setVitaAssistantOpen(true)}
                onOpenCapture={() => setCaptureModalOpen(true)}
              />
            )}

            {currentTab === 'timeline' && (
              <TimelineView
                readings={readings}
                checkIns={checkIns}
                onOpenCapture={() => setCaptureModalOpen(true)}
                onOpenCheckIn={() => setCheckInModalOpen(true)}
              />
            )}

            {currentTab === 'food' && (
              <FoodPersonalizationView
                userProfile={userProfile}
                onUpdateLocation={(newLoc) =>
                  setUserProfile((prev) => ({ ...prev, location: newLoc }))
                }
              />
            )}

            {currentTab === 'profile' && (
              <HealthProfileView
                userProfile={userProfile}
                readings={readings}
                onResetDemo={handleResetDemo}
                onUpdateConditions={(conds) =>
                  setUserProfile((prev) => ({ ...prev, conditions: conds }))
                }
              />
            )}
          </main>

          {/* Mobile Bottom Navigation */}
          <MobileNav
            currentTab={currentTab}
            onSelectTab={(tab) => setCurrentTab(tab)}
            onOpenCapture={() => setCaptureModalOpen(true)}
            onOpenCheckIn={() => setCheckInModalOpen(true)}
          />
        </div>
      )}

      {/* Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        onExploreDemo={() => {
          setAuthModalOpen(false);
          setUserProfile(DEFAULT_DEMO_USER);
          setReadings(DEMO_READINGS);
          setCheckIns(DEMO_CHECK_INS);
          setViewState('app');
          setCurrentTab('dashboard');
        }}
      />

      <CaptureModal
        isOpen={captureModalOpen}
        onClose={() => setCaptureModalOpen(false)}
        onSaveReading={handleSaveReading}
        userProfile={userProfile}
      />

      <DailyCheckInModal
        isOpen={checkInModalOpen}
        onClose={() => setCheckInModalOpen(false)}
        onSaveCheckIn={handleSaveCheckIn}
      />

      <VitaAssistantModal
        isOpen={vitaAssistantOpen}
        onClose={() => setVitaAssistantOpen(false)}
        userProfile={userProfile}
        readings={readings}
        checkIns={checkIns}
      />

      <EmergencyModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
      />
    </div>
  );
}
