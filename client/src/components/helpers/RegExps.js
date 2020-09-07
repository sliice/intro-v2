export const RegExps = {
    cyrillicsRegExp: /^[А-Яа-яё]+$/,
    loginRegExp: /^[a-z\._0-9]+$/,
    passwordRegExp: /^[A-Za-z0-9\._]{6,20}$/,
    punctuations: /^[^А-Яа-яёA-Za-z]*$/gi,
    linkRegExp: /^[a-z\-0-9]{1,}[a-z0-9]+$/,
    testNameRegExp: /^[А-Яа-яё\.,\-\–?!\ \(\)]+$/,
}

export default RegExps