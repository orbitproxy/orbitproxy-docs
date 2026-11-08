# orbitproxy 环境准备

只确认这台电脑能用 orbitproxy。不要发布服务，不要加策略，不要查日志，不要问用户要发布什么。

所有命令都在用户自己的电脑上执行，不要放进沙箱。WorkBuddy 这类环境默认会把命令关在沙箱里，沙箱里的安装、登录和客户端不会作用到用户的真实系统。开始之前先关掉沙箱，或改用允许访问用户家目录、网络和浏览器的执行方式。如果你在远端、碰不到用户的 localhost，不要猜测，把命令交给用户自己执行。

不要要求用户把 authtoken 贴进对话，也不要在命令、日志或文件里打印它。安装脚本结束时如果提示执行 `orbitproxy authtoken`，忽略那一步，改用下面的 `login`。

某一项已经满足就跳过，不要从头再装一遍。

## 客户端

先找已经安装的程序。找到就用它，不要跑安装脚本。

- macOS、Linux：`~/.orbitproxy/bin/orbitproxy`。PATH 里已有 `orbitproxy` 时用 PATH 里的那个。
- Windows：`$env:LOCALAPPDATA\orbitproxy\orbitproxy.exe`。若 `~\.orbitproxy\bin\orbitproxy.exe` 已存在，用那个。

下文用 `<orbitproxy>` 代表找到的程序路径。

都没有时才安装。

macOS、Linux：

```bash
curl -fsSL https://dashboard.app.orbitproxy.cloud/install.sh | bash
```

装完程序在 `~/.orbitproxy/bin/orbitproxy`。脚本不会把它加入 PATH。

Windows 仅支持 64 位。在 PowerShell 中执行：

```powershell
irm https://dashboard.app.orbitproxy.cloud/install.ps1 | iex
```

装完程序在 `$env:LOCALAPPDATA\orbitproxy\orbitproxy.exe`。脚本不会写入 PATH。

## 技能

执行：

```bash
npx skills ls -g --json
```

输出里已经有 `orbitproxy-setup`，技能包就已安装。不要执行 `npx skills add`，也不要执行 `npx skills update`。

没有 `orbitproxy-setup` 时才安装。不要停下来问用户装到哪个目录。

```bash
npx skills add orbitproxy/skills -g --all
```

本机没有 `npx` 时，告诉用户技能没装上，然后继续登录。不要改用别的安装方式。

## 登录

`<orbitproxy> status --json` 里 `logged_in` 为 true 就结束准备，回到用户这次要做的任务。

否则先用一句话告诉用户：接下来会打开浏览器，需要他本人在页面上确认登录。不要只在任务列表里写「登录」，也不要闷头轮询。

```bash
<orbitproxy> login --client <当前产品名>
```

任何智能体都可以登录。知道自己的产品名时带上 `--client`，授权页会显示这个名字。不知道就不要编，直接执行 `<orbitproxy> login`。不带 `--client` 时，授权页只显示 orbitproxy。

- 已登录时，输出 `already logged in`，结束准备。
- 当前终端没有交互时，命令只打印链接并退出，自己不会打开浏览器。第一行是链接。你立刻在用户自己的电脑上打开它，这一步不能放进沙箱：
  - macOS：`open "<第一行的链接>"`
  - Linux：`xdg-open "<第一行的链接>"`
  - Windows：`Start-Process "<第一行的链接>"`
  打开之后立刻告诉用户：浏览器已经打开，请在页面上点确认。不要把链接丢给用户复制。如果 `open` 失败，再把链接发出来，并说明自动打开没有成功。
  然后执行 `<orbitproxy> status --json`，直到 `logged_in` 为 true。退出码 `3` 表示用户还没确认。等待期间不要停在「正在执行命令」而不出声。
- 有交互终端时，命令会自己打开浏览器并等待确认。这时不要再开一次，但仍然要告诉用户去浏览器里确认。

登录完成后回到用户这次要做的任务。不要问要不要发布临时页面，除非那个任务文件明确要求发布。
