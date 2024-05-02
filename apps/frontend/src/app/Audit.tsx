import { useState, useEffect } from 'react';
import axios from 'axios';
import { MembersDtoI, TraceI } from '@master-diploma/shared-resources';
import { Table, Td, Th, Tr } from './styles/styles';

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
    <Table>
      <thead>
        <Tr>
          <Th>email</Th>
          <Th>method</Th>
          <Th>url</Th>
          <Th>body</Th>
          <Th>query</Th>
        </Tr>
      </thead>
      <tbody>
        {audit.map((a) => (
          <Tr key={a.id}>
            <Td>{members.find(({ id }) => id === a.userId)?.email}</Td>
            <Td>{a.method}</Td>
            <Td>{a.url}</Td>
            <Td>
              {a.body?.length && a.body?.length < 15
                ? a.body
                : a.body?.slice(0, 12) + '...'}
            </Td>
            <Td>
              {a.query?.length && a.query?.length < 15
                ? a.query
                : a.query?.slice(0, 12) + '...'}
            </Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
};
