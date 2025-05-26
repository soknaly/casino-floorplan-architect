
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, RotateCw, Trash2 } from 'lucide-react';
import { GameObject } from '@/types/floor-plan';
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
  const [name, setName] = useState(object.name);
  const [x, setX] = useState(object.x);
  const [y, setY] = useState(object.y);
  const [width, setWidth] = useState(object.width);
  const [height, setHeight] = useState(object.height);

  const handleSave = () => {
    onUpdate({
      name,
      x: Number(x),
      y: Number(y),
      width: Number(width),
      height: Number(height)
    });
    onOpenChange(false);
    toast.success('Object properties updated');
  };

  const handleRotate = () => {
    onUpdate({ rotation: (object.rotation + 90) % 360 });
    toast.success('Object rotated');
  };

  const handleRemove = () => {
    onRemove();
    onOpenChange(false);
    toast.success('Object removed');
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Object Properties</h4>
            <p className="text-sm text-muted-foreground">
              Edit the properties of the selected object.
            </p>
          </div>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="object-name">Name</Label>
              <Input
                id="object-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Object name"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="object-x">X Position</Label>
                <Input
                  id="object-x"
                  type="number"
                  value={x}
                  onChange={(e) => setX(Number(e.target.value))}
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="object-y">Y Position</Label>
                <Input
                  id="object-y"
                  type="number"
                  value={y}
                  onChange={(e) => setY(Number(e.target.value))}
                  min="0"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="object-width">Width</Label>
                <Input
                  id="object-width"
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  min="10"
                />
              </div>
              <div>
                <Label htmlFor="object-height">Height</Label>
                <Input
                  id="object-height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  min="10"
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              Save
            </Button>
            <Button variant="outline" onClick={handleRotate}>
              <RotateCw className="w-4 h-4" />
            </Button>
            <Button variant="destructive" onClick={handleRemove}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
