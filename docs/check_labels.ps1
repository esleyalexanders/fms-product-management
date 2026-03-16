$remaining = @()
Get-ChildItem -Recurse -Filter "*.html" | ForEach-Object {
    $text = Get-Content $_.FullName -Raw
    if ($text -match 'nav-section-label') {
        $remaining += $_.FullName
    }
}
if ($remaining.Count -eq 0) {
    Write-Host "All clear - no nav-section-label found."
} else {
    Write-Host "Still has nav-section-label:"
    $remaining | ForEach-Object { Write-Host $_ }
}
