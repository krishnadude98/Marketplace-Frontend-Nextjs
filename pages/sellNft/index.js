import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
// import ManualHeader from "components/Header.jsx";
import { Form, useNotification } from "web3uikit";
import nftMarketplaceAbi from "../../constants/NftMarketplace.json";
import nftAbi from "../../constants/BasicNft.json";
import { useWeb3Contract } from "react-moralis";
import { chainId } from "react-moralis";
import networkMapping from "../../constants/networkMapping.json";
import { ethers } from "ethers";
import { useMoralis } from "react-moralis";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { web3, isWeb3Enabled } = useMoralis();

  const marketplaceAddress =
    networkMapping[chainId ? chainId : 11155111]["nftMarketplace"][0];

  const { runContractFunction } = useWeb3Contract();
  const dispatch = useNotification();

  const approveAndList = async (data) => {
    console.log("Approving.......");
    const nftAddress = data.data[0].inputResult;
    const tokenId = data.data[1].inputResult;
    const price = ethers.toBigInt(
      ethers.parseUnits(data.data[2].inputResult, "ether").toString()
    );
    console.log(nftAddress);
    console.log(tokenId);
    console.log(price);
    const approveOption = {
      abi: nftAbi,
      contractAddress: nftAddress,
      functionName: "approve",
      gasLimit: 20000000000,
      params: {
        to: marketplaceAddress,
        tokenId: tokenId,
      },
    };
    await runContractFunction({
      params: approveOption,
      onSuccess: async (tx) => {
        await tx.wait(1);
        handleApproveSuccess(nftAddress, tokenId, price);
      },

      onError: (e) => {
        console.log(e);
      },
    });

    async function handleApproveSuccess(nftAddress, tokenId, price) {
      // const estimatedGas = await contract.estimateGas.listItem(
      //   nftAddress,
      //   tokenId,
      //   price
      // // );
      // console.log("ESTIMATED GAS", estimatedGas());
      console.log(nftAddress);
      console.log(tokenId);
      console.log(price);
      console.log("Approved");

      const listOption = {
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "listItem",
        params: {
          nftAddress: nftAddress,
          tokenId: tokenId,
          price: price,
        },
      };
      // const signer = web3.getSigner();
      // const marketplaceContract = new ethers.Contract(
      //   marketplaceAddress,
      //   nftMarketplaceAbi,
      //   signer
      // );

      // const tx2 = await marketplaceContract.listItem(
      //   nftAddress, // Correct the arguments here
      //   tokenId, // Correct the arguments here
      //   price,
      //   {
      //     gasLimit: 10000000,
      //   }
      // );

      // await tx2.wait(1);
      // handleListSuccess();

      await runContractFunction({
        params: listOption,
        onSuccess: async (tx) => {
          await tx.wait(1);
          handleListSuccess();
        },

        onError: (e) => {
          console.log(e);
        },
      });
    }
  };
  async function handleListSuccess() {
    dispatch({
      type: "success",
      message: "listed",
      title: "Listed pls Refresh the home",
      position: "topR",
    });
  }
  return (
    <div className={styles.container}>
      <div className="bg-scroll  h-screen">
        <Form
          onSubmit={approveAndList}
          data={[
            {
              name: "Nft Address",
              type: "text",
              inputWidth: "50%",
              value: "",
              key: "nftAddress",
            },
            {
              name: "Token Id",
              type: "number",
              value: "",
              key: "tokenId",
            },
            {
              name: "Price in Eth",
              type: "number",
              value: "",
              key: "price",
            },
          ]}
          title="Sell You Nft"
          id="MainForm"
        />
      </div>
    </div>
  );
}
