const {Router} = require('express')
const User = require('../models/User')
const Student = require('../models/Student')
const bcrypt = require('bcryptjs')
const config = require('config')
const {check, validationResult} = require('express-validator')
const router = Router()
const auth = require('../middleware/Auth.middleware')

// /students/create
router.post('/create',
    [
        check('login', 'Too short. Min length is 2').isLength({ min: 2 }),
        check('password', 'Incorrect password. Min length is 6').isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()){
                return res.status(400).json({ errors: errors.array(), message: 'Incorrect registration data'})
            }

            const {login, password, type, pic, name, surname, grade, letter, birthday } = req.body

            const candidate = await User.findOne({ login })
            if (candidate)
                res.status(400).json({ message: "This user already exists"})

            const hashedPassword = await bcrypt.hash(password, 12)

            const user = new User({ login, password: hashedPassword, pic, type, name, surname})

            await user.save()
            res.status(201).json({ message: "User've created"})

            // if user is a student
            if (type === 's') {
                try {
                    const candidateStudent = await User.findOne({ login })
                    const student = new Student({ user: candidateStudent._id, grade , letter, birthday})
                    await student.save()
                    res.status(201).json({ message: "Student've created"})
                }
                catch (e) {
                    res.status(500).json({ message: "Something went wrong with creating a student. Try again" })
                }
            }

        }
        catch(e){
            res.status(500).json({ message: "Something went wrong with creating a user. Try again" })
        }
    })

// /students
    router.get('/', auth, async (req, res) => {
        try {
            const students = await Student.find()
            const gradesArrayString = []
            const gradesArrayObject = []
            for (let i = 0; i < students.length; i++) {
                if (!gradesArrayString.includes(students[i].grade  + students[i].letter)) {
                    gradesArrayString.push(students[i].grade + students[i].letter)
                    gradesArrayObject.push({ grade: students[i].grade, letter: students[i].letter })
                }
            }
            gradesArrayObject.sort((a, b) => a.letter > b.letter ? 1 : -1);
            gradesArrayObject.sort((a, b) => a.grade > b.grade ? 1 : -1);

            const grades = []
            for (let i = 0; i < gradesArrayObject.length; i++) {
                let studentsArray = []

                for (let j = 0; j < students.length; j++){

                    if (gradesArrayObject[i].grade == students[j].grade && gradesArrayObject[i].letter.toString() === students[j].letter.toString()) {
                        let student = await User.findById(students[j].user)
                        studentsArray.push({ username: student.login, name: student.name, surname: student.surname, birthday: student.birthday, pic: student.pic })
                    }

                }
                studentsArray.sort((a, b) => a.surname > b.surname ? 1 : -1);
                grades.push({ grade: gradesArrayObject[i].grade, letter: gradesArrayObject[i].letter, students: studentsArray })
            }
            res.json(grades)
        }
        catch(e){
            res.status(500).json({ message: "Something went wrong. Try again" })
        }
    })

router.get('/grade/:k', auth, async (req, res) => {
    try {
        const students = await Student.updateMany({}, {
            $inc: {grade: req.params.k}
        })
        res.json({ message: 'Grade have changed' })
    }
    catch (e) {
        res.status(500).json({ message: "Something went wrong. Try again" })
    }
})

module.exports = router