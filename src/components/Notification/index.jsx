import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X } from 'lucide-react';
import { removeNotification } from '../../store/slices/notificationSlice';
import s from './Notification.module.scss';

const Notification = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notification.notifications);
  const [closingIds, setClosingIds] = useState([]);

  const handleClose = (id) => {
    setClosingIds((prev) => [...prev, id]);
    setTimeout(() => {
      dispatch(removeNotification(id));
      setClosingIds((prev) => prev.filter((closingId) => closingId !== id));
    }, 300); // Match this with your animation duration
  };

  // Auto-dismiss notifications after 5 seconds
  useEffect(() => {
    if (notifications.length > 0) {
      const timers = notifications.map((notification) => {
        return setTimeout(() => {
          handleClose(notification.id);
        }, 5000);
      });

      return () => {
        timers.forEach((timer) => clearTimeout(timer));
      };
    }
  }, [notifications]);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className={s.notificationContainer}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${s.notification} ${s[notification.type]} ${
            closingIds.includes(notification.id) ? s.closing : ''
          }`}
        >
          <div className={s.notificationMessage}>{notification.message}</div>
          <button
            className={s.closeButton}
            onClick={() => handleClose(notification.id)}
            aria-label="Close notification"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notification;