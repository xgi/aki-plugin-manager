import { install } from "./install";
import { uninstall } from "./uninstall";

export const manager = (ipcMain: any, baseDir: string) => {
  ipcMain.on("aki-install", (event: any, name: string, version: string) => {
    install(name, version, baseDir, (err?: Error) => {
      event.sender.send(`aki-installed-${name}`, err);
    });
  });

  ipcMain.on("aki-uninstall", (event: any, name: string) => {
    uninstall(name, baseDir, (err?: Error) => {
      event.sender.send(`aki-uninstalled-${name}`, err);
    });
  });
};
