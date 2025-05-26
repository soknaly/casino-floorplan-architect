
import React, { useState } from 'react';
import { GameObject } from '@/types/floor-plan';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RotateCw, Trash2, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface ObjectPropertiesPopoverProps {
  object: GameObject;
  onUpdate: (updates: Partial<GameObject>) => void;
  onRemove: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ObjectPropertiesPopover: React.FC<ObjectPropertiesPopoverProps> = ({
  object,
  onUpdate,
  onRemove,
  isOpen,
  onOpenChange
}) => {
  const [formData, setFormData] = useState({
    name: object.name,
    x: object.x.toString(),
    y: object.y.toString(),
    width: object.width.toString(),
    height: object.height.toString(),
  });

  const handleSave = () => {
    const updates: Partial<GameObject> = {
      name: formData.name,
      x: parseFloat(formData.x) || 0,
      y: parseFloat(formData.y) || 0,
      width: parseFloat(formData.width) || 50,
      height: parseFloat(formData.height) || 50,
    };
    
    onUpdate(updates);
    onOpenChange(false);
    toast.success('Object properties updated');
  };

  const handleRotate = () => {
    const newRotation = (object.rotation + 90) % 360;
    onUpdate({ rotation: newRotation });
    toast.success('Object rotated');
  };

  const handleDelete = () => {
    onRemove();
    onOpenChange(false);
    toast.success('Object removed');
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="h-6 w-6 p-0"
        >
          <Settings className="w-3 h-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-white border shadow-lg z-50">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Edit Object Properties</h4>
            <p className="text-xs text-gray-500">Modify the properties of the selected object</p>
          </div>

          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="object-name" className="text-xs">Name</Label>
              <Input
                id="object-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="h-8 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="object-x" className="text-xs">X Position</Label>
                <Input
                  id="object-x"
                  type="number"
                  value={formData.x}
                  onChange={(e) => setFormData(prev => ({ ...prev, x: e.target.value }))}
                  className="h-8 text-xs"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="object-y" className="text-xs">Y Position</Label>
                <Input
                  id="object-y"
                  type="number"
                  value={formData.y}
                  onChange={(e) => setFormData(prev => ({ ...prev, y: e.target.value }))}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="object-width" className="text-xs">Width</Label>
                <Input
                  id="object-width"
                  type="number"
                  value={formData.width}
                  onChange={(e) => setFormData(prev => ({ ...prev, width: e.target.value }))}
                  className="h-8 text-xs"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="object-height" className="text-xs">Height</Label>
                <Input
                  id="object-height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              onClick={handleSave}
              className="flex-1 h-8 text-xs"
            >
              Save Changes
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRotate}
              className="h-8 w-8 p-0"
            >
              <RotateCw className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDelete}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
