import JSZip from "jszip";
// @ts-ignore
import { saveAs } from "file-saver";

const BACKUP_KEYS = [
  "website_bookmark_list",
  "theme",
  "ignoreList",
  "search_engine_list",
  "search_forecast_index",
];

/**
 * 导出备份
 */
export function exportBackup() {
  const zip = new JSZip();
  Promise.all(
    BACKUP_KEYS.map((key) =>
      storage
        .getItem<string>(`local:${key}`, { fallback: "" })
        .then((res) => [key, res])
    )
  )
    .then((res) => {
      res.forEach((item) => {
        zip.file(`${item[0]}.json`, JSON.stringify(item[1] ?? ""));
      });
    })
    .then(() => {
      zip
        .generateAsync({
          type: "blob",
        })
        .then((content) => {
          saveAs(content, "backup.zip");
        });
    });
}

export function importBackup(backupFile: File | null) {
  if (!backupFile) return;
  JSZip.loadAsync(backupFile)
    .then((zip) => {
      BACKUP_KEYS.forEach((key) => {
        const file = zip.file(`${key}.json`);
        if (file) {
          file.async("text").then((content) => {
            storage.setItem(`local:${key}`, JSON.parse(content));
          });
        }
      });
    })
    .then(() => {
      location.reload();
    })

    .catch((e) => {
      alert("导入失败：" + e);
    });
}
