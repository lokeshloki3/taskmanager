import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import TaskForm from './TaskForm';

type NewModalProps = {
  onClose: () => void;
  onTaskAdded: () => void;
};

const NewModal: React.FC<NewModalProps> = ({ onClose, onTaskAdded }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [category, setCategory] = useState('work');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<"todo" | "inprogress" | "completed">("todo");

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 300) {
      setTaskDesc(e.target.value);
    }
  };

  const submitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      alert('No user is currently logged in.');
      return;
    }

    if (!taskTitle || !dueDate || !status) {
      alert('Please fill all required fields.');
      return;
    }

    try {
      const displayName = user.displayName || 'default';
      const tasksRef = collection(db, 'tasks', user.uid, displayName);

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
      console.error('Error adding task:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl shadow-lg pb-3 pt-3 pr-6 pl-6 max-w-2xl w-full">
        <h2 className="text-2xl font-bold m-4 text-center text-gray-800">Create Task</h2>
        <hr />

        <form onSubmit={submitTask}>
          <TaskForm
            taskTitle={taskTitle}
            setTaskTitle={setTaskTitle}
            taskDesc={taskDesc}
            setTaskDesc={setTaskDesc}
            category={category}
            setCategory={setCategory}
            dueDate={dueDate}
            setDueDate={setDueDate}
            status={status as "todo" | "inprogress" | "completed"}
            setStatus={setStatus}
            handleTextAreaChange={handleTextAreaChange}
          />

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
              style={{ backgroundColor: '#7B1A84' }}
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewModal;
