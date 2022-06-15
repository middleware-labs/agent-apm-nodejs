#pragma once

#include <stdint.h>
#include <uv.h>

#include "Process.hpp"

namespace melt {
  class EventLoop  {
    public:
      explicit EventLoop(v8::Isolate* isolate);

      Process process;

      void inject(Object carrier);


  };

  EventLoop::EventLoop(v8::Isolate* isolate) {


  }
  void EventLoop::inject(Object carrier) {
  }

}
