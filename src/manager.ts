import { install } from "./install";

export const manager = (ipcMain: any, baseDir: string) => {
  ipcMain.on("aki-install", (event: any, name: string, version: string) => {
    install(name, version, baseDir, (err?: Error) => {
      event.sender.send(`aki-installed-${name}`, err);
    });
  });
};
