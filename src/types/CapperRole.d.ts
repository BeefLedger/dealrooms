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

interface CapperRoleInterface extends ethers.utils.Interface {
  functions: {
    "isCapper(address)": FunctionFragment;
    "addCapper(address)": FunctionFragment;
    "renounceCapper()": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "isCapper", values: [string]): string;
  encodeFunctionData(functionFragment: "addCapper", values: [string]): string;
  encodeFunctionData(
    functionFragment: "renounceCapper",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "isCapper", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "addCapper", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceCapper",
    data: BytesLike
  ): Result;

  events: {
    "CapperAdded(address)": EventFragment;
    "CapperRemoved(address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "CapperAdded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "CapperRemoved"): EventFragment;
}

export class CapperRole extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: CapperRoleInterface;

  functions: {
    isCapper(
      account: string,
      overrides?: CallOverrides
    ): Promise<{
      0: boolean;
    }>;

    addCapper(
      account: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    renounceCapper(overrides?: Overrides): Promise<ContractTransaction>;
  };

  isCapper(account: string, overrides?: CallOverrides): Promise<boolean>;

  addCapper(
    account: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  renounceCapper(overrides?: Overrides): Promise<ContractTransaction>;

  callStatic: {
    isCapper(account: string, overrides?: CallOverrides): Promise<boolean>;

    addCapper(account: string, overrides?: CallOverrides): Promise<void>;

    renounceCapper(overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    CapperAdded(account: string | null): EventFilter;

    CapperRemoved(account: string | null): EventFilter;
  };

  estimateGas: {
    isCapper(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    addCapper(account: string, overrides?: Overrides): Promise<BigNumber>;

    renounceCapper(overrides?: Overrides): Promise<BigNumber>;
  };

  populateTransaction: {
    isCapper(
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    addCapper(
      account: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    renounceCapper(overrides?: Overrides): Promise<PopulatedTransaction>;
  };
}
