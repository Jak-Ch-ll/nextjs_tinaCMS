import { Article } from "@prisma/client";
import { GetServerSideProps } from "next";
import ReactMarkdown from "react-markdown";
import { getArticleToRender } from "../../utils";
import { API_IMAGE_ENDPOINT_INTERNAL } from "../../_constants";

interface ArticleToRender extends Omit<Article, "createdAt" | "updatedAt"> {
  createdAt: string;
  updatedAt: string;
}

interface ArticlePageProps {
  article: ArticleToRender;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const url = params!.url as string;

  try {
    const article = await getArticleToRender({ url });

    return {
      props: {
        article,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};

export default function ArticlePage({ article }: ArticlePageProps) {
  return (
    <div className="max-width">
      <h1>{article.title}</h1>
      <img
        src={`${API_IMAGE_ENDPOINT_INTERNAL}/${article.img}`}
        alt="Some alt text"
      />
      <p>{article.teaser}</p>
      <ReactMarkdown children={article.content} />
    </div>
  );
}
