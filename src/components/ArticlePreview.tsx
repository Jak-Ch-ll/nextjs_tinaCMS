import Image from "next/image"
import { ArticleTeaserData } from "../utils/ArticleDB"
import LinkTo from "./LinkTo"
import styles from "./ArticlePreview.module.scss"
import { DateTime } from "./DateTime"

export interface ArticlePreviewProps {
  article: ArticleTeaserData
}

export const ArticlePreview = ({
  article,
}: ArticlePreviewProps): JSX.Element => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <DateTime date={article.publishedAt} />
        <h3 className={styles.title}>{article.title}</h3>
        <p className={styles.text}>{article.teaserText}</p>
        <LinkTo className={styles.link} href={`/blog/${article.url}`}>
          More
        </LinkTo>
      </div>
      <div className="imgBox">
        <Image
          src={article.img}
          alt=""
          role="presentation"
          width={150}
          height={100}
        />
      </div>
    </div>
  )
}
