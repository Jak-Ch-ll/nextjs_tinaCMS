import { useRouter } from "next/router";
import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { InlineWysiwyg } from "react-tinacms-editor";
import {
  InlineForm,
  InlineImage,
  InlineText,
  InlineTextarea,
} from "react-tinacms-inline";
import { useCMS, useForm, usePlugin } from "tinacms";
import { ArticleAPI } from "../../utils/ArticleAPI";
import { ArticleFormData } from "../../utils/ArticleDB";
import { API_IMAGE_ENDPOINT_INTERNAL } from "../../_constants";

import styles from "./BlogForm.module.scss";
import { BlogImage } from "./BlogImage";
import { useAutoURL } from "./hooks/useAutoURL";
import { useLocalStorage } from "./hooks/useLocalStorage";

interface FormProps {
  article?: ArticleFormData;
}

interface FormData extends ArticleFormData {
  published: boolean;
}

export const BlogForm = ({ article }: FormProps) => {
  const cms = useCMS();
  const router = useRouter();
  const articleAPI = new ArticleAPI();

  const onSubmit = async (data: FormData) => {
    const formData = {
      ...data,
      publishedAt: data.published ? new Date() : null,
    };

    // @ts-ignore
    delete formData.published;

    try {
      if (article) await articleAPI.patch(article.id, formData);
      else await articleAPI.post(formData);

      cms.alerts.success("Article saved");

      setTimeout(() => {
        router.push(formData.url);
      }, 500);
    } catch (err) {
      cms.alerts.error(err.response.statusText);
      throw new Error();
    }
  };

  const getInitialValues = (): FormData | void => {
    if (!article) return;
    const data = { ...article, published: !!article.publishedAt };

    return data;
  };

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
            );
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
          if (!value) return "URL can not be empty";
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
  });

  useLocalStorage(form);
  useAutoURL(form, form.values.autoURL);

  usePlugin(form);

  return (
    <InlineForm form={form}>
      <div className={`${styles.container}`}>
        <h1>
          <InlineText name="title" placeholder="Write an awesome title" />
        </h1>
        <p>
          <InlineTextarea
            name="teaserText"
            placeholder="And some teaser text"
          />
        </p>
        {/* <TinaImage name="img" /> */}
        <InlineImage
          className={styles.imgContainer}
          name="img"
          parse={(media) => media.id}
        >
          {({ src }) => {
            return (
              src && <BlogImage src={`http://localhost:3000${src}`} alt="" />
            );
          }}
        </InlineImage>
        <p>
          <InlineWysiwyg
            name="content"
            format="markdown"
            imageProps={{
              parse: (media) => `${API_IMAGE_ENDPOINT_INTERNAL}/${media.id}`,
              previewSrc: (url) => url,
            }}
          >
            <ReactMarkdown source={data.content} />
          </InlineWysiwyg>
        </p>
      </div>
    </InlineForm>
  );
};
