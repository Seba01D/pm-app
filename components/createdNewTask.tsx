"use client";

import { useState, useEffect } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { FaPlus, FaCheck, FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import TileComponent from "./tileComponent";

interface Tile {
  id: string;
  name: string;
  project_id: string;
}

interface CreatedNewTaskProps {
  projectId: string;
}

export default function CreatedNewTask({ projectId }: CreatedNewTaskProps) {
  const [tileName, setTileName] = useState("");
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [isAddingTile, setIsAddingTile] = useState(false);
  const [editingTileId, setEditingTileId] = useState<string | null>(null);
  const [editTileName, setEditTileName] = useState("");

  // Pobieranie istniejących kafelków z bazy danych
  useEffect(() => {
    const fetchTiles = async () => {
      const supabase = createSupabaseBrowser();
      const { data, error } = await supabase
        .from("project_tiles")
        .select("*")
        .eq("project_id", projectId);

      if (error) {
        console.error("Error fetching tiles:", error);
      } else {
        setTiles(data || []);
      }
    };

    fetchTiles();
  }, [projectId]);

  // Dodanie nowego kafelka do bazy danych i aktualizacja interfejsu
  const addTileToDatabase = async () => {
    if (tileName.trim() === "") return;

    const supabase = createSupabaseBrowser();
    const { data, error } = await supabase
      .from("project_tiles")
      .insert([{ name: tileName, project_id: projectId }])
      .select()
      .single();

    if (error) {
      console.error("Error adding tile:", error);
    } else if (data) {
      setTiles([...tiles, data as Tile]);
      setTileName("");
      setIsAddingTile(false);
    }
  };

  // Rozpocznij edytowanie kafelka
  const startEditingTile = (tileId: string, currentName: string) => {
    setEditingTileId(tileId);
    setEditTileName(currentName);
  };

  // Zapisz edytowaną nazwę kafelka
  const saveEditedTile = async (tileId: string) => {
    const supabase = createSupabaseBrowser();
    const { error } = await supabase
      .from("project_tiles")
      .update({ name: editTileName })
      .eq("id", tileId);

    if (error) {
      console.error("Error updating tile:", error);
    } else {
      setTiles((prevTiles) =>
        prevTiles.map((tile) =>
          tile.id === tileId ? { ...tile, name: editTileName } : tile
        )
      );
      setEditingTileId(null);
      setEditTileName("");
    }
  };

  // Usuń kafelek z bazy danych i aktualizuj interfejs
  const deleteTile = async (tileId: string) => {
    const supabase = createSupabaseBrowser();
    const { error } = await supabase
      .from("project_tiles")
      .delete()
      .eq("id", tileId);

    if (error) {
      console.error("Error deleting tile:", error);
    } else {
      setTiles((prevTiles) => prevTiles.filter((tile) => tile.id !== tileId));
    }
  };

  // Anuluj dodawanie kafelka
  const cancelAddingTile = () => {
    setTileName("");
    setIsAddingTile(false);
  };

  return (
    <div className="p-4 flex space-x-3 overflow-x-auto snap-x snap-mandatory">
      {/* Wyświetlanie istniejących kafelków */}
      {tiles.map((tile) => (
        <div
          key={tile.id}
          className="p-2 w-80 min-h-min flex-shrink-0 snap-start"
        >
  {/*        <div className="flex space-x-2 mt-2">
            {editingTileId === tile.id ? (
              <>
                <button
                  onClick={() => saveEditedTile(tile.id)}
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
                  onClick={() => startEditingTile(tile.id, tile.name)}
                  className="text-gray-500 hover:text-blue-500 transition"
                  aria-label="Edit"
                >
                  <FaEdit size={16} />
                </button>
                <button
                  onClick={() => deleteTile(tile.id)}
                  className="text-gray-500 hover:text-red-500 transition"
                  aria-label="Delete"
                >
                  <FaTrash size={16} />
                </button>
              </>
            )}
          </div>*/}
          {/* Każdy kafelek ma własny komponent TileComponent */}
          <TileComponent key={tile.id} tile={tile} />
        </div>
      ))}

      <div>
      {/* Dodawanie nowego kafelka */}
      {isAddingTile ? (
        <div className="p-4 border rounded bg-white shadow-md flex items-center space-x-2 w-80 flex-shrink-0 snap-start">
          <input
            type="text"
            value={tileName}
            onChange={(e) => setTileName(e.target.value)}
            placeholder="Enter tile name"
            maxLength={20}
            className="border-b border-gray-300 w-full focus:outline-none focus:border-blue-500 focus:ring-0 placeholder-gray-500"
          />
          <button
            onClick={addTileToDatabase}
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
          className="w-10 h-10 bg-gray-200 text-gray-600 flex items-center justify-center rounded-lg shadow-md hover:bg-gray-300 hover:text-gray-700 transition text-xl flex-shrink-0 snap-start"
        >
          <FaPlus />
        </button>
      )}
    </div>
    </div>
  );
}
