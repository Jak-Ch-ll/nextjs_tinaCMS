import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { getSession } from "next-auth/client"
import { ArticleTableData, ArticleDB } from "../../utils/ArticleDB"
import { redirectOnNoAccess } from "../../utils"
import { ArticleTable } from "../../components/tina/ArticleTable"
import Head from "next/head"

import styles from "./index.module.scss"

interface TinaPageProps {
  articles: ArticleTableData[]
}

export const getServerSideProps: GetServerSideProps<TinaPageProps> = async (
  context
) => {
  const session = await getSession(context)
  if (!session) return redirectOnNoAccess()

  const db = new ArticleDB()

  const articles = await db.getArticlesForTable()

  return {
    props: {
      articles,
    },
  }
}

export default function TinaPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>
      <main className={styles.main}>
        <ArticleTable articles={props.articles} />
      </main>
    </>
  )
}
