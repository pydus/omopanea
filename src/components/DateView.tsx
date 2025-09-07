import * as styles from '../styles/DateView.module.css'

export default function DateView({
  dateCreated,
  dateEdited
}: {
  dateCreated: number,
  dateEdited: number
}) {
  function getDateTimeString(time: number) {
    const date = new Date(time)
    let dateString = date.toDateString()
    const otherDate = new Date(Date.now())

    if (dateString === otherDate.toDateString()) {
      dateString = 'Today'
    }

    otherDate.setDate(otherDate.getDate() - 1)

    if (dateString === otherDate.toDateString()) {
      dateString = 'Yesterday'
    }

    const timeString = date.toTimeString().slice(0, 5)

    return `${dateString} ${timeString}`
  }

  return (
    <div className={styles.date}>
      {getDateTimeString(dateCreated)}
      {dateEdited !== dateCreated
        ? <span title={`Edited ${getDateTimeString(dateEdited)}`}> * </span>
        : ' '}
    </div>
  )
}
