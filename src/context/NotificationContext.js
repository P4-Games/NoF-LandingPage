import { createContext, useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import { v4 as uuidv4 } from 'uuid'
import { Web3Context } from './Web3Context'

export const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const { walletAddress } = useContext(Web3Context)

  const getNotificationsByUser = (user) => {
    if (!user) return notifications
    const myNotifications = notifications.filter(
      (notification) => notification.walletAddress === user && notification.deleted === false
    )
    return filterUniqueNotifications(myNotifications)
  }

  const filterUniqueNotifications = (notificationList) => {
    const uniqueIdentifiers = new Set()
    return notificationList.filter((notification) => {
      const identifier = `${notification.message}-${JSON.stringify(notification.data)}`
      if (uniqueIdentifiers.has(identifier)) {
        return false
      }
      uniqueIdentifiers.add(identifier)
      return true
    })
  }

  useEffect(() => {
    const filteredNotifications = getNotificationsByUser(walletAddress)
    setNotifications(filteredNotifications)
  }, [walletAddress]) //eslint-disable-line react-hooks/exhaustive-deps

  const addNotification = (user, message, data) => {
    const date = new Date().toLocaleString()
    const newNotification = {
      id: uuidv4(),
      date: date,
      walletAddress: user,
      message: message,
      data: data || [],
      read: false,
      deleted: false
    }

    setNotifications((prevNotifications) => {
      const updatedNotifications = [...prevNotifications, newNotification]
      return updatedNotifications.sort((a, b) => new Date(b.date) - new Date(a.date))
    })
  }

  const readNotification = (notificationId) => {
    const updatedNotifs = notifications.map((notification) =>
      notification.id === notificationId ? { ...notification, read: true } : notification
    )
    setNotifications(updatedNotifs)
  }

  const deleteNotification = (notificationId) => {
    const updatedNotifs = notifications.filter((notification) => notification.id !== notificationId)
    setNotifications(updatedNotifs)
  }

  const readAllNotifications = (user) => {
    const updatedNotifs = notifications.map((notification) =>
      notification.walletAddress === user ? { ...notification, read: true } : notification
    )
    setNotifications(updatedNotifs)
  }

  const deleteAllNotifications = (user) => {
    const updatedNotifs = notifications.filter(
      (notification) => notification.walletAddress !== user
    )
    setNotifications(updatedNotifs)
  }

  NotificationProvider.propTypes = {
    children: PropTypes.node.isRequired
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        getNotificationsByUser,
        addNotification,
        readNotification,
        readAllNotifications,
        deleteNotification,
        deleteAllNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
