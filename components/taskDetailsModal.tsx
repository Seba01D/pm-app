import React, { useState } from "react";
import { FaTimes, FaTrash, FaCheck, FaPen } from "react-icons/fa";

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
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [newTaskName, setNewTaskName] = useState(taskDescription);
  const [newFullDescription, setNewFullDescription] = useState(fullDescription);

  if (!isOpen) return null;

  const handleSaveName = () => {
    onUpdateName(newTaskName);
    setIsEditingName(false);
  };

  const handleSaveDescription = () => {
    onSave(newFullDescription);
    setIsEditingDescription(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[500px]">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Task Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </div>

        {/* Task Name Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            {isEditingName ? (
              <div className="flex items-center w-full">
                <input
                  type="text"
                  value={newTaskName}
                  onChange={(e) =>
                    setNewTaskName(e.target.value.slice(0, 18)) // Limit to 13 characters
                  }
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
                <span className="text-gray-800 text-lg font-medium truncate">
                  {newTaskName}
                </span>
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

        {/* Divider */}
        <hr className="border-gray-200 my-4" />

        {/* Full Description Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Details
            </label>
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
            <p className="text-sm text-gray-600 whitespace-pre-line break-words max-h-48 overflow-y-auto">
              {newFullDescription.trim()
                ? newFullDescription
                : <span className="italic text-gray-400">No description provided yet.</span>}
            </p>
          ) : (
            <textarea
              className="w-full p-2 border-b border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={newFullDescription}
              onChange={(e) => setNewFullDescription(e.target.value)}
              placeholder="Edit task details"
              rows={5}
            />
          )}
          {isEditingDescription && (
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => {
                  setNewFullDescription(fullDescription);
                  setIsEditingDescription(false);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDescription}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Save
              </button>
            </div>
          )}
        </div>

        {/* Divider */}
        <hr className="border-gray-200 my-4" />

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
