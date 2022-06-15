{
  "targets": [
    {
      "target_name": "metrics",
      "sources": [ "src/metrics/main.cpp" ],
      "include_dirs": [
           "src",
           "<!(node -e \"require('nan')\")"
        ],
    }
  ],
}