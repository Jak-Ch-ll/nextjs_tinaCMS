import {
  Media,
  MediaList,
  MediaListOptions,
  MediaStore,
  MediaUploadOptions,
} from "@tinacms/core";
import axios from "axios";
import { API_IMAGE_ENDPOINT_INTERNAL as endpoint } from "../../_constants";

// https://tina.io/docs/media/

export class ImageStore implements MediaStore {
  accept = "image/*";

  async persist(options: MediaUploadOptions[]): Promise<Media[]> {
    const media: Media[] = [];

    options.forEach(async (option) => {
      const formData = new FormData();
      formData.append(option.file.name, option.file);

      const res = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      media.push({
        type: "file",
        id: option.file.name,
        directory: `media/test`,
        filename: option.file.name,
        previewSrc: `${endpoint}/${option.file.name}`,
      });
    });

    return media;
  }

  async previewSrc(src: string) {
    return `${endpoint}/${src}`;
  }

  async list({ limit = 10, offset = 0 }: MediaListOptions): Promise<MediaList> {
    const res = await axios.get(endpoint);
    const fileNames: string[] = res.data;

    const items: Media[] = [];
    const totalCount = fileNames.length;

    fileNames.forEach((filename) => {
      const type = "file";
      const id = filename;
      const directory = `/test/`;

      items.push({
        type,
        id,
        directory,
        filename,
        previewSrc: `${endpoint}/${filename}`,
      });
    });

    return {
      items,
      limit,
      offset,
      totalCount,
    };
  }

  async delete(media: Media) {
    axios.delete(`${endpoint}/${media.filename}`);
  }
}
