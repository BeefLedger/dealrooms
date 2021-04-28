import { Magic, MagicUserMetadata } from 'magic-sdk';
import { ethers } from 'ethers';
/*
export async function getUser(): Promise<MagicUserMetadata | null> {
    const magic = getMagicLink();
    const isLoggedIn = await magic.user.isLoggedIn();
    if (isLoggedIn) {
        const user: MagicUserMetadata = await magic.user.getMetadata();
        return user;
    } else {
        return null;
    } 
};

export async function loginUser(email) {
    const magic = getMagicLink();
    await magic.auth.loginWithMagicLink({ email });
};

export async function logoutUser() {
    const magic = getMagicLink();
    await magic.user.logout();
};

export function getMagicLink() {
    return new Magic(process.env.MAGIC_KEY || "pk_test_6ABE2E341F154BF7",
    {
        network: {
            rpcUrl: 'http://127.0.0.1:8545'
            //chainId: 1011 // Your own node's chainId 
        }
    })
}

export function getMagicProvider() {
    return new ethers.providers.Web3Provider(getMagicLink().rpcProvider)
}
*/