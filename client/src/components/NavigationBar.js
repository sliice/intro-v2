import React, {useCallback, useContext, useEffect, useState} from "react";
import {NavLink} from "react-router-dom";
import './appearence/css/index.css'
import {useLocation} from "react-router-dom";
import {AuthContext} from "./context/AuthContext";
import {useHttp} from "../hooks/Http.hook";
import {emojiToString} from "./helpers/Emoji";


export const NavigationBar = () => {

    const location = useLocation()
    const {userType, username, token} = useContext(AuthContext)
    const {request} = useHttp();
    const currentLocation = location.pathname.slice(1)
    const [pic, setPic] = useState()


    const fetchPic = useCallback(async () => {
        try {
            const fetched = await request(`/api/users/get/${username}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            })
            setPic(fetched.pic)
        }
        catch (e) {}
    }, [token, username])

    useEffect(() => {
        const small = 'transform: scale(0.8); opacity: 0.3;'
        const big = 'transform: scale(1.2); opacity: 1;'
        try {
            fetchPic()
            document.getElementById('tests').style = small
            document.getElementById('profile/' + username).style = small
            if (userType === 'p') document.getElementById('students').style = small
            document.getElementById(currentLocation).style = big
        }
        catch (e) {}
    }, [currentLocation])

    // const showNavBar = e => {
    //     e.preventDefault()
    //     setNavBarState(true)
    //     console.log(navBarClasses)
    // }

    // const hideNavBar = e => {
        // e.preventDefault()
        // setNavBarState(false)
        // console.log(navBarClasses)
    // }

    return (
        <div>

            {/*<div className = 'navBarCover' onMouseEnter={e => showNavBar(e)} onMouseLeave={e => hideNavBar(e)}/>*/}

            <div className = 'navBar'>
                <NavLink to = '/tests' className = 'picNavBar' id = 'tests'>
                    📋
                </NavLink>

                <NavLink to = {'/profile/' + username} className = 'picNavBar' id = {'profile/' + username}>
                    {pic && emojiToString(pic)}
                    { !pic && '😊️'}
                </NavLink>
                {
                    userType === 'p' &&
                    <NavLink to = '/students' className='picNavBar' id = 'students'>
                        👩🏻‍🏫
                        <p></p>
                    </NavLink>
                }
            </div>
        </div>
    )
}
    export default NavigationBar


