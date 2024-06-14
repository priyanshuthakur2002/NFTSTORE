import Link from "next/link";
import styles from "./Footer.module.css";
import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <p>Copyright &copy; {year} NFTStore. All rights reserved!</p>
        <ul className={styles.socialLinks}>
          <li>
            <Link href="#">
              <Image src="/x.png" width={40} height={40} alt="x logo" />
            </Link>
          </li>
          <li>
            <Link href="https://telegram.org/">
              <Image
                src="/telegram.png"
                width={40}
                height={40}
                alt="telegram logo"
              />
            </Link>
          </li>
          <li>
            <Link href="#">
              <Image
                src="/youtube.png"
                width={40}
                height={40}
                alt="youtube logo"
              />
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
