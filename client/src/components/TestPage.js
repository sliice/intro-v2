import React, {useCallback, useContext, useEffect, useState} from 'react'
import './appearence/css/index.css'
import './appearence/css/TestPage.css'
import {AuthContext} from "./context/AuthContext";
import {useHttp} from "../hooks/Http.hook";
import {useHistory, useParams} from 'react-router-dom'
import {NavLink} from "react-router-dom";
import {ReactComponent as Arrow} from './appearence/images/Arrow.svg'
import {ReactComponent as EditIcon} from './appearence/images/EditIcon.svg'

export const TestPage = () => {

    const link = useParams().id
    const history = useHistory()

    const [test, setTest] = useState({ name: '', description: '', shortDescription: '', questions: [], answers: []})
    const {token, userID, username, userType} = useContext(AuthContext)
    const [answers, setAnswers] = useState([])
    const {request} = useHttp()


    const [content, setContent] = useState('description')
    const [index, setIndex] = useState(0)
    const [goNext, setGoNext] = useState(false)

    const fetchTestData = useCallback(async () => {
        try {
            const fetched = await request(`/api/tests/short/${link}`, 'GET', null, {
                Authorization: `Bearer ${token}`,
            })
            setTest(fetched)
            if (fetched) document.title = fetched.name
        }
        catch (e) {
            history.push('/')
        }
    }, [token, request])

    const saveAnswers = async () => {
        try {
            const data = await request(`/api/tests/${link}/save`, 'POST', {userID, answers, link, date: new Date()})
            if (data.message === 'Result is saved')
                history.push(`/tests/${link}/${username}`)
        }
        catch (e) {}
    }

    const showTest = e => {
        e.preventDefault()
        setContent('testStartPage')
    }
    const next = async (e) => {
        e.preventDefault()
        if (index != test.q - 1)
            setIndex(index + 1)
        else
            await saveAnswers()

    }

    const back = e => {
        e.preventDefault()
        setTimeout(() =>  setIndex(index - 1), 300)
    }

    const handleAnswering = async (e, i, j) => {
        let answ = answers

        if (!answ[j])
            answ[j] = []

        if (!answ[j].includes(i))
            answ[j].push(i)

        for (let k = 0; k < answ.length; k++){
            if (!answ[k])
                answ[k] = []
            else {
                if (answ[k].includes(i)){
                    let index = answ[k].indexOf(i)
                    if (index != -1 && j != k)
                        answ[k].splice(index, 1)
                }
                answ[k].sort((a, b) => a > b ? 1 : -1)
            }
        }

        setAnswers(answ)
        await next(e)
    }

    useEffect(() => {
        fetchTestData()
        if (content === 'testStartPage')
            document.body.style = 'transition-duration: 1s; transition-timing-function: ease-in-out; background: #E6EBC3;'
    }, [fetchTestData, content])


    return (
        <div>
            { content === 'description' &&
                <div className = 'testInfo'>

                    <div className = 'nameAndEditIcon'>
                        <h1 className = 'bigTestName'>{test.name}</h1>
                        {
                            userType === 'p' &&
                            <NavLink to = {`/tests/${link}/edit`}>
                                <EditIcon/>
                            </NavLink>
                        }
                    </div>

                    <p className='testDescription'>{test.shortDescription}
                    <br/>{test.description}</p>

                    <div className = 'flexboxRow'>
                        <div type='button' className = 'longGreenBtn' onClick = {showTest}>
                            <p>Пройти</p>
                        </div>
                    </div>
                </div>
            }

            { content === 'testStartPage' &&
                <div>
                {
                   test.questions.map((question, i) => {
                       if (i == index)
                       return (
                           <div className = 'questionCard' key = {i}>

                               <div className = 'arrows'>
                                   {
                                       (i > 0) &&
                                       <Arrow className = 'backArrow' onClick={e => back(e)}/>
                                   }
                               </div>

                               <h1>{i + 1}/{test.q}</h1>
                               <p>{question}</p>

                               <div className = 'answersBox'>
                               {
                                   test.answers.map((answer, j) => {
                                       return(
                                           <div className = 'answersBox'>
                                               <div className = 'answerbtn' key = {j} onClick = {(e) => handleAnswering(e, i, j)}/>
                                               <p>{answer}</p>
                                           </div>)
                                   })
                               }
                                   </div>

                               {
                                   // && (answers.filter(a => a.includes(i)).length == 1) &&
                                   // answers.filter(a => a.includes(i)).length > 0 &&
                               }
                           </div>
                       )
                        })
                }
                    {/*{*/}
                    {/*    // index == test.questions - 1 &&*/}
                        {/*<input type='button' className = 'yesbtn'  value = 'результат' disabled={loading} onClick={e => saveAnswers(e)}/>*/}
                    {/*}*/}
                    {/*<input type='button' className = 'yesbtn'  value = 'результат' disabled={loading} onClick={e => saveAnswers(e)}/>*/}
                </div>
            }
        </div>


    )
}

export default TestPage;