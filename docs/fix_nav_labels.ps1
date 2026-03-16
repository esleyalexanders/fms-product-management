$files = Get-ChildItem -Path "." -Recurse -Filter "*.html" | Where-Object { (Select-String -Path $_.FullName -Pattern "nav-section-label" -Quiet) }
foreach ($file in $files) {
    if ($file.Name -eq "home.html") { continue }
    $content = Get-Content $file.FullName -Raw
    $content = $content -replace '<div\s+class="nav-section-label"[^>]*>[^<]*</div>', '<hr class="nav-divider">'
    Set-Content -Path $file.FullName -Value $content -NoNewline
    Write-Host ("Updated: " + $file.FullName)
}
Write-Host "Done."
