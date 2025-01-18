import React, { useEffect, useState } from "react";
import { FaTimes, FaTrash, FaCheck, FaPen } from "react-icons/fa";
import { updateTaskPriority, updateTaskDetails, fetchPriorities } from "@/app/api/taskApi/route";
import { Priority, Task } from "@/app/types";


interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskDescription: string;
  fullDescription: string;
  isComplete: boolean;
  onSave: (newFullDescription: string) => void;
  onUpdateName: (newName: string) => void;
  onDelete: () => void;
  onToggleComplete: () => void;
  onPriorityChange: (taskId: string, newPriorityId: string) => void; // Add onPriorityChange prop
  selectedTask: Task | null;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  isOpen,
  onClose,
  taskDescription,
  fullDescription,
  isComplete,
  onSave,
  onUpdateName,
  onDelete,
  onToggleComplete,
  onPriorityChange,
  selectedTask,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [newTaskName, setNewTaskName] = useState(taskDescription);
  const [newFullDescription, setNewFullDescription] = useState(fullDescription);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<Priority | null>(null);
  
  useEffect(() => {
    const loadPriorities = async () => {
      try {
        const prioritiesData = await fetchPriorities();
        const updatedPriorities = [{ id: "", name: "Priority" }, ...prioritiesData];
        setPriorities(prioritiesData);
        if (selectedTask) {
          const taskPriority = prioritiesData.find(
            (priority) => priority.id === selectedTask.priority_id
          );
          setSelectedPriority(taskPriority || null);
        }
      } catch (error) {
        console.error("Error loading priorities:", error);
      }
    };

    if (isOpen) {
      loadPriorities();
    }

  }, [isOpen, selectedTask]);

  const handleSaveName = () => {
    onUpdateName(newTaskName);
    setIsEditingName(false);
  };

  const handleSaveDescription = () => {
    onSave(newFullDescription);
    setIsEditingDescription(false);
  };

  const handlePriorityChange = async (priorityId: string) => {
    if (!selectedTask) return;

    const newPriority = priorities.find((p) => p.id === priorityId);
    setSelectedPriority(newPriority || null);

    // Update the task's priority in the database
    try {
      await updateTaskPriority(selectedTask.id, priorityId); // Call the API to update the priority
      // Pass updated priority to the parent component
      onPriorityChange(selectedTask.id, priorityId);
    } catch (error) {
      console.error("Error updating task priority:", error);
    }
  };

  const renderDescription = (description: string) => {
    if (!description.trim()) {
      return <span className="italic text-gray-400">No description provided yet.</span>;
    }
    const parts = description.split(/(https?:\/\/[^\s]+)/g);

    return parts.map((part, index) => {
      if (part.match(/^https?:\/\/[^\s]+$/)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {part}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-[90%] max-w-full md:w-[700px]">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Task Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </div>
  
        {/* Task Name Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            {isEditingName ? (
              <div className="flex items-center w-full">
                <input
                  type="text"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value.slice(0, 18))} // Limit to 18 characters
                  className="border-b border-gray-300 w-full px-2 py-1 focus:outline-none focus:border-blue-500"
                  placeholder="Edit task name"
                />
                <button
                  onClick={handleSaveName}
                  className="ml-2 text-green-500 hover:text-green-600 transition"
                  aria-label="Save name"
                >
                  <FaCheck />
                </button>
                <button
                  onClick={() => {
                    setNewTaskName(taskDescription);
                    setIsEditingName(false);
                  }}
                  className="ml-2 text-red-500 hover:text-red-600 transition"
                  aria-label="Cancel editing"
                >
                  <FaTimes />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                {/* Zmiana koloru na niebieski */}
                <span className="text-blue-600 text-lg font-medium truncate">{newTaskName}</span>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="ml-2 text-gray-500 hover:text-blue-500 transition"
                  aria-label="Edit name"
                >
                  <FaPen />
                </button>
              </div>
            )}
          </div>
        </div>
  
        {/* Linia oddzielająca */}
        <hr className="border-t border-gray-300 my-4" />
  
        {/* Full Description Section */}
        <div className="mb-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 mb-2">Details</label>
            {!isEditingDescription && (
              <button
                onClick={() => setIsEditingDescription(true)}
                className="text-gray-500 hover:text-blue-500 transition"
                aria-label="Edit description"
              >
                <FaPen />
              </button>
            )}
          </div>
          {!isEditingDescription ? (
            <div className="text-sm text-gray-600 whitespace-pre-line break-words max-h-32 overflow-y-auto">
              {renderDescription(newFullDescription)}
            </div>
          ) : (
            <>
              <textarea
                className="w-full p-2 border-b border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={newFullDescription}
                onChange={(e) => setNewFullDescription(e.target.value)}
                placeholder="Edit task details"
                rows={5}
              />
            </>
          )}
        </div>
  
        <div className="mb-2">
          {isEditingDescription && (
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setNewFullDescription(fullDescription);
                  setIsEditingDescription(false);
                }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-300"
                  >
                    Cancel
                  </button>
              <button
                onClick={handleSaveDescription}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                  >
                    Save
              </button>
            </div>
          )}
        </div>
  
        {/* Linia oddzielająca przed dolnymi przyciskami */}
        <hr className="border-t border-gray-300 my-6" />
        
{/* Priority Section */}
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">Priority</label>
  <select
    value={selectedPriority?.id || ""}
    onChange={(e) => handlePriorityChange(e.target.value)}
    className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
  >
    {/* Only show this option when no valid priority is selected */}
    <option value="" disabled hidden className="text-gray-400">
      Select Priority
    </option>
    {priorities.map((priority) => (
      <option key={priority.id} value={priority.id}>
        {priority.name}
      </option>
    ))}
  </select>
</div>



        <hr className="border-t border-gray-300 my-6" />

        {/* Actions Section */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={onToggleComplete}
            className={`px-4 py-2 rounded-lg transition ${
              isComplete
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {isComplete ? "Mark as Incomplete" : "Mark as Complete"}
          </button>
          <button
            onClick={onDelete}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            <FaTrash className="mr-2" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
