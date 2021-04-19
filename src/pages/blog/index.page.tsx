import { GetStaticProps } from "next";
import { ArticlePreview } from "../../components/ArticlePreview";
import { ArticleDB, PreviewArticle } from "../../utils/ArticleDB";
import styles from "./index.module.scss";

interface BlogPageProps {
  articles: PreviewArticle[];
}

export const getStaticProps: GetStaticProps<BlogPageProps> = async () => {
  const db = new ArticleDB();
  const articles = await db.getPreviewArticles();

  return {
    props: {
      articles,
    },
    revalidate: 1,
  };
};

export default function BlogPage({ articles }: BlogPageProps) {
  const renderedArticles = articles.map((article) => {
    return (
      <li key={article.id} className={styles.item}>
        <ArticlePreview article={article} />
      </li>
    );
  });

  return <ul className={`max-width ${styles.list}`}>{renderedArticles}</ul>;
}
