const ADDRESSES = 
{
    erc20: "0xc932a3617930567A47Dc822d32B13a740743a709",
    erc721: "0x3fDb030ED0FD7ff9536DfA96E910320Ea2ddf12F",
    DealRoomHub: "0xc10CE10aF9AA8AB72F61182a35C39b79c4E5152e"
}
export const DEALROOM_HUB = ADDRESSES.DealRoomHub
export const DEFAULT_ERC20 = ADDRESSES.erc20
export const DEFAULT_ERC721 = ADDRESSES.erc721

// Admin account for default provider (local chain only)
export const ADMIN = "0xB051764B2da6Aa16b9Bc439BcAd1c309Ad7a32CA"

//These accounts are unlocked accounts in testrpc with the following seed:
//abuse forget cool step task knife bargain vacant lemon manual various pride
export const TESTRPC_ACCOUNTS = [
    {
        address: "0xB051764B2da6Aa16b9Bc439BcAd1c309Ad7a32CA",
        name: "Alice Ardoyne (Arbitrator)"
    },
    {
        address: "0xc4e0daB85A5e7Cffec5025cb206E16278Ec20040",
        name: "Brian Billington"
    },
    {
        address: "0x89CFC4E15C4b2fAb2b3029eae40B137B91C2129e",
        name: "Heatchecker (Sensor)"
    },
    {
        address: "0xe2724151E5C905A82aF7AB4476748655E22d72D6",
        name: "Doc Wheatly (Doc approver)"
    },
    {
        address: "0x0Ad0a7Aa5395B09435b7cd42Eb254a163a4a5cf9",
        name: "Ella Ernshaw"
    },
    {
        address: "0xAd6ed15133884D83d3A6b93006fd34a13d9E5A7E",
        name: "Bob & Sons Foodstuff (Buyer)"
    },
    {
        address: "0x205742d1d3C6249cb382bA2142eD197d436B326b",
        name: "Sonya the Farmer (Seller)"
    },
]

//These accounts are set up via MagicLink and are suitable for demos and UI tests
export const DEMO_ACCOUNTS = [
    {
        //barryearsman+arbitrator@gmail.com
        //address: "0xbb5ac46e32eD3bb9402AAc3cfb77Ae7DE623ca9F",
        address: "0xB051764B2da6Aa16b9Bc439BcAd1c309Ad7a32CA", //My test wallet
        name: "Alice Angstrom (Arbitrator)"
    },
    {
        address: "0x89CFC4E15C4b2fAb2b3029eae40B137B91C2129e",
        name: "Bruce Bullock"
    },
    {
        //barryearsman+sensor@gmail.com
        address: "0xB904B4aF96D951Ad2081ee34E3Ee7115D17fc3b9",
        name: "SensorDyne 2000 (Sensor)"
    },
    {
         //barryearsman+doc@gmail.com
        address: "0x0ea6EE4E13Dea2A44Fb277beD3a2F381439f5415",
        name: "Dr Daniel Dumphrey (Doc approver)"
    },
    {
        address: "0xAd6ed15133884D83d3A6b93006fd34a13d9E5A7E",
        name: "Eric Ellison"
    },
    {
        //barryearsman+buyer@gmail.com
        address: "0x3c8f64283Da1846252b201bb4ab198cDFeFAAE3c",
        name: "Big Bazza's Bargain Burgers (Buyer)"
    },
    {
        //barryearsman@gmail.com
        address: "0xd5AE65265C8F8E09C48da86DE16287F5d90c75e5",
        name: "Earsman Farming Solutions (Seller)"
    },
]