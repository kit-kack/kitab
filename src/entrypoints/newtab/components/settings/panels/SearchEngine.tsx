import { SEARCH_ENGINE_LIST_ATOM } from "@/entrypoints/newtab/store";
import { ActionIcon, Button, Input, Table } from "@mantine/core";
import { useAtom } from "jotai";
import { Panel } from "../panel";
import {
  RiArrowUpSLine,
  RiCheckLine,
  RiCloseLine,
  RiPencilLine,
} from "@remixicon/react";
import { SearchEngine } from "@/entrypoints/newtab/store/defaults";

function Component() {
  const [engineList, setEngineList] = useAtom(SEARCH_ENGINE_LIST_ATOM);
  const [editingMap, setEditingMap] = useState<Record<string, SearchEngine>>(
    {}
  );

  function adjustSort(ind: number) {
    if (ind === 0) {
      return;
    }
    const newEngineList = [...engineList];
    const beforeEngine = newEngineList[ind - 1];
    const engine = newEngineList[ind];
    newEngineList.splice(ind - 1, 2, engine, beforeEngine);
    setEngineList(newEngineList);
    console.log("adjustSort", newEngineList);
  }

  function addEngine() {
    const newEngineList = [...engineList];
    newEngineList.push({
      value: "新搜索引擎",
      url: "todo",
    });
    setEngineList(newEngineList);
  }

  function removeEngineOrRemoveEditing(ind: number, isEditing: boolean) {
    if (isEditing) {
      const newEditingMap = { ...editingMap };
      delete newEditingMap[engineList[ind].value];
      setEditingMap(newEditingMap);
      return;
    }
    const newEngineList = [...engineList];
    newEngineList.splice(ind, 1);
    setEngineList(newEngineList);
  }

  function controlEdit(ind: number, finish: boolean) {
    const editData = editingMap[engineList[ind].value];
    if (editData) {
      // 完成
      if (finish) {
        const newEngineList = [...engineList];
        newEngineList[ind] = editData;
        setEngineList(newEngineList);
        return;
      }
    }
    if (!finish) {
      // 添加
      const newEditingMap = { ...editingMap };
      const engine = engineList[ind];
      newEditingMap[engine.value] = engine;
      setEditingMap(newEditingMap);
    }
  }

  console.log("rerender", engineList, engineList);

  const rows = engineList.map((engine, ind) => {
    const editData = editingMap[engine.value];
    const isEditing = editData != null;
    return (
      <Table.Tr key={engine.value}>
        <Table.Td>
          {isEditing ? (
            <Input
              size="xs"
              value={editData?.value || engine.value}
              onChange={(e) => {
                setEditingMap({
                  ...editingMap,
                  [engine.value]: {
                    ...editData,
                    value: e.target.value,
                  },
                });
              }}
            />
          ) : (
            engine.value + (ind === 0 ? "（默认）" : "")
          )}
        </Table.Td>
        <Table.Td>
          {isEditing ? (
            <Input
              size="xs"
              value={editData?.url || engine.url}
              onChange={(e) => {
                setEditingMap({
                  ...editingMap,
                  [engine.value]: {
                    ...editData,
                    url: e.target.value,
                  },
                });
              }}
            />
          ) : (
            engine.url
          )}
        </Table.Td>
        <Table.Td
          classNames={{
            td: "w-[50px]",
          }}
        >
          <ActionIcon.Group>
            <ActionIcon
              variant="subtle"
              size="xs"
              radius="xs"
              onClick={() => controlEdit(ind, isEditing)}
            >
              {isEditing ? <RiCheckLine /> : <RiPencilLine />}
            </ActionIcon>
            {!isEditing && (
              <ActionIcon
                variant="subtle"
                size="xs"
                radius="xs"
                disabled={ind === 0}
                onClick={() => adjustSort(ind)}
              >
                <RiArrowUpSLine />
              </ActionIcon>
            )}
            <ActionIcon
              variant="subtle"
              size="xs"
              radius="xs"
              disabled={engineList.length <= 1 && !isEditing}
              onClick={() => removeEngineOrRemoveEditing(ind, isEditing)}
              color="red"
            >
              <RiCloseLine />
            </ActionIcon>
          </ActionIcon.Group>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>名称</Table.Th>
            <Table.Th>URL</Table.Th>
            <Table.Th>操作</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <div className="text-right">
        <Button size="xs" onClick={addEngine}>
          添加
        </Button>
      </div>
    </>
  );
}

export const SearchEnginePanel: Panel = {
  title: "搜索引擎",
  Component,
};
