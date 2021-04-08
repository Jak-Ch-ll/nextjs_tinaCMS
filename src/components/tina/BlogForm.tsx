import { Article } from "@prisma/client";
import axios from "axios";
import React from "react";
import ReactMarkdown from "react-markdown";
import { InlineWysiwyg } from "react-tinacms-editor";
import {
  InlineForm,
  InlineImage,
  InlineText,
  InlineTextarea,
} from "react-tinacms-inline";
import { useForm, usePlugin } from "tinacms";
import { API_ARTICLE_ENDPOINT_INTERNAL as endpoint } from "../../pages/api/_constants";
import { ArticleToRender } from "../../types";

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
      const { published, url, title, teaser, img, content } = article;

      return {
        published,
        url,
        title,
        teaser,
        img,
        content,
      };
    }
  };

  const [data, form] = useForm<ArticleToRender>({
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
        name: "url",
        label: "URL",
        component: "text",
        description: "The URL after www.homepage.de/blog/",
      },
    ],
  });

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
        <InlineImage
          className={styles.imgContainer}
          name="img"
          parse={(media) => media.id}
        />
        <p>
          <InlineWysiwyg name="content" format="markdown">
            <ReactMarkdown source={data.content} />
          </InlineWysiwyg>
        </p>
      </div>
    </InlineForm>
  );
};
