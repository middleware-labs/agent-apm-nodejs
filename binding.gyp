{
  "targets": [
    {
     "target_name" : "eventLoopStats",
	 "sources"     : [ "src/metrics/eventLoopStats.cc" ],
      "include_dirs": [
           "src",
           "<!(node -e \"require('nan')\")"
        ],
    }
  ],
}