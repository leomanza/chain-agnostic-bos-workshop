# BOS ACADEMY

## BOS components designs patterns workshop series

## Module 1: chain-agnostic widgets
Example widgets for module 1 on the BOS components design patterns workshop series.

This first module is focused on chain-agnostic widget examples focused on a multi-chain app implementation.

App to be implemented: multi-chain token wrapper

The scope of this workshop is to create a token wrapper app. Initially, it would allow ETH/WETH token holders on Ethereum or NEAR/WNEAR token holders on Near to wrap and unwrap their tokens.

On this workshop we started with a basic Token wrapper implementation and through continuous improvements and refactoring, we are delivering a new Token Wrapper over each iteration.

* V0: Initial version In this version of the app, the entire implementation for the ETH wrapper and NEAR wrapper is consolidated into a single file.
* V1: Changes on this version: App composed by:
  * an abstract wrapper, chain-agnostic widget with all the common logic an functionallity.
  * a ETH/WETH wrapper implementation
  * a NEAR/WNEAR wrapper implementationç
* V2: Changes on this version:
  * Unified app that render the proper wrapper implementation depending on the network the user is logged in.
 
## Challenges

Proposed challenges for further improvement and expansion:

1. Adding support for additional chains: expand the app to support wrapping and unwrapping tokens on additional chains, such as Polygon (Matic) and Binance Smart Chain (BNB).
   Ensure that the chain-agnostic design allows for easy integration of new chain-specific implementation. Any suggestion or improvement is welcome.
2. Multi-Asset token wrapping. extend the token wrapper to support multiple assest selections beyond the native token on each chain-specific implementation. Idea: ETH wrapper over multiple chains.
