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

  const handleTextAreaChange = (e) => {
    if (e.target.value.length <= 300) {
      setTaskDesc(e.target.value);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl shadow-lg pb-3 pt-3 pr-6 pl-6 max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Edit Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2 mt-4">
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              required
              className="border border-gray-300 p-2 w-full rounded-lg bg-gray-100"
              placeholder="Update task"
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
            <div className="flex justify-between mt-3">
              <div className="flex flex-col gap-2">
                <p>Task Category*</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCategory('work')}
                    className="border border-black p-1 pr-5 pl-5 text-sm rounded-xl"
                    style={{
                      backgroundColor: category === 'work' ? '#CBABCE' : '',
                      color: category === 'work' ? 'white' : ''
                    }}                  >
                    Work
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory('professional')}
                    className="border border-black p-1 pr-5 pl-5 text-sm rounded-xl"
                    style={{
                      backgroundColor: category === 'professional' ? '#CBABCE' : '',
                      color: category === 'professional' ? 'white' : ''
                    }}                  >
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

          <div className="flex justify-end gap-4 mt-10">
            <button
              type="button"
              onClick={onClose}
              className="border border-gray-300 px-6 py-2 rounded-3xl text-sm font-semibold hover:bg-gray-200 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-white px-6 py-2 rounded-3xl text-sm font-semibold"
              style={{ backgroundColor: '#7B1A84' }}            >
              Update Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
