
import React from 'react';
import { DndContext } from '@dnd-kit/core';
import { FloorPlanDesigner } from '@/components/FloorPlanDesigner';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <FloorPlanDesigner />
    </div>
  );
};

export default Index;
