import React from 'react';

export interface ContextState {
  user?: {
    id: string,
    username: string,
    first_name: string,
    last_name: string,
    full_name: string,
    email: string,
    is_member: boolean,
    is_staff: boolean,
    is_superuser: boolean
  };
  updateUser: (data: ContextState) => void;
}

const SessionContext = React.createContext({
  user: null,
  updateUser: (data) => {
    // eslint-disable-next-line no-console
    console.error('updateUser not implemented', data);
  },
} as ContextState);

export default SessionContext;
