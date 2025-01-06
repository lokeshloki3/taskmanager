import React, { useState, useEffect } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

const EditTaskModal = ({ isOpen, onClose, taskId, initialTaskData, onEdit }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [category, setCategory] = useState('work');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (initialTaskData) {
      setTaskTitle(initialTaskData.task || '');
      setTaskDesc(initialTaskData.desc || '');
      setCategory(initialTaskData.category || 'work');
      if (initialTaskData.dueDate) {
        const parsedDate =
          initialTaskData.dueDate.toDate?.() ||
          new Date(initialTaskData.dueDate);
        setDueDate(parsedDate.toISOString().substr(0, 10));
      } else {
        setDueDate('');
      }
      setStatus(initialTaskData.status || '');
    }
  }, [initialTaskData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (user && taskId) {
      try {
        const displayName = user.displayName || 'default';
        const taskRef = doc(db, 'tasks', user.uid, displayName, taskId);
        await updateDoc(taskRef, {
          task: taskTitle,
          desc: taskDesc,
          category,
          dueDate: new Date(dueDate),
          status,
        });

        onEdit(); // Refresh task list after edit
        onClose();
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
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              required
              className="border border-gray-300 p-2 w-full rounded"
              placeholder="Update task"
            />
            <textarea
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              placeholder="Task description"
              className="border border-gray-300 p-2 w-full rounded mt-2"
            />
            <div className="flex justify-between mt-3">
              <div className="flex flex-col">
                <p>Task Category*</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCategory('work')}
                    className={`border border-black p-1 rounded-xl ${category === 'work' ? 'bg-blue-500 text-white' : ''}`}
                  >
                    Work
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory('professional')}
                    className={`border border-black p-1 rounded-xl ${category === 'professional' ? 'bg-blue-500 text-white' : ''}`}
                  >
                    Professional
                  </button>
                </div>
              </div>

              <div>
                <p>Due on*</p>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  className="border border-gray-300 p-2 rounded"
                />
              </div>

              <div>
                <p>Task Status*</p>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                  className="border border-gray-300 p-2 rounded"
                >
                  <option value="" disabled>
                    Choose
                  </option>
                  <option value="todo">Todo</option>
                  <option value="inprogress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
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
