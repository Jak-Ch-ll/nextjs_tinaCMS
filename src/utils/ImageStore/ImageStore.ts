import {
  Media,
  MediaList,
  MediaListOptions,
  MediaStore,
  MediaUploadOptions
} from "@tinacms/core"
import axios from "axios"
import slugify from "slugify"
import { API_IMAGE_ENDPOINT as endpoint } from "../../_constants"

// https://tina.io/docs/media/

export class ImageStore implements MediaStore {
  accept = "image/*"

  async persist(options: MediaUploadOptions[]): Promise<Media[]> {
    return Promise.all(
      options.map(async (option) => {
        const formData = new FormData()
        formData.append(option.file.name, option.file)

        try {
          await axios.post(endpoint, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })

          const name = slugify(option.file.name, {
            lower: true,
          })

          return {
            type: "file" as const,
            id: name,
            directory: `media/test`,
            filename: option.file.name,
            previewSrc: `${endpoint}/${option.file.name}`,
          }
        } catch (err) {
          throw new Error(err)
        }
      })
    )
  }

  // previewSrc for rendered image in form
  previewSrc = (src: string) => (src ? `${endpoint}/${src}` : "")

  async list({ limit = 10, offset = 0 }: MediaListOptions): Promise<MediaList> {
    const res = await axios.get(endpoint)
    const fileNames: string[] = res.data

    const items: Media[] = []
    const totalCount = fileNames.length

    fileNames.forEach((filename) => {
      const type = "file"
      const id = filename
      const directory = `/test/`

      items.push({
        type,
        id,
        directory,
        filename,
        previewSrc: `${endpoint}/${filename}`,
      })
    })

    return {
      items,
      limit,
      offset,
      totalCount,
    }
  }

  async delete(media: Media) {
    await axios.delete(`${endpoint}/${media.filename}`)
  }
}
