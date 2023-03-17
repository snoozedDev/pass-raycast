import { useActor } from "@xstate/react";
import { useContext } from "react";
import { ActorRef } from "xstate";
import { GlobalStateContext, GlobalStateContextType } from "../components/GlobalStateProvider";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyEvent = any;

type EmittedFromActorRef<TActor extends ActorRef<AnyEvent, unknown>> = TActor extends ActorRef<AnyEvent, infer TEmitted>
  ? TEmitted
  : never;

type ContextlessGlobalStateContextType = Exclude<keyof GlobalStateContextType, "initialContext">;

export const useGlobalActor = <T extends ContextlessGlobalStateContextType>(
  machine: T
): [EmittedFromActorRef<GlobalStateContextType[T]>, GlobalStateContextType[T]["send"]] => {
  const service = useContext(GlobalStateContext)[machine];
  const actor = useActor(service);
  return actor;
};
