import { BiTask } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../components/firebaseConfig";
import mainimg from "../assets/mainimg.png"
import { useNavigate } from "react-router-dom";

const Home = () => {

    const navigate = useNavigate();
    // console.log(mainimg)

    const handleClick = () => {
        signInWithPopup(auth, provider).then(async (data) => {
            // console.log(data);
            if (data.user) {
                navigate("/profile");
            }
        })
    }

    return (
        <div className="flex justify-around bg-[#FFF9F9]">
            <div className="flex flex-col justify-center items-start min-h-screen gap-4">
                <div className="flex gap-4 font-bold ml-20 md:ml-0">
                    <BiTask style={{ color: '#C191C2' }} className="text-2xl md:text-4xl mt-2 md:mt-0" />
                    <p className="text-2xl md:text-4xl text-[#C191C2]">TaskBuddy</p>
                </div>
                <p className="text-center md:text-start text-sm">Streamline your workflow and track progress effortlessly <br />with out all-in-one task management app.</p>
                <div className="flex items-center mx-auto gap-2 p-4 text-xl md:text-3xl rounded-3xl mt-2 md:mt-6 pl-8 pr-8" style={{ backgroundColor: "#292929" }}>
                    <button className="text-white flex gap-2 items-center" onClick={handleClick}> <FcGoogle /> Continue with Google</button>
                </div>
            </div>
            <img src={mainimg} alt="main image" className=" max-w-[600px] w-full h-auto hidden md:block" />
        </div>
    )
}

export default Home;