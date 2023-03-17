// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.pass.fetchingItemList:invocation[0]": {
      type: "done.invoke.pass.fetchingItemList:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.pass.copyingToClipboard:invocation[0]": {
      type: "error.platform.pass.copyingToClipboard:invocation[0]";
      data: unknown;
    };
    "error.platform.pass.fetchingItemList:invocation[0]": {
      type: "error.platform.pass.fetchingItemList:invocation[0]";
      data: unknown;
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    copyToClipboard: "done.invoke.pass.copyingToClipboard:invocation[0]";
    fetchItemList: "done.invoke.pass.fetchingItemList:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    clearError: "COPY_OTP" | "COPY_PASS" | "xstate.init";
    setError:
      | "error.platform.pass.copyingToClipboard:invocation[0]"
      | "error.platform.pass.fetchingItemList:invocation[0]";
    setItemList: "done.invoke.pass.fetchingItemList:invocation[0]";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {
    copyToClipboard: "COPY_OTP" | "COPY_PASS";
    fetchItemList: "xstate.init";
  };
  matchesStates: "copyingToClipboard" | "fetchingItemList" | "idle";
  tags: "loading";
}
