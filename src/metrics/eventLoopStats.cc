#include <nan.h>

using namespace v8;

const uint32_t maxPossibleUint32 = -1;
const uint64_t maxPossibleUint64 = -1;
const uint32_t minPossibleUint32 = 0;

uv_check_t check_handle;

uint32_t min;
uint32_t max;
uint32_t sum;
uint32_t num;

uint64_t previous_now = maxPossibleUint64;

void reset() {
  min = maxPossibleUint32;
  max = minPossibleUint32;
  sum = 0;
  num = 0;
}

void on_check(uv_check_t* handle) {
  const uint64_t now = uv_hrtime();
  uint32_t duration;
  if (previous_now >= now) {
    duration = 0;
  } else {
     duration = (now - previous_now) / static_cast<uint64_t>(1e6);
  }
  if (duration < min) {
    min = duration;
  }
  if (duration > max) {
    max = duration;
  }
  sum += duration;
  num += 1;
  previous_now = now;
}


static NAN_METHOD(sense) {
  if (num == 0) {
    min = 0;
    max = 0;
  }

  Local<Object> obj = Nan::New<Object>();
  Nan::Set(
    obj,
    Nan::New("min").ToLocalChecked(),
    Nan::New<Number>(static_cast<double>(min))
  );
  Nan::Set(
    obj,
    Nan::New("max").ToLocalChecked(),
    Nan::New<Number>(static_cast<double>(max))
  );
  Nan::Set(
    obj,
    Nan::New("num").ToLocalChecked(),
    Nan::New<Number>(static_cast<double>(num))
  );
  Nan::Set(
    obj,
    Nan::New("sum").ToLocalChecked(),
    Nan::New<Number>(static_cast<double>(sum))
  );

  reset();

  info.GetReturnValue().Set(obj);
}


NAN_MODULE_INIT(init) {
  reset();

  uv_check_init(uv_default_loop(), &check_handle);
  uv_check_start(&check_handle, reinterpret_cast<uv_check_cb>(on_check));
  uv_unref(reinterpret_cast<uv_handle_t*>(&check_handle));

  Nan::Set(target,
    Nan::New("sense").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(sense)).ToLocalChecked()
  );
}

NODE_MODULE(eventLoopStats, init)
