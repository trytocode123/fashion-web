import {Outlet} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {logOut} from "../../redux/Reducer/authSlice.js";

const ResetAuth = () => {
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

export default ResetAuth;