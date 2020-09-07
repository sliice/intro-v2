import * as cyrToTranslit from 'cyrillic-to-translit-js'

export const createShortLink = name => {
    let shortLink = cyrToTranslit().transform(name).toString().replace(/[^А-Яа-яA-Za-z0-9]+/gi, '-').toLowerCase()
    shortLink = cutLink(shortLink)
    return shortLink
}

const cutLink = link => {
    if (! /^[a-z0-9]*$/.test(link.slice(link.length - 1))){
        link.slice(0, (link.length - 1))
    }
    else return link
}

export default createShortLink

