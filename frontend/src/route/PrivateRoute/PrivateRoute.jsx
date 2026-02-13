import {Navigate, Outlet} from "react-router-dom";
import {useSelector} from "react-redux";

const PrivateRoute = () => {
    const auth = useSelector(state => state.auth);
    if (!auth) {
        return <Navigate to={"/"} replace/>
    }

    return <Outlet/>
}

export default PrivateRoute;