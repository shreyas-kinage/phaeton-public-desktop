export default {
  address: /^phae[a-z0-9]{0,41}$/,
  publicKey: /^[0-9a-f]{64}$/,
  username: /^[a-z0-9!@$&_.]{3,20}$/,
  delegateName: /^[a-z0-9!@$&_.]{3,20}$/,
  transactionId: /^[0-9a-z]{64}/,
  blockId: /^[0-9a-z]{64}/,
  phaeAddressTrunk: /^(.{6})(.+)?(.{5})$/,
  publicKeyTrunk: /^(.{6})(.+)?(.{5})$/,
  delegateSpecialChars: /[a-z0-9!@$&_.]+/g,
};
