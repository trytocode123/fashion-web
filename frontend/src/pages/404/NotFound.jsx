import {Link} from "react-router-dom";
import {useDispatch} from "react-redux";
import {logOut} from "../../redux/Reducer/authSlice.js";

const NotFound = () => {
    const dispatch = useDispatch();
    const handleBack = () => {
        dispatch(logOut());
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">

            <h1 className="text-9xl font-extrabold text-gray-800 tracking-widest">
                404
            </h1>

            <p className="mt-4 text-xl text-gray-600 text-center">
                Oops! The page you're looking for doesn't exist.
            </p>

            <div className="w-24 h-1 bg-indigo-500 rounded mt-6"></div>

            <div className="mt-8 flex gap-4">
                <Link
                    to="/home"
                    className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition duration-200"
                >
                    Go Home
                </Link>

                <Link
                    onClick={handleBack}
                    to="/"
                    className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-200"
                >
                    Back to Login
                </Link>
            </div>

        </div>
    );
};

export default NotFound;
