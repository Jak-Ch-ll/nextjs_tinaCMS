import { GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/router"
import ReactMarkdown from "react-markdown"
import prisma from "../../../prisma/prisma"
import { API_IMAGE_ENDPOINT } from "../../_constants"

import styles from "./[url].module.scss"
import { BlogImage } from "../../components/tina/BlogImage"
import { ArticleDB, ArticleRenderData } from "../../utils/ArticleDB"
import { DateTime } from "../../components/DateTime"
import Head from "next/head"

interface ArticlePageProps {
  article: ArticleRenderData
}

const articleDB = new ArticleDB()

export const getStaticProps: GetStaticProps<ArticlePageProps> = async ({
  params,
}) => {
  const url = params!.url as string

  try {
    const article = await articleDB.getPublishedArticleToRender(url)

    return {
      props: {
        article,
      },
      revalidate: 1,
    }
  } catch {
    return {
      notFound: true,
      revalidate: 1,
    }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await prisma.article.findMany()

  const paths = articles.map(({ url }) => ({
    params: { url },
  }))

  return {
    paths,
    fallback: true,
  }
}

export const blogMarkdownRenderers = {
  image: ({ src, alt = "" }: { src: string; alt: string }) => {
    return <BlogImage src={src} alt={alt} />
  },
}

export default function ArticlePage({ article }: ArticlePageProps) {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Head>
        <title>{article.title}</title>
      </Head>
      <main className={`${styles.container}`}>
        <article className={styles.article}>
          <header className={styles.header}>
            <h1 className={styles.title}>{article.title}</h1>
            <DateTime date={article.publishedAt} />
            <p className={styles.intro}>{article.teaserText}</p>
          </header>
          <BlogImage
            src={`${API_IMAGE_ENDPOINT}/${article.img}`}
            alt={article.imgAlt}
          />
          <section>
            <ReactMarkdown
              className={styles.content}
              renderers={blogMarkdownRenderers}
              children={article.content}
            />
          </section>
        </article>
      </main>
    </>
  )
}
