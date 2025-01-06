import React, { useState } from 'react'
import { db } from './firebaseConfig'
import { doc, updateDoc } from 'firebase/firestore'

const EditTask = ({ task, id }) => {

    const [updatedTask, setUpdatedTask] = useState([task])

    const updateTask = async (e)=>{
        e.preventDefault();

        try {
            const taskDocument = doc(db,"tasks", id);
            await updateDoc(taskDocument,{
                task: updatedTask,
                isChecked: false,
            })
            window.location.reload();
        } catch (error) {
            console.log(error)
        }
    }
    console.log(task, id)
    return (
        <div>
            <input
            type='text'
            placeholder='Update task'
            defaultValue={updatedTask}
            onChange={e=>setUpdatedTask(e.target.value)}/>
            <button type='submit' onClick={e=> updateTask(e)}>Edit task</button>
        </div>
    )
}

export default EditTask