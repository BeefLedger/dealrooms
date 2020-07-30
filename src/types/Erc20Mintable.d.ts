/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction
} from "ethers";
import {
  Contract,
  ContractTransaction,
  Overrides,
  CallOverrides
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";

interface Erc20MintableInterface extends ethers.utils.Interface {
  functions: {
    "approve(address,uint256)": FunctionFragment;
    "totalSupply()": FunctionFragment;
    "transferFrom(address,address,uint256)": FunctionFragment;
    "increaseAllowance(address,uint256)": FunctionFragment;
    "balanceOf(address)": FunctionFragment;
    "addMinter(address)": FunctionFragment;
    "renounceMinter()": FunctionFragment;
    "decreaseAllowance(address,uint256)": FunctionFragment;
    "transfer(address,uint256)": FunctionFragment;
    "isMinter(address)": FunctionFragment;
    "canMint()": FunctionFragment;
    "allowance(address,address)": FunctionFragment;
    "mint(address,uint256)": FunctionFragment;
    "stopMinting()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "approve",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferFrom",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "increaseAllowance",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "balanceOf", values: [string]): string;
  encodeFunctionData(functionFragment: "addMinter", values: [string]): string;
  encodeFunctionData(
    functionFragment: "renounceMinter",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "decreaseAllowance",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transfer",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "isMinter", values: [string]): string;
  encodeFunctionData(functionFragment: "canMint", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "allowance",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "mint",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "stopMinting",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "increaseAllowance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "addMinter", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceMinter",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "decreaseAllowance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "isMinter", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "canMint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "stopMinting",
    data: BytesLike
  ): Result;

  events: {
    "MinterAdded(address)": EventFragment;
    "MinterRemoved(address)": EventFragment;
    "Transfer(address,address,uint256)": EventFragment;
    "Approval(address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "MinterAdded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "MinterRemoved"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Transfer"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Approval"): EventFragment;
}

export class Erc20Mintable extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: Erc20MintableInterface;

  functions: {
    /**
     * See {IERC20-approve}.     * Requirements:     * - `spender` cannot be the zero address.
     */
    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    /**
     * See {IERC20-totalSupply}.
     */
    totalSupply(
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    /**
     * See {IERC20-transferFrom}.     * Emits an {Approval} event indicating the updated allowance. This is not required by the EIP. See the note at the beginning of {ERC20};     * Requirements: - `sender` and `recipient` cannot be the zero address. - `sender` must have a balance of at least `amount`. - the caller must have allowance for `sender`'s tokens of at least `amount`.
     */
    transferFrom(
      sender: string,
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    /**
     * Atomically increases the allowance granted to `spender` by the caller.     * This is an alternative to {approve} that can be used as a mitigation for problems described in {IERC20-approve}.     * Emits an {Approval} event indicating the updated allowance.     * Requirements:     * - `spender` cannot be the zero address.
     */
    increaseAllowance(
      spender: string,
      addedValue: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    /**
     * See {IERC20-balanceOf}.
     */
    balanceOf(
      account: string,
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    addMinter(
      account: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    renounceMinter(overrides?: Overrides): Promise<ContractTransaction>;

    /**
     * Atomically decreases the allowance granted to `spender` by the caller.     * This is an alternative to {approve} that can be used as a mitigation for problems described in {IERC20-approve}.     * Emits an {Approval} event indicating the updated allowance.     * Requirements:     * - `spender` cannot be the zero address. - `spender` must have allowance for the caller of at least `subtractedValue`.
     */
    decreaseAllowance(
      spender: string,
      subtractedValue: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    /**
     * See {IERC20-transfer}.     * Requirements:     * - `recipient` cannot be the zero address. - the caller must have a balance of at least `amount`.
     */
    transfer(
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    isMinter(
      account: string,
      overrides?: CallOverrides
    ): Promise<{
      0: boolean;
    }>;

    canMint(
      overrides?: CallOverrides
    ): Promise<{
      0: boolean;
    }>;

    /**
     * See {IERC20-allowance}.
     */
    allowance(
      owner: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;

    /**
     * See {ERC20-_mint}.     * Requirements:     * - the caller must have the {MinterRole}.
     */
    mint(
      account: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    stopMinting(overrides?: Overrides): Promise<ContractTransaction>;
  };

  /**
   * See {IERC20-approve}.     * Requirements:     * - `spender` cannot be the zero address.
   */
  approve(
    spender: string,
    amount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  /**
   * See {IERC20-totalSupply}.
   */
  totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

  /**
   * See {IERC20-transferFrom}.     * Emits an {Approval} event indicating the updated allowance. This is not required by the EIP. See the note at the beginning of {ERC20};     * Requirements: - `sender` and `recipient` cannot be the zero address. - `sender` must have a balance of at least `amount`. - the caller must have allowance for `sender`'s tokens of at least `amount`.
   */
  transferFrom(
    sender: string,
    recipient: string,
    amount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  /**
   * Atomically increases the allowance granted to `spender` by the caller.     * This is an alternative to {approve} that can be used as a mitigation for problems described in {IERC20-approve}.     * Emits an {Approval} event indicating the updated allowance.     * Requirements:     * - `spender` cannot be the zero address.
   */
  increaseAllowance(
    spender: string,
    addedValue: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  /**
   * See {IERC20-balanceOf}.
   */
  balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

  addMinter(
    account: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  renounceMinter(overrides?: Overrides): Promise<ContractTransaction>;

  /**
   * Atomically decreases the allowance granted to `spender` by the caller.     * This is an alternative to {approve} that can be used as a mitigation for problems described in {IERC20-approve}.     * Emits an {Approval} event indicating the updated allowance.     * Requirements:     * - `spender` cannot be the zero address. - `spender` must have allowance for the caller of at least `subtractedValue`.
   */
  decreaseAllowance(
    spender: string,
    subtractedValue: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  /**
   * See {IERC20-transfer}.     * Requirements:     * - `recipient` cannot be the zero address. - the caller must have a balance of at least `amount`.
   */
  transfer(
    recipient: string,
    amount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  isMinter(account: string, overrides?: CallOverrides): Promise<boolean>;

  canMint(overrides?: CallOverrides): Promise<boolean>;

  /**
   * See {IERC20-allowance}.
   */
  allowance(
    owner: string,
    spender: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  /**
   * See {ERC20-_mint}.     * Requirements:     * - the caller must have the {MinterRole}.
   */
  mint(
    account: string,
    amount: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  stopMinting(overrides?: Overrides): Promise<ContractTransaction>;

  callStatic: {
    /**
     * See {IERC20-approve}.     * Requirements:     * - `spender` cannot be the zero address.
     */
    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    /**
     * See {IERC20-totalSupply}.
     */
    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    /**
     * See {IERC20-transferFrom}.     * Emits an {Approval} event indicating the updated allowance. This is not required by the EIP. See the note at the beginning of {ERC20};     * Requirements: - `sender` and `recipient` cannot be the zero address. - `sender` must have a balance of at least `amount`. - the caller must have allowance for `sender`'s tokens of at least `amount`.
     */
    transferFrom(
      sender: string,
      recipient: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    /**
     * Atomically increases the allowance granted to `spender` by the caller.     * This is an alternative to {approve} that can be used as a mitigation for problems described in {IERC20-approve}.     * Emits an {Approval} event indicating the updated allowance.     * Requirements:     * - `spender` cannot be the zero address.
     */
    increaseAllowance(
      spender: string,
      addedValue: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    /**
     * See {IERC20-balanceOf}.
     */
    balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    addMinter(account: string, overrides?: CallOverrides): Promise<void>;

    renounceMinter(overrides?: CallOverrides): Promise<void>;

    /**
     * Atomically decreases the allowance granted to `spender` by the caller.     * This is an alternative to {approve} that can be used as a mitigation for problems described in {IERC20-approve}.     * Emits an {Approval} event indicating the updated allowance.     * Requirements:     * - `spender` cannot be the zero address. - `spender` must have allowance for the caller of at least `subtractedValue`.
     */
    decreaseAllowance(
      spender: string,
      subtractedValue: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    /**
     * See {IERC20-transfer}.     * Requirements:     * - `recipient` cannot be the zero address. - the caller must have a balance of at least `amount`.
     */
    transfer(
      recipient: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isMinter(account: string, overrides?: CallOverrides): Promise<boolean>;

    canMint(overrides?: CallOverrides): Promise<boolean>;

    /**
     * See {IERC20-allowance}.
     */
    allowance(
      owner: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    /**
     * See {ERC20-_mint}.     * Requirements:     * - the caller must have the {MinterRole}.
     */
    mint(
      account: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    stopMinting(overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    MinterAdded(account: string | null): EventFilter;

    MinterRemoved(account: string | null): EventFilter;

    Transfer(from: string | null, to: string | null, value: null): EventFilter;

    Approval(
      owner: string | null,
      spender: string | null,
      value: null
    ): EventFilter;
  };

  estimateGas: {
    /**
     * See {IERC20-approve}.     * Requirements:     * - `spender` cannot be the zero address.
     */
    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    /**
     * See {IERC20-totalSupply}.
     */
    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    /**
     * See {IERC20-transferFrom}.     * Emits an {Approval} event indicating the updated allowance. This is not required by the EIP. See the note at the beginning of {ERC20};     * Requirements: - `sender` and `recipient` cannot be the zero address. - `sender` must have a balance of at least `amount`. - the caller must have allowance for `sender`'s tokens of at least `amount`.
     */
    transferFrom(
      sender: string,
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    /**
     * Atomically increases the allowance granted to `spender` by the caller.     * This is an alternative to {approve} that can be used as a mitigation for problems described in {IERC20-approve}.     * Emits an {Approval} event indicating the updated allowance.     * Requirements:     * - `spender` cannot be the zero address.
     */
    increaseAllowance(
      spender: string,
      addedValue: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    /**
     * See {IERC20-balanceOf}.
     */
    balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    addMinter(account: string, overrides?: Overrides): Promise<BigNumber>;

    renounceMinter(overrides?: Overrides): Promise<BigNumber>;

    /**
     * Atomically decreases the allowance granted to `spender` by the caller.     * This is an alternative to {approve} that can be used as a mitigation for problems described in {IERC20-approve}.     * Emits an {Approval} event indicating the updated allowance.     * Requirements:     * - `spender` cannot be the zero address. - `spender` must have allowance for the caller of at least `subtractedValue`.
     */
    decreaseAllowance(
      spender: string,
      subtractedValue: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    /**
     * See {IERC20-transfer}.     * Requirements:     * - `recipient` cannot be the zero address. - the caller must have a balance of at least `amount`.
     */
    transfer(
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    isMinter(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    canMint(overrides?: CallOverrides): Promise<BigNumber>;

    /**
     * See {IERC20-allowance}.
     */
    allowance(
      owner: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    /**
     * See {ERC20-_mint}.     * Requirements:     * - the caller must have the {MinterRole}.
     */
    mint(
      account: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    stopMinting(overrides?: Overrides): Promise<BigNumber>;
  };

  populateTransaction: {
    /**
     * See {IERC20-approve}.     * Requirements:     * - `spender` cannot be the zero address.
     */
    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    /**
     * See {IERC20-totalSupply}.
     */
    totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    /**
     * See {IERC20-transferFrom}.     * Emits an {Approval} event indicating the updated allowance. This is not required by the EIP. See the note at the beginning of {ERC20};     * Requirements: - `sender` and `recipient` cannot be the zero address. - `sender` must have a balance of at least `amount`. - the caller must have allowance for `sender`'s tokens of at least `amount`.
     */
    transferFrom(
      sender: string,
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    /**
     * Atomically increases the allowance granted to `spender` by the caller.     * This is an alternative to {approve} that can be used as a mitigation for problems described in {IERC20-approve}.     * Emits an {Approval} event indicating the updated allowance.     * Requirements:     * - `spender` cannot be the zero address.
     */
    increaseAllowance(
      spender: string,
      addedValue: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    /**
     * See {IERC20-balanceOf}.
     */
    balanceOf(
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    addMinter(
      account: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    renounceMinter(overrides?: Overrides): Promise<PopulatedTransaction>;

    /**
     * Atomically decreases the allowance granted to `spender` by the caller.     * This is an alternative to {approve} that can be used as a mitigation for problems described in {IERC20-approve}.     * Emits an {Approval} event indicating the updated allowance.     * Requirements:     * - `spender` cannot be the zero address. - `spender` must have allowance for the caller of at least `subtractedValue`.
     */
    decreaseAllowance(
      spender: string,
      subtractedValue: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    /**
     * See {IERC20-transfer}.     * Requirements:     * - `recipient` cannot be the zero address. - the caller must have a balance of at least `amount`.
     */
    transfer(
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    isMinter(
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    canMint(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    /**
     * See {IERC20-allowance}.
     */
    allowance(
      owner: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    /**
     * See {ERC20-_mint}.     * Requirements:     * - the caller must have the {MinterRole}.
     */
    mint(
      account: string,
      amount: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    stopMinting(overrides?: Overrides): Promise<PopulatedTransaction>;
  };
}
