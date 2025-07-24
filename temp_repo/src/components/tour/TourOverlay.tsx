
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, ArrowLeft, ArrowRight, SkipForward } from 'lucide-react';
import { usePlatformTourContext } from '@/contexts/PlatformTourContext';

interface TourOverlayProps {
  isActive: boolean;
}

const TourOverlay: React.FC<TourOverlayProps> = ({ isActive }) => {
  const {
    currentStep,
    currentTourStep,
    totalSteps,
    isNavigating,
    nextStep,
    previousStep,
    skipTour
  } = usePlatformTourContext();

  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    console.log('TourOverlay effect - isActive:', isActive, 'currentTourStep:', currentTourStep, 'isNavigating:', isNavigating);
    
    if (!isActive || !currentTourStep || isNavigating) {
      console.log('Tour not active, no current step, or navigating');
      return;
    }

    if (currentTourStep.targetSelector) {
      // Add longer delay to ensure elements are rendered after navigation
      const timer = setTimeout(() => {
        const element = document.querySelector(currentTourStep.targetSelector!) as HTMLElement;
        console.log('Found target element:', element, 'for selector:', currentTourStep.targetSelector);
        setTargetElement(element);
        
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 600);

      return () => clearTimeout(timer);
    } else {
      setTargetElement(null);
    }
  }, [isActive, currentTourStep, isNavigating]);

  // Early return with logging
  if (!isActive || !currentTourStep || isNavigating) {
    console.log('TourOverlay rendering nothing - isActive:', isActive, 'currentTourStep:', currentTourStep, 'isNavigating:', isNavigating);
    return null;
  }

  console.log('TourOverlay rendering tour step:', currentTourStep.id);

  const getTooltipPosition = () => {
    if (!targetElement) {
      return {
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999
      };
    }

    const rect = targetElement.getBoundingClientRect();
    const tooltipWidth = 320;
    const tooltipHeight = 200;
    
    let top = rect.top;
    let left = rect.left;
    
    switch (currentTourStep.position) {
      case 'top':
        top = rect.top - tooltipHeight - 20;
        left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        break;
      case 'bottom':
        top = rect.bottom + 20;
        left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        break;
      case 'left':
        top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
        left = rect.left - tooltipWidth - 20;
        break;
      case 'right':
        top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
        left = rect.right + 20;
        break;
      default:
        top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
        left = rect.right + 20;
    }

    // Ensure tooltip stays within viewport
    if (left < 10) left = 10;
    if (left + tooltipWidth > window.innerWidth - 10) {
      left = window.innerWidth - tooltipWidth - 10;
    }
    if (top < 10) top = 10;
    if (top + tooltipHeight > window.innerHeight - 10) {
      top = window.innerHeight - tooltipHeight - 10;
    }

    return {
      position: 'fixed' as const,
      top,
      left,
      zIndex: 9999
    };
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50"
        style={{ zIndex: 9998 }}
      />
      
      {/* Highlight for target element */}
      {targetElement && (
        <div
          className="fixed border-4 border-teal-400 rounded-lg shadow-xl pointer-events-none"
          style={{
            top: targetElement.getBoundingClientRect().top - 4,
            left: targetElement.getBoundingClientRect().left - 4,
            width: targetElement.offsetWidth + 8,
            height: targetElement.offsetHeight + 8,
            zIndex: 9998,
            boxShadow: '0 0 0 4px rgba(20, 184, 166, 0.3), 0 0 20px rgba(20, 184, 166, 0.5)'
          }}
        />
      )}
      
      {/* Tour Tooltip */}
      <div
        className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-80 max-h-96 overflow-y-auto"
        style={getTooltipPosition()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-teal-500"></div>
            <span className="text-sm font-medium text-slate-600">
              Step {currentStep + 1} of {totalSteps}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={skipTour}
            className="h-8 w-8 p-0 hover:bg-slate-100 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-600 to-teal-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {currentTourStep.title}
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {currentTourStep.description}
          </p>
        </div>

        {/* Actions - Improved Layout */}
        <div className="flex flex-col gap-3">
          {/* Primary Action Row */}
          <div className="flex items-center justify-between">
            {currentStep > 0 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={previousStep}
                className="border-slate-200 hover:bg-slate-50 text-sm px-3 py-2 h-9"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
            ) : (
              <div></div>
            )}
            
            <Button
              onClick={nextStep}
              className="bg-gradient-to-r from-blue-600 to-teal-500 hover:shadow-lg text-white text-sm px-4 py-2 h-9"
            >
              {currentStep === totalSteps - 1 ? 'Complete' : 'Next'}
              {currentStep !== totalSteps - 1 && <ArrowRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
          
          {/* Secondary Action Row */}
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={skipTour}
              className="text-slate-500 hover:text-slate-700 text-sm px-3 py-2 h-9"
            >
              <SkipForward className="h-4 w-4 mr-1" />
              Skip Tour
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TourOverlay;
