import React, { useState, useEffect } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from './firebaseConfig';

const EditTaskModal = ({ isOpen, onClose, taskId, initialTask, onEdit }) => {
  const [task, setTask] = useState(initialTask || '');

  // Update task value if initialTask changes
  useEffect(() => {
    setTask(initialTask || '');
  }, [initialTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (taskId) {
      try {
        const taskRef = doc(db, 'tasks', taskId);
        await updateDoc(taskRef, { task });
        onEdit();  // Callback to refresh task list in parent
        onClose();  // Close the modal after editing
      } catch (error) {
        console.log('Error updating task:', error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl shadow-lg pb-3 pt-3 pr-6 pl-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Edit Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block text-gray-600">Task</label>
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              required
              className="border border-gray-300 p-2 w-full rounded"
              placeholder="Update task"
            />
          </div>
          <div className="flex justify-between mt-3">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
            >
              Update Task
            </button>
            <button
              type="button"
              onClick={onClose}
              className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-200 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
