import { useEffect, useState } from "react";
import { auth } from "../components/firebaseConfig";
import { db } from "../components/firebaseConfig";
import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";

const Dashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [tasks, setTasks] = useState([]);
  const collectionRef = collection(db, "tasks");
  const [createTask, setCreateTask] = useState('');

  useEffect(() => {
    const getTasks = async () => {
      await getDocs(collectionRef).then((task) => {
        let tasksData = task.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        setTasks(tasksData);
      }).catch((err) => {
        console.log(err);
      })
    }
    getTasks();
  }, [])

  console.log("tasks", tasks);

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      console.log(user);
      // console.log(user?.photoURL);
      setUserDetails(user);
    });
  }

  useEffect(() => {
    fetchUserData();
  }, []);


  async function handleLogout() {
    try {
      await auth.signOut();
      window.location.href = "/";
      console.log("User logout");
    } catch (error) {
      console.log("error in logging out", error.message);
    }
  }

  const submitTask = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collectionRef, {
        task: createTask,
        isChecked: false
      })
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  const deleteTask = async (id) => {
    try {
      window.confirm("Are you sure delete ?");
      // console.log(id);
      const documentRef = doc(db, "tasks", id);
      await deleteDoc(documentRef);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      {userDetails ? (
        <>
          <img src={userDetails.photoURL} />
          <h3>Welcome {userDetails.displayName}</h3>
          <div>
            <p>Email: {userDetails.email}</p>
          </div>
          <button className="bg-orange-600" onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Loading...</p>
      )}

      {tasks.map(({ task, id }) =>
        <div key={id}>
          <div>
            <span>
              <input type="checkbox" />
              {task}
            </span>
          </div>
          <button>Edit</button>
          <br />
          <button onClick={() => deleteTask(id)}>Delete</button>
        </div>
      )}

      <form onSubmit={submitTask}>
        <input type="text" onChange={e => setCreateTask(e.target.value)} />
        <button type="submit">Add Task</button>
      </form>
    </div>
  )
}

export default Dashboard