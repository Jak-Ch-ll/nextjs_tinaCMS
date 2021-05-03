import styles from "./DateTime.module.scss"

export interface DateProps {
  date: string
}

export const DateTime = ({ date }: DateProps): JSX.Element => {
  const renderedDate = date.split("-").reverse().join("/")

  return (
    <time className={styles.date} dateTime={date}>
      {renderedDate}
    </time>
  )
}
