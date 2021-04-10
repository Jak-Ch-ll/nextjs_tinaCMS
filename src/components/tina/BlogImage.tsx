import Image from "next/image";

import styles from "./BlogImage.module.scss";

export interface BlogImageProps {
  src: string;
  alt: string;
}

export const BlogImage = ({ src, alt }: BlogImageProps): JSX.Element => {
  return (
    <div className={styles.container}>
      <Image src={src} alt={alt} layout="fill" objectFit="cover" />
    </div>
  );
};
