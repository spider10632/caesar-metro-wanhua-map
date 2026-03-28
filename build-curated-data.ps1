$ErrorActionPreference = "Stop"

$workspace = Split-Path -Parent $MyInvocation.MyCommand.Path
$sourcePath = Join-Path $workspace "wanhua_poi_database_v3.json"
$outputJsonPath = Join-Path $workspace "wanhua_poi_curated.json"
$outputJsPath = Join-Path $workspace "wanhua_poi_curated.data.js"

$curationJson = @'
{
  "updates": {
    "wanhua_006": {
      "map_label_name": "\u7cd6\u5ecd\u6587\u5316\u516c\u5712",
      "notes": "\u7d19\u672c\u5730\u5716\u6a19\u793a\u70ba\u300e\u7cd6\u5ecd\u6587\u5316\u516c\u5712\u300f\uff1b\u6b63\u5f0f\u540d\u7a31\u70ba\u300e\u7cd6\u5ecd\u6587\u5316\u5712\u5340\u300f",
      "source_status": "paper_map_corrected"
    },
    "wanhua_025": {
      "map_label_name": "\u9054\u4eba\u8c46\u6f3f",
      "name_zh": "\u9054\u4eba\u8c46\u6f3f\u5927\u738b",
      "name_en": "Daren Soy Milk King",
      "google_maps_url": "https://www.google.com/maps/search/?api=1&query=%E9%81%94%E4%BA%BA%E8%B1%86%E6%BC%BF%E5%A4%A7%E7%8E%8B",
      "address_zh": "\u53f0\u5317\u5e02\u842c\u83ef\u5340\u897f\u5712\u8def\u4e00\u6bb5314-2\u865f",
      "phone": "02-2336-8778",
      "opening_hours": "24 hours",
      "notes": "\u539f\u8cc7\u6599\u7591\u4f3c\u8aa4\u6293\u7d19\u672c\u5730\u5716\u7b2c\u4e09\u884c\u65e5\u6587\u300e\u8c46\u4e73\u300f\uff1b\u4f9d\u7d19\u672c\u4f4d\u7f6e\u8207\u5468\u908a\u73fe\u6709\u5e97\u5bb6\u8cc7\u8a0a\uff0c\u66ab\u4ee5\u300e\u9054\u4eba\u8c46\u6f3f\u5927\u738b\u300f\u5c0d\u61c9",
      "source_status": "partially_verified",
      "source_url": "https://spot.line.me/detail/486247019371828921",
      "is_active": true
    }
  },
  "additions": [
    {
      "id": "wanhua_046",
      "map_label_name": "\u6636\u9d3b\u9eb5\u9ede",
      "name_zh": "\u6636\u9d3b\u9eb5\u9ede",
      "name_en": "Chang Hung Noodles",
      "primary_category": "\u9910\u98f2",
      "subcategory": "\u5348\u9910",
      "business_type": "restaurant",
      "meal_tags": ["\u5348\u9910"],
      "google_maps_url": "https://www.google.com/maps/search/?api=1&query=%E6%98%B6%E9%B4%BB%E9%BA%B5%E9%BB%9E",
      "address_zh": "\u53f0\u5317\u5e02\u842c\u83ef\u5340\u83ef\u897f\u885715\u865f171\u865f\u6524",
      "phone": "",
      "opening_hours": "\u9031\u4e00\u81f3\u9031\u4e94 12:00-18:00\uff1b\u9031\u516d\u81f3\u9031\u65e5\u4f11\u606f",
      "near_mrt": "\u9f8d\u5c71\u5bfa\u7ad9",
      "notes": "\u7d19\u672c\u5730\u5716\u88dc\u9f4a\uff1b\u7c73\u5176\u6797\u6307\u5357\u5fc5\u6bd4\u767b\u63a8\u4ecb",
      "source_status": "verified",
      "source_url": "https://guide.michelin.com/tw/zh_TW/taipei-region/taipei/restaurant/chang-hung-noodles",
      "is_active": true,
      "display_order": 17.1
    },
    {
      "id": "wanhua_047",
      "map_label_name": "\u6e90\u82b3\u5208\u5305",
      "name_zh": "\u6e90\u82b3\u5208\u5305",
      "name_en": "Yuan Fang Guabao",
      "primary_category": "\u9910\u98f2",
      "subcategory": "\u5348\u9910",
      "business_type": "restaurant",
      "meal_tags": ["\u5348\u9910", "\u665a\u9910"],
      "google_maps_url": "https://www.google.com/maps/search/?api=1&query=%E6%BA%90%E8%8A%B3%E5%88%88%E5%8C%85",
      "address_zh": "\u53f0\u5317\u5e02\u842c\u83ef\u5340\u83ef\u897f\u885717-2\u865f161\u865f\u6524",
      "phone": "02-2381-0249",
      "opening_hours": "\u9031\u4e8c\u81f3\u9031\u65e5 11:30-20:00\uff1b\u9031\u4e00\u4f11\u606f",
      "near_mrt": "\u9f8d\u5c71\u5bfa\u7ad9",
      "notes": "\u7d19\u672c\u5730\u5716\u88dc\u9f4a\uff1b\u7c73\u5176\u6797\u6307\u5357\u5fc5\u6bd4\u767b\u63a8\u4ecb",
      "source_status": "verified",
      "source_url": "https://guide.michelin.com/tw/zh_TW/taipei-region/taipei/restaurant/yuan-fang-guabao",
      "is_active": true,
      "display_order": 17.2
    },
    {
      "id": "wanhua_048",
      "map_label_name": "\u5c0f\u738b\u716e\u74dc",
      "name_zh": "\u5c0f\u738b\u716e\u74dc",
      "name_en": "Wang's Broth",
      "primary_category": "\u9910\u98f2",
      "subcategory": "\u5348\u9910",
      "business_type": "restaurant",
      "meal_tags": ["\u5348\u9910", "\u665a\u9910"],
      "google_maps_url": "https://www.google.com/maps/search/?api=1&query=%E5%B0%8F%E7%8E%8B%E7%85%AE%E7%93%9C",
      "address_zh": "\u53f0\u5317\u5e02\u842c\u83ef\u5340\u83ef\u897f\u885717-4\u865f153\u865f\u6524",
      "phone": "02-2370-7118",
      "opening_hours": "\u9031\u4e00\u3001\u9031\u4e09\u81f3\u9031\u65e5 09:00-20:00\uff1b\u9031\u4e8c\u4f11\u606f",
      "near_mrt": "\u9f8d\u5c71\u5bfa\u7ad9",
      "notes": "\u7d19\u672c\u5730\u5716\u88dc\u9f4a\uff1b\u7c73\u5176\u6797\u6307\u5357\u5fc5\u6bd4\u767b\u63a8\u4ecb",
      "source_status": "verified",
      "source_url": "https://guide.michelin.com/tw/zh_TW/taipei-region/taipei/restaurant/hsiao-wang-steamed-minced-pork-with-pickles-in-broth",
      "is_active": true,
      "display_order": 17.3
    }
  ]
}
'@

$curation = $curationJson | ConvertFrom-Json
$source = Get-Content -Raw -Encoding UTF8 $sourcePath | ConvertFrom-Json
$patched = New-Object System.Collections.Generic.List[object]

foreach ($item in $source) {
  $row = [ordered]@{}
  foreach ($prop in $item.PSObject.Properties) {
    if ($prop.Name -eq "meal_tags") {
      $row[$prop.Name] = @($prop.Value)
    } else {
      $row[$prop.Name] = $prop.Value
    }
  }

  $update = $curation.updates.PSObject.Properties | Where-Object { $_.Name -eq $item.id } | Select-Object -ExpandProperty Value -First 1
  if ($update) {
    foreach ($prop in $update.PSObject.Properties) {
      $row[$prop.Name] = $prop.Value
    }
  }

  $patched.Add([pscustomobject]$row)
}

foreach ($addition in $curation.additions) {
  $patched.Add([pscustomobject]$addition)
}

$sorted = $patched | Sort-Object { [double]$_.display_order }, id
$json = $sorted | ConvertTo-Json -Depth 8
[System.IO.File]::WriteAllText($outputJsonPath, $json, [System.Text.UTF8Encoding]::new($false))
[System.IO.File]::WriteAllText($outputJsPath, "window.WANHUA_POI_DATA = $json;", [System.Text.UTF8Encoding]::new($false))

Write-Output "Created curated data with $($sorted.Count) records."
