const {Router} = require('express')
const router = Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const UserAnswers = require('../models/UserAnswers')
const Student = require('../models/Student')
const auth = require('../middleware/Auth.middleware')

// /get/login
router.get('/get/:login', auth, async (req, res) => {
     try {
         const user = await User.findOne({ login: req.params.login })
         let birthday = '', grade = '', letter = ''

         if (!user)
             res.json({ message: 'No user found' })

         if (user.type === 's') {
             const student = await Student.findOne({ user: user._id })
             birthday = student.birthday
             grade = student.grade
             letter = student.letter
         }
         console.log(birthday)

         res.json({ login: user.login, name: user.name, surname: user.surname, pic: user.pic, type: user.type, birthday: birthday, grade: grade, letter: letter })
     }
     catch(e){
         res.status(500).json({ message: "Something went wrong. Try again" })
     }
})

// users/edit
router.post('/edit', [],  async (req, res) => {
    try {
        const user = await User.findOne({ login: req.body.oldLogin })
        let password = user.password

        if (req.body.password)
            password = await bcrypt.hash(req.body.password, 12)

        const editedUser = await User.findOneAndUpdate({login: req.body.oldLogin}, {
            login: req.body.login,
            password,
            type: req.body.type,
            name: req.body.name,
            surname: req.body.surname,
            pic: req.body.pic
        })

        if (req.body.type === 's') {
            const editedStudent = await Student.findOneAndUpdate({ user: editedUser._id }, {
                grade: req.body.grade,
                letter: req.body.letter,
                birthday: req.body.birthday
            })
        }

        res.status(201).json({ message: "User've edited" })
    }
    catch (e) {
        res.status(500).json({ message: "Something went wrong. Try again" })
    }
})

// users/edit
router.post('/:login/drop', [],  async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ login: req.params.login }, {
            returnOriginal: true
        })

        const student = await Student.findOneAndDelete({ user: user._id })

        await UserAnswers.deleteMany({ userID: user._id})

        res.status(201).json({ message: "User is deleted" })
    }
    catch (e) {
        res.status(500).json({ message: "Something went wrong. Try again" })
    }
})



module.exports = router