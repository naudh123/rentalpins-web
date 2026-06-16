Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile((Join-Path $PSScriptRoot "..\public\logo\logo.png"))

function Test-Visible($c) {
  if ($c.A -le 16) { return $false }
  if ($c.R -lt 24 -and $c.G -lt 24 -and $c.B -lt 24) { return $false }
  return $true
}

$prev = 0
for ($y = 0; $y -lt $img.Height; $y++) {
  $cnt = 0
  for ($x = 0; $x -lt $img.Width; $x++) {
    if (Test-Visible $img.GetPixel($x, $y)) { $cnt++ }
  }
  if ($y % 20 -eq 0 -or ($prev -gt 80 -and $cnt -lt 20) -or ($prev -lt 20 -and $cnt -gt 80)) {
    Write-Output "y=$y cnt=$cnt"
  }
  $prev = $cnt
}
$img.Dispose()
