import React, { useState } from 'react';
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

const NewModal = ({ isOpen, onClose, onTaskAdded }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [category, setCategory] = useState('work');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('');

  if (!isOpen) return null;

  const submitTask = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!taskTitle || !dueDate || !status) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const displayName = user.displayName || "default";
      const tasksRef = collection(db, "tasks", user.uid, displayName);
      await addDoc(tasksRef, {
        task: taskTitle,
        desc: taskDesc,
        category,
        dueDate: new Date(dueDate),
        isChecked: false,
        status,
        createdAt: new Date(),
      });

      onTaskAdded();
      onClose();
    } catch (error) {
      console.log("Error adding task:", error);
    }
  };

  const handleReset = () => {
    setTaskTitle('');
    setTaskDesc('');
    setCategory('work');
    setDueDate('');
    setStatus('');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl shadow-lg pb-3 pt-3 pr-6 pl-6 max-w-xl w-full">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800 border-b-2">Create Task</h2>
        <form onSubmit={submitTask}>
          <div className="mb-2">
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              required
              className="border border-gray-300 p-2 w-full rounded"
              placeholder="Task title"
            />
            <textarea
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              placeholder="Task description"
              className="border border-gray-300 p-2 w-full rounded mt-2"
            />
            <div className='flex justify-between mt-3'>
              <div className='flex flex-col'>
                <p>Task Category*</p>
                <div className='flex gap-2'>
                  <button
                    type='button'
                    onClick={() => setCategory('work')}
                    className={`border border-black p-1 rounded-xl ${category === 'work' ? 'bg-blue-500 text-white' : ''}`}
                  >
                    Work
                  </button>
                  <button
                    type='button'
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
                  <option value="" disabled>Choose</option>
                  <option value="todo">To Do</option>
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
              Add Task
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-200 transition duration-200"
            >
              Reset
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

export default NewModal;