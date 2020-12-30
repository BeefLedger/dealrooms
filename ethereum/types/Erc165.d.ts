/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Contract, ContractTransaction, EventFilter, Signer } from "ethers";
import { Listener, Provider } from "ethers/providers";
import { Arrayish, BigNumber, BigNumberish, Interface } from "ethers/utils";
import {
  TransactionOverrides,
  TypedEventDescription,
  TypedFunctionDescription
} from ".";

interface Erc165Interface extends Interface {
  functions: {
    supportsInterface: TypedFunctionDescription<{
      encode([interfaceId]: [Arrayish]): string;
    }>;
  };

  events: {};
}

export class Erc165 extends Contract {
  connect(signerOrProvider: Signer | Provider | string): Erc165;
  attach(addressOrName: string): Erc165;
  deployed(): Promise<Erc165>;

  on(event: EventFilter | string, listener: Listener): Erc165;
  once(event: EventFilter | string, listener: Listener): Erc165;
  addListener(eventName: EventFilter | string, listener: Listener): Erc165;
  removeAllListeners(eventName: EventFilter | string): Erc165;
  removeListener(eventName: any, listener: Listener): Erc165;

  interface: Erc165Interface;

  functions: {
    /**
     * See {IERC165-supportsInterface}. Time complexity O(1), guaranteed to always use less than 30 000 gas.
     */
    supportsInterface(
      interfaceId: Arrayish,
      overrides?: TransactionOverrides
    ): Promise<boolean>;

    /**
     * See {IERC165-supportsInterface}. Time complexity O(1), guaranteed to always use less than 30 000 gas.
     */
    "supportsInterface(bytes4)"(
      interfaceId: Arrayish,
      overrides?: TransactionOverrides
    ): Promise<boolean>;
  };

  /**
   * See {IERC165-supportsInterface}. Time complexity O(1), guaranteed to always use less than 30 000 gas.
   */
  supportsInterface(
    interfaceId: Arrayish,
    overrides?: TransactionOverrides
  ): Promise<boolean>;

  /**
   * See {IERC165-supportsInterface}. Time complexity O(1), guaranteed to always use less than 30 000 gas.
   */
  "supportsInterface(bytes4)"(
    interfaceId: Arrayish,
    overrides?: TransactionOverrides
  ): Promise<boolean>;

  filters: {};

  estimate: {
    /**
     * See {IERC165-supportsInterface}. Time complexity O(1), guaranteed to always use less than 30 000 gas.
     */
    supportsInterface(
      interfaceId: Arrayish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    /**
     * See {IERC165-supportsInterface}. Time complexity O(1), guaranteed to always use less than 30 000 gas.
     */
    "supportsInterface(bytes4)"(
      interfaceId: Arrayish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;
  };
}
