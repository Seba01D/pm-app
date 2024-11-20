export interface Task {
    id: string;
    description: string;
    tile_id: string;
    is_complete: boolean;
    full_description: string;
  }
  
  export interface Tile {
    id: string;
    name: string;
  }
  