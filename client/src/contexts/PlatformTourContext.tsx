import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export interface TourStep {
  id: string;
  title: string;
  description: string;
  targetSelector?: string;
  route?: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: () => void;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to iTea HQ!',
    description: 'Let\'s take a quick tour of your complete tea trading platform. We\'ll show you the key features that will streamline your workflow.',
    position: 'center',
    route: '/app/get-started'
  },
  {
    id: 'dashboard',
    title: 'Your Command Center',
    description: 'The dashboard gives you a real-time overview of your wallets, recent transactions, and workflow activity. Everything you need at a glance.',
    position: 'center',
    route: '/app/dashboard'
  },
  {
    id: 'operations',
    title: 'Operations Hub',
    description: 'Manage your tea workflow, directory, and trade analytics. This is where you\'ll process bids, generate E-slips, and track your business.',
    targetSelector: '[href="/app/operations/tea-workflow"]',
    position: 'right',
    route: '/app/dashboard'
  },
  {
    id: 'banking',
    title: 'Financial Management',
    description: 'Handle payments, manage wallets, and process inflows. Your complete financial toolkit for tea trading operations.',
    targetSelector: '[href="/app/banking/payments"]',
    position: 'right',
    route: '/app/dashboard'
  },
  {
    id: 'tea-workflow',
    title: 'Tea Workflow Management',
    description: 'This is your main workspace for processing tea auctions - from bid intake to payment matching and tea release.',
    position: 'center',
    route: '/app/operations/tea-workflow'
  },
  {
    id: 'profile',
    title: 'Your Profile & Settings',
    description: 'Access your account settings, logout, and restart this tour anytime from your profile menu.',
    targetSelector: '[data-testid="user-profile"]',
    position: 'left',
    route: '/app/dashboard'
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'You\'ve completed the platform tour. You can restart it anytime from your profile menu. Ready to start managing your tea trading operations?',
    position: 'center',
    route: '/app/dashboard'
  }
];

interface PlatformTourContextType {
  isActive: boolean;
  currentStep: number;
  currentTourStep: TourStep;
  totalSteps: number;
  isCompleted: boolean;
  isNavigating: boolean;
  startTour: () => void;
  nextStep: () => void;
  previousStep: () => void;
  skipTour: () => void;
  completeTour: () => void;
  restartTour: () => void;
}

const PlatformTourContext = createContext<PlatformTourContextType | undefined>(undefined);

export const PlatformTourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const completed = localStorage.getItem('platform-tour-completed');
    setIsCompleted(completed === 'true');
    console.log('Tour initialization - completed:', completed);
  }, []);

  // Debug effect to log state changes
  useEffect(() => {
    console.log('Tour state changed:', { isActive, currentStep, isCompleted, isNavigating });
  }, [isActive, currentStep, isCompleted, isNavigating]);

  const startTour = () => {
    console.log('Starting platform tour - before state change');
    setIsActive(true);
    setCurrentStep(0);
    setIsNavigating(false);
    console.log('Starting platform tour - after state change');
    
    const firstStep = tourSteps[0];
    console.log('First step:', firstStep);
    
    if (firstStep.route && location.pathname !== firstStep.route) {
      console.log('Navigating to:', firstStep.route);
      setIsNavigating(true);
      navigate(firstStep.route);
      // Add delay to ensure navigation is complete
      setTimeout(() => {
        setIsNavigating(false);
      }, 500);
    }
  };

  const nextStep = () => {
    console.log('Moving to next step from:', currentStep);
    if (currentStep < tourSteps.length - 1) {
      const nextStepIndex = currentStep + 1;
      const nextStep = tourSteps[nextStepIndex];
      
      setCurrentStep(nextStepIndex);
      
      if (nextStep.route && location.pathname !== nextStep.route) {
        setIsNavigating(true);
        navigate(nextStep.route);
        // Add delay to ensure navigation is complete before showing next step
        setTimeout(() => {
          setIsNavigating(false);
        }, 500);
      }
      
      if (nextStep.action) {
        setTimeout(nextStep.action, 500);
      }
    } else {
      completeTour();
    }
  };

  const previousStep = () => {
    console.log('Moving to previous step from:', currentStep);
    if (currentStep > 0) {
      const prevStepIndex = currentStep - 1;
      const prevStep = tourSteps[prevStepIndex];
      
      setCurrentStep(prevStepIndex);
      
      if (prevStep.route && location.pathname !== prevStep.route) {
        setIsNavigating(true);
        navigate(prevStep.route);
        setTimeout(() => {
          setIsNavigating(false);
        }, 500);
      }
    }
  };

  const skipTour = () => {
    console.log('Skipping tour');
    setIsActive(false);
    setCurrentStep(0);
    setIsNavigating(false);
  };

  const completeTour = () => {
    console.log('Completing tour');
    setIsActive(false);
    setCurrentStep(0);
    setIsCompleted(true);
    setIsNavigating(false);
    localStorage.setItem('platform-tour-completed', 'true');
  };

  const restartTour = () => {
    console.log('Restarting tour');
    localStorage.removeItem('platform-tour-completed');
    setIsCompleted(false);
    startTour();
  };

  const currentTourStep = tourSteps[currentStep];

  const value = {
    isActive,
    currentStep,
    currentTourStep,
    totalSteps: tourSteps.length,
    isCompleted,
    isNavigating,
    startTour,
    nextStep,
    previousStep,
    skipTour,
    completeTour,
    restartTour
  };

  return (
    <PlatformTourContext.Provider value={value}>
      {children}
    </PlatformTourContext.Provider>
  );
};

export const usePlatformTourContext = () => {
  const context = useContext(PlatformTourContext);
  if (context === undefined) {
    throw new Error('usePlatformTourContext must be used within a PlatformTourProvider');
  }
  return context;
};
