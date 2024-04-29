import { useState, useEffect } from 'react';
import axios from 'axios';

export const Audit = () => {
  const [data, setData] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const audit = await axios('/other/audit');
        const response = await axios('/members');
        setData(audit.data.reverse());
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching namespaces:', error);
      }
    })();
  }, []);

  return (
    <>
      {data.map(({ userId, url, method, body, query }) => (
        <>
          <div>
            {users.find(({ id }) => id === userId).email} | {method} | {url}
          </div>
          <div>body: {body}</div>
          <div>query: {query}</div>
          <br />
        </>
      ))}
    </>
  );
};
