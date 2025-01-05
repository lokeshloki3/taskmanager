import { useEffect, useState } from "react";
import { auth } from "../components/firebaseConfig";
import { db } from "../components/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const Dashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [tasks, setTasks] = useState([]);
  const collectionRef = collection(db, "tasks");

  useEffect(() => {
    const getTasks = async () => {
      await getDocs(collectionRef).then((task) => {
        let tasksData = task.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        setTasks(tasksData);
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
        <button>Delete</button>
      </div>
      )}

    </div>
  )
}

export default Dashboard