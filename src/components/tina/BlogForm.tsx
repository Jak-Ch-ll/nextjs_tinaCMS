import axios from "axios";
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
import { useForm, usePlugin } from "tinacms";
import {
  API_ARTICLE_ENDPOINT_INTERNAL as endpoint,
  API_IMAGE_ENDPOINT_INTERNAL,
} from "../../_constants";
import { ArticleInForm, ArticleToRender } from "../../_types";

import styles from "./BlogForm.module.scss";

interface FormProps {
  article?: ArticleToRender;
}

export const BlogForm = ({ article }: FormProps) => {
  const onSubmit = async (formData: any) => {
    console.log(formData);
    if (article) {
      return await axios.patch(`${endpoint}/${article.id}`, formData);
    }
    return await axios.post(endpoint, formData);
  };

  const getInitialValues = () => {
    if (article) {
      const values: any = { ...article };

      delete values.createdAt;
      delete values.updatedAt;

      return values as ArticleInForm;
    }
  };

  const [data, form] = useForm<ArticleInForm>({
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
      },
      {
        name: "_",
        component: () => <h4>URL</h4>,
      },
      {
        name: "url",
        label: "The URL after www.homepage.de/blog/",
        component: "text",
      },
      {
        name: "autoURL",
        label: "Auto URL",
        component: "toggle",
        defaultValue: true,
      },
      {
        name: "Image",
        component: () => <h4>Image</h4>,
      },
      {
        name: "imgAlt",
        label: "Alternative text",
        component: "text",
      },
      {
        name: "imgTitle",
        label: "Image title",
        component: "text",
      },
      // {
      //   name: "img",
      //   label: "Preview Image",
      //   component: "image",
      //   parse: (media) => media.id,
      // },
    ],
  });

  // enable/disable url field
  useEffect(() => {
    const field = document.querySelector<HTMLInputElement>("input[name='url']");
    console.log(data.autoURL);

    if (data.autoURL) {
      return field?.setAttribute("disabled", "");
    }
    return field?.removeAttribute("disabled");
  }, [data.autoURL]);

  const updateUrl = () => {};

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
      <div className={`max-width ${styles.container}`}>
        <h1>
          <InlineText name="title" placeholder="Write an awesome title" />
        </h1>
        <p>
          <InlineTextarea name="teaser" placeholder="And some teaser text" />
        </p>
        {/* <TinaImage name="img" /> */}
        <InlineImage
          className={styles.imgContainer}
          name="img"
          parse={(media) => media.id}
        />
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
