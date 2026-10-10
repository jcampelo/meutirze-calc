param(
  [switch]$SkipPwaValidation
)

$ErrorActionPreference = "Stop"

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$keystorePath = Join-Path $projectRoot "android.keystore"
$assetLinksPath = Join-Path $projectRoot "assetlinks.json"
$publicWellKnown = Join-Path $projectRoot "public\.well-known"
$publicAssetLinks = Join-Path $publicWellKnown "assetlinks.json"
$javaHome = "C:\Users\campe\.bubblewrap\jdk\jdk-17.0.11+9"
$keytool = Join-Path $javaHome "bin\keytool.exe"

function Convert-SecureStringToPlainText {
  param([securestring]$SecureValue)

  $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecureValue)
  try {
    [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
  }
  finally {
    if ($ptr -ne [IntPtr]::Zero) {
      [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
    }
  }
}

if (!(Test-Path $keystorePath)) {
  throw "Keystore nao encontrado em: $keystorePath"
}

Push-Location $projectRoot
try {
  $storePasswordSecure = Read-Host "Senha do Key Store" -AsSecureString
  $keyPasswordSecure = Read-Host "Senha da Key" -AsSecureString

  $storePassword = Convert-SecureStringToPlainText $storePasswordSecure
  $keyPassword = Convert-SecureStringToPlainText $keyPasswordSecure

  try {
    $env:JAVA_HOME = $javaHome
    $env:BUBBLEWRAP_KEYSTORE_PASSWORD = $storePassword
    $env:BUBBLEWRAP_KEY_PASSWORD = $keyPassword

    $buildArgs = @("build")
    if ($SkipPwaValidation) {
      $buildArgs += "--skipPwaValidation"
    }

    & bubblewrap.cmd @buildArgs
    if ($LASTEXITCODE -ne 0) {
      throw "bubblewrap build falhou com exit code $LASTEXITCODE"
    }

    $keytoolOutput = & $keytool -list -v -keystore $keystorePath -alias android -storepass $storePassword -keypass $keyPassword 2>&1
    if ($LASTEXITCODE -ne 0) {
      throw "Falha ao ler o fingerprint da chave: $keytoolOutput"
    }

    $shaLine = $keytoolOutput | Where-Object { $_ -match "SHA256:" } | Select-Object -First 1
    if (!$shaLine) {
      throw "Nao foi possivel encontrar SHA256 no keytool."
    }

    $fingerprint = ($shaLine -replace ".*SHA256:\s*", "").Trim()
    $currentFingerprints = (& bubblewrap.cmd fingerprint list 2>&1) -join "`n"
    if ($currentFingerprints -notmatch [regex]::Escape($fingerprint)) {
      & bubblewrap.cmd fingerprint add $fingerprint --name upload-key
      if ($LASTEXITCODE -ne 0) {
        throw "Falha ao adicionar fingerprint no twa-manifest.json"
      }
    }

    & bubblewrap.cmd fingerprint generateAssetLinks
    if ($LASTEXITCODE -ne 0) {
      throw "Falha ao gerar assetlinks.json"
    }

    New-Item -ItemType Directory -Force -Path $publicWellKnown | Out-Null
    Copy-Item -Path $assetLinksPath -Destination $publicAssetLinks -Force

    Write-Host ""
    Write-Host "OK: App Bundle assinado: app-release-bundle.aab"
    Write-Host "OK: APK assinado para teste: app-release-signed.apk"
    Write-Host "OK: Digital Asset Links copiado para: public\.well-known\assetlinks.json"
    Write-Host ""
    Write-Host "Depois do primeiro upload na Play Console, copie tambem o SHA-256 da App signing key"
    Write-Host "e adicione em public\.well-known\assetlinks.json antes do release publico."
  }
  finally {
    Remove-Item Env:\BUBBLEWRAP_KEYSTORE_PASSWORD -ErrorAction SilentlyContinue
    Remove-Item Env:\BUBBLEWRAP_KEY_PASSWORD -ErrorAction SilentlyContinue
    $storePassword = $null
    $keyPassword = $null
  }
}
finally {
  Pop-Location
}
