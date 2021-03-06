/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context } from 'fabric-contract-api';
import { ChaincodeStub, ClientIdentity } from 'fabric-shim';
import { MyFirstContractContract } from '.';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import winston = require('winston');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext implements Context {
    public stub: sinon.SinonStubbedInstance<ChaincodeStub> = sinon.createStubInstance(ChaincodeStub);
    public clientIdentity: sinon.SinonStubbedInstance<ClientIdentity> = sinon.createStubInstance(ClientIdentity);
    public logger = {
        getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
        setLevel: sinon.stub(),
     };
}

describe('MyFirstContractContract', () => {

    let contract: MyFirstContractContract;
    let ctx: TestContext;

    beforeEach(() => {
        contract = new MyFirstContractContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"my first contract 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"my first contract 1002 value"}'));
    });

    describe('#myFirstContractExists', () => {

        it('should return true for a my first contract', async () => {
            await contract.myFirstContractExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a my first contract that does not exist', async () => {
            await contract.myFirstContractExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createMyFirstContract', () => {

        it('should create a my first contract', async () => {
            await contract.createMyFirstContract(ctx, '1003', 'my first contract 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"my first contract 1003 value"}'));
        });

        it('should throw an error for a my first contract that already exists', async () => {
            await contract.createMyFirstContract(ctx, '1001', 'myvalue').should.be.rejectedWith(/The my first contract 1001 already exists/);
        });

    });

    describe('#readMyFirstContract', () => {

        it('should return a my first contract', async () => {
            await contract.readMyFirstContract(ctx, '1001').should.eventually.deep.equal({ value: 'my first contract 1001 value' });
        });

        it('should throw an error for a my first contract that does not exist', async () => {
            await contract.readMyFirstContract(ctx, '1003').should.be.rejectedWith(/The my first contract 1003 does not exist/);
        });

    });

    describe('#updateMyFirstContract', () => {

        it('should update a my first contract', async () => {
            await contract.updateMyFirstContract(ctx, '1001', 'my first contract 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"my first contract 1001 new value"}'));
        });

        it('should throw an error for a my first contract that does not exist', async () => {
            await contract.updateMyFirstContract(ctx, '1003', 'my first contract 1003 new value').should.be.rejectedWith(/The my first contract 1003 does not exist/);
        });

    });

    describe('#deleteMyFirstContract', () => {

        it('should delete a my first contract', async () => {
            await contract.deleteMyFirstContract(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a my first contract that does not exist', async () => {
            await contract.deleteMyFirstContract(ctx, '1003').should.be.rejectedWith(/The my first contract 1003 does not exist/);
        });

    });

});
