import { GetStaticProps } from "next";
import Link from "next/link";
import { ArticleToRender } from "../../_types";
import { getArticlesToRender } from "../../utils";

interface BlogPageProps {
  articles: ArticleToRender[];
}

export const getStaticProps: GetStaticProps<BlogPageProps> = async () => {
  const articles = await getArticlesToRender();

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
      <div key={article.id}>
        <Link href={`/blog/${article.url}`}>
          {/* eslint-disable-next-line */}
          <a>{article.title}</a>
        </Link>
      </div>
    );
  });

  return <div>{renderedArticles}</div>;
}
