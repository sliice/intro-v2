const CountScalePoints = require('../middleware/CountScalePoints')
const FindScaleInterval = require('../middleware/FindScaleInterval')

module.exports = (test, answers) => {
    let scales = []

    for (let i = 0; i < test.scales.length; i++) {
        let scale = test.scales[i]
        let name = scale.name
        let points = 0, maxPoints = 0
        let interval = {}

        if (test.scales[i].scaleanswers){
            points += CountScalePoints(test.scales[i].scaleanswers, answers)
        }

        interval = FindScaleInterval(scale.intervals, points)

        scale.intervals.sort((a, b) => a.max < b.max ? 1 : -1)
        scales[i] = { name, points, maxPoints: scale.intervals[0].max, ...interval }
    }

    scales.sort((a, b) => (a.points/a.maxPoints) > (b.points/b.maxPoints) ? 1 : -1)
    scales.sort((a, b) => a.important < b.important ? 1 : -1)

    return {test: test.name, scales}
}