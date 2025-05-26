
import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { GameObject } from '@/types/floor-plan';
import { Button } from '@/components/ui/button';
import { RotateCw, Trash2, Edit } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface DraggableObjectProps {
  object: GameObject;
  onUpdate: (updates: Partial<GameObject>) => void;
  onRemove: () => void;
  floorBounds: { width: number; height: number };
}

export const DraggableObject: React.FC<DraggableObjectProps> = ({
  object,
  onUpdate,
  onRemove,
  floorBounds
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(object.name);

  const [{ isDragging }, drag] = useDrag({
    type: 'placed-object',
    item: { id: object.id, type: 'placed-object' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (!dropResult) {
        const offset = monitor.getDifferenceFromInitialOffset();
        if (offset) {
          const newX = Math.max(0, Math.min(object.x + offset.x, floorBounds.width - object.width));
          const newY = Math.max(0, Math.min(object.y + offset.y, floorBounds.height - object.height));
          onUpdate({ x: newX, y: newY });
        }
      }
    },
  });

  const getObjectColor = (type: GameObject['type']): string => {
    switch (type) {
      case 'slot-machine': return 'bg-red-500';
      case 'poker-table': return 'bg-green-600';
      case 'roulette': return 'bg-purple-600';
      case 'blackjack': return 'bg-blue-600';
      case 'table': return 'bg-yellow-600';
      default: return 'bg-gray-500';
    }
  };

  const getObjectIcon = (type: GameObject['type']): string => {
    switch (type) {
      case 'slot-machine': return '🎰';
      case 'poker-table': return '♠️';
      case 'roulette': return '🎲';
      case 'blackjack': return '🃏';
      case 'table': return '🪑';
      default: return '⬜';
    }
  };

  const handleRotate = () => {
    const newRotation = (object.rotation + 90) % 360;
    onUpdate({ rotation: newRotation });
    toast.success('Object rotated');
  };

  const handleNameSave = () => {
    if (editName.trim()) {
      onUpdate({ name: editName.trim() });
      setIsEditing(false);
      toast.success('Name updated');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      setEditName(object.name);
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={drag}
      className={`absolute cursor-move select-none transition-all ${
        isDragging ? 'opacity-50 scale-110' : 'opacity-100'
      } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        left: object.x,
        top: object.y,
        width: object.width,
        height: object.height,
        transform: `rotate(${object.rotation}deg)`,
        transformOrigin: 'center',
      }}
      onClick={(e) => {
        e.stopPropagation();
        setIsSelected(!isSelected);
      }}
    >
      {/* Object body */}
      <div
        className={`w-full h-full rounded-lg shadow-lg border-2 border-white ${getObjectColor(
          object.type
        )} flex items-center justify-center text-white font-bold relative overflow-hidden`}
      >
        <div className="text-center">
          <div className="text-lg">{getObjectIcon(object.type)}</div>
          {isEditing ? (
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={handleKeyPress}
              className="w-full text-xs mt-1 h-6 bg-white text-black"
              autoFocus
            />
          ) : (
            <div 
              className="text-xs mt-1 truncate cursor-pointer hover:bg-black hover:bg-opacity-20 px-1 rounded"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              {object.name}
            </div>
          )}
        </div>

        {/* Selection controls */}
        {isSelected && (
          <div className="absolute -top-10 left-0 flex gap-1 bg-white rounded shadow-lg p-1">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="h-6 w-6 p-0"
            >
              <Edit className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleRotate();
              }}
              className="h-6 w-6 p-0"
            >
              <RotateCw className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
                toast.success('Object removed');
              }}
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
