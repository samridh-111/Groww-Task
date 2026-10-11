import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useAppState } from './state/AppState';
import { AppShell } from './components/layout/AppShell';
import { ErrorBoundary } from './components/ErrorBoundary';
import { runPlanAssertions } from './lib/planEngine';

// Page Imports
import WelcomePage from './pages/Welcome';
import SituationPage from './pages/onboarding/Situation';
import IncomePage from './pages/onboarding/Income';
import ExpensesPage from './pages/onboarding/Expenses';
import GoalsPage from './pages/onboarding/Goals';
import TimelinePage from './pages/onboarding/Timeline';
import RiskPage from './pages/onboarding/Risk';
import CalculatingPage from './pages/onboarding/Calculating';

import PlanPage from './pages/Plan';
import WhyPlanPage from './pages/WhyPlan';
import RecommendedPage from './pages/Recommended';
import CategoryDetailPage from './pages/CategoryDetail';
import BeforeInvestLessonPage from './pages/BeforeInvestLesson';
import ReviewInvestPage from './pages/ReviewInvest';
import ConfirmedInvestPage from './pages/ConfirmedInvest';

import HomePage from './pages/Home';
import ExplorePage from './pages/Explore';
import LearnPage from './pages/Learn';
import LessonDetailPage from './pages/LessonDetail';
import YouPage from './pages/You';
import ProfileEditPage from './pages/ProfileEdit';
import ScenarioPage from './pages/Scenario';
import DemoControlsPage from './pages/DemoControls';
import NotFoundPage from './pages/NotFound';

// Route Guard Component
function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { state } = useAppState();
  const location = useLocation();

  const isOnboardingStep = location.pathname.startsWith('/onboarding') || location.pathname === '/welcome';
  const hasPlan = state.plan !== null || state.riskPreference !== null;

  if (!hasPlan && !isOnboardingStep) {
    return <Navigate to="/welcome" replace />;
  }

  if (state.onboardingComplete && location.pathname === '/welcome') {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default function App() {
  useEffect(() => {
    runPlanAssertions();
  }, []);

  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppShell />}>
              {/* Onboarding Routes */}
              <Route path="/" element={<Navigate to="/welcome" replace />} />
              <Route path="/welcome" element={<ProtectedRoute><WelcomePage /></ProtectedRoute>} />
              <Route path="/onboarding/situation" element={<SituationPage />} />
              <Route path="/onboarding/income" element={<IncomePage />} />
              <Route path="/onboarding/expenses" element={<ExpensesPage />} />
              <Route path="/onboarding/goals" element={<GoalsPage />} />
              <Route path="/onboarding/timeline" element={<TimelinePage />} />
              <Route path="/onboarding/risk" element={<RiskPage />} />
              <Route path="/onboarding/calculating" element={<CalculatingPage />} />

              {/* Plan & Investment Routes */}
              <Route path="/plan" element={<ProtectedRoute><PlanPage /></ProtectedRoute>} />
              <Route path="/plan/why" element={<ProtectedRoute><WhyPlanPage /></ProtectedRoute>} />
              <Route path="/invest/recommended" element={<ProtectedRoute><RecommendedPage /></ProtectedRoute>} />
              <Route path="/invest/:categoryId" element={<ProtectedRoute><CategoryDetailPage /></ProtectedRoute>} />
              <Route path="/learn/before-you-invest" element={<ProtectedRoute><BeforeInvestLessonPage /></ProtectedRoute>} />
              <Route path="/invest/review" element={<ProtectedRoute><ReviewInvestPage /></ProtectedRoute>} />
              <Route path="/invest/confirmed" element={<ProtectedRoute><ConfirmedInvestPage /></ProtectedRoute>} />

              {/* Core App Tab Routes */}
              <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/explore" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
              <Route path="/explore/:categoryId" element={<ProtectedRoute><CategoryDetailPage /></ProtectedRoute>} />
              <Route path="/learn" element={<ProtectedRoute><LearnPage /></ProtectedRoute>} />
              <Route path="/learn/:lessonId" element={<ProtectedRoute><LessonDetailPage /></ProtectedRoute>} />
              <Route path="/you" element={<ProtectedRoute><YouPage /></ProtectedRoute>} />
              <Route path="/you/profile" element={<ProtectedRoute><ProfileEditPage /></ProtectedRoute>} />
              <Route path="/scenario" element={<ProtectedRoute><ScenarioPage /></ProtectedRoute>} />
              <Route path="/you/demo" element={<ProtectedRoute><DemoControlsPage /></ProtectedRoute>} />

              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
}
