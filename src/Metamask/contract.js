const forwarderOrigin = "http://localhost:9010";

const initialize = () => {
  //Basic Actions Section
  const onboardButton = document.getElementById("connectButton");
  const getAccountsButton = document.getElementById("getAccounts");
  const getAccountsResult = document.getElementById("getAccountsResult");
  const disChainId = document.getElementById("chainId");
  const disAccounts = document.getElementById("accounts");
  const disNetwork = document.getElementById("network");

  //Created check function to see if the MetaMask extension is installed
  const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  //We create a new MetaMask onboarding object to use in our app
  const onboarding = new MetaMaskOnboarding({ forwarderOrigin }); // back to metamask.io

  //This will start the onboarding proccess
  const onClickInstall = () => {
    onboardButton.innerText = "Onboarding in progress";
    onboardButton.disabled = true;
    //On this object we have startOnboarding which will start the onboarding process for our end user
    onboarding.startOnboarding();
  };

  const onClickConnect = async () => {
    try {
      // Will open the MetaMask UI
      // You should disable this button while the request is pending!
      await ethereum.request({ method: "eth_requestAccounts" });
      MetaMaskClientCheck();
    } catch (error) {
      console.error(error);
    }
  };

  const isMetaMaskConnected = async () => {
    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log("run");
    console.log(accounts);
    return Boolean(accounts && accounts.length > 0);
  };

  const MetaMaskClientCheck = async () => {
    const accounts = await ethereum.request({ method: "eth_accounts" });
    const chainId = await ethereum.request({ method: "eth_chainId" });
    const networkId = await ethereum.request({ method: "net_version" });

    //Eth_Accounts-getAccountsButton
    getAccountsButton.addEventListener("click", async () => {
      //we use eth_accounts because it returns a list of addresses owned by us.

      //We take the first address in the array of addresses and display it
      getAccountsResult.innerHTML = accounts[0] || "Not able to get accounts";
    });

    const conCheck = await isMetaMaskConnected();
    //Now we check to see if MetaMask is installed
    if (!isMetaMaskInstalled()) {
      //If it isn't installed we ask the user to click to install it
      onboardButton.innerText = "Click here to install MetaMask!";

      onboardButton.onclick = onClickInstall;
      //The button is now disabled
      onboardButton.disabled = false;
    } else if (conCheck) {
      onboardButton.innerText = "Connected";
      onboardButton.disabled = true;
      disAccounts.innerHTML = accounts[0];
      disChainId.innerHTML = chainId;
      disNetwork.innerHTML = networkId;
      if (onboarding) {
        onboarding.stopOnboarding();
      }
    } else {
      //If it is installed we change our button text
      onboardButton.innerText = "Connect";

      onboardButton.onclick = onClickConnect;
      //The button is now disabled
      onboardButton.disabled = false;
    }
  };

  MetaMaskClientCheck();
};

window.addEventListener("DOMContentLoaded", initialize);

const checkbtn = document.getElementById("fuck");

const checkNFT = async () => {
  const tokenID = [];
  const options = { method: "GET" };
  const accounts = await ethereum.request({ method: "eth_accounts" });
  // const accounts = '0xe4b80b17e78020f28076966afc1f17e9bedc8823';
  let index;
  // console.log(accounts);

  fetch(
    `https://api.opensea.io/api/v1/assets?owner=${accounts}&limit=20`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      response.assets.forEach((asset) => tokenID.push(asset.token_id));
      index = tokenID.findIndex((id) => id === "0");
      // contractAdrs = tokenID.findIndex(adr => adr === '');
      if (index === -1) throw new Error("Token is invalid 💥");
      console.log(response.assets[index]);
      console.log(response.assets[index].asset_contract.address);
    })
    .catch((err) => console.error(err));
};
checkbtn.addEventListener("click", checkNFT);
