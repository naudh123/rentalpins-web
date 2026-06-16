Add-Type -AssemblyName System.Drawing

$targets = @(
  "c:\RentIt_Dev\apps\RentalPins_Full_web\public\logo\logo-pin.png",
  "c:\RentIt_Dev\apps\RentalPins_Full_web\public\logo\logo-stack.png"
)

foreach ($path in $targets) {
  $bmp = [System.Drawing.Bitmap]::FromFile($path)
  $w = $bmp.Width
  $h = $bmp.Height

  $visited = New-Object "bool[,]" $w, $h
  $q = [System.Collections.Generic.Queue[System.Drawing.Point]]::new()

  function Push-Point([int]$x, [int]$y) {
    if ($x -lt 0 -or $y -lt 0 -or $x -ge $w -or $y -ge $h) { return }
    if ($visited[$x, $y]) { return }
    $visited[$x, $y] = $true
    $q.Enqueue([System.Drawing.Point]::new($x, $y))
  }

  for ($x = 0; $x -lt $w; $x++) {
    Push-Point $x 0
    Push-Point $x ($h - 1)
  }
  for ($y = 0; $y -lt $h; $y++) {
    Push-Point 0 $y
    Push-Point ($w - 1) $y
  }

  while ($q.Count -gt 0) {
    $p = $q.Dequeue()
    $c = $bmp.GetPixel($p.X, $p.Y)
    $isWhiteBg = ($c.A -gt 0) -and ($c.R -ge 242) -and ($c.G -ge 242) -and ($c.B -ge 242)
    if (-not $isWhiteBg) { continue }

    $bmp.SetPixel($p.X, $p.Y, [System.Drawing.Color]::FromArgb(0, $c.R, $c.G, $c.B))
    Push-Point ($p.X + 1) $p.Y
    Push-Point ($p.X - 1) $p.Y
    Push-Point $p.X ($p.Y + 1)
    Push-Point $p.X ($p.Y - 1)
  }

  $tmp = [System.IO.Path]::ChangeExtension($path, ".tmp.png")
  $bmp.Save($tmp, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Move-Item -Path $tmp -Destination $path -Force
  Write-Output "Background removed: $path"
}
