const {Router} = require('express')
const router = Router()
const User = require('../models/User')
const UserAnswers = require('../models/UserAnswers')
const Test = require('../models/Test')
const auth = require('../middleware/Auth.middleware')
const TestResult = require('../middleware/TestResult')


// /login
router.get('/:login', auth, async (req, res) => {

    try {
        const user = await User.findOne({ login: req.params.login })
        const userAnswers = await UserAnswers.find({ userID: user._id })
        let response = []

        if (!user || !userAnswers)
            res.json({ message: 'Results not found' })

        for (let i = 0; i < userAnswers.length; i++){

            let test = await Test.findById(userAnswers[i].testID)
            let result = TestResult(test, userAnswers[i].answers)

            let link = test.link
            test = result.test

            let date = userAnswers[i].date
            let scales = []

            for (let j = 0; j < result.scales.length; j++) {
                if (result.scales[j].important)
                    scales.push(result.scales[j].name + ': ' + result.scales[j].intervalName)
            }

            if (!scales[0])
                scales.push('Всё в норме')

            response.push({test, link, date, scales})
        }

        res.json(response)
    }
    catch(e){
        res.status(500).json({ message: "Something went wrong. Try again" })
    }
})



module.exports = router