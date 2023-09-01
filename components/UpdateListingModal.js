import { useState } from "react";
import { Modal, Input, useNotification, Button } from "web3uikit";
import { useWeb3Contract } from "react-moralis";
import nftMarketplaceAbi from "../constants/NftMarketplace.json";
import { ethers } from "ethers";

export default function UpdateListingModal({
  nftAddress,
  tokenId,
  isVisible,
  marketPlaceAddress,
  onClose,
}) {
  const dispatch = useNotification();
  const [listingPrice, setListingPrice] = useState("");
  const [cancel, setCancel] = useState(false);
  const handleUpdateListingSucess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "listing updated",
      title: "Listing updated Pls Refresh",
      position: "topR",
    });
    onClose && onClose();
    setListingPrice("0");
  };
  const handleCancelListingSucess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "listing canceled",
      title: "Listing canceled Pls Refresh",
      position: "topR",
    });
    onClose && onClose();
    setListingPrice("0");
  };

  const { runContractFunction: updateListing } = useWeb3Contract({
    abi: nftMarketplaceAbi,
    contractAddress: marketPlaceAddress,
    functionName: "updateListing",
    params: {
      nftAddress: nftAddress,
      tokenId: tokenId,
      updatedPrice: ethers.parseEther(listingPrice || "0"),
    },
  });
  const { runContractFunction: cancelListing } = useWeb3Contract({
    abi: nftMarketplaceAbi,
    contractAddress: marketPlaceAddress,
    functionName: "cancelListing",
    params: {
      nftAddress: nftAddress,
      tokenId: tokenId,
    },
  });
  return (
    <Modal
      customFooter={
        <div className="flex justify-between">
          <Button
            onClick={() => {
              updateListing({
                onError: (err) => console.log(err),
                onSuccess: handleUpdateListingSucess,
              });
            }}
            style={{
              marginRight: "2em",
              textAlign: "center",
            }}
            customize={{ margin: "10px 10px" }}
            text="update listing"
            theme="primary"
          ></Button>
          <Button
            onClick={() => {
              cancelListing({
                onError: (err) => console.log(err),
                onSuccess: handleCancelListingSucess,
              });
            }}
            text="cancel listing"
            theme="primary"
          ></Button>
        </div>
      }
      isVisible={isVisible}
      onCancel={onClose}
      onCloseButtonPressed={onClose}
      onOk={() => {
        updateListing({
          onError: (err) => console.log(err),
          onSuccess: handleUpdateListingSucess,
        });
      }}
    >
      <Input
        label="update listing in L1 Currency (ETH)"
        name="New listing price"
        type="number"
        onChange={(event) => {
          setListingPrice(event.target.value);
        }}
      />
    </Modal>
  );
}
