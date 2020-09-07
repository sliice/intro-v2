export const formatDateToRu = d => {

    let date

    if (typeof d === 'string')
        date = new Date(d)
    else
        date = d

    const months = [
        'января',
        'февраля',
        'марта',
        'апреля',
        'марта',
        'июня',
        'июля',
        'августа',
        'сентября',
        'октября',
        'ноября',
        'декабря',
    ]

    const day = new Intl.DateTimeFormat('ru', { day: 'numeric' }).format(date)
    const month = new Intl.DateTimeFormat('ru', { month: 'numeric' }).format(date)
    const year = new Intl.DateTimeFormat('ru', { year: 'numeric' }).format(date)

    return (day + ' ' + months[month - 1] + ' ' + year).toString()
}

export default formatDateToRu