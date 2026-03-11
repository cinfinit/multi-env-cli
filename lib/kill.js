const fs = require('fs');
const path = require('path');

module.exports = function kill(id) {
  const projectRoot = process.cwd();
  const multiEnvDir = path.join(projectRoot, '.multi-env');
  const instancesFile = path.join(multiEnvDir, 'instances.json');

  if (!fs.existsSync(instancesFile)) {
    console.log('No instances found.');
    return;
  }

  let instances = JSON.parse(fs.readFileSync(instancesFile));
  const instance = instances.find(i => i.id === id);

  if (!instance) {
    console.log('Instance not found.');
    return;
  }

  try {
    process.kill(instance.pid);
    console.log(`Killed instance ${id}`);
  } catch (err) {
    console.error(`Failed to kill instance ${id}: ${err.message}`);
  }

  instances = instances.filter(i => i.id !== id);
  fs.writeFileSync(instancesFile, JSON.stringify(instances, null, 2));

  // Clean temp env if exists
  if (fs.existsSync(instance.envFile)) fs.unlinkSync(instance.envFile);
};