module.exports = (scaleanswers, answers) => {
    let points = 0
    for (let i = 0; i < scaleanswers.length; i++)
        if (scaleanswers[i] && answers[i])
            points += (answers[i].filter(a => scaleanswers[i].questions.includes(a))).length * scaleanswers[i].k

    return points
}