const install = require("./install");

module.exports = (ipcMain, baseDir) => {
  ipcMain.on("hpm-install", (event, name, version) => {
    install(name, version, baseDir, () => {
      event.sender.send(`hpm-installed-${name}`);
    });
  });
};
