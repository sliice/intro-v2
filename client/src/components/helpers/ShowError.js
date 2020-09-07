const showError = async (show, inputID, errorID) => {
    // if show is true => show errors
    try {
        if (show){
            document.getElementById(inputID).style.borderBottomColor = '#E88732'
            document.getElementById(errorID).className = 'error soft_appearing'
            document.getElementById(errorID).style.display = 'inline-block'
        }
        // if false => hide errors
        else
            document.getElementById(inputID).style.borderBottomColor = '#E0E7B4'
    }
    catch (e) {}
}

export default showError