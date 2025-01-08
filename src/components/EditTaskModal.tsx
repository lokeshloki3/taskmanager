import React, { useState, useEffect } from 'react';
import { updateDoc, doc, Timestamp } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import TaskForm from './TaskForm';
import { Task } from '../pages/Profile';

interface EditTaskModalProps {
  onClose: () => void;
  taskId: string;
  initialTaskData: Task;
  onEdit: () => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ onClose, taskId, initialTaskData, onEdit }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [category, setCategory] = useState('work');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<"todo" | "inprogress" | "completed">("todo");

  useEffect(() => {
    if (initialTaskData) {
      setTaskTitle(initialTaskData.task || '');
      setTaskDesc(initialTaskData.desc || '');
      setCategory(initialTaskData.category || 'work');
      if (initialTaskData.dueDate) {
        const parsedDate =
          initialTaskData.dueDate instanceof Timestamp
            ? initialTaskData.dueDate.toDate()
            : new Date(initialTaskData.dueDate);
        setDueDate(parsedDate.toISOString().substr(0, 10));
      } else {
        setDueDate('');
      }
      setStatus(initialTaskData.status || '');
    }
  }, [initialTaskData]);

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 300) {
      setTaskDesc(e.target.value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

        onEdit();
        onClose();
      } catch (error) {
        console.log('Error updating task:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl shadow-lg pb-3 pt-3 pr-6 pl-6 max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Edit Task</h2>
        <form onSubmit={handleSubmit}>
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
              Update Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
