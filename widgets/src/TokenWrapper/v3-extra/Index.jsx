const authorId = "manzanal.near";
const NETWORK_NEAR = "NEAR";
const NETWORK_ETH = "ETH";
const NETWORK_POLYGON = "POLYGON";
const ETH_CHAINID = 1;
const POLYGON_CHAINID = 137;
State.init({
  network: undefined,
  networkIsLoaded: false,
  error: null,
});

const getEVMAccountId = () => {
  if (ethers !== undefined) {
    return Ethers.send("eth_requestAccounts", [])[0] ?? "";
  }
  return "";
};

console.log("ethers", ethers);
if (!state.networkIsLoaded) {
  if (getEVMAccountId() !== "") {
    console.log("ethers is loading network");
    Ethers.provider()
      .getNetwork()
      .then((chainIdData) => {
        console.log("chainId", chainIdData.chainId);
        if (chainIdData.chainId === ETH_CHAINID) {
          // ETH
          State.update({
            network: NETWORK_ETH,
            networkIsLoaded: true,
            error: null,
          });
        } else if (chainIdData.chainId === POLYGON_CHAINID) {
          // POLYGON
          State.update({
            network: NETWORK_POLYGON,
            networkIsLoaded: true,
            error: null,
          });
        } else {
          State.update({
            network: null,
            networkIsLoaded: true,
            error: "Wrong network. Please connect to an allowed network",
          });
        }
      });
  } else {
    // ethers not supported on this gateway
    State.update({ network: NETWORK_NEAR, networkIsLoaded: true, error: null });
  }
}

console.log("NETWORK", state.network);
if (!state.networkIsLoaded && !state.network) return <>Loading</>;
if (state.error) return <>{state.error}</>;
const getContent = {
  NEAR: (
    <Widget src={`${authorId}/widget/TokenWrapper.v3-extra.NearWrapper`} props={{}} />
  ),
  ETH: (
    <Widget src={`${authorId}/widget/TokenWrapper.v3-extra.EthWrapper`} props={{}} />
  ),
  POLYGON: (
    <Widget
      src={`${authorId}/widget/TokenWrapper.v3-extra.MaticWrapper`}
      props={{}}
    />
  ),
}[state.network];

const Container = styled.div`
  width: 100%;

  * {
    margin: 0;
  }
`;
return <Container>{getContent}</Container>;
