
export interface Floor {
  id: string;
  name: string;
  width: number;
  height: number;
  backgroundImage: string | null;
  objects: GameObject[];
}

export interface GameObject {
  id: string;
  type: 'table' | 'slot-machine' | 'poker-table' | 'roulette' | 'blackjack';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  name: string;
}

export interface DragItem {
  type: string;
  objectType: GameObject['type'];
}
