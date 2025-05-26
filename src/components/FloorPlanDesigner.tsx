
import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay } from '@dnd-kit/core';
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
  const [activeId, setActiveId] = useState<string | null>(null);
  
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

  const getDefaultWidth = (type: GameObject['type']): number => {
    switch (type) {
      case 'slot-machine': return 40;
      case 'poker-table': return 120;
      case 'roulette': return 100;
      case 'blackjack': return 80;
      case 'table': return 60;
      default: return 50;
    }
  };

  const getDefaultHeight = (type: GameObject['type']): number => {
    switch (type) {
      case 'slot-machine': return 60;
      case 'poker-table': return 80;
      case 'roulette': return 100;
      case 'blackjack': return 60;
      case 'table': return 60;
      default: return 50;
    }
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event;
    setActiveId(null);

    if (!over || !activeFloor) return;

    const activeData = active.data.current;

    if (activeData?.type === 'toolbox-item' && over.id === 'floor-canvas') {
      // Adding new object from toolbox
      const rect = active.rect.current?.translated;
      const x = Math.max(0, Math.min(rect?.left || 0, activeFloor.width - getDefaultWidth(activeData.objectType)));
      const y = Math.max(0, Math.min(rect?.top || 0, activeFloor.height - getDefaultHeight(activeData.objectType)));

      const newObject: GameObject = {
        id: Date.now().toString(),
        type: activeData.objectType,
        x,
        y,
        width: getDefaultWidth(activeData.objectType),
        height: getDefaultHeight(activeData.objectType),
        rotation: 0,
        name: `${activeData.objectType.replace('-', ' ').toUpperCase()} ${activeFloor.objects.length + 1}`
      };

      addObjectToFloor(newObject);
    } else if (activeData?.type === 'floor-object' && over.id === 'floor-canvas') {
      // Moving existing object
      const object = activeData.object;
      const newX = Math.max(0, Math.min(object.x + delta.x, activeFloor.width - object.width));
      const newY = Math.max(0, Math.min(object.y + delta.y, activeFloor.height - object.height));
      
      updateObjectInFloor(object.id, { x: newX, y: newY });
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="h-screen flex">
        {/* Left Panel - Floor List */}
        <div className="w-80 bg-white border-r border-gray-200 shadow-lg">
          <FloorList
            floors={floors}
            activeFloorId={activeFloorId}
            onFloorSelect={setActiveFloorId}
            onFloorAdd={addFloor}
            onFloorDelete={deleteFloor}
            onFloorUpdate={updateFloor}
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

      <DragOverlay>
        {activeId ? (
          <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg opacity-75">
            Dragging...
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
