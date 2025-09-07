import * as styles from '../styles/MenuButton.module.css'

export default function MenuButton({
  name,
  onClick
}: {
  name: string,
  onClick: () => void
}) {
  return (
    <div className={styles.menuButton}>
      <ul>
        <li onClick={onClick}>{name}</li>
      </ul>
    </div>
  )
}
