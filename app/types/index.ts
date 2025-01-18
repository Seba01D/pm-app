export interface Task {
    priority(priority: any): unknown;
    id: string;
    description: string;
    tile_id: string;
    is_complete: boolean;
    full_description: string;
    priority_id: string;
  }
  
  export interface Tile {
    id: string;
    name: string;
  }
  
  export interface Project {
    id: string;
    name: string;
    description?: string;
    isOwner: boolean;
    created_at: string;
}

export interface Priority {
  id: string;
  name: string;
  color: string;
}
