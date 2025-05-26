
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Upload, Edit } from 'lucide-react';
import { Floor } from '@/types/floor-plan';
import { toast } from 'sonner';

interface FloorListProps {
  floors: Floor[];
  activeFloorId: string;
  onFloorSelect: (floorId: string) => void;
  onFloorAdd: (floor: Omit<Floor, 'id' | 'objects'>) => void;
  onFloorDelete: (floorId: string) => void;
  onFloorUpdate: (floorId: string, updates: Partial<Floor>) => void;
}

export const FloorList: React.FC<FloorListProps> = ({
  floors,
  activeFloorId,
  onFloorSelect,
  onFloorAdd,
  onFloorDelete,
  onFloorUpdate
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingFloor, setEditingFloor] = useState<Floor | null>(null);
  const [newFloorName, setNewFloorName] = useState('');
  const [newFloorWidth, setNewFloorWidth] = useState(800);
  const [newFloorHeight, setNewFloorHeight] = useState(600);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      toast.success('Background image uploaded successfully!');
    }
  };

  const handleAddFloor = () => {
    if (!newFloorName.trim()) {
      toast.error('Please enter a floor name');
      return;
    }

    onFloorAdd({
      name: newFloorName,
      width: newFloorWidth,
      height: newFloorHeight,
      backgroundImage
    });

    // Reset form
    setNewFloorName('');
    setNewFloorWidth(800);
    setNewFloorHeight(600);
    setBackgroundImage(null);
    setIsAddDialogOpen(false);
    toast.success('Floor created successfully!');
  };

  const openEditDialog = (floor: Floor) => {
    setEditingFloor(floor);
    setNewFloorName(floor.name);
    setNewFloorWidth(floor.width);
    setNewFloorHeight(floor.height);
    setBackgroundImage(floor.backgroundImage);
    setIsEditDialogOpen(true);
  };

  const handleEditFloor = () => {
    if (!editingFloor || !newFloorName.trim()) {
      toast.error('Please enter a floor name');
      return;
    }

    onFloorUpdate(editingFloor.id, {
      name: newFloorName,
      width: newFloorWidth,
      height: newFloorHeight,
      backgroundImage
    });

    // Reset form
    setEditingFloor(null);
    setNewFloorName('');
    setNewFloorWidth(800);
    setNewFloorHeight(600);
    setBackgroundImage(null);
    setIsEditDialogOpen(false);
    toast.success('Floor updated successfully!');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Floors</h2>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add New Floor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Floor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="floor-name">Floor Name</Label>
                <Input
                  id="floor-name"
                  value={newFloorName}
                  onChange={(e) => setNewFloorName(e.target.value)}
                  placeholder="e.g., Main Floor, VIP Area"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="floor-width">Width (px)</Label>
                  <Input
                    id="floor-width"
                    type="number"
                    value={newFloorWidth}
                    onChange={(e) => setNewFloorWidth(Number(e.target.value))}
                    min="400"
                    max="2000"
                  />
                </div>
                <div>
                  <Label htmlFor="floor-height">Height (px)</Label>
                  <Input
                    id="floor-height"
                    type="number"
                    value={newFloorHeight}
                    onChange={(e) => setNewFloorHeight(Number(e.target.value))}
                    min="300"
                    max="1500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="background-image">Background Image (Optional)</Label>
                <div className="mt-2">
                  <Input
                    id="background-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                {backgroundImage && (
                  <div className="mt-2">
                    <img
                      src={backgroundImage}
                      alt="Background preview"
                      className="w-full h-24 object-cover rounded border"
                    />
                  </div>
                )}
              </div>

              <Button onClick={handleAddFloor} className="w-full">
                Create Floor
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Floor Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Floor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-floor-name">Floor Name</Label>
                <Input
                  id="edit-floor-name"
                  value={newFloorName}
                  onChange={(e) => setNewFloorName(e.target.value)}
                  placeholder="e.g., Main Floor, VIP Area"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-floor-width">Width (px)</Label>
                  <Input
                    id="edit-floor-width"
                    type="number"
                    value={newFloorWidth}
                    onChange={(e) => setNewFloorWidth(Number(e.target.value))}
                    min="400"
                    max="2000"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-floor-height">Height (px)</Label>
                  <Input
                    id="edit-floor-height"
                    type="number"
                    value={newFloorHeight}
                    onChange={(e) => setNewFloorHeight(Number(e.target.value))}
                    min="300"
                    max="1500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-background-image">Background Image (Optional)</Label>
                <div className="mt-2">
                  <Input
                    id="edit-background-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                {backgroundImage && (
                  <div className="mt-2">
                    <img
                      src={backgroundImage}
                      alt="Background preview"
                      className="w-full h-24 object-cover rounded border"
                    />
                  </div>
                )}
              </div>

              <Button onClick={handleEditFloor} className="w-full">
                Update Floor
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {floors.map((floor) => (
          <Card
            key={floor.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              floor.id === activeFloorId
                ? 'ring-2 ring-blue-500 bg-blue-50'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onFloorSelect(floor.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{floor.name}</CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditDialog(floor);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  {floors.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onFloorDelete(floor.id);
                        toast.success('Floor deleted successfully');
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xs text-gray-600">
                <div>Size: {floor.width} × {floor.height}</div>
                <div>Objects: {floor.objects.length}</div>
                {floor.backgroundImage && (
                  <div className="flex items-center mt-1">
                    <Upload className="w-3 h-3 mr-1" />
                    Background set
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
