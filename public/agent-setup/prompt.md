# orbitproxy agent setup

你的任务是把用户本机上的一个服务发布到公网，并确认公网地址返回的就是这个服务。不要解释产品，先做出一个可以打开的地址。

所有命令都在用户自己的电脑上执行，不要放进沙箱。WorkBuddy 这类环境默认会把命令关在沙箱里，沙箱里的安装、登录和客户端不会作用到用户的真实系统。开始之前先关掉沙箱，或改用允许访问用户家目录、网络和浏览器的执行方式。如果你在远端、碰不到用户的 localhost，不要猜测，把命令交给用户自己执行。

不要要求用户把 authtoken 贴进对话，也不要在命令、日志或文件里打印它。安装脚本结束时如果提示执行 `orbitproxy authtoken`，忽略那一步，改用下面的 `login`。

顺序固定为：安装客户端，登录并等到用户在浏览器里确认，然后再问要发布什么。登录没有完成之前，不要问服务，也不要创建分享。

## 向用户提问

需要用户做选择时，调用当前环境里真实存在的提问工具，让弹窗出现。不要只在对话正文里写「请选择」。某个工具不在当前会话里，就在对话里说明这次没有提问弹窗，再问，不要假装已经弹出。

只使用下面有公开名称的工具：

- Cursor：`AskQuestion`。至少两个选项。推荐项放在第一个，标签末尾加「（推荐）」。用户可以用 Other 自己填写。
- VS Code 里的 GitHub Copilot：`vscode_askQuestions`。官方引用名是 `#vscode/askQuestions`。旧名 `copilot_askQuestions` 仍被界面识别。2026 年 1 月合入时，设置 `github.copilot.chat.askQuestions.enabled` 默认是关的。当前会话没有这个工具时，先让用户打开该设置，不要改成在正文里列选项。
- Claude Code：`AskUserQuestion`。文档写明用它做选择题，用户可以选选项，也可以在 Other 里自己写。
- TRAE：设置项叫「智能体主动提问」。产品里的工具名是 `AskUserQuestion`。2026 年 10 月 16 日 TRAE 技术支持确认，部分版本没有把这个工具下发给会话，正在修复。当前会话没有 `AskUserQuestion` 时，在对话里问，并说明这次没有提问弹窗。
- WorkBuddy：用它自己的「向用户提问」步骤。官方文档没有公开工具名，不要调用 `AskQuestion` 或 `AskUserQuestion`。

其他没有写在这里的编辑器，在对话里问，并说明该环境没有可核对的提问工具。

登录之后要问的那一道题：

是否已经有正在运行、需要发布到公网的内网服务？

选项：

1. 没有，先发布一个临时页面（推荐）
2. 有，我在 Other 里填写协议、地址和端口

选了「有」时：HTTP 服务用 HTTPS 分享，原始 TCP（例如 SSH、数据库）用 TCP 分享。地址没说时用 `127.0.0.1`。用户已经在最初那条消息里给了地址和端口，就不要再问一遍。

选了「没有」时：告诉用户，你会临时在本机启动一个只返回一页说明的 HTTP 服务，并把它发布出去，用来确认 orbitproxy 可用。这不是用户的业务服务。

## 安装客户端

先看命令是否已经存在。存在就用已有的程序。

- macOS、Linux 的安装脚本：

```bash
curl -fsSL https://dashboard.app.orbitproxy.cloud/install.sh | bash
```

程序在 `~/.orbitproxy/bin/orbitproxy`。脚本不会把它加入 PATH，后面的命令使用这个路径。

- Windows 仅支持 64 位。在 PowerShell 中执行：

```powershell
irm https://dashboard.app.orbitproxy.cloud/install.ps1 | iex
```

程序在 `$env:LOCALAPPDATA\orbitproxy\orbitproxy.exe`。脚本不会写入 PATH。若用户以前把程序放在 `~\.orbitproxy\bin\orbitproxy.exe`，用那个已存在的程序。

下文用 `<orbitproxy>` 代表上面这个程序的实际路径。

## 登录

执行 `login` 之前，先用一句话告诉用户：接下来会打开浏览器，需要他本人在页面上确认登录。不要只在任务列表里写「登录」，也不要闷头轮询。

```bash
<orbitproxy> login --client <平台>
```

`<平台>` 必须和当前编辑器一致，授权页会按这个名字显示：

- Cursor：`cursor`
- VS Code 里的 GitHub Copilot：`copilot`
- Claude Code：`claude`
- TRAE：`trae`
- WorkBuddy：`workbuddy`

不带 `--client` 时，授权页只显示 orbitproxy，不出现任何 AI 工具的名称。WorkBuddy 也要带 `--client workbuddy`，否则同样不会显示 WorkBuddy。

- 已登录时，输出 `already logged in`，继续下一步。
- 当前终端没有交互时，命令只打印链接并退出，自己不会打开浏览器。第一行是链接。你立刻在用户自己的电脑上打开它，这一步不能放进沙箱：
  - macOS：`open "<第一行的链接>"`
  - Linux：`xdg-open "<第一行的链接>"`
  - Windows：`Start-Process "<第一行的链接>"`
  打开之后立刻告诉用户：浏览器已经打开，请在页面上点确认。不要把链接丢给用户复制。如果 `open` 失败，再把链接发出来，并说明自动打开没有成功。
  然后执行 `<orbitproxy> status --json`，直到 `logged_in` 为 true。退出码 `3` 表示用户还没确认。等待期间不要停在「正在执行命令」而不出声。
- 有交互终端时，命令会自己打开浏览器并等待确认。这时不要再开一次，但仍然要告诉用户去浏览器里确认。

登录完成之后，再按上面的「向用户提问」问要发布什么。不要在登录之前问。

## 准备上游

### 用户已有服务

先确认本机地址和端口有进程在听。

- HTTP，macOS / Linux：`curl -sS -o /dev/null -w '%{http_code}' http://127.0.0.1:PORT`
- HTTP，Windows：`(Invoke-WebRequest -Uri http://127.0.0.1:PORT -UseBasicParsing).StatusCode`
- TCP：`nc -z 127.0.0.1 PORT`，或 PowerShell 的 `Test-NetConnection -ComputerName 127.0.0.1 -Port PORT`

没有进程在听时，不要执行 `proxy add`。告诉用户服务还没起来。

### 没有现有服务

只做 HTTP。选一个空闲的高位端口，例如 `8765`。页面正文写「这是 orbitproxy 的临时页面」。先在本机请求这个端口，确认返回该页面，再创建分享。

macOS / Linux，按顺序尝试，有一个能用即可：

```bash
mkdir -p /tmp/orbitproxy-hello
printf '%s\n' '<!doctype html><meta charset="utf-8"><title>orbitproxy</title><p>这是 orbitproxy 的临时页面。</p>' > /tmp/orbitproxy-hello/index.html
python3 -m http.server 8765 --bind 127.0.0.1 --directory /tmp/orbitproxy-hello
```

没有 `python3` 时：

```bash
node -e "require('http').createServer((q,s)=>{s.writeHead(200,{'content-type':'text/html;charset=utf-8'});s.end('<!doctype html><meta charset=utf-8><title>orbitproxy</title><p>这是 orbitproxy 的临时页面。</p>')}).listen(8765,'127.0.0.1')"
```

两个都没有时，停下来告诉用户，不要自己编一个文件服务。

Windows 不要使用 `HttpListener`，非管理员绑定需要额外的 URL 保留。已有 `py -3` 或 `node` 时，用上面的同一种服务，并绑定 `127.0.0.1`。否则用 PowerShell 的 `TcpListener`：

```powershell
$port = 8765
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $port)
$listener.Start()
$body = [Text.Encoding]::UTF8.GetBytes("<!doctype html><meta charset=`"utf-8`"><title>orbitproxy</title><p>这是 orbitproxy 的临时页面。</p>")
while ($true) {
  $client = $listener.AcceptTcpClient()
  $stream = $client.GetStream()
  $buf = New-Object byte[] 4096
  $null = $stream.Read($buf, 0, $buf.Length)
  $head = [Text.Encoding]::ASCII.GetBytes("HTTP/1.1 200 OK`r`nContent-Type: text/html; charset=utf-8`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n")
  $stream.Write($head, 0, $head.Length)
  $stream.Write($body, 0, $body.Length)
  $client.Close()
}
```

把这个进程放在后台，方便你继续执行后面的命令。

## 连接云网关并创建分享

先让客户端在后台运行。它会等到连上云网关再返回，最多 15 秒。已经在运行时，命令会等待它在线。

```bash
<orbitproxy> run --background
```

退出码 `6` 表示没有连上云网关。macOS 上不要用 `sudo` 执行 `run`。

然后创建分享。HTTP：

```bash
<orbitproxy> proxy add --type api_gateway --protocol https --host 127.0.0.1 --port PORT --json
```

TCP：

```bash
<orbitproxy> proxy add --type api_gateway --protocol tcp --host 127.0.0.1 --port PORT --json
```

从 JSON 读取 `public_url`。`warnings` 里出现 `local_not_listening` 时，分享虽然已创建，但上游没有在听。先处理上游，不要把这个地址交给用户当成功结果。

退出码 `4` 表示超出套餐，或当前没有有效订阅。把这个结果告诉用户，不要反复重试。

地址不是用户自己的域名时，控制面会分配一个系统域名。关闭分享后这个域名仍留在账号里，下次不指定子域名时会优先复用。

## 证明它能打开

用超时请求公网地址，确认响应和本地上游一致，而不是连接失败。

- HTTPS：`curl -fsS --max-time 20 PUBLIC_URL`
- TCP：对公网地址做一次 TCP 连接检查，不要发 HTTP 请求。

然后把公网地址告诉用户，并说明如何在浏览器或对应客户端里打开。

临时页面要留着，让用户自己打开。同时说明怎样结束：

- 关闭分享：`<orbitproxy> close PORT`
- 停掉你启动的临时 HTTP 进程

用户的既有服务不要在结束时关闭。后台客户端继续运行，并告诉用户可以用 `<orbitproxy> stop` 停掉由 `run --background` 启动的进程。
