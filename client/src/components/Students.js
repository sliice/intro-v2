import React, {Component, useCallback, useContext, useEffect, useState} from 'react';
import './appearence/css/index.css'
import './appearence/css/Auth.css'
import './appearence/css/Students.css';
import './appearence/css/DatePicker.css';
import {useHttp} from "../hooks/Http.hook";
import {AuthContext} from "./context/AuthContext";
import {emojis, emojiToString} from "./helpers/Emoji";
import RegExps from "./helpers/RegExps";
import {NavLink} from "react-router-dom";
import DatePicker from "react-datepicker/es";
import {registerLocale} from "react-datepicker";
import * as cyrToTranslit from 'cyrillic-to-translit-js'
import formatDateToRu from "./helpers/DateFormat";
import notify from './helpers/Notify'
import showError from './helpers/ShowError'
import SearchIcon from "./appearence/images/SearchIcon";
import AddIcon from "./appearence/images/AddIcon";
import {ReactComponent as SortIcon} from './appearence/images/SortIcon.svg'


export const Students = () => {

    const {loading, request} = useHttp();

    const [form, setForm] = useState({
        login: '',
        password: '',
        type: 's',
        pic: [128522],
        name: '',
        surname: '',
        grade: '',
        letter: '',
        birthday: ''
    })
    const [errors, setErrors] = useState({
        name: '',
        surname: '',
        login: '',
        password: ''
    })
    const [grades, setGrades] = useState([])
    const [shownGrades, setShownGrades] = useState([])
    const [search, setSearch] = useState([])
    const [notFound, setNotFound] = useState()
    const [sorted, setSorted] = useState(false)
    const [isSearching, activateSearching] = useState('none')
    const [isAdding, activateAdding] = useState('none')
    const [isChoosingEmoji, activateChoosingEmoji] = useState(false)
    const [date, setDate] = useState()
    const {token} = useContext(AuthContext)


    const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
    const days = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']

    registerLocale('ru', {
        localize: {
            month: i => months[i],
            day: i => days[i]
        },
        formatLong:{}
    });

    const changeHandler = e => {
        e.preventDefault()
        let login = form.login
        switch (e.target.name) {
            case 'grade':
                let thisYear = new Date().getFullYear();
                let then = new Date(thisYear - 7 - e.target.value, 0, 1);
                setDate(then);
                break
            case 'surname':
                login = cyrToTranslit().transform(e.target.value).toString().toLowerCase();
                break;
            case 'login':
                login = e.target.value.toString().toLowerCase();
                break;
        }
        setForm({...form, [e.target.name]: e.target.value, login: login, birthday: date})
    }


    const checkFields = async (e) => {
        e.preventDefault()
        try {
            if (!(form.name && form.surname && form.grade && form.letter && form.birthday && form.login && form.password))
                notify("Не все поля заполнены")

            let name = '', surname = '', login = '', password = ''
            if (form.name && !RegExps.cyrillicsRegExp.test(form.name)) {
                name = 'Допустима только из кириллица'
                await showError(true,'name', 'errorStudentName')
            }
            if (form.surname && !RegExps.cyrillicsRegExp.test(form.surname)) {
                surname = 'Допустима только из кириллица'
                await showError(true,'surname', 'errorStudentSurname')
            }
            if (form.login && !RegExps.loginRegExp.test(form.login)) {
                login = 'Допустимы только a-z, цифры, точка и пробел'
                await showError(true,'login', 'errorStudentLogin')
            }

            if (form.password && !RegExps.passwordRegExp.test(form.password)) {
                if (form.password.length < 6 || form.password.length > 20)
                    password = 'Пароль должен содержать от 6 до 20 символов'
                else
                    password = 'Допустимы только A-z, цифры, точка и пробел'
                await showError(true, 'password', 'errorStudentPassword')
            }

            !name && await showError(false,'name', 'errorStudentName')
            !surname && await showError(false,'surname', 'errorStudentSurname')
            !login && await showError(false,'login', 'errorStudentLogin')
            !password && await showError(false,'password', 'errorStudentPassword')

            setErrors({name, surname, login, password})
            if (!name && !surname && !login && !password)
                return true
            else
                return false

        }
        catch (e) {}
    }

    const setBirthday = birthday => {
        setDate(birthday)
        setForm({...form, birthday: birthday})
    }

    const registerHandler = async (e) => {
        e.preventDefault()
        try {
            if (await checkFields(e)){
                const data = await request('/api/students/create', 'POST', {...form})
                console.log(data.message)
                if (data.message === 'User\'ve created'){
                    notify('Пользователь создан')
                    setForm({
                        login: '',
                        password: '',
                        type: 's',
                        pic: [128522],
                        name: '',
                        surname: '',
                        grade: '',
                        letter: '',
                        birthday: ''
                    })
                }
                else if (data.message === 'This user already exists'){
                    notify('Пользователь с таким логином уже существует')
                }
            }
        }
        catch (e) {}
    }

    const fetchGrades = useCallback(async () => {
        try {
            const fetched = await request('/api/students', 'GET', null, {
                Authorization: `Bearer ${token}`
            })
            fetched.sort((a, b) => a.grade > b.grade ? 1 : -1);
            setGrades(fetched)

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
                let gradesArray = []
                grades.map(grade => {
                    let studentsArray = []
                    grade.students.map(student => {
                        studentsArray.push((student.name + student.surname).toString().toLowerCase())
                    })
                    gradesArray.push((grade.grade + grade.letter + studentsArray).toString().toLowerCase())
                })

                let indexes = []
                gradesArray.map((grade, i) => {
                    if (grade.toString().includes(searchFilter))
                        indexes.push(i)
                })

                if (indexes.length != 0){
                    setShownGrades([...indexes])
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
            switch (sorted) {
                case true:
                    document.getElementById('sortIcon').style = 'transform: rotate(360deg);';
                    document.getElementById('gradesCollection').style = 'flex-direction: column;';
                    setSorted(false);
                    break;
                case false:
                    document.getElementById('sortIcon').style = 'transform: rotate(180deg);';
                    document.getElementById('gradesCollection').style = 'flex-direction: column-reverse;';
                    setSorted(true);
                    break;
            }
        }
        catch (e) {}
    }

    const handleAddActivating = e => {
        e.preventDefault()
        switch (isAdding){
            case 'active':
                activateAdding('inactive');
                document.getElementById('label').className = 'addingPanelAppearing'
                document.getElementById('gradesCollection').className = 'addingPanelAppearing gradesCollection'
                document.getElementById('addingStudent').className = 'gradesDisappearing addingStudent'
                break
            case 'none':
            case 'inactive':
                activateAdding('active');
                document.getElementById('label').className = 'addingPanelDisappearing'
                document.getElementById('gradesCollection').className = 'addingPanelDisappearing gradesCollection'
                document.getElementById('addingStudent').className = 'gradesAppearing addingStudent'
                break
        }
    }

    const handleChooseEmojiActivating = e => {
        e.preventDefault()
        activateChoosingEmoji(!isChoosingEmoji)
    }

    const setFormPic = e => {
        e.preventDefault()
        setForm({...form, pic: emojis[e.target.id.slice(1)]})
    }

    const showAll = () => {
        let shownSize = []
        for (let i = 0; i < grades.length; i++){
            shownSize.push(i)
        }
        setShownGrades([...shownSize])
    }

    const changeGrade = async (e, k) => {
        e.preventDefault()
        try {
            const data = await request(`/api/students/grade/${k}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            })
            if (data.message === 'Grade have changed'){
                if (k == 1)
                    notify('Класс всех учеников повышен')
                else if (k == -1)
                    notify('Класс всех учеников понижен')
                fetchGrades(e)
            }
        }
        catch (e) {}
    }

    useEffect(() => {

        if (grades.length == 0) fetchGrades()
        document.body.style = 'transition-duration: .5s; transition-timing-function: ease-in-out; background: white;'
        document.title = 'Ученики'

        if (shownGrades.length == 0)
            showAll()

    }, [fetchGrades, shownGrades, showAll])




    return(
        <div>
            <h1 id = 'label' className = 'soft_appearing'>Ученики</h1>
            <div className = 'searchSortAndAdd'>
                <input type = 'text' id = 'search'
                       className = {  isSearching === 'active' && 'searchAppearing' ||
                       isSearching === 'inactive' && 'searchDisappearing' ||
                       isSearching === 'none' && 'invisible'}
                       placeholder = 'Поиск по ученикам и классам'onChange = {e => doSearch(e)}/>

                <SearchIcon handleSearchActivating = {handleSearchActivating}/>
                <SortIcon onClick = {e => doSort(e)}/>
                <AddIcon handleAddActivating ={handleAddActivating}/>

            </div>

                {notFound && <h1 className = 'notFound'>Ничего не найдено</h1>}

            <div id = 'gradesCollection' className = 'gradesCollection' >
                {
                    !notFound && grades &&
                    grades.map((grade, index) =>
                        {
                            if (shownGrades.includes(index))
                            return (
                                <div className = 'gradeItem gradesAppearing' key = {index}>
                                    <p className = 'grade'>{grade.grade}{grade.letter}</p>
                                    <div className = 'students'>
                                    {
                                        grade.students.map((student, i) => {
                                            if (/\d/.test(search) || (student.name + student.surname).toString().toLowerCase().includes(search))
                                                return (
                                                    <NavLink to = {'/profile/' + student.username} key = {i} className = 'studentItem soft_appearing'>
                                                        <div className = 'nameAndSurname'>
                                                            <p>{student.name} {student.surname}</p>
                                                        </div>
                                                        <p className = 'pic'>{emojiToString(student.pic)}</p>
                                                    </NavLink>
                                                )
                                        })
                                    }
                                    </div>
                                </div>
                            )
                        })
                }
            </div>
            <div className = 'addingStudent' id = 'addingStudent'>
                    {/*<input type='text' id = 'type' name='type' placeholder='Тип' onChange={changeHandler} value = {form.type}/>*/}
                <div className = 'addingStudentEmoji' onClick = { e => handleChooseEmojiActivating(e) } disabled={loading}>
                    {emojiToString(form.pic)}
                </div>

                {
                    isChoosingEmoji &&
                    <div className = 'emojiContainer'>
                        {
                            emojis.map((emoji, i) => {
                                return (
                                    <div className = 'addingStudentEmoji' onClick = {e => setFormPic(e)} key = {i} id = {'e' + i}>
                                        {emojiToString(emoji)}
                                    </div>
                                )
                            })
                        }
                    </div>
                }


                {!isChoosingEmoji &&
                <div className = 'addingStudentFormInputs'>
                <input type='text' id='name' name='name' placeholder='Имя' onChange={e => changeHandler(e)}
                       value={form.name}/>
                    <p className = 'error' id = 'errorStudentName'>{errors.name}</p>
                    <input type='text' id = 'surname' name='surname' placeholder='Фамилия' onChange={e => changeHandler(e)} value = {form.surname}/>
                    <p className = 'error' id = 'errorStudentSurname'>{errors.surname}</p>

                    <div className = 'gradeAndLetter'>
                    <select name='grade' defaultValue = '' onChange={e => changeHandler(e)}>
                    <option value = '' disabled>Класс</option>
                    <option value = '1'>1</option>
                    <option value = '2'>2</option>
                    <option value = '3'>3</option>
                    <option value = '4'>4</option>
                    <option value = '5'>5</option>
                    <option value = '6'>6</option>
                    <option value = '7'>7</option>
                    <option value = '8'>8</option>
                    <option value = '9'>9</option>
                    <option value = '10'>10</option>
                    <option value = '11'>11</option>
                    </select>
                    <div></div>
                    <select id = 'letter' name='letter' defaultValue = '' onChange={e => changeHandler(e)}>
                    <option value = '' disabled>Буква</option>
                    <option value = 'А'>А</option>
                    <option value = 'Б'>Б</option>
                    <option value = 'В'>В</option>
                    <option value = 'Г'>Г</option>
                    <option value = 'Д'>Д</option>
                    </select>
                    </div>

                    <DatePicker selected = {date}
                                value = {formatDateToRu(date)}
                    onChange = {date => setBirthday(date)}
                    placeholderText = 'Дата рождения'
                    locale = 'ru' dateFormat="dd/MM/yyyy"/>

                    <input type='text' id = 'login' name='login' placeholder='Логин' onChange={e => changeHandler(e)} value = {form.login}/>
                    <p className = 'error' id = 'errorStudentLogin'>{errors.login}</p>
                    <input type='text' id = 'password' name='password' placeholder='Пароль' onChange={e => changeHandler(e)} value = {form.password}/>
                    <p className = 'error' id = 'errorStudentPassword'>{errors.password}</p>

                    <div className = 'longGreenBtn' onClick = {e => registerHandler(e)}>
                        <p>Создать</p>
                    </div>
            </div> }

                </div>

            {
                !notFound && grades &&
                <div className = 'flexboxRow soft_appearing'>
                    <div className = 'longGrayBtn' onClick = {e => changeGrade(e, -1)}>
                        <p>Понизить класс</p>
                    </div>
                    <div className = 'longGreenBtn' onClick = {e => changeGrade(e, 1)}>
                        <p>Повысить класс</p>
                    </div>
                </div>
            }

        </div>
    )
}

export default Students;