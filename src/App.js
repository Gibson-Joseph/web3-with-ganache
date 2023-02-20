import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "./utils/load-contract";

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    isProviderLoaded: false,
    web3: null,
    contract: null,
  });

  const [account, setAccount] = useState(null);
  const [balance, setbalance] = useState(null);
  const [shouldReload, reload] = useState(false);

  const reloadEffect = useCallback(() => reload(!shouldReload), [shouldReload]);
  const setAccountListener = (provider) => {
    // https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider
    provider.on("accountsChanged", (accounts) => {
      // setAccount(accounts[0]);
      window.location.reload();
    });

    // detected the metamask unlock or not
    // provider._jsonRpcConnection.events.on("notification", (payload) => {
    //   const { method } = payload;
    //   console.log("method", method);
    //   if (method === "metamask_unlockStateChanged") {
    //     setAccount(null);
    //   }
    // });
  };
  useEffect(() => {
    const loadProvider = async () => {
      // with metamask we have an access to window.ethereum & to window.web3
      // metamask injects a global API into website
      // This API allows websites to request users, accounts, read data to blockchain
      // sign messages and transactions

      const provider = await detectEthereumProvider();
      if (provider) {
        const contract = await loadContract("Faucet", provider);
        // provider.request({ method: "eth_requestAccounts" });
        setAccountListener(provider);
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract,
          isProviderLoaded: true,
        });
      } else {
        setWeb3Api((api) => {
          return { ...api, isProviderLoaded: true };
        });
        console.error("Please, install Metamask.");
      }

      // https://www.udemy.com/course/solidity-ethereum-in-react-next-js-the-complete-guide/learn/lecture/28624158#learning-tools
      // if (window.ethereum) {
      //   provider = window.ethereum;
      //   try {
      //     await provider.request({ method: "eth_requestAccounts" });
      //   } catch (error) {
      //     console.error("user denide account access!");
      //   }
      // } else if (window.web3) {
      //   provider = window.web3.currentProvider;
      // } else if (!process.env.production) {
      //   provider = new Web3.providers.HttpProvider("http://localhost:7545");
      // }

      // setWeb3Api({
      //   web3: new Web3(provider),
      //   provider,
      // });
    };
    loadProvider();
  }, []);

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
    };
    // console.log("account", account);
    web3Api.web3 && getAccount();
  }, [web3Api, account]); // added account

  // useEffect(() => {
  //   const getBalance = async () => {
  //     const balance = await web3Api.web3.eth.getBalance(account);
  //     const bn_to_eth = web3Api.web3.utils.fromWei(balance, "ether");
  //     console.log("balance", bn_to_eth);
  //   };
  //   account && getBalance();
  // }, [web3Api.web3, account]);

  const addFunds = useCallback(async () => {
    const { contract, web3 } = web3Api;
    await contract.addFunds({
      from: account,
      value: web3.utils.toWei("1", "ether"),
    });
    reloadEffect();
  }, [web3Api, account, reloadEffect]); // Why use web3Api

  const withDrawFunds = useCallback(async () => {
    const { contract, web3 } = web3Api;
    await contract.withdraw(web3.utils.toWei("1", "ether"), { from: account });
    reloadEffect();
  }, [web3Api, account, reloadEffect]);

  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api;
      const balance = await web3.eth.getBalance(contract.address);
      setbalance(web3.utils.fromWei(balance, "ether"));
    };
    web3Api.contract && loadBalance();
  }, [web3Api, shouldReload]);

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          {web3Api.isProviderLoaded ? (
            <div className="is-flex is-align-items-center">
              <div>
                <strong className="mr-2">Accounts: </strong>
              </div>
              {account ? (
                <span className="">{account}</span>
              ) : !web3Api.provider ? (
                <>
                  <div className="notification is-warning is-size-6 is-rounded">
                    Wallet is not detected!{` `}
                    <a
                      target={"_blank"}
                      href="https://docs.metamask.io"
                      rel="noreferrer"
                    >
                      Install Metamask
                    </a>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => {
                    web3Api.provider.request({ method: "eth_requestAccounts" });
                  }}
                  className="button is-small"
                >
                  Connect Wallet!
                </button>
              )}
            </div>
          ) : (
            <span>Looking for web3...</span>
          )}
          <div className="balance-view is-size-2 my-4">
            Current Balance: <strong>{balance}</strong> ETH
          </div>
          <button
            className="button is-link mr-2"
            disabled={!account}
            onClick={() => addFunds()}
          >
            Donate 1eth
          </button>
          <button
            className="button is-primary"
            disabled={!account}
            onClick={() => withDrawFunds()}
          >
            Withdraw
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
