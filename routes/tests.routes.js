const {Router} = require('express')
const Test = require('../models/Test')
const User = require('../models/User')
const UserAnswers = require('../models/UserAnswers')
const router = Router()
const auth = require('../middleware/Auth.middleware')
const TestResult = require('../middleware/TestResult')

// /api/tests
router.get('/', auth, async (req, res) => {
    try {
        const tests = await Test.find({ draft: false })
        res.json(tests)
    }
    catch(e){
        res.status(500).json({ message: "Something went wrong. Try again" })
    }
})

// /api/tests/size/id
router.get('/:size/:id', auth, async (req, res) => {
    try {
        const test = await Test.findOne({ link: req.params.id })
        let response

        if (req.params.size === 'full')
            response = test

        else if (req.params.size === 'short')
            response = {
            name: test.name,
            description: test.description,
            shortDescription: test.shortDescription,
            q: test.q,
            questions: test.questions,
            answers: test.answers
        }

        res.json(response)
    }
    catch(e){
        res.status(500).json({ message: "Something went wrong. Try again" })
    }
})

// /id/save
router.post('/:id/save', async (req, res) => {
    try {
        const data = req.body
        const test = await Test.findOne({ link: data.link })
        const user = await User.findById(data.userID)

        const filter = { userID: user._id, testID: test._id}
        const newData = { userID: user._id, testID: test._id, answers: data.answers, date: data.date }

        const userAnswers = await UserAnswers.findOneAndUpdate(filter, newData, {
            returnOriginal: true
        })

        if (!userAnswers){
            const newUserAnswers = new UserAnswers({...newData})
            await newUserAnswers.save()
        }

        res.status(201).json({ message: "Result is saved"})
    }
    catch (e) {
        res.status(500).json({ message: "Something went wrong. Try again" })
    }
})

// /id/drop
router.post('/:id/drop', async (req, res) => {
    try {
        const test = await Test.findOneAndDelete({ link: req.params.id }, {
            returnOriginal: true
        })

        const id = test._id
        await UserAnswers.deleteMany({ testID: id })

        res.status(201).json({ message: "Test is deleted"})
    }
    catch (e) {
        res.status(500).json({ message: "Something went wrong. Try again" })
    }
})


// /api/tests/id/result/login
router.get('/:id/result/:login', auth, async(req, res) => {
    try {
        const user = await User.findOne({ login: req.params.login })
        const test = await Test.findOne({ link: req.params.id })
        const userAnswers = await UserAnswers.findOne({ userID: user._id, testID: test._id })

        if (!userAnswers)
            res.json({ message: 'Пока что такого результата нет' })

        let response = TestResult(test, userAnswers.answers)
        response = {...response, user: user.name + ' ' + user.surname }

        res.json(response)
    }
    catch (e) {
        res.status(500).json({ message: "Something went wrong. Try again" })
    }
})

module.exports = router