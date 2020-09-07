import React, {useContext, useEffect, useState} from "react"
import {useParams, useHistory, NavLink} from "react-router-dom";
import './appearence/css/index.css'
import './appearence/css/ResultPage.css'
import {useHttp} from "../hooks/Http.hook"
import {AuthContext} from "./context/AuthContext"
import ScaleIncreasing from './helpers/ScaleIncreasing'

export const ResultPage = () => {

    const login = useParams().id
    const link = useParams().link

    const {request} = useHttp()
    const {token, username, userType} = useContext(AuthContext)
    const history = useHistory()

    if (userType !== 'p' && login !== username)
        history.push(`/tests/${link}`)

    const [result, setResult] = useState([])
    const [test, setTest] = useState('')
    const [error, setError] = useState('Пока что такого результата нет')
    const [importantResults, setImportantResults] = useState(false)
    const [notImportantResults, setNotImportantResults] = useState(false)

    const fetchResult = async () => {
        try {
            let fetched = await request(`/api/tests/${link}/result/${login}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            })
            if (!fetched.message){
                setError(null)
                setTest(fetched.test)
                setResult(fetched.scales)
                if (fetched) document.title = fetched.user + ': ' + fetched.test

                if (fetched.scales[0].important)
                    setImportantResults(true)
                if (!fetched.scales[fetched.scales.length - 1].important)
                    setNotImportantResults(true)
            }
        }
        catch (e) {
        }
    }

    useEffect(() => {
        document.body.style = 'transition-duration: .7s; transition-timing-function: ease-in-out; background: white;'
    })
    useEffect(() => {
        if (!test)
            fetchResult()
    }, [test])

    return(
        <div className = 'resultPage'>

            {
                error &&
                <p className = 'notFound'>
                    {error}
                </p>
            }

            <h1>{test}</h1>

            {
                result.map((res, i) => {
                    if (res.important)
                    return (
                        <div className = 'resultModule extra' title = {`Баллы: ${res.points} / ${res.maxPoints}`} key = {i}>
                            <h3>{res.name}: {res.intervalName}</h3>
                            <h2>{res.points} / {res.maxPoints}</h2>
                            <div className = 'pointsScale'>
                                {ScaleIncreasing(res.points, res.maxPoints, '#E88732', '#AB5500')}
                            </div>
                            <p>{res.intervalDescription}</p>
                        </div>
                    )
                })
            }

            {
                result.map((res, i) => {
                    if (!res.important)
                        return (
                            <div className = 'resultModule normal' key = {i}>
                                <h3>{res.name}: {res.intervalName}</h3>
                                <h2>{res.points} / {res.maxPoints}</h2>
                                <div className = 'pointsScale' title = {`Баллы: ${res.points} / ${res.maxPoints}`}>
                                    {ScaleIncreasing(res.points, res.maxPoints, '#E0E7B4', '#96A07C')}
                                </div>
                                <p className = 'resultDescription'>{res.intervalDescription}</p>
                            </div>
                        )
                })
            }

            <div className = 'flexboxRow'>
            {
                !error && login === username &&
                <NavLink to = {`/tests/${link}`} className = 'longGreenBtn'>
                    <p>Пройти заново</p>
                </NavLink>
            }
            </div>
        </div>
    )
}

export default ResultPage