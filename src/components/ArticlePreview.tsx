import Image from "next/image"
import { ArticleTeaserData } from "../utils/ArticleDB"
import LinkTo from "./LinkTo"
import styles from "./ArticlePreview.module.scss"
import { DateTime } from "./DateTime"

export interface ArticlePreviewProps {
  article: ArticleTeaserData
  alwaysShowImg?: boolean
}

export const ArticlePreview = ({
  article,
  alwaysShowImg = true,
}: ArticlePreviewProps): JSX.Element => {
  return (
    <div className={styles.component}>
      <div className={styles.content}>
        <DateTime date={article.publishedAt} />
        <LinkTo href={`/blog/${article.url}`}>
          <h3 className={styles.title}>{article.title}</h3>
        </LinkTo>
        <div
          className={`${styles.innerImgContainer} ${
            alwaysShowImg && styles.alwaysShow
          }`}
        >
          <Image
            src={article.img}
            alt=""
            role="presentation"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <p className={styles.text}>{article.teaserText}</p>
        <LinkTo
          className={styles.link}
          href={`/blog/${article.url}`}
          role="presentation"
          aria-hidden={true}
        >
          More
        </LinkTo>
      </div>
      <div className={styles.imgContainer}>
        <Image
          src={article.img}
          alt=""
          role="presentation"
          layout="fill"
          objectFit="cover"
        />
      </div>
    </div>
  )
}
