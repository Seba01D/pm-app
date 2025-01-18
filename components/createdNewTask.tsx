"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import TileComponent from "./tileComponent";
import { addTile, deleteTile, fetchTiles, Tile, updateTile } from "@/app/api/tileApi/route";

interface CreatedNewTaskProps {
  projectId: string;
}

export default function CreatedNewTask({ projectId }: CreatedNewTaskProps) {
  const [tileName, setTileName] = useState("");
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [isAddingTile, setIsAddingTile] = useState(false);
  const [editingTileId, setEditingTileId] = useState<string | null>(null);
  const [editTileName, setEditTileName] = useState("");

  useEffect(() => {
    const loadTiles = async () => {
      const tilesData = await fetchTiles(projectId);
      const sortedTiles = tilesData.sort((a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      setTiles(sortedTiles);
    };
    loadTiles();
  }, [projectId]);

  const handleAddTile = async () => {
    if (tileName.trim() === "") return;
    const newTile = await addTile(tileName, projectId);
    if (newTile) {
      setTiles([...tiles, newTile]);
      setTileName("");
      setIsAddingTile(false);
    }
  };

  const handleEditTile = async (tileId: string) => {
    const success = await updateTile(tileId, editTileName);
    if (success) {
      setTiles((prevTiles) =>
        prevTiles.map((tile) =>
          tile.id === tileId ? { ...tile, name: editTileName } : tile
        )
      );
      setEditingTileId(null);
      setEditTileName("");
    }
  };

  const handleDeleteTile = async (tileId: string) => {
    const success = await deleteTile(tileId);
    if (success) {
      setTiles((prevTiles) => prevTiles.filter((tile) => tile.id !== tileId));
    }
  };

  const cancelAddingTile = () => {
    setTileName("");
    setIsAddingTile(false);
  };

 return (
    <div className="p-4">
      {/* Wrapper for horizontal scroll */}
      <div className="flex space-x-3 snap-x snap-mandatory">
        {tiles.map((tile) => (
          <div
            key={tile.id}
            className="w-80 min-h-min flex-shrink-0 snap-start"
          >
            <TileComponent tile={tile} />
            <div className="flex space-x-2 mt-2">
              {editingTileId === tile.id ? (
                <>
                  <button
                    onClick={() => handleEditTile(tile.id)}
                    className="text-gray-500 hover:text-green-500 transition"
                    aria-label="Save"
                  >
                    <FaCheck size={16} />
                  </button>
                  <button
                    onClick={() => setEditingTileId(null)}
                    className="text-gray-500 hover:text-red-500 transition"
                    aria-label="Cancel"
                  >
                    <FaTimes size={16} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleDeleteTile(tile.id)}
                    className="text-gray-500 hover:text-red-500 transition"
                    aria-label="Delete"
                  >
                    <FaTrash size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        <div className="pr-3">
          {isAddingTile ? (
            <div className="p-4 border rounded-xl bg-white shadow-md flex items-center space-x-2 w-80 flex-shrink-0 snap-start">
              <input
                type="text"
                value={tileName}
                onChange={(e) => setTileName(e.target.value)}
                placeholder="Enter tile name"
                maxLength={16}
                className="border-b border-gray-300 w-full focus:outline-none focus:border-blue-500 focus:ring-0 placeholder-gray-500"
              />
              <button
                onClick={handleAddTile}
                className="text-gray-500 hover:text-green-500 transition"
                aria-label="Accept"
              >
                <FaCheck />
              </button>
              <button
                onClick={cancelAddingTile}
                className="text-gray-500 hover:text-red-500 transition"
                aria-label="Cancel"
              >
                <FaTimes />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingTile(true)}
              className="p-3 h-10 w-80 bg-black bg-opacity-20 text-white flex items-center 
                        rounded-xl shadow-md hover:bg-black hover:bg-opacity-30 hover:text-gray-500 
                        transition flex-shrink-0 snap-start"
            >
              <FaPlus className="mr-2" /> Add another list
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
