import { Message } from 'primereact/message'
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react'
import {
    Abi,
    BaseError,
    ContractFunctionArgs,
    ContractFunctionName,
    ContractFunctionRevertedError,
    InsufficientFundsError,
    SimulateContractReturnType,
    UserRejectedRequestError,
    WriteContractReturnType
} from 'viem'
import { waitForTransactionReceipt } from 'viem/actions'
import useClient from '../../hooks/useClient'

type Props = {
    dummy?: never
}

export type TransactionExecutorRef = {
    simulateTransaction: <
        TABI extends Abi,
        TFunctionName extends ContractFunctionName<TABI, 'nonpayable' | 'payable'>,
        TArgs extends ContractFunctionArgs<TABI, 'nonpayable' | 'payable', TFunctionName>
    >(
        transaction: Promise<SimulateContractReturnType<TABI, TFunctionName, TArgs>>
    ) => Promise<SimulateContractReturnType<TABI, TFunctionName, TArgs>['result'] | null>

    writeTransaction: (transaction: Promise<WriteContractReturnType>) => Promise<void>
}

enum TransactionState {
    NONE,
    WAITING_FOR_FINISH,
    ERROR,
    SUCCESS
}

const TransactionExecutor = forwardRef<TransactionExecutorRef, Props>((_, ref) => {
    const [client] = useClient()

    const [state, setState] = useState(TransactionState.NONE)
    const [errorMessage, setErrorMessage] = useState(null as string | null)

    const handleError = useCallback(
        async <
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
            T extends any
        >(
            body: () => Promise<T>
        ) => {
            setState(TransactionState.WAITING_FOR_FINISH)
            setErrorMessage(null)

            try {
                return await body()
            } catch (error) {
                setState(TransactionState.ERROR)
                console.error(error)

                // We try to recognize the error
                if (error instanceof BaseError) {
                    const revertError = error.walk((err) => err instanceof ContractFunctionRevertedError)
                    const userRejectedError = error.walk((e) => e instanceof UserRejectedRequestError)
                    const insufficientFundsError = error.walk((e) => e instanceof InsufficientFundsError)

                    if (revertError instanceof ContractFunctionRevertedError) {
                        const errorName = revertError.data?.errorName ?? ''
                        setErrorMessage(errorName)
                        throw error
                    } else if (userRejectedError instanceof UserRejectedRequestError) {
                        setErrorMessage('The transaction was rejected by the user')
                        throw error
                    } else if (insufficientFundsError instanceof InsufficientFundsError) {
                        setErrorMessage('Insufficient funds')
                        throw error
                    }
                }

                setErrorMessage('Unknown error')
                throw error
            }
        },
        []
    )

    const writeTransaction = useCallback(
        async (writtenTransaction: Promise<WriteContractReturnType>) => {
            if (!client) return

            // Then write it if everything looks alright
            const tx = await writtenTransaction

            // We use waitForTransactionReceipt() to wait for the transaction to be mined. This method
            // returns the transaction's receipt.
            const receipt = await waitForTransactionReceipt(client, { hash: tx })

            // The receipt, contains a status flag, which is 0 to indicate an error.
            if (receipt.status === 'reverted') {
                // We can't know the exact error that made the transaction fail when it
                // was mined, so we throw this generic one.
                setState(TransactionState.ERROR)
                setErrorMessage('Transaction was reverted')
                throw new Error('Transaction was reverted')
            }

            // If we got here, the transaction was successful
            setState(TransactionState.SUCCESS)
            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    resolve()
                }, 1000)
            })
        },
        [client]
    )

    const simulateTransaction = useCallback(
        async <
            TABI extends Abi,
            TFunctionName extends ContractFunctionName<TABI, 'nonpayable' | 'payable'>,
            TArgs extends ContractFunctionArgs<TABI, 'nonpayable' | 'payable', TFunctionName>
        >(
            simulatedTransaction: Promise<SimulateContractReturnType<TABI, TFunctionName, TArgs>>
        ) => {
            if (!client) {
                throw new Error()
            }

            // We simulate the transaction
            const { request, result } = simulatedTransaction
                ? await simulatedTransaction
                : { request: null, result: null }

            await writeTransaction(client.writeContract(request as any))

            return result
        },
        [client, writeTransaction]
    )

    useImperativeHandle(ref, () => {
        return {
            writeTransaction: async (transaction) => {
                await handleError(async () => {
                    await writeTransaction(transaction)
                })
            },

            simulateTransaction: async (transaction) => {
                return await handleError(async () => {
                    return await simulateTransaction(transaction)
                })
            }
        }
    }, [handleError, simulateTransaction, writeTransaction])

    return (
        <>
            {state === TransactionState.WAITING_FOR_FINISH && (
                <Message
                    severity="info"
                    icon={
                        <>
                            <span className="pi pi-spin pi-spinner" />
                            &nbsp;
                        </>
                    }
                    text="Waiting for transaction..."
                    className="w-full"
                />
            )}
            {state === TransactionState.ERROR && (
                <Message
                    severity="error"
                    icon={
                        <>
                            <span className="pi pi-exclamation-triangle" />
                            &nbsp;
                        </>
                    }
                    text={`Error: ${errorMessage}`}
                    className="w-full"
                />
            )}
            {state === TransactionState.SUCCESS && (
                <Message
                    severity="success"
                    icon={
                        <>
                            <span className="pi pi-check" />
                            &nbsp;
                        </>
                    }
                    text="Successful transaction..."
                    className="w-full"
                />
            )}
        </>
    )
})

export default TransactionExecutor
