import { useRouter } from "next/router";
import Link from "next/link";

import styles from "./Banner.module.sass";
import LinkTo from "./LinkTo";

export function Banner() {
  const router = useRouter();
  const navTargets = [
    {
      url: "/",
      text: "Home",
    },
    {
      url: "/blog",
      text: "Blog",
    },
  ];

  return (
    <header className={styles.header}>
      <div>
        <LinkTo href="/">My Blog</LinkTo>
      </div>
      <nav>
        <ul>
          {navTargets.map((target, i) => {
            return (
              <li key={i}>
                <LinkTo
                  href={target.url}
                  {...(target.url === router.pathname && {
                    className: styles.active,
                  })}
                >
                  {target.text}
                </LinkTo>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
