const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const os = require('os');

module.exports = async function run({ envFilePath, autoCleanup = true, commandString = 'npm run dev' }) {
  const projectRoot = process.cwd();
  const multiEnvDir = path.join(projectRoot, '.multi-env');
  if (!fs.existsSync(multiEnvDir)) fs.mkdirSync(multiEnvDir);

  const instancesFile = path.join(multiEnvDir, 'instances.json');
  if (!fs.existsSync(instancesFile)) fs.writeFileSync(instancesFile, JSON.stringify([]));

  const tempEnvFile = path.join(multiEnvDir, `env.temp.${Date.now()}`);
  fs.copyFileSync(envFilePath, tempEnvFile);

  console.log(`Temp env file created: ${tempEnvFile}`);
  console.log('You can edit this file while the app is running for hot updates.');

  let childProcess;
  let restarting = false; // Flag to prevent cleanup during restart

  function startChild() {
    childProcess = spawn(commandString, {
      shell: true,
      stdio: 'inherit',
      env: { ...process.env, DOTENV_CONFIG_PATH: tempEnvFile },
    });

    const instance = {
      id: Date.now().toString(),
      pid: childProcess.pid,
      envFile: tempEnvFile,
      command: commandString
    };

    let instances = JSON.parse(fs.readFileSync(instancesFile));
    instances.push(instance);
    fs.writeFileSync(instancesFile, JSON.stringify(instances, null, 2));

    console.log(`Started instance ${instance.id} with PID ${childProcess.pid}`);

    childProcess.on('exit', () => {
      let current = JSON.parse(fs.readFileSync(instancesFile));
      current = current.filter(i => i.pid !== childProcess.pid);
      fs.writeFileSync(instancesFile, JSON.stringify(current, null, 2));

      // Only delete temp file if this is final exit
      if (!restarting && autoCleanup && fs.existsSync(tempEnvFile)) {
        fs.unlinkSync(tempEnvFile);
        console.log(`Temp env file deleted: ${tempEnvFile}`);
      }
    });
  }

  // Initial start
  startChild();

  // Watch temp env file for edits
  fs.watch(tempEnvFile, { persistent: true }, (eventType) => {
    if (eventType === 'change') {
      console.log('Temp env file changed, restarting app...');
      if (childProcess) {
        restarting = true;
        process.kill(childProcess.pid);
        // tiny delay to let exit handler finish
        setTimeout(() => {
          restarting = false;
          startChild();
        }, 50);
      }
    }
  });
};
