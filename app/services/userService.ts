import { Magic, MagicUserMetadata } from 'magic-sdk';

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

function getMagicLink() {
    return new Magic(process.env.MAGIC_KEY || "pk_test_6ABE2E341F154BF7");
}