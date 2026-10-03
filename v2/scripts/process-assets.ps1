Add-Type -AssemblyName System.Drawing

$brainDir = "C:\Users\john\.gemini\antigravity-ide\brain\cd4372e5-70c9-4bb8-aed3-ef74c05ecfc8"
$assetsDir = "c:\Users\john\Documents\Projetos\deathDate\v2\assets"
$imagesDir = "$assetsDir\images"
$playstoreDir = "$assetsDir\playstore"

if (!(Test-Path $playstoreDir)) {
    New-Item -ItemType Directory -Path $playstoreDir -Force | Out-Null
}

function Resize-Image($srcPath, $dstPath, $newWidth, $newHeight) {
    $srcImg = [System.Drawing.Image]::FromFile($srcPath)
    $dstImg = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
    $graphics = [System.Drawing.Graphics]::FromImage($dstImg)
    
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    
    $graphics.DrawImage($srcImg, 0, 0, $newWidth, $newHeight)
    
    $dstImg.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $graphics.Dispose()
    $dstImg.Dispose()
    $srcImg.Dispose()
    Write-Output "Generated: $dstPath ($newWidth x $newHeight)"
}

function Create-Background($dstPath, $width, $height, $hexColor) {
    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($bmp)
    $color = [System.Drawing.ColorTranslator]::FromHtml($hexColor)
    $brush = New-Object System.Drawing.SolidBrush($color)
    $graphics.FillRectangle($brush, 0, 0, $width, $height)
    $bmp.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $brush.Dispose()
    $graphics.Dispose()
    $bmp.Dispose()
    Write-Output "Generated Background: $dstPath ($width x $height)"
}

$iconSrc = "$brainDir\deathdate_app_icon_1791058318530.jpg"
$featureSrc = "$brainDir\playstore_feature_graphic_1791058336789.jpg"
$ss1Src = "$brainDir\playstore_ss_countdown_1791058360045.jpg"
$ss2Src = "$brainDir\playstore_ss_habits_1791058383048.jpg"
$ss3Src = "$brainDir\playstore_ss_simulator_1791058412989.jpg"
$ss4Src = "$brainDir\playstore_ss_science_1791058444380.jpg"

# 1. Ícones do App
Resize-Image $iconSrc "$imagesDir\icon.png" 512 512
Resize-Image $iconSrc "$playstoreDir\icon-512.png" 512 512
Resize-Image $iconSrc "$imagesDir\android-icon-foreground.png" 432 432
Resize-Image $iconSrc "$imagesDir\splash-icon.png" 256 256
Resize-Image $iconSrc "$imagesDir\favicon.png" 48 48
Create-Background "$imagesDir\android-icon-background.png" 432 432 "#0B0E14"

# 2. Play Store Feature Graphic (1024x500 obrigatório)
Resize-Image $featureSrc "$playstoreDir\feature-graphic-1024x500.png" 1024 500

# 3. Screenshots Play Store (1080x1920)
Resize-Image $ss1Src "$playstoreDir\screenshot-1-countdown-1080x1920.png" 1080 1920
Resize-Image $ss2Src "$playstoreDir\screenshot-2-habits-1080x1920.png" 1080 1920
Resize-Image $ss3Src "$playstoreDir\screenshot-3-simulator-1080x1920.png" 1080 1920
Resize-Image $ss4Src "$playstoreDir\screenshot-4-science-1080x1920.png" 1080 1920

Write-Output "Todos os recursos visuais foram processados com sucesso!"
