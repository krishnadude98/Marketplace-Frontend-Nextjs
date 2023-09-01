import { ConnectButton, Button, useNotification } from "web3uikit";
import Link from "next/link";
import nftMarketplaceAbi from "../constants/NftMarketplace.json";
import { useWeb3Contract, useMoralis } from "react-moralis";
import networkMapping from "../constants/networkMapping.json";
import { chainId } from "react-moralis";
import { useEffect, useState } from "react";

export default function Header() {
  const [hasFunds, setHashFunds] = useState(true);
  const dispatch = useNotification();
  const marketplaceAddress =
    networkMapping[chainId ? chainId : 11155111]["nftMarketplace"][0];
  const { account, Moralis, isWeb3Enabled } = useMoralis();
  const handleWithdrawSucess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "funds gathered",
      title: "Funds transfered to your account",
      position: "topR",
    });
  };
  const { runContractFunction: withdrawFunds } = useWeb3Contract({
    abi: nftMarketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "withdrawProceeds",
    params: {},
  });
  const { runContractFunction: getFunds } = useWeb3Contract({
    abi: nftMarketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "getProceeds",
    params: { seller: account },
  });

  const getFundsAccount = async () => {
    let result = await getFunds({ onError: (err) => alert(err) });
    if (result.toString() != "0") {
      setHashFunds(false);
    }
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      const result = getFundsAccount();

      console.log(result);
    }
  }, [account]);
  return (
    <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
      <h1 className="py-4 px-4 font-bold text-3xl">NFT Marketplace</h1>
      <div className="flex flex-row items-center">
        <Link href="/" className="mr-4 p-6">
          HOME
        </Link>
        <Link href="/sellNft" className="mr-4 p-6">
          Sell NFT
        </Link>
        <Link href="/soldNft" className="mr-4 p-6">
          Sold NFT
        </Link>
        <Button
          text="Withdraw"
          theme="primary"
          onClick={() => {
            withdrawFunds({
              onError: (err) => alert(err.message),
              onSuccess: handleWithdrawSucess,
            });
          }}
          disabled={hasFunds}
        ></Button>

        <ConnectButton moralisAuth={true} />
      </div>
    </nav>
  );
}
