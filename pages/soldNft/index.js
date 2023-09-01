import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import NftBoxSold from "@/components/NftBoxSold";
import networkMapping from "../../constants/networkMapping";
import { chainId } from "react-moralis";

// import ActiveItem from "../schemas/ActiveItem";

// import ManualHeader from "components/Header.jsx";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [listings, setListings] = useState([]);
  const { isWeb3Enabled } = useMoralis();

  async function getListings() {
    let listings = await fetch("/api/getBoughtLisiting/");
    let res = await listings.json();
    if (listings.length != 0) {
      setListings(res.data);
      console.log(listings[0]);
    }
  }
  useEffect(() => {
    getListings();
  }, []);

  return (
    <>
      <div className="bg-scroll bg-my_bg_image h-screen">
        <div className=" container mx-auto">
          <h1 className=" py-4 font-bold text-2xl"> Recently Bought</h1>

          <div className=" flex flext-wrap">
            {isWeb3Enabled ? (
              listings.length < 1 ? (
                <div>fetching....</div>
              ) : (
                listings.map((nft, index) => {
                  return (
                    <div className=" text-white">
                      <NftBoxSold
                        price={nft.price}
                        nftAddress={nft.nftAddress}
                        tokenId={nft.tokenId}
                        marketplaceAddress={
                          networkMapping[chainId ? chainId : 11155111][
                            "nftMarketplace"
                          ][0]
                        }
                        buyedBy={nft.buyer}
                        listedAt={nft.createdAt}
                        key={`${nft.nftAddress}${nft.tokenId}`}
                      />
                    </div>
                  );
                })
              )
            ) : (
              <div className=" text-white">Connect Metamask</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
