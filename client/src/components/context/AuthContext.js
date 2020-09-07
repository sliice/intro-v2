import {createContext} from 'react'

function noop() {}

export const AuthContext = createContext({
    token: null,
    userID: null,
    username: null,
    userType: null,
    name: null,
    surname: null,
    login: noop,
    logout: noop,
    isAuthenticated: false
})