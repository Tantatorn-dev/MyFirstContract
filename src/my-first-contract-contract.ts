/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { MyFirstContract } from './my-first-contract';

@Info({title: 'MyFirstContractContract', description: 'My Smart Contract' })
export class MyFirstContractContract extends Contract {

    @Transaction(false)
    @Returns('boolean')
    public async myFirstContractExists(ctx: Context, myFirstContractId: string): Promise<boolean> {
        const data: Uint8Array = await ctx.stub.getState(myFirstContractId);
        return (!!data && data.length > 0);
    }

    @Transaction()
    public async createMyFirstContract(ctx: Context, myFirstContractId: string, value: string): Promise<void> {
        const exists: boolean = await this.myFirstContractExists(ctx, myFirstContractId);
        if (exists) {
            throw new Error(`The my first contract ${myFirstContractId} already exists`);
        }
        const myFirstContract: MyFirstContract = new MyFirstContract();
        myFirstContract.value = value;
        const buffer: Buffer = Buffer.from(JSON.stringify(myFirstContract));
        await ctx.stub.putState(myFirstContractId, buffer);
    }

    @Transaction(false)
    @Returns('MyFirstContract')
    public async readMyFirstContract(ctx: Context, myFirstContractId: string): Promise<MyFirstContract> {
        const exists: boolean = await this.myFirstContractExists(ctx, myFirstContractId);
        if (!exists) {
            throw new Error(`The my first contract ${myFirstContractId} does not exist`);
        }
        const data: Uint8Array = await ctx.stub.getState(myFirstContractId);
        const myFirstContract: MyFirstContract = JSON.parse(data.toString()) as MyFirstContract;
        return myFirstContract;
    }

    @Transaction()
    public async updateMyFirstContract(ctx: Context, myFirstContractId: string, newValue: string): Promise<void> {
        const exists: boolean = await this.myFirstContractExists(ctx, myFirstContractId);
        if (!exists) {
            throw new Error(`The my first contract ${myFirstContractId} does not exist`);
        }
        const myFirstContract: MyFirstContract = new MyFirstContract();
        myFirstContract.value = newValue;
        const buffer: Buffer = Buffer.from(JSON.stringify(myFirstContract));
        await ctx.stub.putState(myFirstContractId, buffer);
    }

    @Transaction()
    public async deleteMyFirstContract(ctx: Context, myFirstContractId: string): Promise<void> {
        const exists: boolean = await this.myFirstContractExists(ctx, myFirstContractId);
        if (!exists) {
            throw new Error(`The my first contract ${myFirstContractId} does not exist`);
        }
        await ctx.stub.deleteState(myFirstContractId);
    }

}
