import {Navigate, Outlet} from "react-router-dom";
import {useSelector} from "react-redux";


const PreventToHome = () => {
    const auth = useSelector(state => state.auth.account.token);

    if (auth) {
        return <Navigate to={"/home"} replace/>
    }

    return (<Outlet/>)
}

export default PreventToHome;