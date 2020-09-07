const {Router} = require('express')
const router = Router()

const auth = require('../middleware/Auth.middleware')
const Test =  require('../models/Test')

// addtest/drafts
router.get('/drafts', auth, async(req, res) => {
    try {
        const drafts = await Test.find({ draft: true })
        res.json(drafts)
    }
    catch (e) {
        res.status(500).json({ message: "Something went wrong. Try again" })
    }
})

// addtest/savedraft
// router.post('/savedraft', async(req, res) => {
//     try {
//         const data = req.body
//         const q = data.questions.length
//         const draft = true
//         let test
//
//         if (data.name === '') data.name = 'Без названия'
//         if (data._id)
//             test = await Test.findById(data._id)
//
//         if (test)
//             await Test.findByIdAndUpdate(data._id, {...data, q, draft})
//
//         else {
//             const newDraft = new TestDraft({...data})
//             await newDraft.save()
//         }
//         res.status(201).json({ message: "Draft is saved" })
//     }
//     catch (e) {
//         res.status(500).json({ message: "Something went wrong. Try again" })
//     }
// })

// addtest/save
router.post('/save:type', async(req, res) => {
    try {
        let draft = false
        let message = 'Test is saved'
        if (req.params.type === 'draft') {
            draft = true
            message = 'Draft is saved'
        }

        const data = req.body
        const q = data.questions.length

        let id = '', test

        if (data._id){
            id = data._id
            test = await Test.findById(id)
        }

        if (test)
            await Test.findByIdAndUpdate(data._id, {...data, q, draft})
        else {
            const newTest = new Test({...data, q, draft})
            id = newTest._id
            await newTest.save()
        }
        res.status(201).json({ message , id })
    }
    catch (e) {
        res.status(500).json({ message: "Something went wrong. Try again" })
    }
})

module.exports = router