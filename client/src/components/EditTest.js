import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useHistory, useParams} from "react-router-dom"
import classNames from 'classnames/bind'
import './appearence/css/index.css'
import './appearence/css/AddTest.css'
import {AuthContext} from "./context/AuthContext";
import createShortLink from "./helpers/CreateShortLink";
import {useHttp} from "../hooks/Http.hook";
import {ReactComponent as AddIcon} from "./appearence/images/AddIcon.svg"
import {ReactComponent as CancelIcon} from "./appearence/images/CancelIcon.svg"
import notify from './helpers/Notify'
import showError from './helpers/ShowError'
import {RegExps} from "./helpers/RegExps";
import ConfirmWindow from "./helpers/ConfirmWindow";


export const EditTest = () => {

    const testlink = useParams().link

    const {token} = useContext(AuthContext)
    const {request} = useHttp();
    const history = useHistory()

    const [errors, setErrors] = useState({ name: '', link: '' })
    const [saveBtnClasses, setSaveBtnClasses] = useState({test: 'invisible', dropbtn: 'invisible'})
    const [isDeleting, activateDeleting] = useState(false)

    const [testData, setTestData] = useState({
        name: '',
        link: '',
        shortDescription: '',
        description: '',
        scales: [{
            name: '' ,
            intervals: [{
                name: '',
                description: '',
                min: '',
                max: '',
                important: false
            }],
            scaleanswers: [{
                k: '',
                questions: []
            }]
        }],
        questions: [''],
        answers: ['']
    })
    const [testDataFetched, setTestDataFetched] = useState(false)

    const handleSaveBtnClasses = (e, test, dropbtn) => {
        e.preventDefault()
        let testClass, deleteClass
        if (!test)
            testClass = 'invisible'
        else testClass = 'slow_appearing'

        if (!dropbtn)
            deleteClass = 'invisible'
        else deleteClass = 'slow_appearing'

        setSaveBtnClasses({test: testClass, dropbtn: deleteClass})
    }

    const isImportantBtn = isImportant => {
        return classNames({inactiveImportantBtn: !isImportant, activeImportantBtn: isImportant})
    }

    const saveDraftBtnClasses = isImportant => {
        return classNames({inactiveImportantBtn: !isImportant, activeImportantBtn: isImportant})
    }


    const textStatus = isActive => {
        return classNames({inactiveText: !isActive, activeText: isActive})
    }


    const fetchTest = useCallback(async() => {
        try {
            const fetched = await request(`/api/tests/full/${testlink}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            })
            setTestData(fetched)
            setTestDataFetched(true)
        }
        catch (e) {}
    }, [token, request])

    const handleSaving = async(e) => {
        e.preventDefault()
        await saveTest()
    }


    const saveTest = async() => {
        if (await checkFields(true)){
            const data = await request('/api/addtest/savetest', 'POST', {...testData, date: new Date()})
            if (data.message === 'Test is saved') {
                notify('Тест сохранён')
                setTestData({...testData, _id: data.id})
            }
        }
    }

    const handleDeleteActivating = e => {
        e.preventDefault()
        activateDeleting(!isDeleting);
    }

    const handleDeleting = async (e) => {
        e.preventDefault()
        await deleteTest()
    }

    const deleteTest = useCallback(async() => {
        try {
            const shortLink = document.getElementById('testLink').value
            const data = await request(`/api/tests/${shortLink}/drop`, 'POST', null)
            if (data.message === 'Test is deleted') {
                notify('Тест удалён')
                setTimeout(() => history.push('/'), 500)
            }
        }
        catch (e) {}
    }, [token, request])

    const checkFields = async(doubleCheck) => {
        let permission = false
        try {

            let name = '', link = ''
            if (testData.name && !RegExps.testNameRegExp.test(testData.name)) {
                name = 'Допустима только кириллица, пробелы и знаки препинания'
                await showError(true, 'testName', 'errorTestName')
            }
            else if (!testData.name) {
                name = 'Введите название методики'
                !doubleCheck && notify('Введите название методики, чтобы сохранить черновик')
                await showError(true, 'testName', 'errorTestName')
            }
            if (testData.link && !RegExps.linkRegExp.test(testData.link)) {
                if (name){
                    testData.link = ''
                }
                else if (!name){
                    link = 'Допустимы только буквы a-z, цифры и дефис между ними'
                    await showError(true, 'testLink', 'errorTestLink')
                }
            }
            else if (!testData.link) {
                if (!name) testData.link = createShortLink(testData.name)
                else testData.link = ''
            }

            await setErrors({name, link})

            !name && await showError(false, 'testName', 'errorTestName')
            !link && await showError(false, 'testLink', 'errorTestLink')

            if (!name && !link)
                permission = true

            let check = ''
            if (!testData.name) check += 'n'
            if (!testData.questions[0]) check += 'q'
            if (!testData.answers[0]) check += 'a'

            if (doubleCheck){
                switch (check){
                    case 'nqa':
                        notify('Введите название методики, хотя бы один вопрос и вариант ответа');
                        break;
                    case 'qa':
                        notify('Введите хотя бы один вопрос и вариант ответа');
                        break;
                    case 'nq':
                        notify('Введите название методики и хотя бы один вопрос');
                        break;
                    case 'na':
                        notify('Введите название методики и хотя бы один вариант ответа');
                        break;
                    case 'q':
                        notify('Введите хотя бы один вопрос');
                        break;
                    case 'a':
                        notify('Введите хотя бы один вариант ответа');
                        break;
                }
                if (check !== '') permission = false;
            }

            return permission
        }
        catch (e) {}
    }


    const changeHandler = async (e) => {
        e.preventDefault()
        if (e.target.name === 'name') {
            let link = createShortLink(e.target.value)
            await setTestData({...testData, [e.target.name]: e.target.value, link})
        }
        else
            await setTestData({...testData, [e.target.name]: e.target.value})
    }

    const handleAddingScale = e => {
        e.preventDefault()
        const scales = testData.scales
        scales.push({
            name: '' ,
            intervals: [{
                name: '',
                description: '',
                min: '',
                max: '',
                important: false
            }],
            scaleanswers: [{
                k: '',
                questions: []
            }]
        })
        setTestData({...testData, scales})
    }

    const handleDeletingScale = (e, i) => {
        e.preventDefault()
        let scales = testData.scales
        scales.splice(i, 1)
        setTestData({...testData, scales})
        if (scales.length == 0) handleAddingScale(e)
    }

    const handleAddingInterval = (e, i) => {
        e.preventDefault()
        let scales = testData.scales
        let intervals = scales[i]['intervals']
        intervals.push({
            name: '',
            description: '',
            min: '',
            max: '',
            important: false
        })
        scales['intervals'] = intervals
        setTestData({...testData, scales})
    }

    const handleDeletingInterval = (e, i, j) => {
        e.preventDefault()
        let scales = testData.scales
        let intervals = scales[i]['intervals']
        intervals.splice(j, 1)
        scales['intervals'] = intervals
        setTestData({...testData, scales})
        if (intervals.length == 0) handleAddingInterval(e, i)
    }

    const handleAddingAnswer = e => {
        e.preventDefault()
        const answers = testData.answers
        answers.push('')
        setTestData({...testData, answers})
    }

    const handleDeletingAnswer = (e, i) => {
        e.preventDefault()
        let answers = testData.answers
        answers.splice(i, 1)
        setTestData({...testData, answers})
        if (answers.length == 0) handleAddingAnswer(e)
    }

    const handleAddingQuestion = e => {
        e.preventDefault()
        const questions = testData.questions
        questions.push('')
        setTestData({...testData, questions})
    }

    const handleDeletingQuestion = (e, i) => {
        e.preventDefault()
        let questions = testData.questions
        questions.splice(i, 1)
        setTestData({...testData, questions})
        if (questions.length == 0) handleAddingQuestion(e)
    }

    const changeScaleHandler = (e, i) => {
        let scales = testData.scales
        if (e.target.name === 'k' && !e.target.value)
            scales[i][e.target.name] = 0
        else scales[i][e.target.name] = e.target.value
        setTestData({...testData, scales})
    }

    const changeIntervalHandler = (e, i, j) => {
        e.preventDefault()
        let scales = testData.scales
        let intervals = scales[i]['intervals']

        // if (e.target.id === 'isImportantYes' || e.target.id === 'isImportantNo' || e.target.id === 'isImportantP')
        if (e.target.id === 'isImportantYes' || e.target.id === 'isImportantNo')
            intervals[j]['important'] = !intervals[j]['important']

        else if (e.target.name === 'min' || e.target.name === 'max')
            intervals[j][e.target.name] = parseInt(e.target.value)
        else
            intervals[j][e.target.name] = e.target.value

        scales[i]['intervals'] = intervals
        setTestData({...testData, scales})
    }

    const changeAnswersHandler = (e, i) => {
        e.preventDefault()
        let answers = testData.answers
        answers[i] = e.target.value
        setTestData({...testData, answers})
    }

    const changeQuestionsHandler = (e, i) => {
        e.preventDefault()
        let questions = testData.questions
        questions[i] = e.target.value
        setTestData({...testData, questions})
    }

    const changeScaleAnswersHandler = (e, i, j, k) => {
        e.preventDefault()

        try {
            let data = testData
            let scale = data.scales[i]
            let questions = [], index, scaleanswers = []

            if (scale.scaleanswers[j])
                scaleanswers = scale.scaleanswers[j]
            else
                scaleanswers = {}

            if (e.target.name === 'k')
                scaleanswers.k = parseInt(e.target.value)

            else {
                if (scaleanswers.questions) {
                    questions = scaleanswers.questions
                    index = questions.indexOf(k)
                    if (index == -1)
                        questions.push(k)
                    else
                        questions.splice(index, 1)
                }
                else
                    questions.push(k)

                questions.sort((a, b) => a > b ? 1 : -1)
                scaleanswers.questions = questions
            }

            scale.scaleanswers[j] = scaleanswers
            data.scales[i] = scale
            setTestData({...testData, data})
        }
        catch (e) {}
    }

    const colorBackground = (e, el, i, j, c, side) => {
        try {
            let color
            switch (c) {
                case 'red':
                    if (side) document.getElementById(el + i + j).style = 'transition-duration: 1s; transition-timing-function: ease-in-out; background: linear-gradient(90deg, #ffffff 0%, #fbe7d6 100%);';
                    else document.getElementById(el + i + j).style = 'transition-duration: 1s; transition-timing-function: ease-in-out; background: linear-gradient(90deg, #fbe7d6 0%, #ffffff 100%);';
                    break;

                case 'white':
                    document.getElementById(el + i + j).style = 'transition-duration: 1s; transition-timing-function: ease-in-out; background: inherit;';
                    break;
            }
        }
        catch (e) {}
    }

    const keyPressedHandler = (e, i) => {
        e.preventDefault()

        if (e.which == 13 || e.keyCode == 13) {
            if (e.target.name === 'q')
                handleAddingQuestion(e)
            else if (e.target.name === 'a')
                handleAddingAnswer(e)
        }

        if ((e.which == 8 || e.keyCode == 8 || e.key === 'Backspace' ||
            e.which == 46 || e.keyCode == 46 || e.key === 'Delete') && e.target.value === ''){
            if (e.target.name === 'q')
                handleDeletingQuestion(e, i)
            else if (e.target.name === 'a')
                handleDeletingAnswer(e, i)
        }

    }

    useEffect(() => {
        document.body.style = 'transition-duration: 1s; transition-timing-function: ease-in-out; background: #FFFFFF;'
        document.title = 'Редактировать методику'
    }, [])


    useEffect(() => {
        const interval = setInterval(() => {
            if (testData.name)
                saveTest()
        }, 20000)

        return () => clearInterval(interval)
    }, [testData.name, testData.shortDescription, testData.description, testData._id])

    useEffect(() => {
        if (!testDataFetched) fetchTest()
    }, [testData])

    return (
        <div className = 'addingTest'>

            <h1>{testData.name}</h1>

            <div className = 'addingTestModule'>
                <h2>Название методики</h2>

                <div className = 'inputWithError'>
                    {   testData.name !== 'Без названия' &&
                    <input type = 'text' name = 'name' id = 'testName' value = {testData.name} placeholder = 'Название методики' onChange = {e => changeHandler(e)}/>}
                    {   testData.name === 'Без названия' &&
                    <input type = 'text' name = 'name' id = 'testName' value = '' placeholder = 'Название методики' onChange = {e => changeHandler(e)}/>}
                    <p className = 'error' id = 'errorTestName'>{errors.name}</p>
                </div>


                <div className = 'shortLinkBox'>
                    <p>Краткая ссылка: </p>
                    <input type = 'text' id = 'testLink' name = 'link' value = {testData.link} placeholder = 'Краткая ссылка' onChange = {e => changeHandler(e)}/>
                </div>
            </div>

            <div className = 'addingTestModule'>
                <h2>Краткое описание</h2>
                <textarea name = 'shortDescription' value = {testData.shortDescription} placeholder = 'Краткое описание методики будет отображаться на странице со всеми методиками' onChange = {e => changeHandler(e)}/>
            </div>

            <div className = 'addingTestModule'>
                <h2>Описание</h2>
                <textarea name = 'description' value = {testData.description} placeholder = 'Полное описание методики будет отображаться на странице методики' onChange = {e => changeHandler(e)}/>
            </div>


            <div className = 'addingTestModule'>
                <h2>Варианты ответов</h2>
            </div>

            <div className = 'addingTestModule'>
                <div className = 'answersAdd'>
                    {
                        testData.answers.map((answer, i) => {
                            return(
                                <div className = 'questionAdd' key = {i}>
                                    <p>{ (i + 1) }</p>
                                    <input type = 'text' name = 'a' id = {'a' + i} placeholder = 'Вариант ответа ' value = {testData.answers[i]} onChange = { e => changeAnswersHandler(e, i) } onKeyUp = { e => keyPressedHandler(e, i) }/>
                                    <CancelIcon onMouseEnter = {e => colorBackground(e, 'a', i, '', 'red', false)} onMouseLeave = {e => colorBackground(e, 'a', i, '', 'white', false)} onClick = { e => handleDeletingAnswer(e, i) } titile = 'Убрать этот вариант ответа'/>
                                </div>)
                        })
                    }
                </div>
                <div onClick = { e => handleAddingAnswer(e) } className = 'adding'>
                    <AddIcon title = 'Новый вариант ответа'/>
                    <p className = {textStatus(false)}>Ещё один вариант ответа</p>
                </div>
            </div>

            <div className = 'addingTestModule'>
                <h2>Вопросы</h2>
            </div>

            <div className = 'addingTestModule'>
                <div className = 'questionsAdd'>
                    {
                        testData.questions.map((question, i) => {
                            return(
                                <div className = 'questionAdd' key = {i}>
                                    <p>{ (i + 1) }</p>
                                    <input type = 'text' name = 'q' id = {'q' + i} placeholder = 'Текст вопроса ' value = {testData.questions[i]} onChange = { e => changeQuestionsHandler(e, i) } onKeyUp = { e => keyPressedHandler(e, i) }/>
                                    <CancelIcon onMouseEnter = {e => colorBackground(e, 'q', i, '', 'red', false)} onMouseLeave = {e => colorBackground(e, 'q', i, '', 'white', false)} onClick = { e => handleDeletingQuestion(e, i) } titile = 'Убрать этот вопрос'/>
                                </div>)
                        })
                    }
                </div>
                <div onClick = { e => handleAddingQuestion(e) } className = 'adding'>
                    <AddIcon title = 'Новый вариант ответа'/>
                    <p className = {textStatus(false)}>Ещё один вопрос</p>
                </div>
            </div>



            <div className = 'addingTestModule'>
                <h2>Шкалы</h2>
                <div className = 'addingTestModule'>
                    <p>Шкальные интервалы – это балльные промежутки, которые могут характеризовать,
                        например, степень проявления тех или иных характеристик, которые исследует шкала</p>
                </div>

                <div className = 'scales'>
                    {
                        testData.scales &&
                        testData.scales.map((scale, i) => {
                            return(
                                <div className = 'scaleBox' id = {'scale' + i} key = {i}>
                                    <CancelIcon className = 'scaleDeletingIcon' onClick = { e => handleDeletingScale(e, i) } titile = 'Убрать эту шкалу'
                                                onMouseEnter = {e => colorBackground(e, 'scale', i, '', 'red', true)} onMouseLeave = {e => colorBackground(e, 'scale',  i, '', 'white', true)}/>
                                    <div className = 'scale soft_appearing' key = {i}>
                                        <input type = 'text' name = 'name' placeholder = {'Название шкалы ' + (i + 1)}  value = {scale.name} onChange = { e => changeScaleHandler(e, i) }/>

                                    </div>
                                    <div className = 'intervals'>
                                        {   scale.intervals.map((interval, j) => {
                                            return (
                                                <div className = 'interval soft_appearing' id = {'interval' + i + j} key = {j}>
                                                    <CancelIcon className = 'cancelIcon intervalDeletingIcon' onMouseEnter = {e => colorBackground(e, 'interval', i, j, 'red', true)} onMouseLeave = {e => colorBackground(e, 'interval', i, j, 'white', true)} onClick = { e => handleDeletingInterval(e, i, j) } titile = 'Убрать этот интервал'/>
                                                    <input type = 'text' className = 'intervalName' name = 'name' value = {interval.name} placeholder = {'Интервал ' + (j + 1)} onChange = { e => changeIntervalHandler(e, i, j) }/>

                                                    <p className = 'intervalP'>Интервал означает нарушение, выход за пределы нормы?</p>

                                                    <div className = 'isImportantYesContainer'>
                                                        <div className = 'isImportantYes' id = 'isImportantYes' className = { isImportantBtn(interval.important) } onClick = { e => changeIntervalHandler(e, i, j) }/>
                                                        <p className = {textStatus(interval.important)} onClick = { e => changeIntervalHandler(e, i, j) }>Да</p>
                                                    </div>
                                                    <div className = 'isImportantNoContainer'>
                                                        <div className = 'isImportantNo' id = 'isImportantNo' className = { isImportantBtn(!interval.important) } onClick = { e => changeIntervalHandler(e, i, j) }/>
                                                        <p className = {textStatus(!interval.important)} onClick = { e => changeIntervalHandler(e, i, j) }>Нет</p>
                                                    </div>


                                                    <textarea className = 'intervalDescription' name = 'description' value = {interval.description} placeholder = 'Комментарий' onChange = { e => changeIntervalHandler(e, i, j) }/>

                                                    <p className = 'intervalP2'>Сколько баллов по шкале нужно набрать, чтобы попасть в интервал?</p>

                                                    <div className = 'intervalMin'>
                                                        <p>От </p>
                                                        <input type = 'number' name = 'min' value = {interval.min} placeholder = 'баллов' onChange = { e => changeIntervalHandler(e, i, j) }/>
                                                    </div>

                                                    <div className = 'intervalMax'>
                                                        <p>До </p>
                                                        <input type = 'number' name = 'max' value = {interval.max} placeholder = 'баллов' onChange = { e => changeIntervalHandler(e, i, j) }/>
                                                    </div>
                                                </div>)})}
                                        <div className = 'adding' onClick = { e => handleAddingInterval(e, i) }>
                                            <AddIcon title = 'Новый интервал'/>
                                            <p className = {textStatus(false)}>Ещё один интервал</p>
                                        </div>
                                    </div>

                                    <div id = 'scaleAnswers'>
                                        {
                                            testData.answers[0] &&
                                            testData.answers.map((answer, j) => {
                                                return (
                                                    <div key = {j}>
                                                        <p>На какие вопросы нужно ответить "{answer}"?</p>
                                                        <div className = 'scaleAnswer'>
                                                            {   testData.questions[0] &&
                                                            testData.questions.map((q, k) => {
                                                                return (
                                                                    <div
                                                                        title = {q}
                                                                        className = {
                                                                            isImportantBtn(
                                                                                testData.scales[i].scaleanswers &&
                                                                                testData.scales[i].scaleanswers[j] &&
                                                                                testData.scales[i].scaleanswers[j].questions &&
                                                                                testData.scales[i].scaleanswers[j].questions.includes(k))}
                                                                        onClick = { e => changeScaleAnswersHandler(e, i, j, k) } key = {k}
                                                                    >
                                                                        <p>{(k + 1)}</p>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                        {
                                                            testData.scales[i].scaleanswers[j] &&
                                                            <div>
                                                                <p>На сколько будут умножаться баллы от ответа "{answer}"?</p>
                                                                <input type = 'number' name = 'k' placeholder = 'Коэффициент' min = '1' value = {testData.scales[i].scaleanswers[j].k} onChange = { e => changeScaleAnswersHandler(e, i, j, null) }/>
                                                            </div>
                                                        }
                                                    </div>)})
                                        }
                                    </div>
                                </div>
                            )})}
                </div>

                <div id = 'scaleAddingIcon' className = 'adding' onClick = { e => handleAddingScale(e) }>
                    <AddIcon title = 'Новая шкала'/>
                    <p className = {textStatus(false)}>Ещё одна шкала</p>
                </div>
            </div>

            <div className = 'savebtns'>
                <div className = 'savetestbtn' onClick = {e => handleSaving(e)}
                     onMouseEnter = {e => handleSaveBtnClasses(e, true, false )}
                     onMouseLeave = {e => handleSaveBtnClasses(e, false, false )}>
                    <p className = {saveBtnClasses.test}>Сохранить тест</p>
                </div>
                <div className = 'deletetestbtn' onClick = {e => handleDeleteActivating(e)}
                     onMouseEnter = {e => handleSaveBtnClasses(e, false,  true )}
                     onMouseLeave = {e => handleSaveBtnClasses(e, false, false )}>
                    <p className = {saveBtnClasses.dropbtn}>Удалить тест</p>
                </div>
            </div>
            {
                isDeleting &&
                <ConfirmWindow text = 'Удалить тест?' confirm={e => handleDeleting(e)} cancel={e => handleDeleteActivating(e)}/>
            }
        </div>


    )
}

export default EditTest
