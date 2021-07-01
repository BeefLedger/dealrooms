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

interface DealRoomInterface extends ethers.utils.Interface {
  functions: {
    "buyer()": FunctionFragment;
    "creator()": FunctionFragment;
    "dealCount()": FunctionFragment;
    "deals(uint256)": FunctionFragment;
    "owner()": FunctionFragment;
    "seller()": FunctionFragment;
    "makeDeal(address,address,uint256,uint256[])": FunctionFragment;
    "dealAssetCount(uint256)": FunctionFragment;
    "missingDealAssets(uint256)": FunctionFragment;
    "assetOwner(uint256,uint256)": FunctionFragment;
    "dealAssetsDeposited(uint256)": FunctionFragment;
    "missingDealCoins(uint256)": FunctionFragment;
    "settle(uint256)": FunctionFragment;
    "withdrawDealAssets(uint256,uint256)": FunctionFragment;
    "withdrawDealCoins(uint256)": FunctionFragment;
    "getOwner()": FunctionFragment;
    "getBuyer()": FunctionFragment;
    "getSeller()": FunctionFragment;
    "changeOwner(address)": FunctionFragment;
    "getDeal(uint256)": FunctionFragment;
    "getDealCount()": FunctionFragment;
    "getDealStatus(uint256)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "buyer", values?: undefined): string;
  encodeFunctionData(functionFragment: "creator", values?: undefined): string;
  encodeFunctionData(functionFragment: "dealCount", values?: undefined): string;
  encodeFunctionData(functionFragment: "deals", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "seller", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "makeDeal",
    values: [string, string, BigNumberish, BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "dealAssetCount",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "missingDealAssets",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "assetOwner",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "dealAssetsDeposited",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "missingDealCoins",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "settle",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawDealAssets",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawDealCoins",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "getOwner", values?: undefined): string;
  encodeFunctionData(functionFragment: "getBuyer", values?: undefined): string;
  encodeFunctionData(functionFragment: "getSeller", values?: undefined): string;
  encodeFunctionData(functionFragment: "changeOwner", values: [string]): string;
  encodeFunctionData(
    functionFragment: "getDeal",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getDealCount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getDealStatus",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "buyer", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "creator", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "dealCount", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deals", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "seller", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "makeDeal", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "dealAssetCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "missingDealAssets",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "assetOwner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "dealAssetsDeposited",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "missingDealCoins",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "settle", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "withdrawDealAssets",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawDealCoins",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getOwner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getBuyer", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getSeller", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "changeOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getDeal", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getDealCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getDealStatus",
    data: BytesLike
  ): Result;

  events: {
    "Debug(bytes32,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Debug"): EventFragment;
}

export class DealRoom extends BaseContract {
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

  interface: DealRoomInterface;

  functions: {
    buyer(overrides?: CallOverrides): Promise<[string]>;

    creator(overrides?: CallOverrides): Promise<[string]>;

    dealCount(overrides?: CallOverrides): Promise<[BigNumber]>;

    deals(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, string, string, BigNumber, number, boolean] & {
        id: BigNumber;
        erc20: string;
        erc721: string;
        price: BigNumber;
        status: number;
        valid: boolean;
      }
    >;

    owner(overrides?: CallOverrides): Promise<[string]>;

    seller(overrides?: CallOverrides): Promise<[string]>;

    makeDeal(
      _erc20: string,
      _erc721: string,
      _price: BigNumberish,
      _assetItems: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    dealAssetCount(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    missingDealAssets(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    assetOwner(
      dealId: BigNumberish,
      assetId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    dealAssetsDeposited(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    missingDealCoins(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    settle(
      id: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdrawDealAssets(
      dealId: BigNumberish,
      count: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdrawDealCoins(
      dealId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getOwner(overrides?: CallOverrides): Promise<[string]>;

    getBuyer(overrides?: CallOverrides): Promise<[string]>;

    getSeller(overrides?: CallOverrides): Promise<[string]>;

    changeOwner(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getDeal(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        [BigNumber, string, string, BigNumber, BigNumber[], number, boolean] & {
          id: BigNumber;
          erc20: string;
          erc721: string;
          price: BigNumber;
          assetItems: BigNumber[];
          status: number;
          valid: boolean;
        }
      ]
    >;

    getDealCount(overrides?: CallOverrides): Promise<[BigNumber]>;

    getDealStatus(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[number]>;
  };

  buyer(overrides?: CallOverrides): Promise<string>;

  creator(overrides?: CallOverrides): Promise<string>;

  dealCount(overrides?: CallOverrides): Promise<BigNumber>;

  deals(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, string, string, BigNumber, number, boolean] & {
      id: BigNumber;
      erc20: string;
      erc721: string;
      price: BigNumber;
      status: number;
      valid: boolean;
    }
  >;

  owner(overrides?: CallOverrides): Promise<string>;

  seller(overrides?: CallOverrides): Promise<string>;

  makeDeal(
    _erc20: string,
    _erc721: string,
    _price: BigNumberish,
    _assetItems: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  dealAssetCount(
    id: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  missingDealAssets(
    id: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  assetOwner(
    dealId: BigNumberish,
    assetId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  dealAssetsDeposited(
    id: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  missingDealCoins(
    id: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  settle(
    id: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdrawDealAssets(
    dealId: BigNumberish,
    count: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdrawDealCoins(
    dealId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getOwner(overrides?: CallOverrides): Promise<string>;

  getBuyer(overrides?: CallOverrides): Promise<string>;

  getSeller(overrides?: CallOverrides): Promise<string>;

  changeOwner(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getDeal(
    id: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, string, string, BigNumber, BigNumber[], number, boolean] & {
      id: BigNumber;
      erc20: string;
      erc721: string;
      price: BigNumber;
      assetItems: BigNumber[];
      status: number;
      valid: boolean;
    }
  >;

  getDealCount(overrides?: CallOverrides): Promise<BigNumber>;

  getDealStatus(id: BigNumberish, overrides?: CallOverrides): Promise<number>;

  callStatic: {
    buyer(overrides?: CallOverrides): Promise<string>;

    creator(overrides?: CallOverrides): Promise<string>;

    dealCount(overrides?: CallOverrides): Promise<BigNumber>;

    deals(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, string, string, BigNumber, number, boolean] & {
        id: BigNumber;
        erc20: string;
        erc721: string;
        price: BigNumber;
        status: number;
        valid: boolean;
      }
    >;

    owner(overrides?: CallOverrides): Promise<string>;

    seller(overrides?: CallOverrides): Promise<string>;

    makeDeal(
      _erc20: string,
      _erc721: string,
      _price: BigNumberish,
      _assetItems: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;

    dealAssetCount(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    missingDealAssets(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    assetOwner(
      dealId: BigNumberish,
      assetId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    dealAssetsDeposited(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    missingDealCoins(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    settle(id: BigNumberish, overrides?: CallOverrides): Promise<void>;

    withdrawDealAssets(
      dealId: BigNumberish,
      count: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    withdrawDealCoins(
      dealId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    getOwner(overrides?: CallOverrides): Promise<string>;

    getBuyer(overrides?: CallOverrides): Promise<string>;

    getSeller(overrides?: CallOverrides): Promise<string>;

    changeOwner(newOwner: string, overrides?: CallOverrides): Promise<void>;

    getDeal(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, string, string, BigNumber, BigNumber[], number, boolean] & {
        id: BigNumber;
        erc20: string;
        erc721: string;
        price: BigNumber;
        assetItems: BigNumber[];
        status: number;
        valid: boolean;
      }
    >;

    getDealCount(overrides?: CallOverrides): Promise<BigNumber>;

    getDealStatus(id: BigNumberish, overrides?: CallOverrides): Promise<number>;
  };

  filters: {
    Debug(
      message?: null,
      num?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { message: string; num: BigNumber }
    >;
  };

  estimateGas: {
    buyer(overrides?: CallOverrides): Promise<BigNumber>;

    creator(overrides?: CallOverrides): Promise<BigNumber>;

    dealCount(overrides?: CallOverrides): Promise<BigNumber>;

    deals(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    seller(overrides?: CallOverrides): Promise<BigNumber>;

    makeDeal(
      _erc20: string,
      _erc721: string,
      _price: BigNumberish,
      _assetItems: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    dealAssetCount(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    missingDealAssets(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    assetOwner(
      dealId: BigNumberish,
      assetId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    dealAssetsDeposited(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    missingDealCoins(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    settle(
      id: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdrawDealAssets(
      dealId: BigNumberish,
      count: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdrawDealCoins(
      dealId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getOwner(overrides?: CallOverrides): Promise<BigNumber>;

    getBuyer(overrides?: CallOverrides): Promise<BigNumber>;

    getSeller(overrides?: CallOverrides): Promise<BigNumber>;

    changeOwner(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getDeal(id: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    getDealCount(overrides?: CallOverrides): Promise<BigNumber>;

    getDealStatus(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    buyer(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    creator(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    dealCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    deals(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    seller(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    makeDeal(
      _erc20: string,
      _erc721: string,
      _price: BigNumberish,
      _assetItems: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    dealAssetCount(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    missingDealAssets(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    assetOwner(
      dealId: BigNumberish,
      assetId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    dealAssetsDeposited(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    missingDealCoins(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    settle(
      id: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    withdrawDealAssets(
      dealId: BigNumberish,
      count: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    withdrawDealCoins(
      dealId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getOwner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getBuyer(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getSeller(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    changeOwner(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getDeal(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getDealCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getDealStatus(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
