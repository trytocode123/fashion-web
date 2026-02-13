import {Outlet, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {useEffect} from "react";


const PreventToHome = () => {
    const auth = useSelector(state => state.auth.account);
    const navigate = useNavigate();
    useEffect(() => {
        if (auth) {
            navigate("/home");
        }
    }, []);
    return (
        <Outlet/>
    )
}

export default PreventToHome;