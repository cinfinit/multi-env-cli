const fs = require('fs');
const path = require('path');

module.exports = function list() {
  const projectRoot = process.cwd();
  const multiEnvDir = path.join(projectRoot, '.multi-env');
  const instancesFile = path.join(multiEnvDir, 'instances.json');

  if (!fs.existsSync(instancesFile)) {
    console.log('No instances found.');
    return;
  }

  const instances = JSON.parse(fs.readFileSync(instancesFile));

  if (instances.length === 0) {
    console.log('No instances running.');
    return;
  }

  console.log('Running instances:');
  instances.forEach(i => {
    console.log(`ID: ${i.id}, PID: ${i.pid}, EnvFile: ${i.envFile}, Command: ${i.command}`);
  });
};