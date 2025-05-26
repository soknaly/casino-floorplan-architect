
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FloorPlanDesigner } from '@/components/FloorPlanDesigner';

const Index = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50">
        <FloorPlanDesigner />
      </div>
    </DndProvider>
  );
};

export default Index;
