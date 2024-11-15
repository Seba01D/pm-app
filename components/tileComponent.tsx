import { createSupabaseBrowser } from "@/lib/supabase/client";
import { useEffect, useState, useCallback, useRef } from "react";
import { FaCheckSquare, FaPlus, FaRegSquare, FaTimes, FaCheck } from "react-icons/fa";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import React from "react";

interface Task {
  id: string;
  description: string;
  tile_id: string;
  is_complete: boolean;
}

interface Tile {
  id: string;
  name: string;
}

const ItemTypes = {
  TASK: "task",
};

const TaskComponent = React.forwardRef(function TaskComponent(
  { task, index, moveTask, toggleComplete }: any,
  ref: React.Ref<HTMLDivElement>
) {
  const dragRef = useRef<HTMLDivElement | null>(null);

  const [, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    hover: (draggedItem: any) => {
      if (draggedItem.index !== index) {
        moveTask(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  drag(drop(dragRef));

  return (
    <div
      ref={dragRef}
      className="flex rounded-lg items-center justify-between p-2 bg-white border border-gray-300 rounded 
                   hover:border-blue-600 cursor-move"
    >
      <span className={`flex-1 ${task.is_complete ? "line-through text-gray-400" : ""}`}>
        {task.description}
      </span>
      <button onClick={() => toggleComplete(task.id, task.is_complete)}>
        {task.is_complete ? <FaCheckSquare className="text-green-500" /> : <FaRegSquare />}
      </button>
    </div>
  );
});

export default function TileComponent({ tile }: { tile: Tile }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskDescription, setTaskDescription] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Pobieranie zadań dla danego kafelka
  const fetchTasks = useCallback(async () => {
    const supabase = createSupabaseBrowser();
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("tile_id", tile.id);

    if (error) {
      console.error("Error fetching tasks:", error);
    } else {
      setTasks(data || []);
    }
  }, [tile.id]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Dodawanie zadania
  const addTask = useCallback(async () => {
    if (taskDescription.trim() === "") return;

    const supabase = createSupabaseBrowser();
    const { data, error } = await supabase
      .from("tasks")
      .insert([{ description: taskDescription, tile_id: tile.id, is_complete: false }])
      .select()
      .single();

    if (error) {
      console.error("Error adding task:", error);
    } else {
      setTasks((prevTasks) => [...prevTasks, data]);
      setTaskDescription("");
      setIsAddingTask(false);
    }
  }, [taskDescription, tile.id]);

  // Przełączanie statusu ukończenia zadania
  const toggleComplete = useCallback(async (taskId: string, isComplete: boolean) => {
    const supabase = createSupabaseBrowser();
    const { error } = await supabase
      .from("tasks")
      .update({ is_complete: !isComplete })
      .eq("id", taskId);

    if (error) {
      console.error("Error updating task:", error);
    } else {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, is_complete: !isComplete } : task
        )
      );
    }
  }, []);

  // Funkcja do przemieszczania zadań
  const moveTask = (fromIndex: number, toIndex: number) => {
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(fromIndex, 1);
    updatedTasks.splice(toIndex, 0, movedTask);
    setTasks(updatedTasks);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 bg-gray-100 rounded-2xl shadow-lg">
        <h2 className="text-lg font-bold text-blue-700">{tile.name}</h2>
        {/* Zadania */}
        <div className="mt-4 space-y-2">
          {tasks.map((task, index) => (
            <TaskComponent
              key={task.id}
              task={task}
              index={index}
              moveTask={moveTask}
              toggleComplete={toggleComplete}
            />
          ))}
        </div>

        {/* Dodawanie zadania */}
        <div className="mt-4">
          {isAddingTask ? (
            <div className="flex items-center">
              <input
                type="text"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Description"
                className="p-2 border border-gray-300 rounded-xl w-full focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={addTask}
                className="ml-2 text-gray-600 hover:text-green-500 transition"
                aria-label="Zatwierdź zadanie"
              >
                <FaCheck />
              </button>
              <button
                onClick={() => setIsAddingTask(false)}
                className="ml-2 text-gray-600 hover:text-red-500 transition"
                aria-label="Anuluj"
              >
                <FaTimes />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingTask(true)}
              className="flex items-center text-gray-500 p-2 rounded-lg hover:bg-blue-200 hover:text-gray-700 transition w-full"
              aria-label="Add task"
            >
              <FaPlus className="mr-2" /> Add task
            </button>
          )}
        </div>
      </div>
    </DndProvider>
  );
}
