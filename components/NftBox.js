import { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import nftMarketplaceAbi from "../constants/NftMarketplace.json";
import nftAbi from "../constants/BasicNft.json";
import Image from "next/image";
import { Card, useNotification } from "web3uikit";
import { ethers } from "ethers";
import UpdateListingModal from "./UpdateListingModal";

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

export default function NftBox({
  price,
  nftAddress,
  tokenId,
  marketplaceAddress,
  seller,
  listedAt,
}) {
  const { isWeb3Enabled, account } = useMoralis();
  const [imageUri, setImageUrl] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const hideModal = () => {
    setShowModal(false);
  };
  const dispath = useNotification();

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

  const { runContractFunction: buyToken } = useWeb3Contract({
    abi: nftMarketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "buyItem",
    msgValue: price,
    params: {
      nftAddress: nftAddress,
      tokenId: tokenId,
    },
  });

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

  const isOwnedByUser = seller.toLowerCase() == account || seller === undefined;
  const formatedOwner = isOwnedByUser
    ? "you"
    : truncateString(seller || "", 15);

  const handleCardClick = () => {
    isOwnedByUser
      ? setShowModal(true)
      : buyToken({
          onError: (err) => console.log(err),
          onSuccess: async (tx) => {
            await tx.wait(1);
            handleBuyItemSucess();
          },
        });
  };

  const handleBuyItemSucess = async () => {
    dispath({
      type: "success",
      message: "Buy Item Sucess",
      title: "Buy Item Sucess",
      position: "topR",
    });
  };

  return (
    <div>
      <div>
        {imageUri ? (
          <div>
            <UpdateListingModal
              isVisible={showModal}
              tokenId={tokenId}
              marketPlaceAddress={marketplaceAddress}
              nftAddress={nftAddress}
              onClose={hideModal}
            />
            <Card
              title={tokenName}
              description={tokenDescription}
              onClick={handleCardClick}
            >
              <div className="p-2">
                <div className=" flex flex-col items-end gap-2">
                  <div>#{tokenId}</div>
                  <div className=" italic text-sm">
                    Owned by: {formatedOwner}
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
