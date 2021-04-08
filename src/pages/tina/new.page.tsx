import { useForm, usePlugin } from "@tinacms/react-core";
import axios from "axios";
import {
  InlineForm,
  InlineImage,
  InlineText,
  InlineTextarea,
} from "react-tinacms-inline";

import { API_ARTICLE_ENDPOINT_INTERNAL as endpoint } from "../api/_constants";

import styles from "./new.module.scss";

export default function NewBlogpost() {
  const [modifiedValues, form] = useForm({
    id: "New Blogpost",
    label: "New Blogpost",
    onSubmit: (formData) => {
      console.log("Submitting?");
      console.log(formData);
      axios.post(endpoint, formData);
    },
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
          <InlineTextarea name="content" placeholder="The content" />
        </p>
      </div>
    </InlineForm>
  );
}
