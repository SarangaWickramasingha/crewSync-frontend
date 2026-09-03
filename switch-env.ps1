$active = ".env"
$local = ".env.local"
$prod = ".env.production"

if (!(Test-Path $local) -or !(Test-Path $prod)) {
    Write-Host "Missing .env.local or .env.production" -ForegroundColor Red
    exit 1
}

if (!(Test-Path $active)) {
    # No .env exists, start with local
    Copy-Item $local $active
    Write-Host "[LOCAL] Copied .env.local -> .env" -ForegroundColor Green
} else {
    $current = (Select-String -Path $active -Pattern '^NEXT_PUBLIC_API_BASE=' | Select-Object -First 1).Line
    $localFirst = (Select-String -Path $local -Pattern '^NEXT_PUBLIC_API_BASE=' | Select-Object -First 1).Line

    if ($current -eq $localFirst) {
        # Currently local -> switch to production
        Copy-Item $prod $active -Force
        Write-Host "[PRODUCTION] Copied .env.production -> .env" -ForegroundColor Red
    } else {
        # Currently production -> switch to local
        Copy-Item $local $active -Force
        Write-Host "[LOCAL] Copied .env.local -> .env" -ForegroundColor Green
    }
}
