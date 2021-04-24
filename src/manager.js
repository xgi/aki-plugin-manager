const install = require("./install");

module.exports = (ipcMain, baseDir) => {
  ipcMain.on("aki-install", (event, name, version) => {
    install(name, version, baseDir, () => {
      event.sender.send(`aki-installed-${name}`);
    });
  });
};
