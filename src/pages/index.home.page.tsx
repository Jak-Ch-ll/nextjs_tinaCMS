import { GetStaticProps } from "next"
import Head from "next/head"
import React from "react"
import { ArticlePreview } from "../components/ArticlePreview"
import { ArticleDB, ArticleTeaserData } from "../utils/ArticleDB"
import styles from "./index.home.module.scss"

interface HomePageProps {
  articles: ArticleTeaserData[]
}

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const db = new ArticleDB()
  const articles = await db.getPreviewArticles()

  return {
    props: {
      articles,
    },
    revalidate: 1,
  }
}

export default function Home({ articles }: HomePageProps) {
  const renderedArticles = articles.map((article) => {
    return (
      <li key={article.id} className={styles.item}>
        <ArticlePreview article={article} />
      </li>
    )
  })

  return (
    <div className={`max-width ${styles.container}`}>
      <Head>
        <title>Hello World</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={`${styles.main}`}>
        <h1 className={styles.title}>Welcome to My Blog!</h1>
        <ul className={`${styles.list}`}>{renderedArticles}</ul>
      </main>
    </div>
  )
}
