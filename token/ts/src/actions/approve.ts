import {
    ConfirmOptions,
    Connection,
    PublicKey,
    sendAndConfirmTransaction,
    Signer,
    Transaction,
    TransactionSignature,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '../constants';
import { createApproveInstruction } from '../instructions';
import { getSigners } from './internal';

/**
 * Approve a delegate permission to transfer up to a maximum number of tokens from an account
 *
 * @param connection     Connection to use
 * @param payer          Payer of the transaction fees
 * @param account        Address of the token account
 * @param delegate       Account authorized to transfer tokens from the account
 * @param owner          Owner of the account
 * @param multiSigners   Signing accounts if `owner` is a multisig
 * @param amount         Maximum number of tokens the delegate may transfer
 * @param confirmOptions Options for confirming the transaction
 * @param programId      SPL Token program account
 *
 * @return Signature of the confirmed transaction
 */
export async function approve(
    connection: Connection,
    payer: Signer,
    account: PublicKey,
    delegate: PublicKey,
    owner: Signer | PublicKey,
    multiSigners: Signer[],
    amount: number | bigint,
    confirmOptions?: ConfirmOptions,
    programId = TOKEN_PROGRAM_ID
): Promise<TransactionSignature> {
    const [ownerPublicKey, signers] = getSigners(owner, multiSigners);

    const transaction = new Transaction().add(
        createApproveInstruction(account, delegate, ownerPublicKey, multiSigners, amount, programId)
    );

    return await sendAndConfirmTransaction(connection, transaction, [payer, ...signers], confirmOptions);
}