"use client";
import { useContext, useState } from "react";
import styles from "./sellNFT.module.css";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { useRouter } from "next/navigation";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import marketplace from "./../marketplace.json";
import { ethers } from "ethers";
import { WalletContext } from "@/context/wallet";

export default function SellNFT() {
  const [formParams, updateFormParams] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [fileURL, setFileURL] = useState();
  const [message, updateMessage] = useState("");
  const [btn, setBtn] = useState(false);
  const [btnContent, setBtnContent] = useState("List NFT");
  const router = useRouter();
  const { isConnected, signer } = useContext(WalletContext);

  async function onFileChange(e) {
    try {
      const file = e.target.files[0];
      const data = new FormData();
      data.set("file", file);
      setBtn(false);
      updateMessage("Uploading image... Please don't click anything!");
      const response = await uploadFileToIPFS(data);
      if (response.success === true) {
        setBtn(true);
        updateMessage("");
        setFileURL(response.pinataURL);
      }
    } catch (e) {
      console.log("Error during file upload...", e);
    }
  }

  async function uploadMetadataToIPFS() {
    const { name, description, price } = formParams;
    if (!name || !description || !price || !fileURL) {
      updateMessage("Please fill all the fields!");
      return -1;
    }

    const nftJSON = {
      name,
      description,
      price,
      image: fileURL,
    };

    try {
      const response = await uploadJSONToIPFS(nftJSON);
      if (response.success === true) {
        return response.pinataURL;
      }
    } catch (e) {
      console.log("Error uploading JSON metadata: ", e);
    }
  }

  async function listNFT(e) {
    try {
      setBtnContent("Processing...");
      const metadataURL = await uploadMetadataToIPFS();
      if (metadataURL === -1) return;

      updateMessage("Uploading NFT...Please dont click anythying!");

      let contract = new ethers.Contract(
        marketplace.address,
        marketplace.abi,
        signer
      );
      const price = ethers.parseEther(formParams.price);

      let transaction = await contract.createToken(metadataURL, price);
      await transaction.wait();

      setBtnContent("List NFT");
      setBtn(false);
      updateMessage("");
      updateFormParams({ name: "", description: "", price: "" });
      alert("Successfully listed your NFT!");
      router.push("/");
    } catch (e) {
      alert("Upload error", e);
    }
  }

  return (
    <div className={styles.container}>
      <Header />
      {isConnected ? (
        <div className={styles.innerContainer}>
          <div className={styles.content}>
            <h2 className={styles.heading}>Upload your NFT</h2>
            <div className={styles.Form}>
              <div className={styles.FormContent}>
                <label className={styles.Label}>NFT name</label>
                <input
                  type="text"
                  className={styles.Input}
                  value={formParams.name}
                  onChange={(e) =>
                    updateFormParams({ ...formParams, name: e.target.value })
                  }
                />
              </div>
              <div className={styles.FormContent}>
                <label className={styles.Label}>NFT description</label>
                <textarea
                  type="text"
                  className={`${styles.Input} ${styles.TextArea}`}
                  value={formParams.description}
                  onChange={(e) =>
                    updateFormParams({
                      ...formParams,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className={styles.FormContent}>
                <label className={styles.Label}>Price (in Eth)</label>
                <input
                  type="number"
                  className={styles.Input}
                  value={formParams.price}
                  onChange={(e) =>
                    updateFormParams({ ...formParams, price: e.target.value })
                  }
                />
              </div>
              <div className={styles.FormContent}>
                <label className={styles.Label}>Upload image</label>
                <input
                  type="file"
                  className={styles.Input}
                  onChange={onFileChange}
                />
              </div>
              <br></br>
              <div className={styles.msg}>{message}</div>
              <button
                onClick={listNFT}
                type="submit"
                className={
                  btn
                    ? `${styles.btn} ${styles.activebtn}`
                    : `${styles.btn} ${styles.inactivebtn}`
                }
              >
                {btnContent === "Processing..." && (
                  <span className={styles.spinner} />
                )}
                {btnContent}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.innerContainer}>
          <div className={styles.notConnected}>
            Connect Your Wallet to Continue...
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
