module.exports = (intervals, points) => {
    let interval = {
        intervalName: '',
        intervalDescription: '',
        important: false
    }

    for (let i = 0; i < intervals.length; i++) {
        let min = intervals[i].min
        let max = intervals[i].max

        if (points >= min && points <= max){
            interval.intervalName = intervals[i].name
            interval.intervalDescription = intervals[i].description
            interval.important = intervals[i].important
        }
    }

    return interval
}