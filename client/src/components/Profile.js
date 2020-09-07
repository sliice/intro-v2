import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useParams, useHistory} from "react-router-dom";
import './appearence/css/Profile.css'
import './appearence/css/index.css'
import './appearence/css/DatePicker.css';
import {AuthContext} from "./context/AuthContext"
import {emojis, emojiToString} from "./helpers/Emoji";
import formatDateToRu from "./helpers/DateFormat"
import showError from './helpers/ShowError'
import {useHttp} from "../hooks/Http.hook"
import {NavLink} from "react-router-dom"
import RegExps from "./helpers/RegExps"
import {ReactComponent as EditIcon} from './appearence/images/EditIcon.svg'
import {ReactComponent as CancelIcon} from './appearence/images/CancelIcon.svg'
import ConfirmWindow from './helpers/ConfirmWindow'


import DatePicker from "react-datepicker/es";
import {registerLocale} from "react-datepicker";
import notify from "./helpers/Notify";
import SearchIcon from "./appearence/images/SearchIcon";
import {ReactComponent as SortIcon} from "./appearence/images/SortIcon.svg";

export const Profile = () => {

  const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
  const days = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']

  registerLocale('ru', {
    localize: {
      month: i => months[i],
      day: i => days[i]
    },
    formatLong:{}
  });


  let login = useParams().id

  const {request} = useHttp();
  const {token, username} = useContext(AuthContext)
  const history = useHistory()

  const [results, setResults] = useState([])
  const [isSearching, activateSearching] = useState('none')
  const [isEditing, activateEditing] = useState(false)
  const [isDeleting, activateDeleting] = useState(false)
  const [isChoosingEmoji, activateChoosingEmoji] = useState(false)
  const [search, setSearch] = useState('')
  const [notFound, setNotFound] = useState()
  const [sorted, setSorted] = useState(false)
  const [resultsFetched, setResultsFetched] = useState(false)
  const [userDataFetched, setUserDataFetched] = useState(false)
  const [errors, setErrors] = useState({
    name: '',
    surname: '',
    login: '',
    password: ''
  })

  const [userData, setUserData] = useState({
    name: '',
    surname: '',
    login: '',
    type: '',
    pic: '',
    birthday: new Date('2000-01-01'),
    grade: '',
    letter: ''
  })
  const [userEditedData, setUserEditedData] = useState({
    name: '',
    surname: '',
    login: '',
    pic: '',
    birthday: new Date('2000-01-01'),
    password: ''
  })

  const fetchUserData = useCallback(async () => {
    try {
      const fetched = await request(`/api/users/get/${login}`, 'GET', null, {
        Authorization: `Bearer ${token}`
      })
      if (!fetched.message) {
        setUserData(fetched)
        if (fetched.birthday) {
          setUserData({...fetched, birthday: new Date(fetched.birthday)})
          setUserEditedData({...fetched, birthday: new Date(fetched.birthday)})
        }
        else {
          setUserData(fetched)
          setUserEditedData(fetched)
        }
        document.title = fetched.name + ' ' + fetched.surname
      }
      else console.log(fetched.message)
      setUserDataFetched(true)
    }
    catch (e) {}
  }, [token, login])

  const fetchResults = useCallback(async () => {
    try {
      const fetched = await request(`/api/results/${login}`, 'GET', null, {
        Authorization: `Bearer ${token}`
      })
      if (!fetched.message) {
        fetched.sort((a, b) => a.date < b.date ? 1 : -1)
        setResults(fetched)
      }
      setResultsFetched(true)
    }
    catch (e) {}
  }, [token, login])


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

  const handleEditActivating = e => {
    e.preventDefault()
    activateEditing(!isEditing);
  }

  const handleDeleteActivating = e => {
    e.preventDefault()
    activateDeleting(!isDeleting);
  }

  const handleDeleting = async (e) => {
    e.preventDefault()
    await deleteUser()
  }

  const deleteUser = useCallback(async() => {
    try {
      const data = await request(`/api/users/${login}/drop`, 'POST', null)
      if (data.message === 'User is deleted') {
        notify('Пользователь удалён')
        setTimeout(() => history.push('/students'), 500)
      }
    }
    catch (e) {}
  }, [token, request])

  const handleEditing = e => {
    e.preventDefault()
    setUserEditedData({...userEditedData, [e.target.name]: e.target.value})
  }

   const setBirthday = date => {
     setUserEditedData({...userEditedData, birthday: new Date(date)})
   }

  const handleChooseEmojiActivating = e => {
    e.preventDefault()
    activateChoosingEmoji(!isChoosingEmoji)
  }

  const setUserPic = e => {
    e.preventDefault()
    setUserEditedData({...userEditedData, pic: emojis[e.target.id.slice(1)]})
  }

  const checkFields = async (e) => {
    e.preventDefault()
    try {
      let name = '', surname = '', login = '', password = ''
      if (!userEditedData.name) {
        name = 'Заполните это поле'
        await showError(true,'name', 'errorName')
      }
      else if (!RegExps.cyrillicsRegExp.test(userEditedData.name)) {
        name = 'Допустима только из кириллица'
        await showError(true,'name', 'errorName')
      }

      if (!userEditedData.surname) {
        surname = 'Заполните это поле'
        await showError(true,'surname', 'errorSurname')
      }
      else if (!RegExps.cyrillicsRegExp.test(userEditedData.surname)) {
        surname = 'Допустима только из кириллица'
        await showError(true,'surname', 'errorSurname')
      }

      if (!userEditedData.login) {
        login = 'Заполните это поле'
        await showError(true,'loginOnProfile', 'errorLoginOnProfile')
      }
      else if (!RegExps.loginRegExp.test(userEditedData.login)) {
        login = 'Допустимы только a-z, цифры, точка и пробел'
        await showError(true,'loginOnProfile', 'errorLoginOnProfile')
      }

      if (userEditedData.password && !RegExps.passwordRegExp.test(userEditedData.password)) {
        if (userEditedData.password.length < 6 || userEditedData.password.length > 20)
          password = 'Пароль должен содержать от 6 до 20 символов'
        else
          password = 'Допустимы только A-z, цифры, точка и пробел'
          await showError(true, 'password', 'errorPassword')
      }

      !name && await showError(false,'name', 'errorName')
      !surname && await showError(false,'surname', 'errorSurname')
      !login && await showError(false,'loginOnProfile', 'errorLoginOnProfile')
      !password && await showError(false,'password', 'errorPassword')

      setErrors({name, surname, login, password})

      if (!name && !surname && !login && !password)
        return true
      else
        return false
    }
    catch (e) {}
  }

  const saveEditedData = async(e) => {
    e.persist()
      try {
        if (await checkFields(e)) {
          const data = await request('/api/users/edit', 'POST', {...userEditedData, oldLogin: userData.login})
          if (data.message === 'User\'ve edited') notify('Данные профиля изменены')
          setUserEditedData({...userEditedData, password: ''})
          setUserData(userEditedData)
          handleEditActivating(e)
        }
      }
      catch (e) {}
  }

  const cancelEditing = e => {
    e.preventDefault()
    setUserEditedData(userData)
    handleEditActivating(e)
  }

  useEffect(() => {
    document.body.style = 'transition-duration: .7s; transition-timing-function: ease-in-out; background: white;'
  })

  useEffect(() => {
    activateEditing(false)

    // !userDataFetched &&
    fetchUserData()
    // !resultsFetched &&
    fetchResults()

  }, [login, resultsFetched, userDataFetched])

  return (
      <div>
        <div className = 'profileContainer'>

          {
            !isEditing &&
            <div className = 'profilePic'> {emojiToString(userData.pic)} </div>
          }
          {
            isDeleting &&
            <ConfirmWindow text = 'Удалить ученика?' confirm={e => handleDeleting(e)} cancel={e => handleDeleteActivating(e)}/>
          }
          {
            isEditing &&
            <div className = 'profileEditingPic' onClick = {e => handleChooseEmojiActivating(e)}> {emojiToString(userEditedData.pic)} </div>
          }

          {
            isChoosingEmoji && isEditing &&
            <div className = 'emojiContainerOnProfile'>
              <div className = 'profileEditingPic' onClick = {e => handleChooseEmojiActivating(e)}> {emojiToString(userEditedData.pic)} </div>
              {
                emojis.map((emoji, i) => {
                  return (
                      <div className = 'addingStudentEmoji' onClick = {e => setUserPic(e)} key = {i} id = {'e' + i}>
                        {emojiToString(emoji)}
                      </div>
                  )
                })
              }
            </div>
          }

          <div className = 'profileHeader'>

            {!isEditing &&
                <div className = 'profileHeaderIcons'>
                  <EditIcon onClick = {e => handleEditActivating(e)}/>
                  {
                    userData.type === 's' &&
                    <CancelIcon onClick = {e => handleDeleteActivating(e)}/>
                  }
                </div>
            }
            {!isEditing &&
            <h1 id = 'fio'>{userData.name} {userData.surname}</h1>}
            {(!isEditing || userData.login === username) &&
            <h2 id = 'loginOnProfile'>{userData.login}</h2>}



            {isEditing &&
            <input type = 'text' id = 'name' name = 'name' className = 'enabledInput' onChange = {e => handleEditing(e)} value = {userEditedData.name} placeholder = 'Имя'/>}
            {isEditing &&
            <p className = 'error' id = 'errorName'>{errors.name}</p>}

            {isEditing &&
            <input type = 'text' id = 'surname' name = 'surname' className = 'enabledInput' onChange = {e => handleEditing(e)} value = {userEditedData.surname} placeholder = 'Фамилия'/>}
            {isEditing &&
            <p className = 'error' id = 'errorSurname'>{errors.surname}</p>}

            {isEditing && userData.login !== username &&
            <input type = 'text' id = 'loginOnProfile' name = 'login' className = 'enabledInput' onChange = {e => handleEditing(e)} value = {userEditedData.login}  placeholder = 'Логин'/>}
            {isEditing &&
            <p className = 'error' id = 'errorLoginOnProfile'>{errors.login}</p>}

            {isEditing &&
            <input type = 'text' id = 'password' name = 'password' className = 'enabledInput' onChange = {e => handleEditing(e)} value = {userEditedData.password}  placeholder = 'Новый пароль' />}
            {isEditing &&
            <p className = 'error' id = 'errorPassword'>{errors.password}</p>}

            {isEditing &&
            <input type = 'text' id = 'password' name = 'password' className = 'enabledInput' onChange = {e => handleEditing(e)} value = {userEditedData.password}  placeholder = 'Новый пароль' />}
            {isEditing &&
            <p className = 'error' id = 'errorPassword'>{errors.password}</p>}


            {userData.type === 'p' &&
            <h3 id = 'type'>Педагог-психолог</h3>}
            {userData.type === 's' && !isEditing &&
            <h3 id = 'grade'><b>{userData.grade + userData.letter} класс</b></h3>}
            {userData.type === 's' && !isEditing &&
            <h3 id = 'birthday'>День рождения: { formatDateToRu(userData.birthday)}</h3>}


            {userData.type === 's' && isEditing &&
                <div id = 'datePickerProfile'>
                  <DatePicker id = 'datePickerProfileInside' className = 'datePicker' value = {formatDateToRu(userEditedData.birthday)}
                      selected = {userEditedData.birthday} onChange = {date => setBirthday(date)}
                              placeholderText = 'Дата рождения'
                              locale = 'ru' dateFormat="dd/MM/yyyy" />
                </div> }

            {userData.type === 's' && isEditing &&
            <div className = 'gradeAndLetter' id = 'gradeAndLetter'>
              <select name='grade' value = {userEditedData.grade} onChange={e => handleEditing(e)}>
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
              <select id = 'letter' name='letter' value = {userEditedData.letter} onChange={e => handleEditing(e)}>
                <option value = '' disabled>Буква</option>
                <option value = 'А'>А</option>
                <option value = 'Б'>Б</option>
                <option value = 'В'>В</option>
                <option value = 'Г'>Г</option>
                <option value = 'Д'>Д</option>
              </select>
            </div>
            }

            {
              isEditing &&

              <div id = 'saveAndCancelEditing'>

                <svg id = 'cancelIcon' onClick = {e => cancelEditing(e)} width="35px" height="35px" viewBox="0 0 300 300" version="1.1">
                  <g fill="#E88732"  id="Logo" stroke="none" stroke-width="1" fill-rule="evenodd">
                  <path d="M231.885822,72.3223305 C241.64893,82.0854378 241.64893,97.9145622 231.885822,107.67767 L184.959,154.604 L222.885822,192.530483 C232.64893,202.293591 232.64893,218.122715 222.885822,227.885822 C213.122715,237.64893 197.293591,237.64893 187.530483,227.885822 L149.604,189.959 L111.67767,227.885822 C101.914562,237.64893 86.0854378,237.64893 76.3223305,227.885822 C66.5592232,218.122715 66.5592232,202.293591 76.3223305,192.530483 L114.249,154.604 L67.3223305,107.67767 C57.5592232,97.9145622 57.5592232,82.0854378 67.3223305,72.3223305 C77.0854378,62.5592232 92.9145622,62.5592232 102.67767,72.3223305 L149.604,119.249 L196.530483,72.3223305 C206.293591,62.5592232 222.122715,62.5592232 231.885822,72.3223305 Z" id="Combined-Shape"></path>
                  </g>
                </svg>

                <svg id = 'saveIcon' onClick = {e => saveEditedData(e)} width="30px" height="30px" viewBox="0 0 300 300" version="1.1">
                  <g id="Logo" fill="#E0E7B4" stroke="none" stroke-width="1" fill-rule="evenodd">
                    <path d="M274.847645,60.3120342 L279.170453,64.6298082 C288.939247,74.3872257 288.948469,90.2163475 279.191052,99.9851413 C279.18419,99.9920115 279.177324,99.9988777 279.170453,100.00574 L151.781477,227.246365 C146.461489,232.560158 139.343499,234.977726 132.387469,234.499068 C125.431382,234.977957 118.312965,232.560413 112.992721,227.246365 L21.3326328,135.693019 C11.563839,125.935602 11.5546167,110.10648 21.3120342,100.337686 L21.3326328,100.317087 L21.3326328,100.317087 L25.655441,95.9993134 C35.4161868,86.2499345 51.2294296,86.2499345 60.9901754,95.9993134 L132.387,167.312 L239.512911,60.3120342 C249.273657,50.5626553 265.086899,50.5626553 274.847645,60.3120342 Z" id="Combined-Shape"></path>
                  </g>
                </svg>

              </div>
            }

          </div>
        </div>

        {results.length != 0 &&
        <div className = 'searchAndSort'>
          <input type = 'text' id = 'search'
                 className = {  isSearching === 'active' && 'searchAppearing' ||
                 isSearching === 'inactive' && 'searchDisappearing' ||
                 isSearching === 'none' && 'invisible'}
                 placeholder = 'Поиск по результатам' onChange = {doSearch}/>

          <SearchIcon handleSearchActivating = {handleSearchActivating}/>
          <SortIcon onClick = {e => doSort(e)} />

        </div>
        }

        <div id = 'resultsCollection' className = 'results'>
          {
            notFound && <h1 className = 'notFound'>Ничего не найдено</h1> ||
            !notFound && results[0] &&
            results.map((result, index) => {
              if ((result.test + result.scales).toLowerCase().includes(search))
                return (
                    <NavLink to={`/tests/${result.link}/${login}`} key={index} className='resultItem soft_appearing'>
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

export default Profile