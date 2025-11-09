import {
  ActionIcon,
  Button,
  Input,
  Menu,
  Popover,
  Stack,
  Text,
} from "@mantine/core";
import { RiSearch2Line } from "@remixicon/react";
import { useSearchResult } from "../../hooks/useSearchResult";
import { useClickAway } from "ahooks";
import { ChangeEventHandler } from "react";
import styles from "./search.module.css";
import { useAtom } from "jotai";
import { INPUT_FOCUS_ATOM } from "../../store";

export function SearchCenter() {
  const [search, setSearch] = useState("");
  const { result } = useSearchResult({ search });
  const [open, setOpen] = useState(true);
  const [focus, setFocus] = useAtom(INPUT_FOCUS_ATOM);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value);
    setOpen(true);
  };
  const intl = useMemo(
    () =>
      new Intl.DateTimeFormat("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    []
  );

  const ref = useRef<HTMLDivElement>(null);
  //   useClickAway(() => setFocus(false), ref);

  return (
    <div>
      <div className="w-full text-center text-[40px] text-[#ffffff] mb-[20px]">
        {intl.format(new Date())}
      </div>
      <div
        ref={ref}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        className="text-center flex items-center justify-center mb-[40px] "
      >
        <Popover width="target" trapFocus={false} opened={true}>
          <Popover.Target>
            <Input
              placeholder="搜索"
              value={search}
              onInput={handleChange}
              radius="xl"
              classNames={{
                wrapper: styles["input-wrapper"],
                input: `${styles.input} ${focus ? styles.focus : ""}`,
              }}
            />
          </Popover.Target>

          {result.length > 0 && (
            <Popover.Dropdown
              classNames={{
                dropdown: styles.dropdown,
              }}
            >
              {result.map((item, index) => (
                <Button
                  variant="subtle"
                  size="xs"
                  fullWidth
                  justify="space-between"
                  className="hover:bg-[#f5f5f5] text-left!"
                  key={item + index}
                >
                  {item}
                </Button>
              ))}
            </Popover.Dropdown>
          )}
        </Popover>
      </div>
    </div>
  );
}
