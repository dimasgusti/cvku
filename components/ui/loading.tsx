import { FaSpinner } from "react-icons/fa6";

const Loading = () => {
    return(
        <div className="w-full h-full flex flex-col justify-center items-center">
            <FaSpinner className="animate-spin" size={32} />
        </div>
    )
}

export default Loading;