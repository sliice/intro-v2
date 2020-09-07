import React, {useCallback, useContext, useEffect, useState} from 'react';
import {NavLink} from "react-router-dom";

import {useHttp} from "../hooks/Http.hook";
import {AuthContext} from "./context/AuthContext";

import './appearence/css/index.css'
import './appearence/css/Tests.css'

import SearchIcon from "./appearence/images/SearchIcon";
import AddIcon from "./appearence/images/AddIcon";
import {ReactComponent as SortIcon} from './appearence/images/SortIcon.svg'

export const Tests = () => {

    const [tests, setTests] = useState([])
    const {token, userType} = useContext(AuthContext)
    const {request} = useHttp();
    const [shown, setShown] = useState([])
    const [search, setSearch] = useState([])
    const [notFound, setNotFound] = useState()
    const [sorted, setSorted] = useState(false)
    const [isSearching, activateSearching] = useState('none')

    const fetchTests = useCallback(async () => {
        try {
            const fetched = await request('/api/tests', 'GET', null, {
                Authorization: `Bearer ${token}`
            })
            fetched.sort((a, b) => a.date < b.date ? 1 : -1)
            setTests(fetched)
        } catch (e) {}
    }, [token, request])


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
                let testsArray = []
                tests.map(test => {
                    testsArray.push((test.name + test.questions + test.description).toString().toLowerCase())
                })

                let indexes = []
                testsArray.map((test, i) => {
                    if (test.toString().includes(searchFilter))
                        indexes.push(i)
                })

                if (indexes.length != 0){
                    setShown([...indexes])
                    setNotFound(false)
                }
                else setNotFound(true)
            }
            else showAll()
        }
        catch (e) {}
    }

    const doSort = e => {
        e.preventDefault()
        try {
            let testsCollection = tests
            switch (sorted) {
                case true:
                    document.getElementById('sortIcon').style = 'transform: rotate(360deg);'
                    testsCollection.sort((a, b) => a.date < b.date ? 1 : -1)
                    setTests(testsCollection)
                    setSorted(false);
                    break;
                case false:
                    document.getElementById('sortIcon').style = 'transform: rotate(180deg);'
                    testsCollection.sort((a, b) => a.date > b.date ? 1 : -1)
                    setTests(testsCollection)
                    setSorted(true);
                    break;
            }
        }
        catch (e) {}
    }

    const showAll = () => {
        let shownSize = []
        for (let i = 0; i < tests.length; i++){
            shownSize.push(i)
        }
        setShown([...shownSize])
    }

    const declension = questions => {
        const q = questions % 10
        switch (q) {
            case 1: return 'вопрос'; break;
            case 2:
            case 3:
            case 4: return 'вопроса'; break;
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 0: return 'вопросов'; break;
        }

    }


    useEffect(() => {
        if (tests.length == 0) fetchTests()
        document.body.style = 'transition-duration: .7s; transition-timing-function: ease-in-out; background: white;'
        document.title = 'Методики'

        if (shown.length == 0)
            showAll()
    }, [fetchTests, shown, showAll])

    return (
        <div>
            <h1 className = 'soft_appearing'>Методики</h1>


            <div className = 'searchSortAndAdd'>
                <input type = 'text' id = 'search'
                       className = {  isSearching === 'active' && 'searchAppearing' ||
                       isSearching === 'inactive' && 'searchDisappearing' ||
                       isSearching === 'none' && 'invisible'}
                       placeholder = 'Поиск по методикам' onChange = { e => doSearch(e) }/>

                <SearchIcon handleSearchActivating = {handleSearchActivating}/>
                <SortIcon onClick = {e => doSort(e)}/>

                {
                    userType === 'p' &&
                    <NavLink to='/addtest'>
                        <AddIcon/>
                    </NavLink>
                }



            </div>

            <div className = 'testsColumns'>
                {notFound && <h1 className = 'notFound'>Ничего не найдено</h1>}
            <div id = 'testsCollection1' className = 'testsColumn2'>
            {
                !notFound &&
                tests.map((test, index) => {
                if (shown.includes(index) && index % 2 != 1)
                return (
                    <NavLink to = {'/tests/' + test.link} key = {index} className = 'testItem soft_appearing'>
                        <p className = 'testName'>{test.name}</p>
                        <p className = 'questions'>{test.q} {declension(test.q)}</p>
                        <p className = 'description'>{test.shortDescription}</p>
                    </NavLink>
                )
            })}
            </div>

            <div id = 'testsCollection2' className = 'testsColumn2'>
                {
                    !notFound &&
                    tests.map((test, index) => {
                        if (shown.includes(index) && index % 2 != 0)
                            return (
                                <NavLink to = {'/tests/' + test.link} key = {index} className = 'testItem soft_appearing'>
                                    <p className = 'testName'>{test.name}</p>
                                    <p className = 'questions'>{test.q} {declension(test.q)}</p>
                                    <p className = 'description'>{test.shortDescription}</p>
                                </NavLink>
                            )
                    })}
            </div>
            </div>
        </div>
    )

}

export default Tests