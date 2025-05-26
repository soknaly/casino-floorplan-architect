
import React, { useRef } from 'react';
import { DndContext, DragEndEvent, useDroppable } from '@dnd-kit/core';
import { Floor, GameObject } from '@/types/floor-plan';
import { DraggableObject } from './DraggableObject';
import { Button } from '@/components/ui/button';
import { Upload, Download } from 'lucide-react';
import { toast } from 'sonner';

interface DesignerPanelProps {
  floor: Floor;
  onObjectAdd: (object: GameObject) => void;
  onObjectUpdate: (objectId: string, updates: Partial<GameObject>) => void;
  onObjectRemove: (objectId: string) => void;
  onFloorUpdate: (updates: Partial<Floor>) => void;
}

export const DesignerPanel: React.FC<DesignerPanelProps> = ({
  floor,
  onObjectAdd,
  onObjectUpdate,
  onObjectRemove,
  onFloorUpdate
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const { setNodeRef, isOver } = useDroppable({
    id: 'floor-canvas',
  });

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event;

    if (!over || over.id !== 'floor-canvas') return;

    const activeData = active.data.current;

    if (activeData?.type === 'toolbox-item') {
      // Adding new object from toolbox
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;

      const x = Math.max(0, Math.min(delta.x, floor.width - getDefaultWidth(activeData.objectType)));
      const y = Math.max(0, Math.min(delta.y, floor.height - getDefaultHeight(activeData.objectType)));

      const newObject: GameObject = {
        id: Date.now().toString(),
        type: activeData.objectType,
        x,
        y,
        width: getDefaultWidth(activeData.objectType),
        height: getDefaultHeight(activeData.objectType),
        rotation: 0,
        name: `${activeData.objectType.replace('-', ' ').toUpperCase()} ${floor.objects.length + 1}`
      };

      onObjectAdd(newObject);
      toast.success(`${newObject.name} added to floor`);
    } else if (activeData?.type === 'floor-object') {
      // Moving existing object
      const object = activeData.object;
      const newX = Math.max(0, Math.min(object.x + delta.x, floor.width - object.width));
      const newY = Math.max(0, Math.min(object.y + delta.y, floor.height - object.height));
      
      onObjectUpdate(object.id, { x: newX, y: newY });
    }
  };

  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onFloorUpdate({ backgroundImage: e.target?.result as string });
        toast.success('Background updated successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const exportFloorPlan = () => {
    const floorData = {
      floor,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(floorData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${floor.name.replace(/\s+/g, '_')}_floor_plan.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Floor plan exported successfully!');
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="h-full flex flex-col bg-gray-100">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="bg-upload" className="cursor-pointer">
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Change Background
                </span>
              </Button>
            </label>
            <input
              id="bg-upload"
              type="file"
              accept="image/*"
              onChange={handleBackgroundUpload}
              className="hidden"
            />
          </div>
          
          <Button variant="outline" size="sm" onClick={exportFloorPlan}>
            <Download className="w-4 h-4 mr-2" />
            Export Plan
          </Button>

          <div className="text-sm text-gray-600 ml-auto">
            Objects: {floor.objects.length} | 
            Drag items from the toolbox to add them to the floor
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto p-8">
          <div className="flex justify-center">
            <div
              ref={(node) => {
                canvasRef.current = node;
                setNodeRef(node);
              }}
              className={`relative border-2 border-dashed shadow-lg transition-colors ${
                isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
              }`}
              style={{
                width: floor.width,
                height: floor.height,
                backgroundImage: floor.backgroundImage ? `url(${floor.backgroundImage})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {/* Game objects */}
              {floor.objects.map((object) => (
                <DraggableObject
                  key={object.id}
                  object={object}
                  onUpdate={(updates) => onObjectUpdate(object.id, updates)}
                  onRemove={() => onObjectRemove(object.id)}
                  floorBounds={{ width: floor.width, height: floor.height }}
                />
              ))}

              {/* Drop zone indicator */}
              {isOver && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
                    Drop here to add object
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
};
