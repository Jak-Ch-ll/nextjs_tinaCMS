import { Prisma } from "@prisma/client"
import axios from "axios"
import { API_ARTICLE_ENDPOINT_INTERNAL } from "../_constants"

const ax = axios.create({
  baseURL: API_ARTICLE_ENDPOINT_INTERNAL,
})

export interface NewArticle
  extends Omit<Prisma.ArticleCreateInput, "id" | "createdAt" | "updatedAt"> {}

export type UpdateArticle = Partial<NewArticle>

interface ArticleAPIInterface {
  post: (article: NewArticle) => Promise<void>
  patch: (id: number, article: UpdateArticle) => Promise<void>
  delete: (id: number) => Promise<void>
}

export class ArticleAPI implements ArticleAPIInterface {
  public async post(data: NewArticle) {
    await ax.post("/", data)
  }

  public async patch(id: number, data: UpdateArticle) {
    await ax.patch(`/${id}`, data)
  }

  public async delete(id: number) {
    await ax.delete(`/${id}`)
  }
}
