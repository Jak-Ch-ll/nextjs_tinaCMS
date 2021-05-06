import Image from "next/image"

import styles from "./BlogImage.module.scss"

export interface BlogImageProps {
  src: string
  alt: string
  className?: string
}

export const BlogImage = ({
  src,
  alt,
  className,
}: BlogImageProps): JSX.Element => {
  return (
    <div className={`${styles.container} ` + className}>
      <Image src={src} alt={alt} layout="fill" objectFit="cover" />
    </div>
  )
}
