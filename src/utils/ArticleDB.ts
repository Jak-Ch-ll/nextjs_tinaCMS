import { Article, Prisma } from "@prisma/client"
import prisma from "../../prisma/prisma"
import { API_IMAGE_ENDPOINT } from "../_constants"

type ArticleBase = Pick<Article, "id" | "url" | "title">

export interface ArticleTeaserData extends ArticleBase {
  publishedAt: string
  teaserText: string
  img: string
}

export interface ArticleTableData extends ArticleBase {
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}

export interface ArticleRenderData extends ArticleBase {
  publishedAt: string
  teaserText: string
  img: string
  imgAlt: string
  imgTitle: string
  content: string
}

export interface ArticleFormData
  extends Omit<ArticleRenderData, "publishedAt"> {
  publishedAt: string | null
  autoURL: boolean
}

export interface ArticleDBInterface {
  getPreviewArticles: () => Promise<ArticleTeaserData[]>
  getArticlesForTable: () => Promise<ArticleTableData[]>
  getPublishedArticleToRender: (url: string) => Promise<ArticleRenderData>
  getArticleFormData: (url: string) => Promise<ArticleFormData>
}

export class ArticleDB implements ArticleDBInterface {
  private baseSelect = Prisma.validator<Prisma.ArticleSelect>()({
    id: true,
    title: true,
    url: true,
  })

  private toDateString(date: Date) {
    return date.toJSON().replace(/T.+/, "")
  }

  public async getPreviewArticles(num?: number) {
    const articles = await prisma.article.findMany({
      where: {
        publishedAt: {
          not: null,
        },
      },
      select: {
        ...this.baseSelect,
        publishedAt: true,
        teaserText: true,
        img: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: num,
    })

    return articles.map((article) => ({
      ...article,
      publishedAt: article.publishedAt
        ? this.toDateString(article.publishedAt)
        : "Article not published",
      img: article.img
        ? `${API_IMAGE_ENDPOINT}/${article.img}`
        : "/img/placeholder.jpg",
    }))
  }

  public async getArticlesForTable() {
    const articles = await prisma.article.findMany({
      select: {
        ...this.baseSelect,
        createdAt: true,
        updatedAt: true,
        publishedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return articles.map((article) => ({
      ...article,
      createdAt: this.toDateString(article.createdAt),
      updatedAt: this.toDateString(article.updatedAt),
      publishedAt: article.publishedAt
        ? this.toDateString(article.publishedAt)
        : "No",
    }))
  }

  private renderDataSelect = Prisma.validator<Prisma.ArticleSelect>()({
    ...this.baseSelect,
    teaserText: true,
    img: true,
    imgAlt: true,
    imgTitle: true,
    publishedAt: true,
    content: true,
  })

  public async getPublishedArticleToRender(url: string) {
    const article = await prisma.article.findFirst({
      where: {
        url,
        publishedAt: {
          not: null,
        },
      },
      select: this.renderDataSelect,
      rejectOnNotFound: true,
    })

    return {
      ...article,
      publishedAt: article.publishedAt
        ? this.toDateString(article.publishedAt)
        : "Article not published",
    }
  }

  public async getArticleFormData(url: string) {
    const article = await prisma.article.findUnique({
      where: {
        url,
      },
      select: {
        ...this.renderDataSelect,
        autoURL: true,
      },
      rejectOnNotFound: true,
    })

    return {
      ...article,
      publishedAt: article.publishedAt
        ? this.toDateString(article.publishedAt)
        : null,
    }
  }
}
