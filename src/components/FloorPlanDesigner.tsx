
import React, { useState } from 'react';
import { FloorList } from './FloorList';
import { DesignerPanel } from './DesignerPanel';
import { Toolbox } from './Toolbox';
import { Floor, GameObject } from '@/types/floor-plan';

export const FloorPlanDesigner = () => {
  const [floors, setFloors] = useState<Floor[]>([
    {
      id: '1',
      name: 'Main Floor',
      width: 800,
      height: 600,
      backgroundImage: null,
      objects: []
    }
  ]);
  const [activeFloorId, setActiveFloorId] = useState<string>('1');
  
  const activeFloor = floors.find(floor => floor.id === activeFloorId);

  const addFloor = (floor: Omit<Floor, 'id' | 'objects'>) => {
    const newFloor: Floor = {
      ...floor,
      id: Date.now().toString(),
      objects: []
    };
    setFloors(prev => [...prev, newFloor]);
    setActiveFloorId(newFloor.id);
  };

  const updateFloor = (floorId: string, updates: Partial<Floor>) => {
    setFloors(prev => prev.map(floor => 
      floor.id === floorId ? { ...floor, ...updates } : floor
    ));
  };

  const deleteFloor = (floorId: string) => {
    setFloors(prev => prev.filter(floor => floor.id !== floorId));
    if (activeFloorId === floorId && floors.length > 1) {
      const remainingFloors = floors.filter(floor => floor.id !== floorId);
      setActiveFloorId(remainingFloors[0].id);
    }
  };

  const addObjectToFloor = (object: GameObject) => {
    if (!activeFloor) return;
    
    updateFloor(activeFloor.id, {
      objects: [...activeFloor.objects, object]
    });
  };

  const updateObjectInFloor = (objectId: string, updates: Partial<GameObject>) => {
    if (!activeFloor) return;
    
    updateFloor(activeFloor.id, {
      objects: activeFloor.objects.map(obj => 
        obj.id === objectId ? { ...obj, ...updates } : obj
      )
    });
  };

  const removeObjectFromFloor = (objectId: string) => {
    if (!activeFloor) return;
    
    updateFloor(activeFloor.id, {
      objects: activeFloor.objects.filter(obj => obj.id !== objectId)
    });
  };

  return (
    <div className="h-screen flex">
      {/* Left Panel - Floor List */}
      <div className="w-80 bg-white border-r border-gray-200 shadow-lg">
        <FloorList
          floors={floors}
          activeFloorId={activeFloorId}
          onFloorSelect={setActiveFloorId}
          onFloorAdd={addFloor}
          onFloorDelete={deleteFloor}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center px-6">
          <h1 className="text-2xl font-bold text-gray-800">Casino Floor Plan Designer</h1>
          {activeFloor && (
            <span className="ml-4 text-sm text-gray-600">
              Current Floor: {activeFloor.name} ({activeFloor.width}×{activeFloor.height})
            </span>
          )}
        </div>

        {/* Designer and Toolbox */}
        <div className="flex-1 flex">
          {/* Designer Panel */}
          <div className="flex-1">
            {activeFloor && (
              <DesignerPanel
                floor={activeFloor}
                onObjectAdd={addObjectToFloor}
                onObjectUpdate={updateObjectInFloor}
                onObjectRemove={removeObjectFromFloor}
                onFloorUpdate={(updates) => updateFloor(activeFloor.id, updates)}
              />
            )}
          </div>

          {/* Right Panel - Toolbox */}
          <div className="w-64 bg-white border-l border-gray-200 shadow-lg">
            <Toolbox />
          </div>
        </div>
      </div>
    </div>
  );
};
