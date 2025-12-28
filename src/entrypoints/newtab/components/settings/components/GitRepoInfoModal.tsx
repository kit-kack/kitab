import { GIT_FILE_SHA_ATOM, GIT_INFO_ATOM } from "@/entrypoints/newtab/store";
import {
  Flex,
  Avatar,
  Button,
  Select,
  PasswordInput,
  Autocomplete,
  Input,
  Text,
} from "@mantine/core";
import { useRequest, useDebounceFn } from "ahooks";
import { useAtom } from "jotai";
import { LabelFor } from "./LabelFor";
import { ContextModalProps } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

const GIT_API_LIST = Object.keys(GIT_APIS).map((key) => ({
  value: key,
  label: key,
}));

export const GIT_REPO_INFO_CONTEXT_MODAL_ID = "git-repo-info-context";

export function GitRepoInfoFormModal({
  context,
  id,
  innerProps: { originGitInfo },
}: ContextModalProps<{
  originGitInfo: GitRepoStorage;
}>) {
  const [gitInfo, setGitInfo] = useState<GitRepoStorage>(originGitInfo);
  const [realGitInfo, setRealGitInfo] = useAtom(GIT_INFO_ATOM);
  const [gitFileSha, setGitFileSha] = useAtom(GIT_FILE_SHA_ATOM);

  const { data: repoList, run } = useRequest(() => listGitRepos(gitInfo), {
    refreshDeps: [gitInfo.api, gitInfo.token],
  });
  const { run: onTokenChange } = useDebounceFn(
    (token: string) => {
      queryUserInfo({
        ...gitInfo,
        token,
      })
        .then((userInfo) => {
          setGitInfo({
            ...gitInfo,
            user: userInfo.login,
            avatar: userInfo.avatar_url,
            token: token,
          });
        })
        .catch((err) => {
          console.error(err);
        });
    },
    {
      wait: 500,
    }
  );

  function selectRepo(value: string | null) {
    const repo = repoList?.find((repo) => repo.name === value);
    if (repo) {
      setGitInfo({ ...gitInfo, repo: repo.name, branch: repo.default_branch });
    } else {
      setGitInfo({ ...gitInfo, repo: value || "" });
    }
  }

  function confirm() {
    if (!gitInfo.token || !gitInfo.repo || !gitInfo.branch) {
      notifications.show({
        color: "red",
        message: "请填写完整的Git仓库信息",
      });
      return;
    }
    const notificationId = notifications.show({
      loading: true,
      title: "数据同步操作",
      message: (
        <Text size="sm">
          正在从远程{gitInfo.api}仓库{gitInfo.user}/{gitInfo.repo}
          同步数据中...
        </Text>
      ),
      withCloseButton: false,
      autoClose: false,
    });
    setRealGitInfo(gitInfo);
    // 删掉本地sha
    setGitFileSha({});
    loadGitRepoConf()
      .then(() => {
        notifications.update({
          id: notificationId,
          loading: false,
          color: "teal",
          message: "数据同步成功",
          autoClose: 2000,
        });
        context.closeModal(id);
      })
      .catch((err) => {
        notifications.update({
          id: notificationId,
          loading: false,
          color: "red",
          message: "数据同步失败：" + err?.message || err,
          autoClose: 2000,
        });
      });
  }

  return (
    <form className="flex justify-between align-center flex-wrap justify-items-end gap-y-[8px] text-[12px] p-[8px]">
      <LabelFor label="用户">
        <Flex align="center" justify="flex-end" gap={4}>
          <Avatar src={gitInfo.avatar} alt={gitInfo.user} size="sm" />
          <Text size="sm">{gitInfo.user}</Text>
          {gitInfo.user && (
            <Button
              variant="transparent"
              size="xs"
              color="error"
              onClick={() =>
                showDangerModal({
                  children: <span>是否注销,停止同步?</span>,
                  onConfirm() {
                    setRealGitInfo({
                      ...gitInfo,
                      user: "",
                      avatar: "",
                      repo: "",
                      branch: "",
                      token: "",
                    });
                    context.closeModal(id);
                  },
                  labels: {
                    confirm: "确定",
                    cancel: "取消",
                  },
                })
              }
            >
              注销
            </Button>
          )}
        </Flex>
      </LabelFor>
      <LabelFor label="平台">
        <Select
          data={GIT_API_LIST}
          value={gitInfo.api}
          onChange={(value) =>
            setGitInfo({
              ...gitInfo,
              api: (value as keyof typeof GIT_APIS) || "github",
            })
          }
        />
      </LabelFor>
      <LabelFor label="Token">
        <PasswordInput
          value={gitInfo.token}
          onChange={(e) => onTokenChange(e.target.value)}
        />
      </LabelFor>
      <LabelFor label="仓库">
        <Autocomplete
          data={repoList || []}
          value={gitInfo.repo}
          onChange={selectRepo}
          onOptionSubmit={selectRepo}
        />
      </LabelFor>
      <LabelFor label="分支">
        <Input
          placeholder="branch"
          value={gitInfo.branch}
          onChange={(e) => setGitInfo({ ...gitInfo, branch: e.target.value })}
        />
      </LabelFor>

      <div className="w-full flex justify-end mt-[10px] gap-[4px]">
        <Button
          size="xs"
          variant="subtle"
          onClick={() => context.closeModal(id)}
        >
          取消
        </Button>
        <Button size="xs" onClick={confirm}>
          确认
        </Button>
      </div>
    </form>
  );
}
