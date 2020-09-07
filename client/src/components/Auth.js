import React, {useContext, useEffect, useState} from 'react';
import {useHttp} from "../hooks/Http.hook";
import {AuthContext} from "./context/AuthContext";
import './appearence/css/Auth.css';
import './appearence/css/index.css';
import {ReactComponent as INTRO} from './appearence/images/INTRO.svg'


export const Auth = () => {

    const auth = useContext(AuthContext)
    const {loading, request, error, clearError} = useHttp();
    const [form, setForm] = useState({ login: '', password: '' })

     const changeHandler = event => {
         setForm({...form, [event.target.name]: event.target.value})
     }

    const keyPressedHandler = async (e) => {
        if (form.login && form.password){
            if (e.which == 13 || e.keyCode == 13)
                await loginHandler()
        }
    }

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', {...form})
            console.log(data.message)
            auth.login(data.token, data.userID, data.userType, data.name, data.surname, data.username)
        }
        catch (e) {}
    }

    useEffect(() => {
        document.title = 'Intro'
        document.body.style = 'background: #E0E7B4;'
    }, [error, clearError])


      return (
          <p className = 'authPage'>
              <INTRO id = 'intropic'/>
              <div className = 'cover' />
              <div className = 'authFormAndButton'>
                  <div className = 'authform'>
                      <input type='text' id = 'login' name='login' placeholder='Логин' onChange = { e => changeHandler(e)}
                             value = {form.login}
                             onKeyPress = { e => keyPressedHandler(e) }/>
                      <input type='password' id = 'password' name='password' placeholder='Пароль' onChange = { e => changeHandler(e)}
                             value = {form.password}
                             onKeyPress = { e => keyPressedHandler(e) }/>
                  </div>
                  <input type='button' className = 'loginbtn' onClick = {e => loginHandler(e) } disabled = {loading}/>
                  <div className = 'loginbtn' onClick = {e => loginHandler(e) } disabled = {loading}/>
              </div>
          </p>
      )
}

export default Auth