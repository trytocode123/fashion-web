import {Navigate, Outlet} from "react-router-dom";
import {useSelector} from "react-redux";

const PrivateRoute = () => {
    const auth = useSelector(state => state.auth.account);
    const keyGoogle = localStorage.getItem("nextRotationAttemptTs");
    if (!auth || !keyGoogle) {
        return <Navigate to={"/"} replace/>
    }

    return <Outlet/>
}

export default PrivateRoute;