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

interface DealRoomDeployerInterface extends ethers.utils.Interface {
  functions: {
    "makeRoom(uint256,address,address)": FunctionFragment;
    "getUserRooms(address)": FunctionFragment;
    "getAllRooms()": FunctionFragment;
    "getRoom(uint256)": FunctionFragment;
    "roomCount()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "makeRoom",
    values: [BigNumberish, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "getUserRooms",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getAllRooms",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getRoom",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "roomCount", values?: undefined): string;

  decodeFunctionResult(functionFragment: "makeRoom", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getUserRooms",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAllRooms",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getRoom", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "roomCount", data: BytesLike): Result;

  events: {};
}

export class DealRoomDeployer extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: DealRoomDeployerInterface;

  functions: {
    makeRoom(
      id: BigNumberish,
      buyer: string,
      seller: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    getUserRooms(
      _user: string,
      overrides?: CallOverrides
    ): Promise<{
      0: string[];
    }>;

    getAllRooms(
      overrides?: CallOverrides
    ): Promise<{
      0: string[];
    }>;

    getRoom(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<{
      0: string;
    }>;

    roomCount(
      overrides?: CallOverrides
    ): Promise<{
      0: BigNumber;
    }>;
  };

  makeRoom(
    id: BigNumberish,
    buyer: string,
    seller: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  getUserRooms(_user: string, overrides?: CallOverrides): Promise<string[]>;

  getAllRooms(overrides?: CallOverrides): Promise<string[]>;

  getRoom(id: BigNumberish, overrides?: CallOverrides): Promise<string>;

  roomCount(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    makeRoom(
      id: BigNumberish,
      buyer: string,
      seller: string,
      overrides?: CallOverrides
    ): Promise<void>;

    getUserRooms(_user: string, overrides?: CallOverrides): Promise<string[]>;

    getAllRooms(overrides?: CallOverrides): Promise<string[]>;

    getRoom(id: BigNumberish, overrides?: CallOverrides): Promise<string>;

    roomCount(overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    makeRoom(
      id: BigNumberish,
      buyer: string,
      seller: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    getUserRooms(_user: string, overrides?: CallOverrides): Promise<BigNumber>;

    getAllRooms(overrides?: CallOverrides): Promise<BigNumber>;

    getRoom(id: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    roomCount(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    makeRoom(
      id: BigNumberish,
      buyer: string,
      seller: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    getUserRooms(
      _user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getAllRooms(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getRoom(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    roomCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
