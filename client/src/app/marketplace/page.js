"use client";
import { WalletContext } from "@/context/wallet";
import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import MarketplaceJson from "../marketplace.json";
import styles from "./marketplace.module.css";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import axios from "axios";
import NFTCard from "../components/nftCard/NFTCard";

export default function Marketplace() {
  const [items, setItems] = useState();
  const { isConnected, signer } = useContext(WalletContext);

  async function getNFTitems() {
    const itemsArray = [];
    if (!signer) return;
    let contract = new ethers.Contract(
      MarketplaceJson.address,
      MarketplaceJson.abi,
      signer
    );

    let transaction = await contract.getAllListedNFTs();

    for (const i of transaction) {
      const tokenId = parseInt(i.tokenId);
      const tokenURI = await contract.tokenURI(tokenId);
      const meta = (await axios.get(tokenURI)).data;
      const price = ethers.formatEther(i.price);

      const item = {
        price,
        tokenId,
        seller: i.seller,
        owner: i.owner,
        image: meta.image,
        name: meta.name,
        description: meta.description,
      };

      itemsArray.push(item);
    }
    return itemsArray;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsArray = await getNFTitems();
        setItems(itemsArray);
      } catch (error) {
        console.error("Error fetching NFT items:", error);
      }
    };

    fetchData();
  }, [isConnected]);

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.innerContainer}>
        <div className={styles.content}>
          {isConnected ? (
            <>
              <div className={styles.nftSection}>
                <h2 className={styles.heading}>NFT Marketplace</h2>
                {items?.length > 0 ? (
                  <div className={styles.nftGrid}>
                    {items?.map((value, index) => (
                      <NFTCard item={value} key={index} />
                    ))}
                  </div>
                ) : (
                  <div className={styles.noNFT}>No NFT Listed Now...</div>
                )}
              </div>
            </>
          ) : (
            <div className={styles.notConnected}>You are not connected...</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
