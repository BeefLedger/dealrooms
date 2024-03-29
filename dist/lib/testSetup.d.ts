import { DeployedEnvironment } from "../ethereum/deploy/deploy";
export declare type DemoEnvironment = {
    deployedEnvironment?: DeployedEnvironment;
    erc20Allocations?: {
        [address: string]: number;
    };
    erc721Allocations?: {
        [address: string]: number[];
    };
};
export declare const demoEnvironment: DemoEnvironment;
export declare function setupTest(adminAddress: string, accounts: any[]): Promise<DemoEnvironment>;
