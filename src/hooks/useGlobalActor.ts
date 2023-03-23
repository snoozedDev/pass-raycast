import { useActor } from "@xstate/react";
import { useContext } from "react";
import { ActorRef } from "xstate";
import { GlobalStateContext, GlobalStateContextType } from "../components/GlobalStateProvider";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EmittedFromActorRef<TActor extends ActorRef<any, unknown>> = TActor extends ActorRef<any, infer TEmitted>
  ? TEmitted
  : never;

export const useGlobalActor = <T extends keyof GlobalStateContextType>(
  machine: T
): [EmittedFromActorRef<GlobalStateContextType[T]>, GlobalStateContextType[T]["send"]] => {
  const service = useContext(GlobalStateContext)[machine];
  const actor = useActor(service);
  return actor;
};
