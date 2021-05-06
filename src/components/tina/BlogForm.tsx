import { useRouter } from "next/router"
import React from "react"
import ReactMarkdown from "react-markdown"
import { InlineWysiwyg } from "react-tinacms-editor"
import {
  InlineForm,
  InlineImage,
  InlineText,
  InlineTextarea,
} from "react-tinacms-inline"
import { useCMS, useForm, usePlugin } from "tinacms"
import { ArticleAPI } from "../../utils/ArticleAPI"
import { ArticleFormData } from "../../utils/ArticleDB"

import { BlogImage } from "./BlogImage"
import { useAutoURL } from "./hooks/useAutoURL"
import { useLocalStorage } from "./hooks/useLocalStorage"
import { DateTime } from "../DateTime"

import styles from "./BlogForm.module.scss"
import blogStyles from "../../pages/blog/[url].module.scss"
import imageStyles from "./BlogImage.module.scss"
import { blogMarkdownRenderers } from "../../pages/blog/[url].page"

interface FormProps {
  article?: ArticleFormData
}

interface FormData extends ArticleFormData {
  published: boolean
}

export const BlogForm = ({ article }: FormProps) => {
  const cms = useCMS()
  const router = useRouter()
  const articleAPI = new ArticleAPI()

  const onSubmit = async (data: FormData) => {
    const formData = {
      ...data,
      publishedAt: data.published ? new Date() : null,
    }

    // @ts-ignore
    delete formData.published

    try {
      if (article) await articleAPI.patch(article.id, formData)
      else await articleAPI.post(formData)

      cms.alerts.success("Article saved")

      setTimeout(() => {
        router.push(formData.url)
      }, 500)
    } catch (err) {
      cms.alerts.error(err.response.statusText)
      throw new Error()
    }
  }

  const getInitialValues = (): FormData | void => {
    if (!article) return
    const data = { ...article, published: !!article.publishedAt }

    return data
  }

  const [data, form] = useForm<FormData>({
    id: "blogpost",
    label: "Blogpost",
    onSubmit,
    initialValues: getInitialValues(),
    fields: [
      {
        name: "published",
        label: "Publish",
        component: "toggle",
        defaultValue: false,
        description: "Check to publish article",
        validate: (value, { title, teaserText, img, content }) => {
          if (value && !(title && teaserText && img && content)) {
            return (
              <>
                <div>Missing the following:</div>
                <ul>
                  {!title && <li>The title</li>}
                  {!teaserText && <li>The teaser text</li>}
                  {!img && <li>The teaser image</li>}
                  {!content && <li>The content</li>}
                </ul>
              </>
            )
          }
        },
      },
      {
        name: "_",
        component: () => <h4>URL</h4>,
      },
      {
        name: "url",
        label: "The URL after www.homepage.de/blog/",
        component: "text",
        validate: (value) => {
          if (!value) return "URL can not be empty"
        },
      },
      {
        name: "autoURL",
        label: "Auto URL",
        component: "toggle",
        defaultValue: true,
      },
      {
        name: "Teaser image",
        component: () => <h4>Teaser image</h4>,
      },
      {
        name: "img",
        label: "Image",
        component: "image",
        parse: (media) => media.id,
      },
      {
        name: "imgAlt",
        label: "Image description (alt-text)",
        component: "text",
      },
      {
        name: "imgTitle",
        label: "Title",
        component: "text",
      },
    ],
  })

  useLocalStorage(form)
  useAutoURL(form, form.values.autoURL)

  usePlugin(form)

  return (
    <InlineForm form={form}>
      <main className={`${blogStyles.container}`}>
        <article className={blogStyles.article}>
          <header className={blogStyles.header}>
            <h1 className={blogStyles.title}>
              <InlineText
                name="title"
                placeholder="Your awesome title"
                focusRing={{ offset: 5 }}
              />
            </h1>
            <DateTime date={article?.publishedAt || "Not yet published"} />
            <p className={blogStyles.intro}>
              <InlineTextarea
                name="teaserText"
                placeholder="Here is space for your teaser text"
                focusRing={{ offset: 5 }}
              />
            </p>
          </header>
          <div className={!data.img ? imageStyles.container : ""}>
            <InlineImage
              name="img"
              parse={(media) => media.id}
              focusRing={{ offset: 5 }}
            >
              {({ src }) => {
                return (
                  src && (
                    <BlogImage src={`http://localhost:3000${src}`} alt="" />
                  )
                )
              }}
            </InlineImage>
          </div>
          <section
            className={
              blogStyles.content +
              (!data.content ? ` ${styles.placeholder}` : "")
            }
            placeholder="And this is the space for the rest of your article"
          >
            <InlineWysiwyg
              focusRing={{ offset: 5 }}
              name="content"
              format="markdown"
              imageProps={{
                parse: (media) => `/${media.id}`,
                previewSrc: (url) => url,
              }}
            >
              <ReactMarkdown
                renderers={blogMarkdownRenderers}
                source={data.content}
              />
            </InlineWysiwyg>
          </section>
        </article>
      </main>
    </InlineForm>
  )
}
