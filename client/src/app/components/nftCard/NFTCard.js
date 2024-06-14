import GetIpfsUrlFromPinata from "@/app/utils";
import Image from "next/image";

import styles from "./NFTCard.module.css";
import Link from "next/link";

export default function NFTCard({ item }) {
  const IPFSUrl = GetIpfsUrlFromPinata(item.image);

  const limitedDescription =
    item.description.length > 100
      ? item.description.substring(0, 100) + "..."
      : item.description;

  return (
    <div className={styles.tile}>
      <div className={styles.imageContainer}>
        <Image src={IPFSUrl} alt="" width={500} height={360} />
      </div>
      <div className={styles.overlay}>
        <Link href={`/nft/${item.tokenId}`} className={styles.text}>
          <strong>{item.name}</strong>
          <p>{limitedDescription}</p>
        </Link>
      </div>
    </div>
  );
}
