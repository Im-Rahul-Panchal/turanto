<#
.SYNOPSIS
  Renders the placeholder artwork described by scripts/placeholders.manifest.json.

.DESCRIPTION
  Turanto ships without final photography, so the UI needs real image files to
  lay out against. This script produces consistent, on-brand placeholder tiles
  (gradient + label, or gradient + glyph) so the app is fully functional and
  visually complete today. Dropping in real artwork later is a straight file
  swap â€” no code changes, because every component reads paths from the central
  asset map.

  Re-run after editing the manifest:
      powershell -ExecutionPolicy Bypass -File scripts/generate-placeholders.ps1

.NOTES
  Requires Windows PowerShell with System.Drawing (built into Windows).
#>
[CmdletBinding()]
param(
  [string]$ManifestPath = '',
  [switch]$Force
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

# $PSScriptRoot is not reliably populated inside a param default, so resolve here.
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if ([string]::IsNullOrWhiteSpace($ManifestPath)) {
  $ManifestPath = Join-Path $scriptDir 'placeholders.manifest.json'
}

$repoRoot = Split-Path -Parent $scriptDir
$manifest = Get-Content -LiteralPath $ManifestPath -Raw -Encoding UTF8 | ConvertFrom-Json

$textFont = 'Segoe UI'
$emojiFont = 'Segoe UI Emoji'

function New-Brush([string]$hex) {
  $hex = $hex.TrimStart('#')
  return [System.Drawing.Color]::FromArgb(
    255,
    [Convert]::ToInt32($hex.Substring(0, 2), 16),
    [Convert]::ToInt32($hex.Substring(2, 2), 16),
    [Convert]::ToInt32($hex.Substring(4, 2), 16)
  )
}

function New-Canvas([int]$w, [int]$h, [string]$bg) {
  $bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $g.Clear((New-Brush $bg))
  return @{ Bitmap = $bmp; Graphics = $g }
}

function Fill-VerticalGradient($g, [int]$w, [int]$h, [string]$from, [string]$to, [float]$angle = 90) {
  $rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, (New-Brush $from), (New-Brush $to), $angle)
  $g.FillRectangle($brush, $rect)
  $brush.Dispose()
}

function Add-SoftCircle($g, [float]$cx, [float]$cy, [float]$r, [int]$alpha) {
  $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb($alpha, 255, 255, 255))
  $g.FillEllipse($brush, ($cx - $r), ($cy - $r), ($r * 2), ($r * 2))
  $brush.Dispose()
}

function Add-Ring($g, [float]$cx, [float]$cy, [float]$r, [int]$alpha, [float]$thickness) {
  $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb($alpha, 255, 255, 255), $thickness)
  $g.DrawEllipse($pen, ($cx - $r), ($cy - $r), ($r * 2), ($r * 2))
  $pen.Dispose()
}

# Splits text into at most $maxLines lines that fit $maxWidth, using real metrics.
function Split-Lines($g, [string]$text, $font, [float]$maxWidth, [int]$maxLines) {
  $words = $text -split '\s+'
  $lines = New-Object System.Collections.Generic.List[string]
  $current = ''

  foreach ($word in $words) {
    $candidate = if ($current -eq '') { $word } else { "$current $word" }
    $w = $g.MeasureString($candidate, $font).Width
    if ($w -le $maxWidth -or $current -eq '') {
      $current = $candidate
    }
    else {
      $lines.Add($current)
      $current = $word
      if ($lines.Count -ge $maxLines) { break }
    }
  }
  if ($current -ne '' -and $lines.Count -lt $maxLines) { $lines.Add($current) }
  # Comma-wrapped so PowerShell hands the list back intact instead of unrolling it.
  return , $lines
}

function Draw-CenteredText($g, [string[]]$lines, $font, [System.Drawing.Brush]$brush, [float]$centerX, [float]$startY, [float]$lineHeight) {
  $format = New-Object System.Drawing.StringFormat
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $format.LineAlignment = [System.Drawing.StringAlignment]::Center
  for ($i = 0; $i -lt $lines.Count; $i++) {
    $rect = New-Object System.Drawing.RectangleF(0, ($startY + ($i * $lineHeight)), $g.ClipBounds.Width, $lineHeight)
    $g.DrawString($lines[$i], $font, $brush, $rect, $format)
  }
  $format.Dispose()
}

function Draw-CenteredGlyph($g, [string]$glyph, [float]$centerX, [float]$centerY, [float]$size) {
  $font = New-Object System.Drawing.Font($emojiFont, $size, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $format = New-Object System.Drawing.StringFormat
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $format.LineAlignment = [System.Drawing.StringAlignment]::Center
  $rect = New-Object System.Drawing.RectangleF(0, $centerY, $g.ClipBounds.Width, $size)
  $g.DrawString($glyph, $font, [System.Drawing.Brushes]::White, $rect, $format)
  $font.Dispose()
  $format.Dispose()
}

function Get-Kind([string]$path) {
  $folder = ($path -split '/')[0]
  switch ($folder) {
    'products' { return 'product' }
    'categories' { return 'category' }
    'banners' { return 'banner' }
    'offers' { return 'offer' }
    'illustrations' { return 'illustration' }
    'avatars' { return 'avatar' }
    default { return 'placeholder' }
  }
}

function Get-Size([string]$kind) {
  switch ($kind) {
    'product' { return @(600, 600) }
    'category' { return @(480, 480) }
    'banner' { return @(1200, 640) }
    'offer' { return @(840, 620) }
    'illustration' { return @(720, 560) }
    'avatar' { return @(256, 256) }
    default { return @(400, 400) }
  }
}

$created = 0
$skipped = 0

foreach ($item in $manifest.items) {
  $path = [string]$item[0]
  $tintName = [string]$item[1]
  $label = [string]$item[2]
  $glyph = if ($item.Count -gt 3) { [string]$item[3] } else { '' }

  $tint = $manifest.tints.$tintName
  $from = [string]$tint[0]
  $to = [string]$tint[1]
  $fg = [string]$tint[2]

  $target = Join-Path (Join-Path $repoRoot 'assets\images') ($path -replace '/', '\')

  if ((Test-Path -LiteralPath $target) -and -not $Force) { $skipped++; continue }

  $dir = Split-Path -Parent $target
  if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }

  $kind = Get-Kind $path
  $size = Get-Size $kind
  $w = $size[0]
  $h = $size[1]

  $canvas = New-Canvas $w $h $from
  $bmp = $canvas.Bitmap
  $g = $canvas.Graphics

  if ($kind -eq 'product') {
    # Soft vertical wash with a bright disc, so a grid of tiles reads as one set.
    Fill-VerticalGradient $g $w $h $from $to 90
    Add-SoftCircle $g ($w * 0.5) ($h * 0.44) ($w * 0.36) 70
    Add-Ring $g ($w * 0.5) ($h * 0.44) ($w * 0.30) 60 3

    $tileFontSize = 56
    if ($label.Length -gt 9) { $tileFontSize = 44 }
    $font = New-Object System.Drawing.Font($textFont, $tileFontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $brush = New-Object System.Drawing.SolidBrush((New-Brush $fg))
    $tileLines = Split-Lines $g $label $font ($w * 0.82) 2
    $lineHeight = $tileFontSize * 1.18
    $totalHeight = $tileLines.Count * $lineHeight
    Draw-CenteredText $g $tileLines.ToArray() $font $brush 0 ($h * 0.44 - ($totalHeight / 2) + ($lineHeight / 2)) $lineHeight
    $brush.Dispose()
    $font.Dispose()
  }
  elseif ($kind -eq 'category') {
    Fill-VerticalGradient $g $w $h $from $to 45
    Add-SoftCircle $g ($w * 0.5) ($h * 0.42) ($w * 0.34) 60

    if ($glyph) { Draw-CenteredGlyph $g $glyph 0 ($h * 0.42 - ($w * 0.19)) ($w * 0.38) }

    $catFontSize = 34
    $font = New-Object System.Drawing.Font($textFont, $catFontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $brush = New-Object System.Drawing.SolidBrush((New-Brush $fg))
    $catLines = Split-Lines $g $label $font ($w * 0.86) 2
    $lineHeight = $catFontSize * 1.2
    $totalHeight = $catLines.Count * $lineHeight
    Draw-CenteredText $g $catLines.ToArray() $font $brush 0 ($h * 0.78 - ($totalHeight / 2) + ($lineHeight / 2)) $lineHeight
    $brush.Dispose()
    $font.Dispose()
  }
  elseif ($kind -eq 'banner' -or $kind -eq 'offer') {
    $isBanner = ($kind -eq 'banner')
    $angle = 40
    if ($isBanner) { $angle = 25 }
    Fill-VerticalGradient $g $w $h $from $to $angle

    # Decorative geometry lives on the right; all copy is left-aligned.
    Add-SoftCircle $g ($w * 0.84) ($h * 0.22) ($h * 0.42) 40
    Add-Ring $g ($w * 0.84) ($h * 0.22) ($h * 0.34) 55 4
    Add-SoftCircle $g ($w * 0.66) ($h * 0.86) ($h * 0.24) 32

    if ($glyph) {
      $glyphSize = $h * 0.26
      $titleSize = 54
      $subSize = 26
      if ($isBanner) { $glyphSize = $h * 0.34; $titleSize = 68; $subSize = 32 }

      $font = New-Object System.Drawing.Font($emojiFont, $glyphSize, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
      $format = New-Object System.Drawing.StringFormat
      $format.Alignment = [System.Drawing.StringAlignment]::Center
      $format.LineAlignment = [System.Drawing.StringAlignment]::Center
      $rect = New-Object System.Drawing.RectangleF(($w * 0.60), ($h * 0.5 - ($glyphSize / 2)), ($w * 0.40), $glyphSize)
      $g.DrawString($glyph, $font, [System.Drawing.Brushes]::White, $rect, $format)
      $font.Dispose()
      $format.Dispose()
    }
    else {
      $titleSize = 54
      $subSize = 26
      if ($isBanner) { $titleSize = 68; $subSize = 32 }
    }

    $leftPad = $w * 0.075
    $maxTextWidth = $w * 0.52

    $titleFont = New-Object System.Drawing.Font($textFont, $titleSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $titleBrush = New-Object System.Drawing.SolidBrush((New-Brush $fg))
    $titleLines = Split-Lines $g $label $titleFont $maxTextWidth 2
    $titleLineHeight = $titleSize * 1.12
    $blockTop = $h * 0.5 - (($titleLines.Count * $titleLineHeight) + ($subSize * 1.5)) / 2

    $leftFormat = New-Object System.Drawing.StringFormat
    $leftFormat.Alignment = [System.Drawing.StringAlignment]::Near
    $leftFormat.LineAlignment = [System.Drawing.StringAlignment]::Center
    for ($i = 0; $i -lt $titleLines.Count; $i++) {
      $rect = New-Object System.Drawing.RectangleF($leftPad, ($blockTop + ($i * $titleLineHeight)), $maxTextWidth, $titleLineHeight)
      $g.DrawString($titleLines[$i], $titleFont, $titleBrush, $rect, $leftFormat)
    }

    $subFont = New-Object System.Drawing.Font($textFont, $subSize, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $subBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(215, 255, 255, 255))
    $subRect = New-Object System.Drawing.RectangleF($leftPad, ($blockTop + ($titleLines.Count * $titleLineHeight) + ($subSize * 0.4)), $maxTextWidth, ($subSize * 1.5))
    $g.DrawString('Turanto', $subFont, $subBrush, $subRect, $leftFormat)

    $leftFormat.Dispose()
    $titleBrush.Dispose()
    $titleFont.Dispose()
    $subBrush.Dispose()
    $subFont.Dispose()
  }
  elseif ($kind -eq 'illustration') {
    # Light, airy backdrop: empty states should feel calm, not alarming.
    Fill-VerticalGradient $g $w $h $from $to 60
    Add-SoftCircle $g ($w * 0.5) ($h * 0.44) ($w * 0.26) 110
    Add-Ring $g ($w * 0.5) ($h * 0.44) ($w * 0.22) 90 4

    if ($glyph) { Draw-CenteredGlyph $g $glyph 0 ($h * 0.44 - ($w * 0.14)) ($w * 0.28) }

    $illFontSize = 40
    $font = New-Object System.Drawing.Font($textFont, $illFontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $brush = New-Object System.Drawing.SolidBrush((New-Brush $fg))
    $illLines = Split-Lines $g $label $font ($w * 0.80) 2
    $lineHeight = $illFontSize * 1.2
    $totalHeight = $illLines.Count * $lineHeight
    Draw-CenteredText $g $illLines.ToArray() $font $brush 0 ($h * 0.80 - ($totalHeight / 2) + ($lineHeight / 2)) $lineHeight
    $brush.Dispose()
    $font.Dispose()
  }
  elseif ($kind -eq 'avatar') {
    $g.Dispose()
    $bmp.Dispose()
    # A circular avatar needs a real alpha channel.
    $bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.Clear([System.Drawing.Color]::Transparent)

    $path2d = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path2d.AddEllipse(0, 0, $w, $h)
    $gradient = New-Object System.Drawing.Drawing2D.LinearGradientBrush((New-Object System.Drawing.Rectangle(0, 0, $w, $h)), (New-Brush $from), (New-Brush $to), 45)
    $g.FillPath($gradient, $path2d)
    $gradient.Dispose()
    $path2d.Dispose()

    $font = New-Object System.Drawing.Font($textFont, ($h * 0.44), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center
    $rect = New-Object System.Drawing.RectangleF(0, 0, $w, $h)
    $g.DrawString($label, $font, [System.Drawing.Brushes]::White, $rect, $format)
    $font.Dispose()
    $format.Dispose()
  }
  else {
    Fill-VerticalGradient $g $w $h $from $to 45
    Add-Ring $g ($w * 0.5) ($h * 0.5) ($w * 0.30) 60 4
    $fontSize = 44
    $font = New-Object System.Drawing.Font($textFont, $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 255, 255, 255))
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center
    $rect = New-Object System.Drawing.RectangleF(0, 0, $w, $h)
    $g.DrawString($label, $font, $brush, $rect, $format)
    $brush.Dispose()
    $font.Dispose()
    $format.Dispose()
  }


  $g.Dispose()
  $bmp.Save($target, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  $created++
}

Write-Output "Placeholders ready: $created generated, $skipped already present."
