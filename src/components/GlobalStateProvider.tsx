import { useInterpret } from "@xstate/react";
import React, { ReactElement, createContext } from "react";
import type { ActorRefFrom } from "xstate";
import { passMachine } from "../machines/pass_machine";

export interface GlobalStateContextType {
  passService: ActorRefFrom<typeof passMachine>;
}

export const GlobalStateContext = createContext({} as GlobalStateContextType);

export const GlobalStateProvider = ({ children }: { children: React.ReactNode }): ReactElement => {
  const passService = useInterpret(passMachine);

  return (
    <GlobalStateContext.Provider
      value={{
        passService,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};
