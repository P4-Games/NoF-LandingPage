import { useContext } from 'react'
import { NotificationContext } from '../context/NotificationContext'

const useNotificationContext = () => useContext(NotificationContext)

export default useNotificationContext
