import React from 'react'



import Login from "../form/login"
import {useTypedSelector} from "../../hooks/useTypedSelector";
import Loader from "../UI/loader"

const Main: React.FC = () => {

    const state = useTypedSelector(state => state.user)

    return (
        state.isLoaded === true ?
        <Loader/> :
        <Login/>
    )
}

export default Main