
import React from 'react';
import { useDrag } from 'react-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GameObject } from '@/types/floor-plan';

const gameObjects: Array<{
  type: GameObject['type'];
  name: string;
  icon: string;
  color: string;
  description: string;
}> = [
  {
    type: 'slot-machine',
    name: 'Slot Machine',
    icon: '🎰',
    color: 'bg-red-500',
    description: 'Classic slot machine'
  },
  {
    type: 'poker-table',
    name: 'Poker Table',
    icon: '♠️',
    color: 'bg-green-600',
    description: 'Round poker table'
  },
  {
    type: 'roulette',
    name: 'Roulette',
    icon: '🎲',
    color: 'bg-purple-600',
    description: 'Roulette wheel table'
  },
  {
    type: 'blackjack',
    name: 'Blackjack',
    icon: '🃏',
    color: 'bg-blue-600',
    description: 'Blackjack table'
  },
  {
    type: 'table',
    name: 'Generic Table',
    icon: '🪑',
    color: 'bg-yellow-600',
    description: 'Multi-purpose table'
  }
];

interface DraggableToolboxItemProps {
  item: typeof gameObjects[0];
}

const DraggableToolboxItem: React.FC<DraggableToolboxItemProps> = ({ item }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'game-object',
    item: { type: 'game-object', objectType: item.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`cursor-move transition-all ${
        isDragging ? 'opacity-50 scale-95' : 'opacity-100 hover:scale-105'
      }`}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div
              className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center text-white text-xl shadow-sm`}
            >
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm text-gray-900 truncate">
                {item.name}
              </h3>
              <p className="text-xs text-gray-500 truncate">
                {item.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const Toolbox: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Toolbox</h2>
        <p className="text-sm text-gray-600 mt-1">
          Drag items to the floor plan
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {gameObjects.map((item) => (
            <DraggableToolboxItem key={item.type} item={item} />
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-800 mb-2">Instructions</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Drag items from here to the floor plan</li>
            <li>• Click objects to select and edit</li>
            <li>• Use controls to rotate or delete</li>
            <li>• Click name to rename objects</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
