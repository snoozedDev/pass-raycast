import { Action, ActionPanel, List, Toast, showToast } from "@raycast/api";
import { useEffect, useState } from "react";
import { useGlobalActor } from "../hooks/useGlobalActor";
import { filterList } from "../utils/pass_utils";

export const Main = () => {
  const [passMachine, passSend] = useGlobalActor("passService");
  const [searchText, setSearchText] = useState("");
  const [filteredPassList, setFilteredPassList] = useState<string[]>([]);
  const [selectedPass, setSelectedPass] = useState<string>("");

  const { itemList, error } = passMachine.context;
  const isLoading = passMachine.hasTag("loading");

  useEffect(() => {
    const newFilteredPassList = filterList(searchText, itemList);
    setFilteredPassList(newFilteredPassList);
  }, [searchText, itemList]);

  const onSelectionChange = (pass: string | null) => {
    if (pass) setSelectedPass(pass);
  };

  useEffect(() => {
    if (error && error.length > 0) {
      showToast({
        title: error,
        style: Toast.Style.Failure,
      });
    }
  }, [error]);

  const onCopyPass = () =>
    passSend({
      type: "COPY_PASS",
      item: selectedPass,
    });

  const onCopyOTP = () =>
    passSend({
      type: "COPY_OTP",
      item: selectedPass,
    });

  return (
    <List
      isLoading={isLoading}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search pass..."
      onSelectionChange={onSelectionChange}
    >
      {filteredPassList.map((pass) => (
        <List.Item
          key={pass}
          id={pass}
          title={pass}
          actions={
            <ActionPanel>
              <Action title="Copy" onAction={onCopyPass} />
              <Action title="Copy OTP" onAction={onCopyOTP} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
};
