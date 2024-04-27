export const generateKeyPair = async (): Promise<CryptoKeyPair> =>
  crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt']
  );

const ab2str = (buf: ArrayBuffer): string => {
  return String.fromCharCode.apply(
    null,
    new Uint8Array(buf) as unknown as number[]
  );
};

const str2ab = (str: string): ArrayBuffer => {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++)
    bufView[i] = str.charCodeAt(i);
  return buf;
};

export const extractPublicKey = async (
  publicKey: CryptoKey
): Promise<string> => {
  const exportedPublicKey = await crypto.subtle.exportKey('spki', publicKey);
  return `-----BEGIN PUBLIC KEY-----\n${window.btoa(
    ab2str(exportedPublicKey)
  )}\n-----END PUBLIC KEY-----`;
};

export const extractPrivateKey = async (
  privateKey: CryptoKey
): Promise<string> => {
  const exportedPrivateKey = await crypto.subtle.exportKey('pkcs8', privateKey);
  return `-----BEGIN PRIVATE KEY-----\n${window.btoa(
    ab2str(exportedPrivateKey)
  )}\n-----END PRIVATE KEY-----`;
};

export const getPrivateKeyFromString = async (
  string: string
): Promise<CryptoKey> => {
  const pemHeader = '-----BEGIN PRIVATE KEY-----';
  const pemFooter = '-----END PRIVATE KEY-----';
  const pemContents = string.substring(
    pemHeader.length,
    string.length - pemFooter.length - 1
  );

  const binaryDerString = window.atob(pemContents);

  const binaryDer = str2ab(binaryDerString);

  return crypto.subtle.importKey(
    'pkcs8',
    binaryDer,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['decrypt']
  );
};

export const getPublicKeyFromString = async (
  string: string
): Promise<CryptoKey> => {
  const pemHeader = '-----BEGIN PUBLIC KEY-----';
  const pemFooter = '-----END PUBLIC KEY-----';
  const pemContents = string
    .substring(pemHeader.length, string.length - pemFooter.length)
    .trim();

  const binaryDerString = window.atob(pemContents);

  const binaryDer = str2ab(binaryDerString);

  return await crypto.subtle.importKey(
    'spki',
    binaryDer,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['encrypt']
  );
};

export const generateSymmetricKey = (): Promise<CryptoKey> =>
  crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, [
    'encrypt',
    'decrypt',
  ]);

export const encryptSymmetricKey = async (
  symmetricKey: CryptoKey,
  publicKey: CryptoKey
): Promise<string> => {
  const result = await crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    publicKey,
    await crypto.subtle.exportKey('raw', symmetricKey)
  );
  return window.btoa(ab2str(result));
};

export const decryptSymmetricKey = async (
  encryptedKey: string,
  privateKey: CryptoKey
): Promise<CryptoKey> => {
  const decryptedKey = await crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    privateKey,
    str2ab(window.atob(encryptedKey))
  );
  return crypto.subtle.importKey(
    'raw',
    decryptedKey,
    { name: 'AES-GCM' },
    true,
    ['encrypt', 'decrypt']
  );
};

export const encryptData = async (
  data: string,
  symmetricKey: CryptoKey
): Promise<string> => {
  const encryptedData = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: new Uint8Array([1, 0, 1]) },
    symmetricKey,
    str2ab(data)
  );

  return window.btoa(ab2str(encryptedData));
};

export const decryptData = async (
  encryptedData: string,
  symmetricKey: CryptoKey
): Promise<string> => {
  const decryptedData = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array([1, 0, 1]) },
    symmetricKey,
    str2ab(window.atob(encryptedData))
  );

  return ab2str(decryptedData);
};
