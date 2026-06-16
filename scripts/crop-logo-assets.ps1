Add-Type -AssemblyName System.Drawing

$root = Join-Path $PSScriptRoot "..\public\logo"
$srcPath = Join-Path $root "logo.png"

# Pin body → orange chevron → wordmark → tagline (1024×1024 master).
$iconEnd = 748
$wordTop = 784
$wordEnd = 888

function Test-VisiblePixel($color) {
  if ($color.A -le 16) { return $false }
  if ($color.R -gt 238 -and $color.G -gt 238 -and $color.B -gt 238) { return $false }
  if ($color.R -lt 24 -and $color.G -lt 24 -and $color.B -lt 24) { return $false }
  return $true
}

function Get-ContentBounds($bitmap) {
  $minX = $bitmap.Width
  $maxX = 0
  $minY = $bitmap.Height
  $maxY = 0

  for ($y = 0; $y -lt $bitmap.Height; $y++) {
    $rowHas = $false
    for ($x = 0; $x -lt $bitmap.Width; $x++) {
      if (Test-VisiblePixel $bitmap.GetPixel($x, $y)) {
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

  return @{ MinX = $minX; MaxX = $maxX; MinY = $minY; MaxY = $maxY }
}

function Save-CroppedRegion($source, $x, $y, $w, $h, $outPath, $pad) {
  $minX = [Math]::Max(0, $x - $pad)
  $minY = [Math]::Max(0, $y - $pad)
  $maxX = [Math]::Min($source.Width - 1, $x + $w - 1 + $pad)
  $maxY = [Math]::Min($source.Height - 1, $y + $h - 1 + $pad)
  $cw = $maxX - $minX + 1
  $ch = $maxY - $minY + 1

  $final = New-Object System.Drawing.Bitmap $cw, $ch
  $g = [System.Drawing.Graphics]::FromImage($final)
  $g.Clear([System.Drawing.Color]::Transparent)
  $srcRect = [System.Drawing.Rectangle]::new($minX, $minY, $cw, $ch)
  $dstRect = [System.Drawing.Rectangle]::new(0, 0, $cw, $ch)
  $g.DrawImage($source, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()
  $final.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
  Write-Output "Wrote $outPath (${cw}x${ch})"
  $final.Dispose()
}

function Copy-Region($source, $top, $height) {
  $slice = New-Object System.Drawing.Bitmap $source.Width, $height
  $g = [System.Drawing.Graphics]::FromImage($slice)
  $g.Clear([System.Drawing.Color]::Transparent)
  $srcRect = [System.Drawing.Rectangle]::new(0, $top, $source.Width, $height)
  $dstRect = [System.Drawing.Rectangle]::new(0, 0, $source.Width, $height)
  $g.DrawImage($source, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()
  return $slice
}

$img = [System.Drawing.Bitmap]::FromFile($srcPath)

$iconBmp = Copy-Region $img 0 ($iconEnd + 1)
$iconBounds = Get-ContentBounds $iconBmp
Save-CroppedRegion $iconBmp $iconBounds.MinX $iconBounds.MinY ($iconBounds.MaxX - $iconBounds.MinX + 1) ($iconBounds.MaxY - $iconBounds.MinY + 1) (Join-Path $root "logo-pin.png") 10
$iconBmp.Dispose()

$stackBmp = Copy-Region $img 0 ($wordEnd + 1)
$stackBounds = Get-ContentBounds $stackBmp
Save-CroppedRegion $stackBmp $stackBounds.MinX $stackBounds.MinY ($stackBounds.MaxX - $stackBounds.MinX + 1) ($stackBounds.MaxY - $stackBounds.MinY + 1) (Join-Path $root "logo-stack.png") 12
$stackBmp.Dispose()

$wordTop = 618
$wordH = $wordEnd - $wordTop
$wordBmp = Copy-Region $img $wordTop $wordH
$wordBounds = Get-ContentBounds $wordBmp
Save-CroppedRegion $wordBmp $wordBounds.MinX $wordBounds.MinY ($wordBounds.MaxX - $wordBounds.MinX + 1) ($wordBounds.MaxY - $wordBounds.MinY + 1) (Join-Path $root "logo-wordmark.png") 8
$wordBmp.Dispose()

$fullBounds = Get-ContentBounds $img
Save-CroppedRegion $img $fullBounds.MinX $fullBounds.MinY ($fullBounds.MaxX - $fullBounds.MinX + 1) ($fullBounds.MaxY - $fullBounds.MinY + 1) (Join-Path $root "logo-full.png") 8

$img.Dispose()
