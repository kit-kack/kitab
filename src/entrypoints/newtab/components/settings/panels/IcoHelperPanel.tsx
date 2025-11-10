import { Panel } from "../panel";
import { CheckIcon, Radio, Table } from "@mantine/core";
import { useAtom } from "jotai";
import { ICO_API_INDEX_ATOM } from "@/entrypoints/newtab/store";
import { DEFAULT_ICO_APIS } from "@/entrypoints/newtab/store/defaults";

function Component() {
  const [index, setIndex] = useAtom(ICO_API_INDEX_ATOM);
  const rows = DEFAULT_ICO_APIS.map((engine, ind) => (
    <Table.Tr key={engine.value}>
      <Table.Td>{engine.value}</Table.Td>
      <Table.Td>{engine.url}</Table.Td>
      <Table.Td>{engine.nonCacheable ? "-" : "支持"}</Table.Td>
      <Table.Td>
        <Radio
          icon={CheckIcon}
          name="ico-helper"
          value={engine.value}
          defaultChecked={index === ind}
          onChange={() => setIndex(ind)}
        />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>名称</Table.Th>
            <Table.Th>URL</Table.Th>
            <Table.Th>缓存</Table.Th>
            <Table.Th>默认</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <h6 className="mb-[0] text-right">
        😘：在这里,感谢上述网站提供的API；其中一些网站为个人运营（未来可能无法访问），若不可用时请切换其他API
      </h6>
    </>
  );
}

export const IconHelperPanel: Panel = {
  title: "图标Ico",
  Component,
};
