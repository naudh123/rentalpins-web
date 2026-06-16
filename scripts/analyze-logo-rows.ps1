Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile((Join-Path $PSScriptRoot "..\public\logo\logo.png"))

function Test-Visible($c) {
  if ($c.A -le 16) { return $false }
  if ($c.R -gt 238 -and $c.G -gt 238 -and $c.B -gt 238) { return $false }
  if ($c.R -lt 24 -and $c.G -lt 24 -and $c.B -lt 24) { return $false }
  return $true
}

for ($y = 748; $y -le 920; $y += 4) {
  $cnt = 0
  $orange = 0
  $navy = 0
  for ($x = 0; $x -lt $img.Width; $x++) {
    $p = $img.GetPixel($x, $y)
    if (Test-Visible $p) {
      $cnt++
      if ($p.R -gt 180 -and $p.G -lt 140) { $orange++ }
      if ($p.B -gt 120 -and $p.R -lt 80) { $navy++ }
    }
  }
  if ($cnt -gt 0) {
    Write-Output "y=$y cnt=$cnt orange=$orange navy=$navy"
  }
}
$img.Dispose()
