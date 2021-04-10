import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import prisma from "../../../prisma/prisma";
import { getArticleToRender } from "../../utils";
import { API_IMAGE_ENDPOINT_INTERNAL } from "../../_constants";
import { ArticleToRender } from "../../_types";

import styles from "./[url].module.scss";
import { BlogImage } from "../../components/tina/BlogImage";

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

  const markdownRenderers = {
    image: ({ src, alt = "" }: { src: string; alt: string }) => {
      return <BlogImage src={`http://localhost:3000${src}`} alt={alt} />;
    },
  };

  return (
    <div className={`max-width ${styles.container}`}>
      <h1 className={styles.title}>{article.title}</h1>
      <BlogImage
        src={`http://localhost:3000${API_IMAGE_ENDPOINT_INTERNAL}/${article.img}`}
        alt={article.imgAlt}
      />
      <p>{article.teaser}</p>
      <ReactMarkdown renderers={markdownRenderers} children={article.content} />
    </div>
  );
}
