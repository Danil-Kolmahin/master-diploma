import { useState, useEffect } from 'react';
import axios from 'axios';
import { MembersDtoI, TraceI } from '@master-diploma/shared-resources';

export const Audit = () => {
  const [audit, setAudit] = useState<TraceI[]>([]);
  const [members, setMembers] = useState<MembersDtoI[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const audit = await axios('/security/audit');
        const response = await axios('/members');
        setAudit(audit.data.reverse());
        setMembers(response.data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <>
      {audit.map(({ userId, url, method, body, query }) => (
        <>
          <div>
            {members.find(({ id }) => id === userId)?.email} | {method} | {url}
          </div>
          <div>body: {body}</div>
          <div>query: {query}</div>
          <br />
        </>
      ))}
    </>
  );
};
