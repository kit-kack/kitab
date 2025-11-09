import { ActionIcon, Button, Input, Menu, Popover } from "@mantine/core";
import { useSearchResult } from "../../hooks/useSearchResult";
import { ChangeEventHandler, KeyboardEventHandler } from "react";
import styles from "./search.module.css";
import { useAtom } from "jotai";
import { INPUT_FOCUS_ATOM, SEARCH_ENGINE_LIST_ATOM } from "../../store";
import { RiSearchLine } from "@remixicon/react";
import { CacheableIco } from "../CacheableIco";
import { useClickAway } from "ahooks";

export function SearchCenter() {
  const ref = useRef<HTMLDivElement>(null);
  useClickAway(() => setFocus(false), ref);

  const [search, setSearch] = useState("");
  const { result } = useSearchResult({ search });
  const [focus, setFocus] = useAtom(INPUT_FOCUS_ATOM);
  const [searchEngineList, setSearchEngineList] = useAtom(
    SEARCH_ENGINE_LIST_ATOM
  );
  const [localSearchEngineList, setLocalSearchEngineList] =
    useState(searchEngineList);

  const searchEngineChooser = useMemo(() => {
    function adjustToTop(ind: number) {
      if (ind === 0) {
        return;
      }
      ref.current!.focus();
      const newEngineList = [...localSearchEngineList];
      const engine = newEngineList[ind];
      newEngineList.splice(ind, 1);
      newEngineList.splice(0, 0, engine);
      setSearchEngineList(newEngineList);
      setLocalSearchEngineList(newEngineList);
    }

    return (
      <Menu trigger="hover" trapFocus={false} hideDetached={false} withinPortal>
        <Menu.Target>
          <ActionIcon
            variant="subtle"
            radius="xl"
            classNames={{
              icon: focus ? "opacity-100" : "opacity-0",
            }}
          >
            <CacheableIco
              url={localSearchEngineList[0].url}
              key={localSearchEngineList[0].value}
            />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          {localSearchEngineList.map((engine, index) => {
            return (
              <Button
                rightSection={
                  <span className="text-[#9e9e9e]">{`Alt + ${index}`}</span>
                }
                fullWidth
                justify="space-between"
                variant="subtle"
                size="xs"
                key={engine.value}
                onClick={() => adjustToTop(index)}
              >
                <div className="inline-flex items-center gap-[4px] mr-[8px]">
                  <CacheableIco url={engine.url} />
                  {engine.value}
                </div>
              </Button>
            );
          })}
        </Menu.Dropdown>
      </Menu>
    );
  }, [searchEngineList, localSearchEngineList, focus]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value);
  };

  function redirectToWeb(index: number) {
    console.log("trigger", index);
    if (index > -1 && index < searchEngineList.length - 1) {
      const engine = searchEngineList[index]!;
      location.href = engine.url.replace("%s", search);
    }
  }

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    let index = -1;
    if (e.code === "Enter") {
      // direct
      index = 0;
    } else if (e.altKey && e.code.startsWith("Digit")) {
      index = +e.code.charAt(5);
    }

    redirectToWeb(index);
  };

  const intl = useMemo(
    () =>
      new Intl.DateTimeFormat("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    []
  );

  return (
    <div>
      <div className="w-full text-center text-[40px] text-[#ffffff] mb-[20px]">
        {intl.format(new Date())}
      </div>
      <div
        ref={ref}
        onFocus={() => setFocus(true)}
        className="text-center flex items-center justify-center mb-[40px] "
      >
        <Popover
          width="target"
          trapFocus={false}
          opened={result.length > 0 && focus}
        >
          <Popover.Target>
            <Input
              placeholder={!focus ? "搜索" : void 0}
              value={search}
              onInput={handleChange}
              onKeyDown={handleKeyDown}
              onBlur={() => setFocus(false)}
              radius="xl"
              leftSection={searchEngineChooser}
              leftSectionPointerEvents={focus ? "all" : void 0}
              rightSection={
                <ActionIcon
                  variant="subtle"
                  radius="xl"
                  className={focus ? "opacity-100" : "opacity-0"}
                  onClick={() => redirectToWeb(0)}
                >
                  <RiSearchLine size={16} />
                </ActionIcon>
              }
              rightSectionPointerEvents={focus ? "all" : void 0}
              classNames={{
                wrapper: `${styles["input-wrapper"]} ${
                  focus ? styles.focus : ""
                }`,
                input: `${styles.input} ${focus ? styles.focus : ""}`,
              }}
            />
          </Popover.Target>

          {result.length > 0 && focus && (
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
