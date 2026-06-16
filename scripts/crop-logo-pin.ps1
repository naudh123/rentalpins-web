Add-Type -AssemblyName System.Drawing

$src = Join-Path $PSScriptRoot "..\public\logo\logo.png"
$out = Join-Path $PSScriptRoot "..\public\logo\logo-pin.png"

$img = [System.Drawing.Bitmap]::FromFile($src)
# Pin + chevron + small gap — keep top 58% (chevron sits above wordmark).
$cropH = [int]($img.Height * 0.63)
$tmp = New-Object System.Drawing.Bitmap($img.Width, $cropH)
$g = [System.Drawing.Graphics]::FromImage($tmp)
$g.Clear([System.Drawing.Color]::Transparent)
$srcRect = New-Object System.Drawing.Rectangle 0, 0, $img.Width, $cropH
$dstRect = New-Object System.Drawing.Rectangle 0, 0, $img.Width, $cropH
$g.DrawImage($img, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()

# Trim horizontal padding only — vertical gap between pin and chevron must stay.
$minX = $tmp.Width
$maxX = 0
for ($y = 0; $y -lt $tmp.Height; $y++) {
  for ($x = 0; $x -lt $tmp.Width; $x++) {
    if ($tmp.GetPixel($x, $y).A -gt 16) {
      if ($x -lt $minX) { $minX = $x }
      if ($x -gt $maxX) { $maxX = $x }
    }
  }
}

$padX = 12
$minX = [Math]::Max(0, $minX - $padX)
$maxX = [Math]::Min($tmp.Width - 1, $maxX + $padX)
$cw = $maxX - $minX + 1
$ch = $cropH

$final = New-Object System.Drawing.Bitmap($cw, $ch)
$g2 = [System.Drawing.Graphics]::FromImage($final)
$g2.Clear([System.Drawing.Color]::Transparent)
$trimSrc = New-Object System.Drawing.Rectangle $minX, 0, $cw, $ch
$trimDst = New-Object System.Drawing.Rectangle 0, 0, $cw, $ch
$g2.DrawImage($tmp, $trimDst, $trimSrc, [System.Drawing.GraphicsUnit]::Pixel)
$g2.Dispose()
$tmp.Dispose()
$img.Dispose()

$final.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output "Wrote $out (${cw}x${ch})"
$final.Dispose()
