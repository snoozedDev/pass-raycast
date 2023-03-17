import { PopToRootType, Toast, closeMainWindow, showHUD, showToast } from "@raycast/api";
import { assign, createMachine } from "xstate";
import { getErrorMessage } from "../utils/error_utils";
import { copyToClipboard, getPassList } from "../utils/pass_utils";

export const passMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcCGtYDoBmYAuAxgBYCWAdlAJJ5gC2AMibHgMQQD2ZYm5AbuwGtuaDDnzFyVGgyZ4EfdgVR4SnANoAGALqatiFO1gkVnfSAAeiAIwBWAJyYAHFYBMNgDQgAnogC0AFkcAXyDPESxcQlIKajpGZhYwACck9iTMZAAbZWw02gz0CPFoqTjZeTJ+JRMyXV0zZENjVTIzSwRfGxdMDQB2DQA2Aas7f3sNAGY7R08fDsCQsMKeCEywFgBhAHkABQBNAH0dgEEAZVP6pBBGoxq2vytHCcwJjUd7FytB3oH-QNm-C4Br1MDZJhNHBpRs4JgNFtdliRVuttvsDlsACo7S4GW4te4dCYuDSYWxDGyOYYuaYaGwebyAqwg-xuXqU2lvKEDYLwsjsCBwBqFBpNO5Xdq+WGOUk2cmU1w0ukA+aw0GOYlWCZMuwUqH+eHhMRRSSxGTMEV40zih42KyYXosx69elzOxw0II0RItYW5pW0AS2x2h2fRzO5W+Vwkh3DDT+CaBCmOfx2A3LAjsZBeSQY9gbTIkZAAI3YqCSEF9YoDgO6Axc-ih9asdY0LlhEYTDjeIzsfVeg1cNhCISAA */
    id: "pass",
    tsTypes: {} as import("./pass_machine.typegen").Typegen0,
    predictableActionArguments: true,
    initial: "fetchingItemList",
    schema: {
      context: {} as { itemList: string[]; error?: string },
      services: {} as {
        fetchItemList: {
          data: string[];
        };
        copyToClipboard: {
          data: void;
        };
      },
      events: {} as
        | {
            type: "COPY_PASS";
            item: string;
          }
        | {
            type: "COPY_OTP";
            item: string;
          },
    },
    context: {
      itemList: [],
    },
    states: {
      fetchingItemList: {
        tags: "loading",
        entry: "clearError",
        invoke: {
          src: "fetchItemList",
          onDone: {
            target: "idle",
            actions: "setItemList",
          },
          onError: {
            target: "idle",
            actions: "setError",
          },
        },
      },

      idle: {
        on: {
          COPY_PASS: "copyingToClipboard",
          COPY_OTP: "copyingToClipboard",
        },
      },
      copyingToClipboard: {
        entry: "clearError",
        invoke: {
          src: "copyToClipboard",
          onDone: {
            target: "idle",
          },
          onError: {
            target: "idle",
            actions: "setError",
          },
        },
      },
    },
  },
  {
    services: {
      copyToClipboard: async (_ctx, evt) => {
        try {
          const toast = await showToast({ title: "Copying password", style: Toast.Style.Animated });
          const res = await copyToClipboard({
            pass: evt.item,
            isOTP: evt.type === "COPY_OTP",
          });
          if (res === "") throw new Error("Unable to copy password");
          await toast.hide();
          await closeMainWindow({
            popToRootType: PopToRootType.Immediate,
          });
          await showHUD(res.replace(/\n/g, " "));
        } catch (e) {
          console.error(e);
          const message = getErrorMessage(e);
          throw message;
        }
      },
      fetchItemList: async () => {
        try {
          const results = await getPassList();
          return results;
        } catch (e) {
          console.error(e);
          const message = getErrorMessage(e);
          throw message;
        }
      },
    },
    actions: {
      setItemList: assign((_, event) => {
        return {
          itemList: event.data,
        };
      }),
      setError: assign((_, event) => {
        if (typeof event.data === "string") {
          return {
            error: event.data,
          };
        }
        console.error("Error in passMachine:", event.data);
        return {};
      }),
      clearError: assign({
        error: undefined,
      }),
    },
  }
);
