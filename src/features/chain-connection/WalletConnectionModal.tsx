import { Dispatch, SetStateAction, useEffect } from "react";
import { twJoin } from "tailwind-merge";
import { Connector, useAccount, useConnect } from "wagmi";
import { Modal } from "../common/Modal";
import coinbaseWalletLogo from "./assets/wallet-logos/coinbase-wallet.svg";
import frameLogo from "./assets/wallet-logos/frame-logo.png";
import metamaskLogo from "./assets/wallet-logos/metamask-logo.svg";
import rabbyLogo from "./assets/wallet-logos/rabby-logo.svg";
import walletConnectLogo from "./assets/wallet-logos/walletconnect-logo.svg";
import { filterUniqueConnectors } from "./utils/filterUniqueConnectors";

const walletLogos: Record<string, string> = {
  walletconnect: walletConnectLogo,
  metamask: metamaskLogo,
  "rabby wallet": rabbyLogo,
  "coinbase wallet": coinbaseWalletLogo,
  frame: frameLogo,
};

const WalletConnectionModal = ({
  setShowConnectionModal,
}: {
  setShowConnectionModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const { isConnected } = useAccount();
  const { connect, connectors, isLoading, pendingConnector } = useConnect();

  const connectorsList = filterUniqueConnectors(connectors);

  useEffect(() => {
    isConnected && setShowConnectionModal(false);
  }, [isConnected, setShowConnectionModal]);

  return (
    <Modal
      className="text-white"
      heading="Select Wallet"
      onCloseRequest={() => setShowConnectionModal(false)}
    >
      <div className="color-white flex w-[360px] flex-col bg-gray-900 font-bold">
        <div className="flex flex-col gap-2">
          {connectorsList
            // .filter((connector) => connector.ready)
            // .sort((c) => (c.ready ? -1 : 1))
            .map((connector: Connector) => {
              return (
                <button
                  className={twJoin(
                    "flex flex-row items-center rounded border border-gray-800 bg-gray-900 p-4",
                    "hover:bg-gray-800 disabled:cursor-not-allowed font-medium",
                  )}
                  disabled={!connector.ready}
                  onClick={() => connect({ connector })}
                  key={connector.id}
                >
                  <img
                    src={walletLogos[connector.name.toLowerCase()]}
                    alt={`${connector.name} logo`}
                    className="mr-5 h-10 w-10"
                  />
                  <span className={twJoin(!connector.ready && "opacity-50")}>
                    {connector.name}
                    {/* {!connector.ready && " (unsupported)"} */}
                    {isLoading &&
                      connector.id === pendingConnector?.id &&
                      " (connecting)"}
                  </span>
                </button>
              );
            })}
        </div>
      </div>
    </Modal>
  );
};

export default WalletConnectionModal;
