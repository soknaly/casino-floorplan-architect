
import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { GameObject } from '@/types/floor-plan';
import { ObjectPropertiesPopover } from './ObjectPropertiesPopover';

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
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `object-${object.id}`,
    data: {
      type: 'floor-object',
      object,
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

  // Calculate the actual position including transform
  const actualStyle = {
    left: object.x,
    top: object.y,
    width: object.width,
    height: object.height,
    transform: `rotate(${object.rotation}deg) ${transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : ''}`,
    transformOrigin: 'center',
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isDragging) {
      setIsSelected(!isSelected);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={actualStyle}
      className={`absolute select-none transition-all ${
        isDragging ? 'opacity-75 scale-105 z-50' : 'opacity-100'
      } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onMouseDown={(e) => {
        // Allow both dragging and clicking
        e.stopPropagation();
      }}
    >
      {/* Object body */}
      <div
        className={`w-full h-full rounded-lg shadow-lg border-2 border-white ${getObjectColor(
          object.type
        )} flex items-center justify-center text-white font-bold relative overflow-hidden hover:shadow-xl transition-shadow cursor-pointer`}
        onClick={handleClick}
      >
        {/* Drag handle - separate from click area */}
        <div
          {...listeners}
          {...attributes}
          className="absolute inset-0 cursor-move"
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
        />
        
        <div className="text-center pointer-events-none relative z-10">
          <div className="text-lg">{getObjectIcon(object.type)}</div>
          <div className="text-xs mt-1 truncate px-1">
            {object.name}
          </div>
        </div>
      </div>

      {/* Selection controls */}
      {isSelected && !isDragging && (
        <div className="absolute -top-10 left-0 flex gap-1 bg-white rounded shadow-lg p-1 z-20">
          <ObjectPropertiesPopover
            object={object}
            onUpdate={onUpdate}
            onRemove={onRemove}
            isOpen={isPropertiesOpen}
            onOpenChange={setIsPropertiesOpen}
          />
        </div>
      )}
    </div>
  );
};
