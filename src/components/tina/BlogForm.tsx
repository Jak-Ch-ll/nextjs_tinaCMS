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
import slugify from "slugify";
import { useCMS, useForm, usePlugin } from "tinacms";
import { ArticleAPI } from "../../utils/ArticleAPI";
import { ArticleFormData } from "../../utils/ArticleDB";
import { API_IMAGE_ENDPOINT_INTERNAL } from "../../_constants";

import styles from "./BlogForm.module.scss";
import { BlogImage } from "./BlogImage";
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
    id: "New Blogpost",
    label: "New Blogpost",
    onSubmit,
    initialValues: getInitialValues(),
    fields: [
      {
        name: "published",
        label: "Publish",
        component: "toggle",
        defaultValue: false,
        description: "Check to publish article",
        validate: (value, { title, teaser, img, content }) => {
          if (value && !(title && teaser && img && content)) {
            return (
              <>
                <div>Missing the following:</div>
                <ul>
                  {!title && <li>The title</li>}
                  {!teaser && <li>The teaser text</li>}
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

  // enable/disable url field
  useEffect(() => {
    const field = document.querySelector<HTMLInputElement>("input[name='url']");
    console.log(data.autoURL);

    if (data.autoURL) {
      return field?.setAttribute("disabled", "");
    }
    return field?.removeAttribute("disabled");
  }, [data.autoURL]);

  // auto update url
  useEffect(() => {
    console.log("Triggered!");
    if (data.autoURL) {
      const title = data.title || "";
      const url = slugify(title, {
        lower: true,
        strict: true,
      });

      form.updateValues({
        url,
      });
    }
  }, [data.autoURL, data.title, form]);

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
            console.log(src);
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
