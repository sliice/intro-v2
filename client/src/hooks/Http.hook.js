import {useState, useCallback, useContext} from 'react'
import {AuthContext} from '../components/context/AuthContext'

export const useHttp = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null )
    const {logout} = useContext(AuthContext)

    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        try {
            if (body){
                body = JSON.stringify(body)
                headers['Content-Type'] = 'application/json'
            }

            const response = await fetch(url, {method, body, headers})
            const data = await response.json()

            if (!response.ok){
                if (data.message === 'Not authorised yet') logout()
                throw new Error(data.message || 'Something went wrong')
            }
            setLoading(false)

            return data
        }
        catch (e) {
            setLoading(false)
            setError(e.message)
            throw e
        }
    }, [])

    const clearError = useCallback(() => setError(null), [])

    return {loading, request, error, clearError }
}