const fs = require('fs');
const path = require('path');

module.exports = function cleanup() {
  const projectRoot = process.cwd();
  const multiEnvDir = path.join(projectRoot, '.multi-env');
  const instancesFile = path.join(multiEnvDir, 'instances.json');

  if (!fs.existsSync(instancesFile)) return;

  let instances = JSON.parse(fs.readFileSync(instancesFile));
  let changed = false;

  instances = instances.filter(instance => {
    try {
      // check if process is alive
      process.kill(instance.pid, 0);
      return true; // still alive
    } catch (err) {
      // process is dead, remove temp file
      changed = true;
      if (fs.existsSync(instance.envFile)) {
        fs.unlinkSync(instance.envFile);
      }
      return false;
    }
  });

  if (changed) {
    fs.writeFileSync(instancesFile, JSON.stringify(instances, null, 2));
  }
};