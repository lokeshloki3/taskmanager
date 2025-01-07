import { useEffect, useState } from "react";
import { auth, db } from "../components/firebaseConfig";
import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import NewModal from "../components/NewModal";
import EditTaskModal from "../components/EditTaskModal";
import UserProfile from "../components/UserProfile";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchEmpty, setIsSearchEmpty] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserDetails(user);
        getUserTasks(user);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = tasks;

    if (categoryFilter) {
      filtered = filtered.filter(
        (task) => task.category?.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    if (dateFilter) {
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + parseInt(dateFilter));

      filtered = filtered.filter((task) => {
        if (task.dueDate?.seconds) {
          const taskDate = new Date(task.dueDate.seconds * 1000);
          return taskDate >= today && taskDate <= futureDate;
        }
        return false;
      });
    }
    if (searchQuery) {
      filtered = filtered.filter((task) =>
        task.task.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
    setIsSearchEmpty(filtered.length === 0);
  }, [tasks, categoryFilter, dateFilter, searchQuery]);

  const getUserTasks = async (user) => {
    if (user) {
      const displayName = user.displayName || "default";
      const tasksRef = collection(db, "tasks", user.uid, displayName);
      const taskSnapshot = await getDocs(tasksRef);
      const taskList = taskSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        isChecked: doc.data().isChecked || false,
      }));
      setTasks(taskList);
    }
  };


  const handleCheckboxChange = async (taskId) => {
    const task = tasks.find((task) => task.id === taskId);
    const newCheckedState = !task.isChecked;

    const taskRef = doc(db, "tasks", userDetails.uid, userDetails.displayName || "default", taskId);
    await updateDoc(taskRef, {
      isChecked: newCheckedState,
    });

    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, isChecked: newCheckedState } : task
      )
    );
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.href = "/";
    } catch (error) {
      console.log("Error in logging out:", error.message);
    }
  };

  const onTaskEditAdded = () => {
    if (auth.currentUser) {
      getUserTasks(auth.currentUser);
    }
  };

  const deleteTask = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this task?");
    if (isConfirmed) {
      try {
        const user = auth.currentUser;
        const displayName = user.displayName || "default";
        const taskDocRef = doc(db, "tasks", user.uid, displayName, id);
        await deleteDoc(taskDocRef);
        setTasks(tasks.filter((task) => task.id !== id));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const openEditModal = (task) => {
    setTaskToEdit(task);
    setEditModalOpen(true);
  };
  const closeEditModal = () => setEditModalOpen(false);

  const renderTaskRows = (status) => {
    const filteredByStatus = filteredTasks.filter(
      (task) => task.status === status
    );

    if (filteredByStatus.length === 0) {
      return (
        <tr>
          <td colSpan="5" className="text-center text-gray-500 py-4">
            No Tasks in {status.charAt(0).toUpperCase() + status.slice(1)}
          </td>
        </tr>
      );
    }

    return filteredByStatus.map((task) => (
      <tr key={task.id} className="bg-gray-100">
        <td className="border px-4 py-2">
          <div className="flex gap-4 justify-start">
            <input
              type="checkbox"
              checked={task.isChecked}
              onChange={() => handleCheckboxChange(task.id)}
            />
            <div>{task.task}</div>
          </div>
        </td>
        <td className="border px-4 py-2 text-center">
          {task.dueDate?.seconds
            ? new Date(task.dueDate.seconds * 1000).toLocaleDateString()
            : "No Due Date"}
        </td>
        <td className="border px-4 py-2 text-center">
          <span
            className={`px-2 py-1 rounded-lg ${task.status === "todo"
              ? "bg-pink-100"
              : task.status === "inprogress"
                ? "bg-sky-100"
                : "bg-green-100"
              }`}
          >
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
        </td>
        <td className="border px-4 py-2 text-center">{task.category}</td>
        <td className="border px-4 py-2 text-center">
          <button
            onClick={() => openEditModal(task)}
            className="bg-gray-500 text-white px-4 py-1 rounded-lg mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => deleteTask(task.id)}
            className="bg-red-500 text-white px-4 py-1 rounded-lg"
          >
            Delete
          </button>
        </td>
      </tr>
    ));
  };

  const countTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status).length;
  };

  const handleSortByDate = () => {
    const sortedTasks = [...tasks].sort((a, b) => {
      const dateA = a.dueDate?.seconds || 0;
      const dateB = b.dueDate?.seconds || 0;
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setTasks(sortedTasks);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleDateFilter = (days) => {
    setDateFilter(days);
  };

  return (
    <div className="mr-4 ml-4">
      {userDetails ? (
        <>
          <UserProfile
            userDetails={userDetails}
            setCategoryFilter={setCategoryFilter}
            handleLogout={handleLogout}
            openModal={openModal}
            handleDateFilter={handleDateFilter}
            tasks={tasks}
            filteredTasks={filteredTasks}
            sortOrder={sortOrder}
            handleSortByDate={handleSortByDate}
            renderTaskRows={renderTaskRows}
            countTasksByStatus={countTasksByStatus}
            openEditModal={openEditModal}
            deleteTask={deleteTask}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isSearchEmpty={isSearchEmpty}
          />
        </>
      ) : (
        <p>Loading...</p>
      )}

      {showModal &&
        <NewModal
          isOpen={showModal}
          onClose={closeModal}
          onTaskAdded={onTaskEditAdded}
        />}

      {editModalOpen && taskToEdit && (
        <EditTaskModal
          isOpen={editModalOpen}
          onClose={closeEditModal}
          taskId={taskToEdit.id}
          initialTaskData={taskToEdit}
          onEdit={onTaskEditAdded}
        />
      )}
    </div>
  );
};

export default Profile;
