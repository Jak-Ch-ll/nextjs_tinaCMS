import { IconButton } from "@material-ui/core"
import Tooltip from "@material-ui/core/Tooltip"
import AddIcon from "@material-ui/icons/Add"
import DeleteIcon from "@material-ui/icons/Delete"
import ExitToAppIcon from "@material-ui/icons/ExitToApp"
import HomeIcon from "@material-ui/icons/Home"
import { signOut } from "next-auth/client"
import { useRouter } from "next/router"
import React from "react"
import ReactMarkdown from "react-markdown"
import { InlineWysiwyg } from "react-tinacms-editor"
import { InlineForm, InlineImage, InlineTextarea } from "react-tinacms-inline"
import { useCMS, useForm, usePlugin } from "tinacms"
import blogStyles from "../../pages/blog/[url].module.scss"
import { blogMarkdownRenderers } from "../../pages/blog/[url].page"
import { ArticleAPI } from "../../utils/ArticleAPI"
import { ArticleFormData } from "../../utils/ArticleDB"
import { API_IMAGE_ENDPOINT } from "../../_constants"
import { DateTime } from "../DateTime"
import styles from "./BlogForm.module.scss"
import { BlogImage } from "./BlogImage"
import imageStyles from "./BlogImage.module.scss"
import { useAutoURL } from "./hooks/useAutoURL"
import { useLocalStorage } from "./hooks/useLocalStorage"



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

  const getInitialValues = (): Partial<FormData> => {
    if (!article) {
      return {
        published: false,
        url: "",
        autoURL: true,
      }
    }
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
        name: "_",
        component: () => (
          <div className={styles.sidebarButtons}>
            {article ? (
              <>
                <Tooltip
                  title="New article"
                  classes={{
                    popper: styles.sidebarTooltip,
                  }}
                >
                  <IconButton
                    aria-label="New article"
                    onClick={() => router.push("/edit/new")}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip
                  title="Delete this article"
                  classes={{
                    popper: styles.sidebarTooltip,
                  }}
                >
                  <IconButton
                    aria-label="Delete this article"
                    onClick={async () => {
                      const { id } = article

                      const confirmed = window.confirm(
                        `Delete article '${data.title}'?`
                      )
                      if (!confirmed) return

                      try {
                        await articleAPI.delete(id)
                        cms.alerts.success(
                          "Successfully deleted article. Going back home"
                        )
                        setTimeout(() => router.push("/edit"), 3000)
                      } catch (err) {
                        cms.alerts.error(
                          "Something went wrong while deleting. Details: ",
                          err
                        )
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </>
            ) : null}
            <Tooltip
              title="Home"
              classes={{
                popper: styles.sidebarTooltip,
              }}
            >
              <IconButton
                aria-label="Home"
                onClick={() => router.push("/edit")}
              >
                <HomeIcon />
              </IconButton>
            </Tooltip>
            <Tooltip
              title="Logout"
              classes={{
                popper: styles.sidebarTooltip,
              }}
            >
              <IconButton
                aria-label="Logout"
                onClick={() => {
                  const confirm = window.confirm(
                    "Are you sure, you want to log out?"
                  )
                  if (confirm) signOut({ callbackUrl: `/` })
                }}
              >
                <ExitToAppIcon />
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
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
        defaultValue: "",
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
        component: () => <h4>Teaser image details</h4>,
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
              <InlineTextarea
                name="title"
                placeholder="Your awesome title comes here"
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
                return src && <BlogImage src={src} alt="" />
              }}
            </InlineImage>
          </div>
          <section
            className={`
              ${blogStyles.content} ${styles.content}${
              !data.content ? ` ${styles.placeholder}` : ""
            }`}
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          >
            <InlineWysiwyg
              className={styles.content}
              focusRing={{ offset: 5 }}
              name="content"
              format="markdown"
              sticky="5rem"
              imageProps={{
                parse: (media) => `${API_IMAGE_ENDPOINT}/${media.id}`,
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
