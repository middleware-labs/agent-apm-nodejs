#include "EventLoop.hpp"
#include "Object.hpp"

namespace melt {
  namespace {
    static void stats(const v8::FunctionCallbackInfo<v8::Value>& info) {
      EventLoop* data = reinterpret_cast<EventLoop*>(info.Data().As<v8::External>()->Value());

      Object obj;

      data->process.inject(obj);

      info.GetReturnValue().Set(obj.to_json());
    }
  }

  NODE_MODULE_INIT() {
    v8::Isolate* isolate = context->GetIsolate();
    EventLoop* data = new EventLoop(isolate);
    v8::Local<v8::External> external = v8::External::New(isolate, data);

    exports->Set(
      context,
      Nan::New("stats").ToLocalChecked(),
      v8::FunctionTemplate::New(isolate, stats, external)->GetFunction(context).ToLocalChecked()
    ).FromJust();
  }
}


