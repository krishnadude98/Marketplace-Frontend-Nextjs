import { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import nftMarketplaceAbi from "../constants/NftMarketplace.json";
import nftAbi from "../constants/BasicNft.json";
import Image from "next/image";
import { Card, useNotification } from "web3uikit";
import { ethers } from "ethers";

const truncateString = (fullString, stringLength) => {
  if (fullString.length <= stringLength) return fullString;
  const seperator = "...";
  const seperatorLength = seperator.length;
  const charsToShow = stringLength - seperatorLength;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  return (
    fullString.substring(0, frontChars) +
    seperator +
    fullString.substring(fullString.length - backChars)
  );
};

export default function NftBoxSold({
  price,
  nftAddress,
  tokenId,
  marketplaceAddress,

  buyedBy,
  listedAt,
}) {
  const { isWeb3Enabled, account } = useMoralis();
  const [imageUri, setImageUrl] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");

  const { error, runContractFunction: getTokenUri } = useWeb3Contract({
    abi: nftAbi,
    contractAddress: nftAddress,
    functionName: "tokenURI",
    params: {
      tokenId: tokenId,
    },
  });
  if (error) {
    console.error("ERROR", error);
  }

  async function updateUI() {
    const tokenURI = await getTokenUri();
    console.log(tokenURI);
    if (tokenURI) {
      const reqestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      const tokenURIResponse = await (await fetch(reqestURL)).json();
      const imageURI = tokenURIResponse.image;
      const imageURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      setImageUrl(imageURL);
      setTokenName(tokenURIResponse.name);
      setTokenDescription(tokenURIResponse.description);
    }
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  const isOwnedByU = buyedBy.toLowerCase() == account || buyedBy === undefined;
  const formatedBuyer = isOwnedByU ? "you" : truncateString(buyedBy || "", 15);

  return (
    <div>
      <div>
        {imageUri ? (
          <div>
            <Card title={tokenName} description={tokenDescription}>
              <div className="p-2">
                <div className=" flex flex-col items-end gap-2">
                  <div>#{tokenId}</div>
                  <div className=" italic text-sm">
                    BoughtBy:{formatedBuyer}
                  </div>
                  <Image
                    loader={() => imageUri}
                    src={imageUri}
                    height="200"
                    width="200"
                  ></Image>
                  <div className=" font-bold">
                    {ethers.formatUnits(price, "ether")} ETH
                  </div>
                  <div className=" font-light">{listedAt}</div>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div>Loading.....</div>
        )}
      </div>
    </div>
  );
}
