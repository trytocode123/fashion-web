import {useDispatch, useSelector} from "react-redux";
import {Outlet} from "react-router-dom";
import {logOut} from "../../redux/Reducer/authSlice.js";
import {useEffect} from "react";

const PublicRoute = () => {
    const auth = useSelector(state => state.auth?.account?.token);
    const dispatch = useDispatch();
    useEffect(() => {
        if (auth != null) {
            dispatch(logOut());
        }
    }, []);

    return (
        <Outlet/>
    )
}

export default PublicRoute;
