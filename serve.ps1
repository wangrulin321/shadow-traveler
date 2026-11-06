$ErrorActionPreference = 'Stop'
$port = 4173
$python = Get-Command python -ErrorAction SilentlyContinue
if (-not $python) {
  $python = Get-Command py -ErrorAction SilentlyContinue
}
if (-not $python) {
  throw '未找到 Python。请安装 Python 3 后再次运行此脚本。'
}
Write-Host "影灯旅人已启动：http://localhost:$port"
& $python.Source -m http.server $port --bind 127.0.0.1
