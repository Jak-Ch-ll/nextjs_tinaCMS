import Image from "next/image";
import { PreviewArticle } from "../utils/ArticleDB";
import LinkTo from "./LinkTo";
import styles from "./ArticlePreview.module.scss";

export interface ArticlePreviewProps {
  article: PreviewArticle;
}

export const ArticlePreview = ({
  article,
}: ArticlePreviewProps): JSX.Element => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.date}>{article.date}</div>
        <h3 className={styles.title}>{article.title}</h3>
        <p className={styles.text}>{article.text}</p>
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
  );
};