export const notify = message => {
    try {
        try {
            document.getElementById('notification').remove()}
        catch (e) {}

        let notification = document.createElement('p')
        notification.innerHTML = message
        notification.className = 'notification'
        notification.id = 'notification'
        document.body.append(notification)
        setInterval(() => notification.remove(), 5000)
    }
    catch (e) {}
}

export default notify