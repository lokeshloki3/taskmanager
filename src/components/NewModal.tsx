import React, { useState } from 'react';
import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebaseConfig";

const NewModal = ({ isOpen, onClose }) => {
  const [createTask, setCreateTask] = useState('');
  const collectionRef = collection(db, "tasks");

  const submitTask = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collectionRef, {
        task: createTask,
        isChecked: false,
      });
      onClose();
      window.location.reload();
    } catch (error) {
      console.log("Error adding task:", error);
    }
  };

  const handleReset = () => {
    setCreateTask('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl shadow-lg pb-3 pt-3 pr-6 pl-6 max-w-xl w-full">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800 border-b-2">Create Task</h2>
        <form onSubmit={submitTask}>

          <div className="mb-2">
            {/* <label className="block text-gray-600">Task</label> */}
            <input
              type="text"
              value={createTask}
              onChange={(e) => setCreateTask(e.target.value)}
              required
              className="border border-gray-300 p-2 w-full rounded"
              placeholder="Task title"
            />
            <textarea name="dshgdsh" id=""></textarea>
            <div className='flex justify-between'>
              <div className='flex flex-col'>
                <p>Task Category*</p>
                <div className='flex gap-2'>
                  <p className='border border-black p-1 rounded-xl'>Work</p>
                  <p className='border border-black p-1 rounded-xl'>Professional</p>
                </div>
              </div>

              <div>
                <p>Due on*</p>
                <input type="date" />
              </div>

              <div>
                <p>Task Status*</p>
                <select>
                  <option value="" disabled selected>Choose</option>
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