/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/function-component-definition */
/* eslint-disable spaced-comment */
/* eslint-disable react/jsx-fragments */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'next-i18next'
import moment from 'moment'
import { VscMailRead } from 'react-icons/vsc'
import { IoMailUnreadOutline } from 'react-icons/io5'
import { RiDeleteBin2Line } from 'react-icons/ri'

import { useWeb3Context, useNotificationContext, useSettingsContext } from '../../hooks'

const NotificationInfo = ({ showNotificationInfo }) => {
  const { t } = useTranslation()
  const {
    getNotificationsByUser,
    readNotification,
    deleteNotification,
    readAllNotifications,
    deleteAllNotifications
  } = useNotificationContext()
  const { walletAddress } = useWeb3Context()

  const [updatedNotifications, setUpdatedNotifications] = useState([])
  const [actionText, setActionText] = useState('')
  const [actionTextVisible, setActionTextVisible] = useState(false)
  const [actionTextPosition, setActionTextPosition] = useState(0)
  const { languageSetted } = useSettingsContext()

  useEffect(() => {
    setUpdatedNotifications(getNotificationsByUser(walletAddress))
  }, [showNotificationInfo, walletAddress, languageSetted]) //eslint-disable-line react-hooks/exhaustive-deps

  const formatNotificationDate = (date) => {
    moment.locale(languageSetted)
    return moment(date).fromNow()
  }

  const translateNotificationMessage = (message, data, short = true) => {
    let newMessage = t(message)
    data.forEach((element) => {
      const regex = new RegExp(`\\{${element.item}\\}`, 'g')
      if (short) newMessage = newMessage.replaceAll(regex, element.valueShort)
      else newMessage = newMessage.replaceAll(regex, element.value)
    })
    return newMessage
  }

  const existsUnreadNotifications = () => {
    if (!updatedNotifications || updatedNotifications.length === 0) {
      return false
    }
    return updatedNotifications.some((notification) => !notification.read)
  }

  const handleCopy = (notification, event) => {
    navigator.clipboard.writeText(notification)
    setActionText(t('account_text_copied'))
    setActionTextPosition(event.clientY - 70)
    setActionTextVisible(true)
    setTimeout(() => {
      setActionTextVisible(false)
    }, 1500)
  }

  const handleRead = (notification, event) => {
    readNotification(notification.id)
    setActionText(t('notification_read'))
    setActionTextPosition(event.clientY - 70)
    setActionTextVisible(true)
    setTimeout(() => {
      setActionTextVisible(false)
    }, 1500)
  }

  const handleDelete = (notification, event) => {
    setActionTextPosition(event.clientY - 70)
    setActionText(t('notification_deleted'))
    setActionTextVisible(true)
    setTimeout(() => {
      setActionTextVisible(false)
    }, 1500)
    deleteNotification(notification.id)
  }

  const handleReadAll = (event) => {
    readAllNotifications(walletAddress)
    setActionTextPosition(event.clientY - 70)
    setActionText(t('notification_all_read'))
    setActionTextVisible(true)
    setTimeout(() => {
      setActionTextVisible(false)
    }, 1500)
  }

  const handleDeleteAll = (event) => {
    setActionTextPosition(event.clientY - 70)
    setActionText(t('notification_all_deleted'))
    setActionTextVisible(true)
    setTimeout(() => {
      setActionTextVisible(false)
    }, 1500)
    deleteAllNotifications(walletAddress)
  }

  // eslint-disable-next-line react/function-component-definition, react/no-unstable-nested-components
  const NotificationTitle = () =>
    updatedNotifications && updatedNotifications.length > 0 ? (
      <div className='notification__info__icon__and__link'>
        <div className='notification__info__link__container'>
          <p className={`notification__info__title`}>{t('notification_title')}</p>
        </div>
        <div className='notification__info__icon__container'>
          {!existsUnreadNotifications() ? (
            <VscMailRead className='notification__info__icon__read' />
          ) : (
            <IoMailUnreadOutline
              className='notification__info__icon'
              onClick={(event) => {
                handleReadAll(event)
              }}
            />
          )}
        </div>
        <div className='notification__info__icon__container'>
          <RiDeleteBin2Line
            className='notification__info__icon'
            onClick={(event) => {
              handleDeleteAll(event)
            }}
          />
        </div>
      </div>
    ) : (
      <div className='notification__info__icon__and__link'>
        <div>
          <p className={`notification__info__title`}>{t('notification_title')}</p>
        </div>
      </div>
    )

  // eslint-disable-next-line react/function-component-definition
  const NotificationMessage = ({ notification }) => (
    <React.Fragment>
      <div className='notification__info__icon__and__link'>
        <div className='notification__info__link__container'>
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events,
          jsx-a11y/click-events-have-key-events
          <p
            className='notification__info__notification__message'
            onClick={(event) => {
              handleCopy(
                translateNotificationMessage(notification.message, notification.data, false),
                event
              )
            }}
          >
            {translateNotificationMessage(notification.message, notification.data, true)}
          </p>
          {actionTextVisible && (
            <span className='notification__info__action__text' style={{ top: actionTextPosition }}>
              {actionText}
            </span>
          )}
        </div>
        <div className='notification__info__icon__container'>
          {notification.read ? (
            <VscMailRead className='notification__info__icon__read' />
          ) : (
            <IoMailUnreadOutline
              className='notification__info__icon'
              onClick={(event) => {
                handleRead(notification, event)
              }}
            />
          )}
        </div>
        <div className='notification__info__icon__container'>
          <RiDeleteBin2Line
            className='notification__info__icon'
            onClick={(event) => {
              handleDelete(notification, event)
            }}
          />
        </div>
      </div>
      <div className='notification__info__date__div'>
        <p className='notification__info__date'>({formatNotificationDate(notification.date)})</p>
      </div>
      {/* <hr className='notification__info__separator' />*/}
    </React.Fragment>
  )

  function NotificationMessages() {
    return (
      <React.Fragment>
        {updatedNotifications.slice(0, 7).map((notification, index) => (
          <NotificationMessage key={`notif-${index}`} notification={notification} />
        ))}
        {/*
      <hr className='notification__info__separator' />
      <div className='notification__info__view__all'>{t('notification_view_all')}</div>
      */}
      </React.Fragment>
    )
  }

  function NoMessages() {
    return (
      <React.Fragment>
        <div className='notification__info__icon__and__link'>
          <p className='notification__info__no__messages'>{t('notification_no_messages')}</p>
        </div>
      </React.Fragment>
    )
  }

  NotificationMessage.propTypes = {
    notification: PropTypes.object
  }

  return (
    <div className={`notification__info ${showNotificationInfo ? 'active' : ''}`}>
      <React.Fragment>
        <div className='notification__info__data'>
          <NotificationTitle />
          <hr className='notification__info__separator' />
          {walletAddress && updatedNotifications && updatedNotifications.length > 0 ? (
            <NotificationMessages />
          ) : (
            <NoMessages />
          )}
        </div>
      </React.Fragment>
    </div>
  )
}

NotificationInfo.propTypes = {
  showNotificationInfo: PropTypes.bool
}

export default NotificationInfo
