Add-Type -AssemblyName System.Drawing

$src = Join-Path $PSScriptRoot "..\public\logo\logo.png"
$out = Join-Path $PSScriptRoot "..\public\logo\logo-pin.png"

function Test-VisiblePixel($color) {
  if ($color.A -le 16) { return $false }
  # Treat near-black background as empty.
  if ($color.R -lt 24 -and $color.G -lt 24 -and $color.B -lt 24) { return $false }
  return $true
}

$img = [System.Drawing.Bitmap]::FromFile($src)
$cropH = [int]($img.Height * 0.63)
$tmp = New-Object System.Drawing.Bitmap($img.Width, $cropH)
$g = [System.Drawing.Graphics]::FromImage($tmp)
$g.Clear([System.Drawing.Color]::Transparent)
$srcRect = New-Object System.Drawing.Rectangle 0, 0, $img.Width, $cropH
$dstRect = New-Object System.Drawing.Rectangle 0, 0, $img.Width, $cropH
$g.DrawImage($img, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$img.Dispose()

$minX = $tmp.Width
$maxX = 0
$minY = $tmp.Height
$maxY = 0

for ($y = 0; $y -lt $tmp.Height; $y++) {
  $rowHas = $false
  for ($x = 0; $x -lt $tmp.Width; $x++) {
    if (Test-VisiblePixel($tmp.GetPixel($x, $y))) {
      $rowHas = $true
      if ($x -lt $minX) { $minX = $x }
      if ($x -gt $maxX) { $maxX = $x }
    }
  }
  if ($rowHas) {
    if ($y -lt $minY) { $minY = $y }
    $maxY = $y
  }
}

$pad = 6
$minX = [Math]::Max(0, $minX - $pad)
$minY = [Math]::Max(0, $minY - $pad)
$maxX = [Math]::Min($tmp.Width - 1, $maxX + $pad)
$maxY = [Math]::Min($tmp.Height - 1, $maxY + $pad)
$cw = $maxX - $minX + 1
$ch = $maxY - $minY + 1

$final = New-Object System.Drawing.Bitmap($cw, $ch)
$g2 = [System.Drawing.Graphics]::FromImage($final)
$g2.Clear([System.Drawing.Color]::Transparent)
$trimSrc = New-Object System.Drawing.Rectangle $minX, $minY, $cw, $ch
$trimDst = New-Object System.Drawing.Rectangle 0, 0, $cw, $ch
$g2.DrawImage($tmp, $trimDst, $trimSrc, [System.Drawing.GraphicsUnit]::Pixel)
$g2.Dispose()
$tmp.Dispose()

$final.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output "Wrote $out (${cw}x${ch})"
$final.Dispose()
