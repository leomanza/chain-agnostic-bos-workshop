if (
  state.networkId === undefined &&
  ethers !== undefined &&
  Ethers.send("eth_requestAccounts", [])[0]
) {
  Ethers.provider()
    .getNetwork()
    .then((chainIdData) => {
      if (chainIdData?.chainId) {
        State.update({ networkId: chainIdData.chainId });
      }
    });
}
if (state.networkId !== undefined && state.networkId !== 1) {
  return <p>Switch to Ethereum Mainnet</p>;
}

State.init({
  unwrap: false,
  balanceToken: null,
  balanceWrapToken: null,
  intervalStarted: false,
  amountIn: null,
  amountOut: null,
  swapButtonText: null,
  swapReady: false,
  sender: null,
});

const ownerId = "manzanal.near";
const wethAddress =
  props.wethAddress || "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";
const tokenDecimals = 18;
const wethAbiUrl =
  props.wethAbiUrl ||
  "https://raw.githubusercontent.com/leomanza/chain-agnostic-bos-workshop/main/ABIs/WETH.abi.json";
const wethAbi = fetch(wethAbiUrl);

if (!wethAbi.ok) {
  return "Loading";
}
const wethAbiBody = wethAbi.body;
const signer = Ethers.provider() ? Ethers.provider().getSigner() : null;
const wethContract = new ethers.Contract(wethAddress, wethAbiBody, signer);

if (state.sender === undefined) {
  const accounts = Ethers.send("eth_requestAccounts", []);
  if (accounts.length) {
    State.update({ sender: accounts[0] });
  }
}
const getWrapTokenBalance = (signerAddress, updateStateCb) => {};

const parseToUnits = (amount) => {
  const tokenDecimals = 18;
  return ethers.utils.parseUnits(amount, tokenDecimals);
};
const formatUnitsFn = (amount) => {
  const tokenDecimals = 18;
  return ethers.utils.formatUnits(amount, tokenDecimals);
};
const isValidAmout = (amount) => {
  if (!amount) return false;
  if (isNaN(Number(amount))) return false;
  if (amount === "") return false;
  if (amount < 0) return false;
  return true;
};

const imgWrapTokenSvg = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <g fill="none" fill-rule="evenodd">
      <circle cx="16" cy="16" r="16" fill="#627EEA" />
      <g fill="#FFF" fill-rule="nonzero">
        <path fill-opacity=".602" d="M16.498 4v8.87l7.497 3.35z" />
        <path d="M16.498 4L9 16.22l7.498-3.35z" />
        <path fill-opacity=".602" d="M16.498 21.968v6.027L24 17.616z" />
        <path d="M16.498 27.995v-6.028L9 17.616z" />
        <path fill-opacity=".2" d="M16.498 20.573l7.497-4.353-7.497-3.348z" />
        <path fill-opacity=".602" d="M9 16.22l7.498 4.353v-7.701z" />
      </g>
    </g>
  </svg>
);
const imgTokenSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.2"
    viewBox="0 0 21 21"
    width="35"
    height="35"
  >
    <path
      fill-rule="evenodd"
      d="m10.7 21c-5.8 0-10.5-4.7-10.5-10.5 0-5.8 4.7-10.5 10.5-10.5 5.7 0 10.4 4.7 10.4 10.5 0 5.8-4.7 10.5-10.4 10.5zm3.9-9.6l-4.1 2.4-4-2.4 4 5.8zm0-0.8l-4-6.8-4 6.8 4 2.3z"
    />
  </svg>
);

const updateBalances = (address) => {
  if (!address) return;
  Ethers.provider()
    .getBalance(address)
    .then((balance) =>
      State.update({
        balanceToken: balance,
      })
    );

  wethContract.balanceOf(address).then((balance) =>
    State.update({
      balanceWrapToken: balance,
    })
  );
};

if (!state.intervalStarted) {
  State.update({ intervalStarted: true });
  updateBalances(state.sender);

  setInterval(() => {
    updateBalances(state.sender);
  }, 2000);
}

const updateSwapButton = () => {
  State.update({ swapReady: false });
  if (!!state.sender) {
    State.update({ swapButtonText: "Connect Wallet" });
    return;
  }

  if (!state.amountIn) {
    return;
  }

  let amountIn = state.amountIn;
  if (!isValidAmout(amountIn)) {
    State.update({ swapButtonText: "Invalid Amount" });
    return;
  }

  let limit = state.unwrap ? state.balanceWrapToken : state.balanceToken;

  if (limit && amountIn < limit) {
    State.update({
      swapButtonText: state.unwrap ? `Unwrap ETH` : `Wrap ETH`,
      swapReady: true,
    });
  } else {
    State.update({
      swapButtonText: `Insufficient ${state.unwrap ? "WETH" : "ETH"} Balance`,
    });
  }
};

const swapInputOnChange = (event) => {
  let re = /^[0-9]*[.,]?[0-9]*$/;
  if (re.test(event.target.value)) {
    State.update({
      amountIn: event.target.value,
      amountOut: event.target.value,
      swapButtonText: null,
    });

    updateSwapButton();
  }
};

const swapButtonOnClick = () => {
  const amount = parseToUnitsFn(amountIn);
  if (state.unwrap) {
    wethContract.withdraw(amount);
  } else {
    wethContract.deposit({ value: amount });
  }
};

const Card = styled.div`
  font-family: 'Inter custom',sans-serif;
  font-size: 16px;
  font-variant: none;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
  color: rgb(255, 255, 255);
  box-sizing: border-box;
 
  background: rgb(13, 17, 28);
  border-radius: 16px;
  border: 1px solid rgb(27, 34, 54);
  padding: 8px;
  z-index: 1;
  transition: transform 250ms ease 0s;
  display: block;
`;

const SwapContainer = styled.div`
  background-color: rgb(19, 26, 42);
  border-radius: 12px;
  padding: 16px;
`;

const SwapContainerOuter = styled.div`
  display: flex;
  flex-flow: column nowrap;
  border-radius: 20px;
`;

const SwapContainerInner = styled.div`
  border-radius: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SwapInput = styled.input`
  color: rgb(255, 255, 255);
  position: relative;
  font-weight: 400;
  outline: none;
  border: none;
  flex: 1 1 auto;
  background-color: transparent;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0px;
  appearance: textfield;
  filter: none;
  opacity: 1;
  transition: opacity 0.2s ease-in-out 0s;
  text-align: left;
  font-size: 36px;
  line-height: 44px;
  font-variant: small-caps;
`;

const SwapArrowContainer = styled.div`
  border-radius: 12px;
  height: 40px;
  width: 40px;
  position: relative;
  margin: -18px auto;
  background-color: rgb(41, 50, 73);
  border: 4px solid rgb(13, 17, 28);
  z-index: 2;
 
  :hover {
    opacity: 0.75;
  }
`;

const SwapArrowWrapper = styled.div`
  display: inline-flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const CurrencyPillContainer = styled.div`
  text-decoration: none;
  background-color: rgb(41, 50, 73);
  color: rgb(255, 255, 255);
  border-radius: 16px;
  padding: 4px 8px 4px 4px;
  margin-left: 12px;
`;

const CurrencyPillWrapper = styled.div`
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: start;
  justify-content: flex-start;
`;

const CurrencyPillImageWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const CurrencyPillSvgImageContainer = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 2px;
`;

const CurrencyPillImage = styled.img`
  color: rgb(255, 255, 255);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 2px;
`;

const CurrencyPillText = styled.span`
  margin: 0px 4px;
  font-size: 20px;
  font-weight: 600;
`;

const SwapDetailsContainer = styled.div`
  padding: 8px 0px 0px;
`;

const SwapDetailsWrapper = styled.div`
  display: flex;
  gap: 10;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: end;
`;

const TextSmall = styled.div`
  color: rgb(152, 161, 192);
  line-height: 1rem;
  box-sizing: border-box;
  font-weight: 400;
  font-size: 14px;
`;

const SwapButtonWrapper = styled.div`
  margin-top: 12px;
`;

const SwapButton = styled.button`
  background-color: ${(props) =>
    props.disabled ? "rgb(41, 50, 73)" : "#1758FE"};
  padding: 16px;
  font-size: 20px;
  font-weight: 600;
  color: rgb(245, 246, 252);
  width: 100%;
  text-align: center;
  border-radius: 20px;
  outline: none;
  border: 1px solid transparent;
  text-decoration: none;
  position: relative;
  z-index: 1;
  cursor: pointer;
`;

const TitleWrapper = styled.div`
  padding: 8px 12px;
  margin: 0px 0px 8px 0px;
  color: rgb(255, 255, 255);
  font-weight: 500;
  font-size: 16px;
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32px;
    width: 100%;
    height: 100%;
    justify-content: center;
  `;

const renderSwapContainer = (
  state,
  showTokenSvg,
  showTokenName,
  swapInputOnChange
) => (
  <SwapContainer>
    <SwapContainerOuter>
      <SwapContainerInner>
        <InputContainer>
          <SwapInput
            inputmode="decimal"
            autocomplete="off"
            autocorrect="off"
            type="text"
            placeholder="0"
            minLength="1"
            maxLength="79"
            spellcheck="false"
            value={state.amountIn}
            onChange={swapInputOnChange}
          />
          <CurrencyPillContainer>
            <CurrencyPillWrapper>
              <CurrencyPillImageWrapper>
                <CurrencyPillSvgImageContainer>
                  {showTokenSvg()}
                </CurrencyPillSvgImageContainer>
                <CurrencyPillText>{showTokenName()}</CurrencyPillText>
              </CurrencyPillImageWrapper>
            </CurrencyPillWrapper>
          </CurrencyPillContainer>
        </InputContainer>
        <SwapDetailsContainer>
          <SwapDetailsWrapper>
            {state.unwrap ? (
              state.balanceWrapToken ? (
                <TextSmall>Balance: {state.balanceWrapToken}</TextSmall>
              ) : null
            ) : state.balanceToken ? (
              <TextSmall>Balance: {state.balanceToken}</TextSmall>
            ) : null}
          </SwapDetailsWrapper>
        </SwapDetailsContainer>
      </SwapContainerInner>
    </SwapContainerOuter>
  </SwapContainer>
);

return (
  <Wrapper>
    <Card>
      <TitleWrapper>
        <p style={{ margin: 0 }}>ETH/WETH Wrapper</p>
      </TitleWrapper>
      {renderSwapContainer(
        state,
        () => (state.unwrap ? imgWrapTokenSvg : imgTokenSvg),
        () => (state.unwrap ? "WETH" : "ETH"),
        swapInputOnChange
      )}
      <SwapArrowContainer
        onClick={() => {
          State.update({
            unwrap: !state.unwrap,
            amountIn: state.amountOut,
            amountOut: state.amountIn,
          });
          updateSwapButton();
        }}
      >
        <SwapArrowWrapper>
          <i class="bi bi-arrow-down-short" />
        </SwapArrowWrapper>
      </SwapArrowContainer>
      {renderSwapContainer(
        state,
        () => (!state.unwrap ? imgWrapTokenSvg : imgTokenSvg),
        () => (!state.unwrap ? "WETH" : "ETH"),
        swapInputOnChange
      )}
      <SwapButtonWrapper>
        <SwapButton disabled={!state.swapReady} onClick={swapButtonOnClick}>
          {state.swapButtonText ??
            `Enter ${state.unwrap ? "WETH" : "ETH"} Amount`}
        </SwapButton>
      </SwapButtonWrapper>
    </Card>
  </Wrapper>
);
