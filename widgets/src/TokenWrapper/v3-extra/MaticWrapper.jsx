const ownerId = "manzanal.near";
const tokenName = "MATIC";
const wrapTokenName = "WMATIC";
const wmaticAddress =
  props.wmaticAddress || "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270";
const tokenDecimals = 18;
const wmaticAbiUrl =
  props.wmaticAbiUrl ||
  "https://raw.githubusercontent.com/leomanza/chain-agnostic-bos-workshop/main/ABIs/WMATIC.abi.json";
const wmaticAbi = fetch(wmaticAbiUrl);

if (!wmaticAbi.ok) {
  return "Loading";
}
const wmaticAbiBody = wmaticAbi.body;
console.log("ABI", wmaticAbiBody);
const signer = Ethers.provider() ? Ethers.provider().getSigner() : null;
const wmaticContract = new ethers.Contract(
  wmaticAddress,
  wmaticAbiBody,
  signer
);

State.init({
  signerAddress: null,
});

const getSignerAddress = () => {
  signer.getAddress().then((signerAddress) => {
    State.update({ signerAddress });
  });
};
getSignerAddress();

const imgWrapTokenSvg = (
  <svg
    width="32"
    height="25.204"
    viewBox="0 0 32 25.204"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="m12.388 10.481 3.573 7.923 5.317 -3.065 0.004 -0.002v-6.135l-8.894 1.279Z"
      fill="#2BBDF7"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="m28.162 4.602 -3.319 -1.25 -3.547 -0.286v19.066l5.321 3.067 4.2 -8.595 -2.649 -8.311 -0.006 -3.689Z"
      fill="#2891F9"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="m27.828 3.072 -1.232 3.066h-0.002v19.063l5.322 -3.066V3.072h-4.088Z"
      fill="#2BBDF7"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="m26.618 0 -5.322 3.068L26.618 6.136l5.322 -3.068L26.618 0Z"
      fill="#2B6DEF"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M15.965 12.267v-0.002l-5.321 -5.954L0 3.065v19.063l5.321 3.068 1.521 -10.55 3.802 0.691v-0.003l5.322 3.067v-6.134h-0.001Z"
      fill="#2891F9"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M5.324 0 0 3.068 15.963 12.273l2.412 -1.39 2.909 -1.678L5.324 0Z"
      fill="#2B6DEF"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M5.325 12.267h-0.001v12.928l5.322 -3.067v-6.794l-5.321 -3.068Z"
      fill="#2BBDF7"
    />
  </svg>
);
const imgTokenSvg = (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="none">
      <circle fill="#6F41D8" cx="16" cy="16" r="16" />
      <path
        d="M21.092 12.693c-.369-.215-.848-.215-1.254 0l-2.879 1.654-1.955 1.078-2.879 1.653c-.369.216-.848.216-1.254 0l-2.288-1.294c-.369-.215-.627-.61-.627-1.042V12.19c0-.431.221-.826.627-1.042l2.25-1.258c.37-.216.85-.216 1.256 0l2.25 1.258c.37.216.628.611.628 1.042v1.654l1.955-1.115v-1.653a1.16 1.16 0 00-.627-1.042l-4.17-2.372c-.369-.216-.848-.216-1.254 0l-4.244 2.372A1.16 1.16 0 006 11.076v4.78c0 .432.221.827.627 1.043l4.244 2.372c.369.215.849.215 1.254 0l2.879-1.618 1.955-1.114 2.879-1.617c.369-.216.848-.216 1.254 0l2.251 1.258c.37.215.627.61.627 1.042v2.552c0 .431-.22.826-.627 1.042l-2.25 1.294c-.37.216-.85.216-1.255 0l-2.251-1.258c-.37-.216-.628-.611-.628-1.042v-1.654l-1.955 1.115v1.653c0 .431.221.827.627 1.042l4.244 2.372c.369.216.848.216 1.254 0l4.244-2.372c.369-.215.627-.61.627-1.042v-4.78a1.16 1.16 0 00-.627-1.042l-4.28-2.409z"
        fill="#FFF"
      />
    </g>
  </svg>
);

const parseToUnitsFn = (amount) => {
  const tokenDecimals = 18;
  return ethers.utils.parseUnits(amount, tokenDecimals);
};

const formatUnitsFn = (amount) => {
  const tokenDecimals = 18;
  return ethers.utils.formatUnits(amount, tokenDecimals);
};
const isValidAmountFn = (amount) => {
  if (!amount) return false;
  if (isNaN(Number(amount))) return false;
  if (amount === "") return false;
  if (amount < 0) return false;
  return true;
};
const isSignedIn = () => !!state.signerAddress;

const getMaticBalance = (signerAddress, updateStateCb) => {
  Ethers.provider()
    .getBalance(signerAddress)
    .then((balance) => updateStateCb(formatUnitsFn(balance)));
};

const getWMaticBalance = (signerAddress, updateStateCb) => {
  wmaticContract
    .balanceOf(signerAddress)
    .then((balance) => updateStateCb(formatUnitsFn(balance)));
};

const wrapFn = (amountIn) => {
  const amount = parseToUnitsFn(amountIn);

  wmaticContract.deposit({ value: amount });
};
const unwrapFn = (amountIn) => {
  const amount = parseToUnitsFn(amountIn);

  wmaticContract.withdraw(amount);
};
if (!state.signerAddress) return "Loading...";
return (
  <Widget
    src={`${ownerId}/widget/TokenWrapper.v3-extra.AbstractWrapper`}
    props={{
      tokenName,
      wrapTokenName,
      imgTokenSvg,
      imgWrapTokenSvg,
      getTokenBalanceFn: getMaticBalance,
      getWrapTokenBalanceFn: getWMaticBalance,
      parseToUnitsFn,
      formatUnitsFn,
      isValidAmountFn,
      wrapFn,
      unwrapFn,
      isSignedIn,
      signerAddress: state.signerAddress,
    }}
  />
);
