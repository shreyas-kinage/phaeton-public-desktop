import * as transactions from '@phaeton/phaeton-transactions-web';
import { cryptography } from '@phaeton/phaeton-client-web'; // eslint-disable-line


export const getTransactionBytes = transaction =>
  transactions.getBytes(transaction);

export const getBufferToHex = buffer => cryptography.bufferToHex(buffer);
