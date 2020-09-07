import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useParams, useHistory, NavLink} from "react-router-dom";

import {AuthContext} from "./context/AuthContext"
import {useHttp} from "../hooks/Http.hook"
import {emojis, emojiToString} from "./helpers/Emoji";
import notify from "./helpers/Notify";

import './appearence/css/Profile.css'
import './appearence/css/index.css'

import SearchIcon from "./appearence/images/SearchIcon";
import {ReactComponent as SortIcon} from './appearence/images/SortIcon.svg'

export const ProfileViewForStudents = () => {

    let login = useParams().id

    const history = useHistory()

    const {request} = useHttp();
    const {token, username} = useContext(AuthContext)
    const [results, setResults] = useState([])
    const [shown, setShown] = useState([])
    const [isSearching, activateSearching] = useState('none')
    const [isChoosingEmoji, activateChoosingEmoji] = useState(false)
    const [search, setSearch] = useState('')
    const [notFound, setNotFound] = useState()
    const [sorted, setSorted] = useState(false)
    const [resultsFetched, setResultsFetched] = useState(false)
    const [userDataFetched, setUserDataFetched] = useState(false)

    if (login !== username)
        history.push('/')

    const [userData, setUserData] = useState({
        name: '',
        surname: '',
        login: '',
        type: '',
        pic: '',
        birthdate: ''
    })
    const [userEditedData, setUserEditedData] = useState({
        pic: ''
    })

    const showAll = () => {
        let shownSize = []
        for (let i = 0; i < results.length; i++){
            shownSize.push(i)
        }
        setShown([...shownSize])
    }


    const fetchUserData = useCallback(async () => {
        try {
            const fetched = await request(`/api/users/get/${username}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            })
            setUserData(fetched)
            setUserEditedData(fetched)
            setUserDataFetched(true)
            if (fetched) document.title = fetched.name + ' ' + fetched.surname
        }
        catch (e) {}
    }, [token, username])

    const fetchResults = useCallback(async () => {
        try {
            const fetched = await request(`/api/results/${username}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            })

            fetched.sort((a, b) => a.date < b.date ? 1 : -1)
            setResults(fetched)
            setResultsFetched(true)
        }
        catch (e) {}
    }, [token, username])


    const handleSearchActivating = e => {
        e.preventDefault()
        switch (isSearching){
            case 'active':
                activateSearching('inactive');
                break
            case 'none':
            case 'inactive':
                activateSearching('active');
                document.getElementById('search').focus()
                break
        }
    }

    const doSearch = e => {
        e.preventDefault()
        try {
            let searchFilter = e.target.value.toString().toLowerCase()
            setSearch(searchFilter)
            setNotFound(false)
            if (searchFilter != '') {
                let resultsArray = []
                results.map(result => {
                    let res = ''
                    result.scales.map(r => {
                        res += r.toString()
                    })
                    resultsArray.push((result.test + res).toString().toLowerCase())
                })

                let indexes = []
                resultsArray.map((result, i) => {
                    if (resultsArray[i].toString().includes(searchFilter))
                        indexes.push(i)
                })

                if (indexes.length != 0) {
                    setNotFound(false)
                }
                else setNotFound(true)
            }
        }
        catch (e) {}
    }

    const doSort = e => {
        e.preventDefault()
        try {
            switch (sorted) {
                case true:
                    document.getElementById('sortIcon').style = 'transform: rotate(360deg);'
                    document.getElementById('resultsCollection').style = 'flex-direction: column;'
                    setSorted(false);
                    break;
                case false:
                    document.getElementById('sortIcon').style = 'transform: rotate(180deg);'
                    document.getElementById('resultsCollection').style = 'flex-direction: column-reverse;'
                    setSorted(true);
                    break;
            }
        }
        catch (e) {}
    }

    const handleChooseEmojiActivating = e => {
        e.preventDefault()
        activateChoosingEmoji(!isChoosingEmoji)
    }

    const saveEditedData = async(e) => {
        e.persist()
        try {
            const data = await request('/api/users/edit', 'POST', {...userData, oldLogin: userData.login, pic: emojis[e.target.id.slice(1)]})
            setUserData({...userData, pic: emojis[e.target.id.slice(1)]})
            if (data.message === 'User\'ve edited') notify('Новый эмоджи профиля установлен')
        }
        catch (e) {}
    }


    useEffect(() => {
        document.body.style = 'transition-duration: .7s; transition-timing-function: ease-in-out; background: white;'

        fetchUserData()
        fetchResults()

        if (shown.length == 0) showAll()

    }, [username, resultsFetched, userDataFetched])


    return (
        <div>
            <div className = 'profileContainer'>

                <div className = 'profileEditingPic' onClick = {e => handleChooseEmojiActivating(e)}> {emojiToString(userData.pic)} </div>
                {isChoosingEmoji &&
                    <div className = 'emojiContainerOnProfile'>
                        <div className = 'profileEditingPic' onClick = {e => handleChooseEmojiActivating(e)}> {emojiToString(userData.pic)} </div>
                        {
                            emojis.map((emoji, i) => {
                                return (
                                    <div className = 'addingStudentEmoji' onClick = {e => saveEditedData(e)} key = {i} id = {'e' + i}>
                                        {emojiToString(emoji)}
                                    </div>
                                )
                            })
                        }
                    </div>
                }

                <div className = 'profileHeader'>

                    <h1 id = 'fio'>{userData.name} {userData.surname}</h1>
                    <h2 id = 'loginOnProfile'>{userData.login}</h2>

                    {userData.type === 's' &&
                    <h3 id = 'type'>Ученик</h3>}

                </div>
            </div>

            {results.length != 0 &&
            <div className = 'searchAndSort'>
                <input type = 'text' id = 'search'
                       className = {  isSearching === 'active' && 'searchAppearing' ||
                       isSearching === 'inactive' && 'searchDisappearing' ||
                       isSearching === 'none' && 'invisible'}
                       placeholder = 'Поиск по результатам' onChange = { e => doSearch(e) }/>

                <SearchIcon handleSearchActivating = {handleSearchActivating}/>
                <SortIcon onClick = { e => doSort(e) } />



            </div>
            }

            <div id = 'resultsCollection' className = 'results'>
                {
                    notFound && <h1 className = 'notFound'>Ничего не найдено</h1> ||
                    !notFound &&
                    results.map((result, index) => {
                        if ((result.test + result.scales).toLowerCase().includes(search))
                        return (
                            <NavLink to={`/tests/${result.link}/${username}`} key={index} className='resultItem soft_appearing'>
                                <p className='resultTestName'>{result.test}</p>
                                <div className='shortResult'>
                                    {
                                        result.scales.map((res, i) => {
                                            return (
                                                <p>{res}</p>
                                            )
                                        })
                                    }
                                </div>
                            </NavLink>
                        )
                    })
                }
                {
                    !notFound && !results[0] &&
                    <h1 className = 'notFound'>Результатов пока нет</h1>
                }
            </div>

        </div>
    )


}

export default ProfileViewForStudents