import {useState, useCallback, useEffect } from 'react'

const storageName = 'userData'

// saving the token, userID and userType in a local storage

export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [ready, setReady] = useState(false)
    const [userID, setuserID] = useState(null)
    const [userType, setuserType] = useState(null)
    const [name, setName] = useState(null)
    const [surname, setSurname] = useState(null)
    const [username, setUsername] = useState(null)


    const login = useCallback((jwtToken, userID, userType, name, surname, username) => {
        setToken(jwtToken)
        setuserID(userID)
        setuserType(userType)
        setName(name)
        setSurname(surname)
        setUsername(username)

        localStorage.setItem(storageName, JSON.stringify({ userID, token: jwtToken, userType, name, surname, username }))

    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setuserID(null)
        setuserType(null)
        setName(null)
        setSurname(null)
        setUsername(null)

        localStorage.removeItem(storageName)
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName))

        if (data && data.token) login(data.token, data.userID, data.userType, data.name, data.surname, data.username)

        setReady(true)
    }, [login])

    return { login, logout, token, userID, username, name, surname, userType, ready }
}