  "use client";

  import React, { useState, useEffect, useCallback } from "react";
  import { fetchTasksForTile, addTaskToTile, toggleTaskComplete, updateTaskDetails, deleteTask, updateTaskPriority, fetchPriorities } from "@/app/api/taskApi/route";
  import { Priority, Task, Tile } from "@/app/types";
  import TaskDetailsModal from "./taskDetailsModal"; // Import modal component
  import { FaCheck, FaPlus, FaTimes, FaEdit, FaTrash } from "react-icons/fa";
  import { updateTile, deleteTile } from "@/app/api/tileApi/route"; // Assuming you have these API functions

  const MAX_DESCRIPTION_LENGTH = 18;

  export default function TileComponent({ tile }: { tile: Tile }) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskDescription, setTaskDescription] = useState("");
    const [isAddingTask, setIsAddingTask] = useState(false);

    // Modal state
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Edit tile state
    const [isEditingTile, setIsEditingTile] = useState(false);
    const [newTileName, setNewTileName] = useState(tile.name);

    const [priorities, setPriorities] = useState<Priority[]>([]);

    // Fetch tasks for the tile
    const fetchTasks = useCallback(async () => {
      try {
        const data = await fetchTasksForTile(tile.id);
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }, [tile.id]);

    useEffect(() => {
      
      fetchTasks();
      const loadPriorities = async () => {
        try {
          const prioritiesData = await fetchPriorities();  // Assuming you have this API
          setPriorities(prioritiesData);
        } catch (error) {
          console.error("Error loading priorities:", error);
        }
      };
  
      loadPriorities();
    }, [fetchTasks]);

    // Add a new task
    const addTask = useCallback(async () => {
      if (taskDescription.trim() === "") return;

      try {
        const newTask = await addTaskToTile(taskDescription, tile.id);
        setTasks((prevTasks) => [...prevTasks, newTask]);
        setTaskDescription("");
        setIsAddingTask(false);
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }, [taskDescription, tile.id]);

    // Toggle task completion
    const toggleComplete = useCallback(async (taskId: string, isComplete: boolean) => {
      try {
        await toggleTaskComplete(taskId, isComplete);
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, is_complete: !isComplete } : task
          )
        );
      } catch (error) {
        console.error("Error toggling task completion:", error);
      }
    }, []);

    // Delete a task
    const handleDelete = useCallback(async (taskId: string) => {
      try {
        await deleteTask(taskId);
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }, []);

    const getPriorityColor = (priorityId: string) => {
      const priority = priorities.find((p) => p.id === priorityId);
      return priority ? priority.color : ""; // Default color if not found
    };

    // Open modal
    const openModal = (task: Task) => {
      setSelectedTask(task);
      setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
      setSelectedTask(null);
      setIsModalOpen(false);
    };

    // Save task details (full description)
    const saveTaskDetails = async (newFullDescription: string) => {
      if (!selectedTask) return;

      try {
        await updateTaskDetails(selectedTask.id, { full_description: newFullDescription });
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === selectedTask.id
              ? { ...task, full_description: newFullDescription }
              : task
          )
        );
        setSelectedTask((prev) =>
          prev ? { ...prev, full_description: newFullDescription } : null
        );
      } catch (error) {
        console.error("Error saving task details:", error);
      }
    };

    // Update task name
    const updateTaskName = async (taskId: string, newName: string) => {
      try {
        await updateTaskDetails(taskId, { description: newName });
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === taskId ? { ...task, description: newName } : task))
        );
        setSelectedTask((prev) =>
          prev ? { ...prev, description: newName } : null
        );
      } catch (error) {
        console.error("Error updating task name:", error);
      }
    };

    // Toggle task completion from modal
    const toggleCompleteFromModal = async () => {
      if (!selectedTask) return;

      const newCompletionStatus = !selectedTask.is_complete;

      await toggleComplete(selectedTask.id, selectedTask.is_complete);
      setSelectedTask((prev) =>
        prev ? { ...prev, is_complete: newCompletionStatus } : null
      );
    };

    // Delete task from modal
    const deleteTaskFromModal = async () => {
      if (!selectedTask) return;

      await handleDelete(selectedTask.id);
      closeModal();
    };

    // Edit tile name
    const editTileName = async () => {
      if (newTileName !== tile.name) {
        try {
          await updateTile(tile.id, newTileName); // Wywołanie API do aktualizacji nazwy kafla
          setIsEditingTile(false);
          // Aktualizuj lokalny stan, aby od razu wyświetlić nową nazwę
          tile.name = newTileName; // Zaktualizuj nazwę w stanie tile
        } catch (error) {
          console.error("Error updating tile:", error);
        }
      }
    };
    
    const handlePriorityChange = async (taskId: string, newPriorityId: string) => {
      try {
        await updateTaskPriority(taskId, newPriorityId); // Wywołanie API, aby zaktualizować priorytet w bazie danych
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, priority_id: newPriorityId } : task
          )
        );
      } catch (error) {
        console.error("Error updating task priority:", error);
      }
    };

    // Delete tile
    const deleteTileHandler = async () => {
      try {
        await deleteTile(tile.id); // Assuming this API exists
        // Handle tile deletion success (like removing it from the UI)
      } catch (error) {
        console.error("Error deleting tile:", error);
      }
    };

    return (
      <div className="p-4 bg-gray-100 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between">
          {isEditingTile ? (
            <div className="flex items-center">
              <input
                type="text"
                value={newTileName}
                maxLength={16}
                onChange={(e) => setNewTileName(e.target.value)}
                className="border-b-2 bg-gray-100 border-gray-300 text-lg font-bold text-blue-700 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={editTileName}
                className="ml-1 text-gray-600 hover:text-green-500 transition"
              >
                <FaCheck />
              </button>
              <button
                onClick={() => setIsEditingTile(false)}
                className="ml-1 text-gray-600 hover:text-red-500 transition"
              >
                <FaTimes />
              </button>
            </div>
          ) : (
            <h2 className="text-lg font-bold text-blue-700">{tile.name}</h2>
          )}
          {!isEditingTile && (
            <div className="flex items-center space-x-2">
              <button onClick={() => setIsEditingTile(true)} className="text-gray-600 hover:text-blue-500">
                <FaEdit />
              </button>
              {/*<button onClick={deleteTileHandler} className="text-gray-600 hover:text-red-500">
                <FaTrash />
              </button>*/}
            </div>
          )}
        </div>

        {/* The rest of the tile component (tasks, adding tasks, etc.) remains unchanged */}
        <div className="mt-4 space-y-2">
  {tasks.map((task) => (
    <div
      key={task.id}
      className="p-2 border rounded-lg bg-white shadow-sm hover:bg-gray-200 cursor-pointer"
      onClick={() => openModal(task)}
    >
      <div className="flex items-center">
        {/* Kwadracik z kolorem priorytetu */}
        <div
          className="w-1 h-4 mr-2"
          style={{ backgroundColor: getPriorityColor(task.priority_id) }}
        ></div>
        {/* Opis zadania */}
        <p
          className={`text-sm font-medium ${
            task.is_complete ? "line-through text-gray-500" : "text-gray-700"
          }`}
        >
          {task.description}
        </p>
      </div>
      {task.full_description && (
        <p className="text-xs text-gray-500 truncate">{task.full_description}</p>
      )}
    </div>
  ))}
</div>


        {/* Section to add new tasks */}
        <div className="mt-4">
          {isAddingTask ? (
            <div className="flex items-center">
              <input
                type="text"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Description"
                className="p-2 border border-gray-300 rounded-xl w-full focus:outline-none focus:border-blue-500"
                maxLength={MAX_DESCRIPTION_LENGTH}
              />
              <button
                onClick={addTask}
                className="ml-2 text-gray-600 hover:text-green-500 transition"
                aria-label="Add task"
              >
                <FaCheck />
              </button>
              <button
                onClick={() => setIsAddingTask(false)}
                className="ml-2 text-gray-600 hover:text-red-500 transition"
                aria-label="Cancel add task"
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

        {/* TaskDetailsModal */}
        {selectedTask && (
          <TaskDetailsModal
            isOpen={isModalOpen}
            onClose={closeModal}
            taskDescription={selectedTask.description}
            fullDescription={selectedTask.full_description || ""}
            isComplete={selectedTask.is_complete}
            onSave={saveTaskDetails}
            onUpdateName={(newName) => updateTaskName(selectedTask.id, newName)}
            onDelete={deleteTaskFromModal}
            onToggleComplete={toggleCompleteFromModal}
            selectedTask={selectedTask}
            onPriorityChange={handlePriorityChange}
          />
        )}
      </div>  
    );
  }
