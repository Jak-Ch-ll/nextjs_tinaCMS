import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import prisma from "../../../prisma/prisma";
import { getArticleToRender } from "../../utils";
import { API_IMAGE_ENDPOINT_INTERNAL } from "../../_constants";
import { ArticleToRender } from "../../_types";

interface ArticlePageProps {
  article: ArticleToRender;
}

export const getStaticProps: GetStaticProps<ArticlePageProps> = async ({
  params,
}) => {
  const url = params!.url as string;

  try {
    const article = await getArticleToRender({ url });

    return {
      props: {
        article,
      },
      revalidate: 1,
    };
  } catch {
    return {
      notFound: true,
      revalidate: 1,
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await prisma.article.findMany();

  const paths = articles.map(({ url }) => ({
    params: { url },
  }));

  return {
    paths,
    fallback: true,
  };
};

export default function ArticlePage({ article }: ArticlePageProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

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
