const callOnStore = (
  dbName: string,
  storeName: string
): Promise<IDBObjectStore> =>
  new Promise((resolve) => {
    const open = window.indexedDB.open(dbName, 1);

    open.onupgradeneeded = () => {
      const db = open.result;
      db.createObjectStore(storeName, { keyPath: 'id' });
    };

    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);

      resolve(store);

      tx.oncomplete = () => db.close();
    };
  });

export const saveToDB = async (
  data: CryptoKey,
  dbName = 'IndexedDB',
  storeName = 'IndexedStore',
  id: string | number = 1
): Promise<void> => {
  const store = await callOnStore(dbName, storeName);
  store.put({ id, data });
};

export const getFromDB = (
  dbName = 'IndexedDB',
  storeName = 'IndexedStore',
  id: string | number = 1
): Promise<CryptoKey> =>
  new Promise((resolve) =>
    callOnStore(dbName, storeName).then((store) => {
      const getData = store.get(id);
      getData.onsuccess = () => resolve(getData.result.data);
    })
  );

export const deleteFromDB = async (
  dbName = 'IndexedDB',
  storeName = 'IndexedStore',
  id: string | number = 1
): Promise<void> => {
  const store = await callOnStore(dbName, storeName);
  store.delete(id);
};
