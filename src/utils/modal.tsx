import { ConfirmModalProps, modals } from "@mantine/modals";
import { RiAlertLine } from "@remixicon/react";

export function showDangerModal(
  props: Pick<ConfirmModalProps, "children" | "onConfirm">
) {
  modals.openConfirmModal({
    title: (
      <div className="flex items-center gap-[4px]">
        <RiAlertLine color="red" size={16} />
        警示
      </div>
    ),
    centered: true,
    labels: {
      confirm: "删除",
      cancel: "取消",
    },
    confirmProps: {
      color: "red",
      size: "xs",
    },
    cancelProps: {
      size: "xs",
      variant: "subtle",
    },
    ...props,
  });
}
