# 🚀 Multi-Env CLI

[![NPM version](https://img.shields.io/npm/v/multi-env-cli.svg?style=flat)](https://www.npmjs.com/package/multi-env-cli) [![NPM downloads](https://img.shields.io/npm/dm/multi-env-cli.svg?style=flat)](https://npmjs.org/package/multi-env-cli)

**The ultimate environment wizard for Node.js developers.**  

Ever wanted to run multiple versions of your app with different `.env` files simultaneously? Ever wished you could tweak env variables **on the fly** while your app is running, without restarting it manually or touching your code?  

Say hello to **Multi-Env CLI** – your new best friend for dev magic.  

---

## ⚡ TL;DR Quick Start

```bash
# 1️⃣ Run an instance with a temp env
npx multi-env run --env-file .env.staging --cmd "node server.js" --auto-cleanup

# 2️⃣ Edit the temp env while app is running → auto-restart happens

# 3️⃣ List all running instances
npx multi-env list

# 4️⃣ Kill a specific instance
npx multi-env kill --id <instance-id>

# 5️⃣ Repeat for multiple instances (staging, prod, dev)
npx multi-env run --env-file .env.prod --cmd "npm run dev"
````

> 🔥 Tip: Your temp env files live in `.multi-env/` — you can freely edit them, watch the CLI restart, and never touch your original `.env` files.

---

## ⚡ Features

* **Hot-editable temp env files**: edit your temp env, save, and the CLI **automatically restarts your app** with updated values.
* **Multiple simultaneous instances**: spin up as many environments as your RAM allows.
* **CLI-managed temp envs**: no more messing with your original `.env` files.
* **Crash-safe & auto-cleanup**: dead instances are automatically cleaned from `.multi-env`, temp files removed if enabled.
* **Fully customizable commands**: run `npm run dev`, `node server.js`, or literally anything.
* **No changes to your code needed**: works out-of-the-box with any Node.js project.

---

## 📦 Installation

**Global install**

```bash
npm install -g multi-env-cli
npx multi-env run
```

---

## 🛠️ Usage

### Interactive Mode

```bash
npx multi-env run
```

* Enter **env file path** (e.g., `.env.staging`)
* Enter **command to run** (`npm run dev`, `node server.js`, etc.)
* Choose whether to **auto-cleanup** temp env after exit

> 🔥 Tip: Save the temp env file while your app is running to trigger automatic restarts with updated values!

---

### Flags / Non-Interactive Mode

```bash
npx multi-env run --env-file .env.prod --cmd "node server.js" --auto-cleanup
```

* `--env-file`: path to the env file to base the temp env on
* `--cmd`: command to run for the instance
* `--auto-cleanup`: deletes the temp env after instance exits

---

### Listing Instances

```bash
npx multi-env list
```

Example output:

```
ID: 171234567890, PID: 12345, EnvFile: .multi-env/env.temp.171234567890, Command: node server.js
```

---

### Killing an Instance

```bash
npx multi-env kill --id 171234567890
```

* Deletes temp env if auto-cleanup enabled
* Updates `instances.json` automatically

---

## 🧪 Example Workflow

```bash
# Run staging instance
npx multi-env run --env-file .env.staging --cmd "node server.js"

# Open .multi-env/env.temp.<id> and edit PORT=4000 → 5000
# CLI automatically restarts app with updated env

# Run production instance simultaneously
npx multi-env run --env-file .env.prod --cmd "node server.js"

# List running instances
npx multi-env list

# Kill staging instance
npx multi-env kill --id <staging-id>
```

---

## 💡 Use Cases

* Run **staging, dev, and prod** instances side-by-side on your machine
* Test **feature flags** or **environment-dependent configs** without restarting
* Hot-edit configs in real-time while testing APIs, bots, servers, or scripts
* Perfect for **rapid prototyping**, **CI/CD simulations**, or **multi-tenant apps**

---

## 📝 Notes & Tips

* Temp envs are stored in `.multi-env/` inside your project.
* The original env file is **never modified**.

---

## ⚡ Pro Tips

* Keep multiple projects running without conflicts — each project has its own `.multi-env` folder.

---

## 🏆 Why Multi-Env CLI?

Because life’s too short to:

* Manually copy `.env` files
* Restart your app every time you tweak a variable
* Lose track of multiple running instances

Multi-Env CLI handles it all — **hot, safe, and simultaneously**.

---

## 👨‍💻 Author — The Env Whisperer

Created by [cinfinit](https://github.com/cinfinit), a developer who treats environment files like a deck of cards: shuffle, duplicate, or vanish them — all without breaking a sweat.

Motto: “Temp files are my playground .”

Special Moves:

- Env Mirage — make multiple instances appear from thin air.

- Hot-Reload Blink — edit .env and watch the app instantly obey.

- Phantom Cleanup — temp envs disappear as if they were never real.

Signature Style: casually spawns multiple Node processes while everyone else hits refresh.

Fun Fact: once convinced a server to restart itself just by editing a temp env file. True story.

⚡ Warning: staring too long at the temp env may cause sudden urges to create another instance.
