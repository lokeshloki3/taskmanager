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

  // const handleReset = () => {
  //   setTaskTitle('');
  //   setTaskDesc('');
  //   setCategory('work');
  //   setDueDate('');
  //   setStatus('');
  // };

  const handleTextAreaChange = (e) => {
    if (e.target.value.length <= 300) {
      setTaskDesc(e.target.value);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl shadow-lg pb-3 pt-3 pr-6 pl-6 max-w-2xl w-full">
        <h2 className="text-2xl font-bold m-4 text-center text-gray-800">Create Task</h2>
        <hr />
        <form onSubmit={submitTask}>
          <div className="mb-2 mt-4">
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              required
              className="border border-gray-300 p-2 w-full rounded-lg bg-gray-100"
              placeholder="Task title"
            />
            <textarea
              value={taskDesc}
              onChange={handleTextAreaChange}
              placeholder="Task description"
              className="border border-gray-300 p-2 w-full rounded-lg mt-4 bg-gray-100 h-36"
            />
            <div className="text-right text-sm mt-1">
              <span>{taskDesc.length}/300</span>
            </div>
            <div className='flex justify-between mt-3'>
              <div className='flex flex-col gap-2'>
                <p>Task Category*</p>
                <div className='flex gap-2'>
                  <button
                    type='button'
                    onClick={() => setCategory('work')}
                    className="border border-black p-1 pr-5 pl-5 text-sm rounded-xl"
                    style={{
                      backgroundColor: category === 'work' ? '#CBABCE' : '',
                      color: category === 'work' ? 'white' : ''
                    }}
                  >
                    Work
                  </button>
                  <button
                    type='button'
                    onClick={() => setCategory('professional')}
                    className="border border-black p-1 pr-5 pl-5 text-sm rounded-xl"
                    style={{
                      backgroundColor: category === 'professional' ? '#CBABCE' : '',
                      color: category === 'professional' ? 'white' : ''
                    }}
                  >
                    Professional
                  </button>
                </div>
              </div>

              <div>
                <p className='mb-2'>Due on*</p>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  className="border border-gray-300 p-1 pr-5 pl-5 text-sm rounded-xl bg-gray-100"
                />
              </div>

              <div>
                <p className='mb-2'>Task Status*</p>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                  className="border border-gray-300 bg-gray-100 p-1 pr-5 pl-5 text-sm rounded-xl cursor-pointer"
                >
                  <option value="" disabled>Choose</option>
                  <option value="todo">To Do</option>
                  <option value="inprogress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

          </div>

          <div className="flex justify-end gap-4 mt-10">
            <button
              type="button"
              onClick={onClose}
              className="border border-gray-300 px-6 py-2 rounded-3xl text-sm font-semibold hover:bg-gray-200 transition duration-200"
            >
              CANCEL
            </button>

            <button
              type="submit"
              className="text-white px-6 py-2 rounded-3xl text-sm font-semibold"
              style={{ backgroundColor: '#7B1A84' }}
            >
              CREATE
            </button>
            {/* <button
              type="button"
              onClick={handleReset}
              className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-200 transition duration-200"
            >
              Reset
            </button> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewModal;