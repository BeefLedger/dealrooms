/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface DealRoomHubInterface extends ethers.utils.Interface {
  functions: {
    "makeBasicRoom(address,address)": FunctionFragment;
    "makeBasicRoomAndDeal(address,address,address,address,uint256,uint256[])": FunctionFragment;
    "makeRoom(tuple)": FunctionFragment;
    "getUserRooms(address)": FunctionFragment;
    "getAllRooms()": FunctionFragment;
    "getRoom(address)": FunctionFragment;
    "roomCount()": FunctionFragment;
    "changeOwner(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "makeBasicRoom",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "makeBasicRoomAndDeal",
    values: [string, string, string, string, BigNumberish, BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "makeRoom",
    values: [
      {
        buyer: string;
        seller: string;
        arbitrator: string;
        sensorApprover: string;
        docApprover: string;
      }
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getUserRooms",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getAllRooms",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "getRoom", values: [string]): string;
  encodeFunctionData(functionFragment: "roomCount", values?: undefined): string;
  encodeFunctionData(functionFragment: "changeOwner", values: [string]): string;

  decodeFunctionResult(
    functionFragment: "makeBasicRoom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "makeBasicRoomAndDeal",
    data: BytesLike
  ): Result;
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
  decodeFunctionResult(
    functionFragment: "changeOwner",
    data: BytesLike
  ): Result;

  events: {
    "NewRoomEvent(address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "NewRoomEvent"): EventFragment;
}

export class DealRoomHub extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: DealRoomHubInterface;

  functions: {
    makeBasicRoom(
      buyer: string,
      seller: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    makeBasicRoomAndDeal(
      buyer: string,
      seller: string,
      _erc20: string,
      _erc721: string,
      _price: BigNumberish,
      _assetItems: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    makeRoom(
      params: {
        buyer: string;
        seller: string;
        arbitrator: string;
        sensorApprover: string;
        docApprover: string;
      },
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getUserRooms(_user: string, overrides?: CallOverrides): Promise<[string[]]>;

    getAllRooms(overrides?: CallOverrides): Promise<[string[]]>;

    getRoom(
      addr: string,
      overrides?: CallOverrides
    ): Promise<
      [
        [string, string, string, string, string, string, string, string] & {
          addr: string;
          buyer: string;
          seller: string;
          arbitrator: string;
          sensorApprover: string;
          docApprover: string;
          dealMultiSig: string;
          agentMultiSig: string;
        }
      ]
    >;

    roomCount(overrides?: CallOverrides): Promise<[BigNumber]>;

    changeOwner(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  makeBasicRoom(
    buyer: string,
    seller: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  makeBasicRoomAndDeal(
    buyer: string,
    seller: string,
    _erc20: string,
    _erc721: string,
    _price: BigNumberish,
    _assetItems: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  makeRoom(
    params: {
      buyer: string;
      seller: string;
      arbitrator: string;
      sensorApprover: string;
      docApprover: string;
    },
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getUserRooms(_user: string, overrides?: CallOverrides): Promise<string[]>;

  getAllRooms(overrides?: CallOverrides): Promise<string[]>;

  getRoom(
    addr: string,
    overrides?: CallOverrides
  ): Promise<
    [string, string, string, string, string, string, string, string] & {
      addr: string;
      buyer: string;
      seller: string;
      arbitrator: string;
      sensorApprover: string;
      docApprover: string;
      dealMultiSig: string;
      agentMultiSig: string;
    }
  >;

  roomCount(overrides?: CallOverrides): Promise<BigNumber>;

  changeOwner(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    makeBasicRoom(
      buyer: string,
      seller: string,
      overrides?: CallOverrides
    ): Promise<string>;

    makeBasicRoomAndDeal(
      buyer: string,
      seller: string,
      _erc20: string,
      _erc721: string,
      _price: BigNumberish,
      _assetItems: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<string>;

    makeRoom(
      params: {
        buyer: string;
        seller: string;
        arbitrator: string;
        sensorApprover: string;
        docApprover: string;
      },
      overrides?: CallOverrides
    ): Promise<string>;

    getUserRooms(_user: string, overrides?: CallOverrides): Promise<string[]>;

    getAllRooms(overrides?: CallOverrides): Promise<string[]>;

    getRoom(
      addr: string,
      overrides?: CallOverrides
    ): Promise<
      [string, string, string, string, string, string, string, string] & {
        addr: string;
        buyer: string;
        seller: string;
        arbitrator: string;
        sensorApprover: string;
        docApprover: string;
        dealMultiSig: string;
        agentMultiSig: string;
      }
    >;

    roomCount(overrides?: CallOverrides): Promise<BigNumber>;

    changeOwner(newOwner: string, overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    NewRoomEvent(addr?: null): TypedEventFilter<[string], { addr: string }>;
  };

  estimateGas: {
    makeBasicRoom(
      buyer: string,
      seller: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    makeBasicRoomAndDeal(
      buyer: string,
      seller: string,
      _erc20: string,
      _erc721: string,
      _price: BigNumberish,
      _assetItems: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    makeRoom(
      params: {
        buyer: string;
        seller: string;
        arbitrator: string;
        sensorApprover: string;
        docApprover: string;
      },
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getUserRooms(_user: string, overrides?: CallOverrides): Promise<BigNumber>;

    getAllRooms(overrides?: CallOverrides): Promise<BigNumber>;

    getRoom(addr: string, overrides?: CallOverrides): Promise<BigNumber>;

    roomCount(overrides?: CallOverrides): Promise<BigNumber>;

    changeOwner(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    makeBasicRoom(
      buyer: string,
      seller: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    makeBasicRoomAndDeal(
      buyer: string,
      seller: string,
      _erc20: string,
      _erc721: string,
      _price: BigNumberish,
      _assetItems: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    makeRoom(
      params: {
        buyer: string;
        seller: string;
        arbitrator: string;
        sensorApprover: string;
        docApprover: string;
      },
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getUserRooms(
      _user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getAllRooms(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getRoom(
      addr: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    roomCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    changeOwner(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
