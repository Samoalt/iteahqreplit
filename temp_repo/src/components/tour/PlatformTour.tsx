
import React from 'react';
import { usePlatformTourContext } from '@/contexts/PlatformTourContext';
import TourOverlay from './TourOverlay';

const PlatformTour: React.FC = () => {
  const { isActive } = usePlatformTourContext();

  return <TourOverlay isActive={isActive} />;
};

export default PlatformTour;
