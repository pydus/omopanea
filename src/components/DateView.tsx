import * as styles from '../styles/DateView.module.css'

export default function DateView({
  dateCreated,
  dateEdited
}: {
  dateCreated: number,
  dateEdited: number
}) {
  function getString(timestamp: number) {
    const date = new Date(timestamp)
    const ms = Date.now() - date.getTime()
    const seconds = Math.round(ms / 1000)
    const minutes = Math.round(seconds / 60)
    const hours = Math.round(minutes / 60)
    const days = Math.round(hours / 24)
    const months = Math.round(days / (365 / 12))
    const years = Math.round(months / 12)

    if (seconds === 0) {
      return 'now'
    } else if (seconds < 60) {
      return `${seconds} second${seconds > 1 ? 's' : ''} ago`
    } else if (minutes < 60) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    } else if (hours < 24) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else if (days < (365 / 12)) {
      return `${days} day${days > 1 ? 's' : ''} ago`
    } else if (months < 12) {
      return `${months} month${months > 1 ? 's' : ''} ago`
    } else {
      return `${years} year${years > 1 ? 's' : ''} ago`
    }
  }

  function getLocaleString(timestamp: number) {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  return (
    <div className={styles.date} title={getLocaleString(dateCreated)}>
      {getString(dateCreated)}
      {dateEdited !== dateCreated
        ? <span title={`Edited ${getString(dateEdited)}`}> * </span>
          : ' '}
    </div>
  )
}
