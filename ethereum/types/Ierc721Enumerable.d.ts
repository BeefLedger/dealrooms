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

interface Ierc721EnumerableInterface extends Interface {
  functions: {
    approve: TypedFunctionDescription<{
      encode([to, tokenId]: [string, BigNumberish]): string;
    }>;

    balanceOf: TypedFunctionDescription<{ encode([owner]: [string]): string }>;

    getApproved: TypedFunctionDescription<{
      encode([tokenId]: [BigNumberish]): string;
    }>;

    isApprovedForAll: TypedFunctionDescription<{
      encode([owner, operator]: [string, string]): string;
    }>;

    ownerOf: TypedFunctionDescription<{
      encode([tokenId]: [BigNumberish]): string;
    }>;

    safeTransferFrom: TypedFunctionDescription<{
      encode([from, to, tokenId]: [string, string, BigNumberish]): string;
    }>;

    setApprovalForAll: TypedFunctionDescription<{
      encode([operator, _approved]: [string, boolean]): string;
    }>;

    supportsInterface: TypedFunctionDescription<{
      encode([interfaceId]: [Arrayish]): string;
    }>;

    transferFrom: TypedFunctionDescription<{
      encode([from, to, tokenId]: [string, string, BigNumberish]): string;
    }>;

    totalSupply: TypedFunctionDescription<{ encode([]: []): string }>;

    tokenOfOwnerByIndex: TypedFunctionDescription<{
      encode([owner, index]: [string, BigNumberish]): string;
    }>;

    tokenByIndex: TypedFunctionDescription<{
      encode([index]: [BigNumberish]): string;
    }>;
  };

  events: {
    Approval: TypedEventDescription<{
      encodeTopics([owner, approved, tokenId]: [
        string | null,
        string | null,
        BigNumberish | null
      ]): string[];
    }>;

    ApprovalForAll: TypedEventDescription<{
      encodeTopics([owner, operator, approved]: [
        string | null,
        string | null,
        null
      ]): string[];
    }>;

    Transfer: TypedEventDescription<{
      encodeTopics([from, to, tokenId]: [
        string | null,
        string | null,
        BigNumberish | null
      ]): string[];
    }>;
  };
}

export class Ierc721Enumerable extends Contract {
  connect(signerOrProvider: Signer | Provider | string): Ierc721Enumerable;
  attach(addressOrName: string): Ierc721Enumerable;
  deployed(): Promise<Ierc721Enumerable>;

  on(event: EventFilter | string, listener: Listener): Ierc721Enumerable;
  once(event: EventFilter | string, listener: Listener): Ierc721Enumerable;
  addListener(
    eventName: EventFilter | string,
    listener: Listener
  ): Ierc721Enumerable;
  removeAllListeners(eventName: EventFilter | string): Ierc721Enumerable;
  removeListener(eventName: any, listener: Listener): Ierc721Enumerable;

  interface: Ierc721EnumerableInterface;

  functions: {
    /**
     * Gives permission to `to` to transfer `tokenId` token to another account. The approval is cleared when the token is transferred. Only a single account can be approved at a time, so approving the zero address clears previous approvals. Requirements: - The caller must own the token or be an approved operator. - `tokenId` must exist. Emits an {Approval} event.
     */
    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    /**
     * Gives permission to `to` to transfer `tokenId` token to another account. The approval is cleared when the token is transferred. Only a single account can be approved at a time, so approving the zero address clears previous approvals. Requirements: - The caller must own the token or be an approved operator. - `tokenId` must exist. Emits an {Approval} event.
     */
    "approve(address,uint256)"(
      to: string,
      tokenId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    /**
     * Returns the number of tokens in ``owner``'s account.
     */
    balanceOf(
      owner: string,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    /**
     * Returns the number of tokens in ``owner``'s account.
     */
    "balanceOf(address)"(
      owner: string,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    /**
     * Returns the account approved for `tokenId` token. Requirements: - `tokenId` must exist.
     */
    getApproved(
      tokenId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<string>;

    /**
     * Returns the account approved for `tokenId` token. Requirements: - `tokenId` must exist.
     */
    "getApproved(uint256)"(
      tokenId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<string>;

    /**
     * Returns if the `operator` is allowed to manage all of the assets of `owner`. See {setApprovalForAll}
     */
    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: TransactionOverrides
    ): Promise<boolean>;

    /**
     * Returns if the `operator` is allowed to manage all of the assets of `owner`. See {setApprovalForAll}
     */
    "isApprovedForAll(address,address)"(
      owner: string,
      operator: string,
      overrides?: TransactionOverrides
    ): Promise<boolean>;

    /**
     * Returns the owner of the `tokenId` token. Requirements: - `tokenId` must exist.
     */
    ownerOf(
      tokenId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<string>;

    /**
     * Returns the owner of the `tokenId` token. Requirements: - `tokenId` must exist.
     */
    "ownerOf(uint256)"(
      tokenId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<string>;

    /**
     * Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients are aware of the ERC721 protocol to prevent tokens from being forever locked. Requirements: - `from` cannot be the zero address. - `to` cannot be the zero address. - `tokenId` token must exist and be owned by `from`. - If the caller is not `from`, it must be have been allowed to move this token by either {approve} or {setApprovalForAll}. - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer. Emits a {Transfer} event.
     */
    safeTransferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    /**
     * Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients are aware of the ERC721 protocol to prevent tokens from being forever locked. Requirements: - `from` cannot be the zero address. - `to` cannot be the zero address. - `tokenId` token must exist and be owned by `from`. - If the caller is not `from`, it must be have been allowed to move this token by either {approve} or {setApprovalForAll}. - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer. Emits a {Transfer} event.
     */
    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    /**
     * Safely transfers `tokenId` token from `from` to `to`. Requirements: - `from` cannot be the zero address. - `to` cannot be the zero address. - `tokenId` token must exist and be owned by `from`. - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}. - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer. Emits a {Transfer} event.
     */
    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      data: Arrayish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    /**
     * Approve or remove `operator` as an operator for the caller. Operators can call {transferFrom} or {safeTransferFrom} for any token owned by the caller. Requirements: - The `operator` cannot be the caller. Emits an {ApprovalForAll} event.
     */
    setApprovalForAll(
      operator: string,
      _approved: boolean,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    /**
     * Approve or remove `operator` as an operator for the caller. Operators can call {transferFrom} or {safeTransferFrom} for any token owned by the caller. Requirements: - The `operator` cannot be the caller. Emits an {ApprovalForAll} event.
     */
    "setApprovalForAll(address,bool)"(
      operator: string,
      _approved: boolean,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    /**
     * Returns true if this contract implements the interface defined by `interfaceId`. See the corresponding https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section] to learn more about how these ids are created. This function call must use less than 30 000 gas.
     */
    supportsInterface(
      interfaceId: Arrayish,
      overrides?: TransactionOverrides
    ): Promise<boolean>;

    /**
     * Returns true if this contract implements the interface defined by `interfaceId`. See the corresponding https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section] to learn more about how these ids are created. This function call must use less than 30 000 gas.
     */
    "supportsInterface(bytes4)"(
      interfaceId: Arrayish,
      overrides?: TransactionOverrides
    ): Promise<boolean>;

    /**
     * Transfers `tokenId` token from `from` to `to`. WARNING: Usage of this method is discouraged, use {safeTransferFrom} whenever possible. Requirements: - `from` cannot be the zero address. - `to` cannot be the zero address. - `tokenId` token must be owned by `from`. - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}. Emits a {Transfer} event.
     */
    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    /**
     * Transfers `tokenId` token from `from` to `to`. WARNING: Usage of this method is discouraged, use {safeTransferFrom} whenever possible. Requirements: - `from` cannot be the zero address. - `to` cannot be the zero address. - `tokenId` token must be owned by `from`. - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}. Emits a {Transfer} event.
     */
    "transferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    /**
     * Returns the total amount of tokens stored by the contract.
     */
    totalSupply(overrides?: TransactionOverrides): Promise<BigNumber>;

    /**
     * Returns the total amount of tokens stored by the contract.
     */
    "totalSupply()"(overrides?: TransactionOverrides): Promise<BigNumber>;

    /**
     * Returns a token ID owned by `owner` at a given `index` of its token list. Use along with {balanceOf} to enumerate all of ``owner``'s tokens.
     */
    tokenOfOwnerByIndex(
      owner: string,
      index: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    /**
     * Returns a token ID owned by `owner` at a given `index` of its token list. Use along with {balanceOf} to enumerate all of ``owner``'s tokens.
     */
    "tokenOfOwnerByIndex(address,uint256)"(
      owner: string,
      index: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    /**
     * Returns a token ID at a given `index` of all the tokens stored by the contract. Use along with {totalSupply} to enumerate all tokens.
     */
    tokenByIndex(
      index: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    /**
     * Returns a token ID at a given `index` of all the tokens stored by the contract. Use along with {totalSupply} to enumerate all tokens.
     */
    "tokenByIndex(uint256)"(
      index: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;
  };

  /**
   * Gives permission to `to` to transfer `tokenId` token to another account. The approval is cleared when the token is transferred. Only a single account can be approved at a time, so approving the zero address clears previous approvals. Requirements: - The caller must own the token or be an approved operator. - `tokenId` must exist. Emits an {Approval} event.
   */
  approve(
    to: string,
    tokenId: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  /**
   * Gives permission to `to` to transfer `tokenId` token to another account. The approval is cleared when the token is transferred. Only a single account can be approved at a time, so approving the zero address clears previous approvals. Requirements: - The caller must own the token or be an approved operator. - `tokenId` must exist. Emits an {Approval} event.
   */
  "approve(address,uint256)"(
    to: string,
    tokenId: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  /**
   * Returns the number of tokens in ``owner``'s account.
   */
  balanceOf(
    owner: string,
    overrides?: TransactionOverrides
  ): Promise<BigNumber>;

  /**
   * Returns the number of tokens in ``owner``'s account.
   */
  "balanceOf(address)"(
    owner: string,
    overrides?: TransactionOverrides
  ): Promise<BigNumber>;

  /**
   * Returns the account approved for `tokenId` token. Requirements: - `tokenId` must exist.
   */
  getApproved(
    tokenId: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<string>;

  /**
   * Returns the account approved for `tokenId` token. Requirements: - `tokenId` must exist.
   */
  "getApproved(uint256)"(
    tokenId: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<string>;

  /**
   * Returns if the `operator` is allowed to manage all of the assets of `owner`. See {setApprovalForAll}
   */
  isApprovedForAll(
    owner: string,
    operator: string,
    overrides?: TransactionOverrides
  ): Promise<boolean>;

  /**
   * Returns if the `operator` is allowed to manage all of the assets of `owner`. See {setApprovalForAll}
   */
  "isApprovedForAll(address,address)"(
    owner: string,
    operator: string,
    overrides?: TransactionOverrides
  ): Promise<boolean>;

  /**
   * Returns the owner of the `tokenId` token. Requirements: - `tokenId` must exist.
   */
  ownerOf(
    tokenId: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<string>;

  /**
   * Returns the owner of the `tokenId` token. Requirements: - `tokenId` must exist.
   */
  "ownerOf(uint256)"(
    tokenId: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<string>;

  /**
   * Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients are aware of the ERC721 protocol to prevent tokens from being forever locked. Requirements: - `from` cannot be the zero address. - `to` cannot be the zero address. - `tokenId` token must exist and be owned by `from`. - If the caller is not `from`, it must be have been allowed to move this token by either {approve} or {setApprovalForAll}. - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer. Emits a {Transfer} event.
   */
  safeTransferFrom(
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  /**
   * Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients are aware of the ERC721 protocol to prevent tokens from being forever locked. Requirements: - `from` cannot be the zero address. - `to` cannot be the zero address. - `tokenId` token must exist and be owned by `from`. - If the caller is not `from`, it must be have been allowed to move this token by either {approve} or {setApprovalForAll}. - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer. Emits a {Transfer} event.
   */
  "safeTransferFrom(address,address,uint256)"(
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  /**
   * Safely transfers `tokenId` token from `from` to `to`. Requirements: - `from` cannot be the zero address. - `to` cannot be the zero address. - `tokenId` token must exist and be owned by `from`. - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}. - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer. Emits a {Transfer} event.
   */
  "safeTransferFrom(address,address,uint256,bytes)"(
    from: string,
    to: string,
    tokenId: BigNumberish,
    data: Arrayish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  /**
   * Approve or remove `operator` as an operator for the caller. Operators can call {transferFrom} or {safeTransferFrom} for any token owned by the caller. Requirements: - The `operator` cannot be the caller. Emits an {ApprovalForAll} event.
   */
  setApprovalForAll(
    operator: string,
    _approved: boolean,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  /**
   * Approve or remove `operator` as an operator for the caller. Operators can call {transferFrom} or {safeTransferFrom} for any token owned by the caller. Requirements: - The `operator` cannot be the caller. Emits an {ApprovalForAll} event.
   */
  "setApprovalForAll(address,bool)"(
    operator: string,
    _approved: boolean,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  /**
   * Returns true if this contract implements the interface defined by `interfaceId`. See the corresponding https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section] to learn more about how these ids are created. This function call must use less than 30 000 gas.
   */
  supportsInterface(
    interfaceId: Arrayish,
    overrides?: TransactionOverrides
  ): Promise<boolean>;

  /**
   * Returns true if this contract implements the interface defined by `interfaceId`. See the corresponding https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section] to learn more about how these ids are created. This function call must use less than 30 000 gas.
   */
  "supportsInterface(bytes4)"(
    interfaceId: Arrayish,
    overrides?: TransactionOverrides
  ): Promise<boolean>;

  /**
   * Transfers `tokenId` token from `from` to `to`. WARNING: Usage of this method is discouraged, use {safeTransferFrom} whenever possible. Requirements: - `from` cannot be the zero address. - `to` cannot be the zero address. - `tokenId` token must be owned by `from`. - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}. Emits a {Transfer} event.
   */
  transferFrom(
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  /**
   * Transfers `tokenId` token from `from` to `to`. WARNING: Usage of this method is discouraged, use {safeTransferFrom} whenever possible. Requirements: - `from` cannot be the zero address. - `to` cannot be the zero address. - `tokenId` token must be owned by `from`. - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}. Emits a {Transfer} event.
   */
  "transferFrom(address,address,uint256)"(
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  /**
   * Returns the total amount of tokens stored by the contract.
   */
  totalSupply(overrides?: TransactionOverrides): Promise<BigNumber>;

  /**
   * Returns the total amount of tokens stored by the contract.
   */
  "totalSupply()"(overrides?: TransactionOverrides): Promise<BigNumber>;

  /**
   * Returns a token ID owned by `owner` at a given `index` of its token list. Use along with {balanceOf} to enumerate all of ``owner``'s tokens.
   */
  tokenOfOwnerByIndex(
    owner: string,
    index: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<BigNumber>;

  /**
   * Returns a token ID owned by `owner` at a given `index` of its token list. Use along with {balanceOf} to enumerate all of ``owner``'s tokens.
   */
  "tokenOfOwnerByIndex(address,uint256)"(
    owner: string,
    index: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<BigNumber>;

  /**
   * Returns a token ID at a given `index` of all the tokens stored by the contract. Use along with {totalSupply} to enumerate all tokens.
   */
  tokenByIndex(
    index: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<BigNumber>;

  /**
   * Returns a token ID at a given `index` of all the tokens stored by the contract. Use along with {totalSupply} to enumerate all tokens.
   */
  "tokenByIndex(uint256)"(
    index: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<BigNumber>;

  filters: {
    Approval(
      owner: string | null,
      approved: string | null,
      tokenId: BigNumberish | null
    ): EventFilter;

    ApprovalForAll(
      owner: string | null,
      operator: string | null,
      approved: null
    ): EventFilter;

    Transfer(
      from: string | null,
      to: string | null,
      tokenId: BigNumberish | null
    ): EventFilter;
  };

  estimate: {
    /**
     * Gives permission to `to` to transfer `tokenId` token to another account. The approval is cleared when the token is transferred. Only a single account can be approved at a time, so approving the zero address clears previous approvals. Requirements: - The caller must own the token or be an approved operator. - `tokenId` must exist. Emits an {Approval} event.
     */
    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    /**
     * Gives permission to `to` to transfer `tokenId` token to another account. The approval is cleared when the token is transferred. Only a single account can be approved at a time, so approving the zero address clears previous approvals. Requirements: - The caller must own the token or be an approved operator. - `tokenId` must exist. Emits an {Approval} event.
     */
    "approve(address,uint256)"(
      to: string,
      tokenId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    /**
     * Returns the number of tokens in ``owner``'s account.
     */
    balanceOf(
      owner: string,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    /**
     * Returns the number of tokens in ``owner``'s account.
     */
    "balanceOf(address)"(
      owner: string,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    /**
     * Returns the account approved for `tokenId` token. Requirements: - `tokenId` must exist.
     */
    getApproved(
      tokenId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    /**
     * Returns the account approved for `tokenId` token. Requirements: - `tokenId` must exist.
     */
    "getApproved(uint256)"(
      tokenId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    /**
     * Returns if the `operator` is allowed to manage all of the assets of `owner`. See {setApprovalForAll}
     */
    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    /**
     * Returns if the `operator` is allowed to manage all of the assets of `owner`. See {setApprovalForAll}
     */
    "isApprovedForAll(address,address)"(
      owner: string,
      operator: string,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    /**
     * Returns the owner of the `tokenId` token. Requirements: - `tokenId` must exist.
     */
    ownerOf(
      tokenId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    /**
     * Returns the owner of the `tokenId` token. Requirements: - `tokenId` must exist.
     */
    "ownerOf(uint256)"(
      tokenId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    /**
     * Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients are aware of the ERC721 protocol to prevent tokens from being forever locked. Requirements: - `from` cannot be the zero address. - `to` cannot be the zero address. - `tokenId` token must exist and be owned by `from`. - If the caller is not `from`, it must be have been allowed to move this token by either {approve} or {setApprovalForAll}. - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer. Emits a {Transfer} event.
     */
    safeTransferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    /**
     * Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients are aware of the ERC721 protocol to prevent tokens from being forever locked. Requirements: - `from` cannot be the zero address. - `to` cannot be the zero address. - `tokenId` token must exist and be owned by `from`. - If the caller is not `from`, it must be have been allowed to move this token by either {approve} or {setApprovalForAll}. - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer. Emits a {Transfer} event.
     */
    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    /**
     * Safely transfers `tokenId` token from `from` to `to`. Requirements: - `from` cannot be the zero address. - `to` cannot be the zero address. - `tokenId` token must exist and be owned by `from`. - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}. - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer. Emits a {Transfer} event.
     */
    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      data: Arrayish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    /**
     * Approve or remove `operator` as an operator for the caller. Operators can call {transferFrom} or {safeTransferFrom} for any token owned by the caller. Requirements: - The `operator` cannot be the caller. Emits an {ApprovalForAll} event.
     */
    setApprovalForAll(
      operator: string,
      _approved: boolean,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    /**
     * Approve or remove `operator` as an operator for the caller. Operators can call {transferFrom} or {safeTransferFrom} for any token owned by the caller. Requirements: - The `operator` cannot be the caller. Emits an {ApprovalForAll} event.
     */
    "setApprovalForAll(address,bool)"(
      operator: string,
      _approved: boolean,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    /**
     * Returns true if this contract implements the interface defined by `interfaceId`. See the corresponding https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section] to learn more about how these ids are created. This function call must use less than 30 000 gas.
     */
    supportsInterface(
      interfaceId: Arrayish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    /**
     * Returns true if this contract implements the interface defined by `interfaceId`. See the corresponding https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section] to learn more about how these ids are created. This function call must use less than 30 000 gas.
     */
    "supportsInterface(bytes4)"(
      interfaceId: Arrayish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    /**
     * Transfers `tokenId` token from `from` to `to`. WARNING: Usage of this method is discouraged, use {safeTransferFrom} whenever possible. Requirements: - `from` cannot be the zero address. - `to` cannot be the zero address. - `tokenId` token must be owned by `from`. - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}. Emits a {Transfer} event.
     */
    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    /**
     * Transfers `tokenId` token from `from` to `to`. WARNING: Usage of this method is discouraged, use {safeTransferFrom} whenever possible. Requirements: - `from` cannot be the zero address. - `to` cannot be the zero address. - `tokenId` token must be owned by `from`. - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}. Emits a {Transfer} event.
     */
    "transferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    /**
     * Returns the total amount of tokens stored by the contract.
     */
    totalSupply(overrides?: TransactionOverrides): Promise<BigNumber>;

    /**
     * Returns the total amount of tokens stored by the contract.
     */
    "totalSupply()"(overrides?: TransactionOverrides): Promise<BigNumber>;

    /**
     * Returns a token ID owned by `owner` at a given `index` of its token list. Use along with {balanceOf} to enumerate all of ``owner``'s tokens.
     */
    tokenOfOwnerByIndex(
      owner: string,
      index: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    /**
     * Returns a token ID owned by `owner` at a given `index` of its token list. Use along with {balanceOf} to enumerate all of ``owner``'s tokens.
     */
    "tokenOfOwnerByIndex(address,uint256)"(
      owner: string,
      index: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    /**
     * Returns a token ID at a given `index` of all the tokens stored by the contract. Use along with {totalSupply} to enumerate all tokens.
     */
    tokenByIndex(
      index: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    /**
     * Returns a token ID at a given `index` of all the tokens stored by the contract. Use along with {totalSupply} to enumerate all tokens.
     */
    "tokenByIndex(uint256)"(
      index: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;
  };
}
