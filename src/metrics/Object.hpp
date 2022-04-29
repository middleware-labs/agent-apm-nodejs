#pragma once

#include <nan.h>
#include <stdint.h>
#include <string>
#include <uv.h>
#include <vector>


namespace melt {
  class Object {
    public:
      Object();
      Object(v8::Local<v8::Object> target);

      void set(std::string key, std::string value);
      void set(std::string key, uint64_t value);
      void set(std::string key, v8::Local<v8::Object> value);
      void set(std::string key, Object value);
      void set(std::string key, std::vector<Object> value);
      void set(std::string key, Nan::FunctionCallback value);

      v8::Local<v8::Object> to_json();
    private:
      v8::Local<v8::Object> target_;
  };

  Object::Object() {
    target_ = Nan::New<v8::Object>();
  }

  Object::Object(v8::Local<v8::Object> target) {
    target_ = target;
  }

  void Object::set(std::string key, std::string value) {
    Nan::Set(
      target_,
      Nan::New(key).ToLocalChecked(),
      Nan::New(value).ToLocalChecked()
    );
  }

  void Object::set(std::string key, uint64_t value) {
    Nan::Set(
      target_,
      Nan::New(key).ToLocalChecked(),
      Nan::New<v8::Number>(static_cast<double>(value))
    );
  }

  void Object::set(std::string key, v8::Local<v8::Object> value) {
    Nan::Set(
      target_,
      Nan::New(key).ToLocalChecked(),
      value
    );
  }

  void Object::set(std::string key, Object value) {
    Nan::Set(
      target_,
      Nan::New(key).ToLocalChecked(),
      value.to_json()
    );
  }

  void Object::set(std::string key, std::vector<Object> value) {
    v8::Local<v8::Array> array = Nan::New<v8::Array>(value.size());

    for (unsigned int i = 0; i < array->Length(); i++) {
      Nan::Set(array, i, value.at(i).to_json());
    }

    Nan::Set(
      target_,
      Nan::New(key).ToLocalChecked(),
      array
    );
  }


  void Object::set(std::string key, Nan::FunctionCallback value) {
    Nan::Set(
      target_,
      Nan::New(key).ToLocalChecked(),
      Nan::GetFunction(Nan::New<v8::FunctionTemplate>(value)).ToLocalChecked()
    );
  }

  v8::Local<v8::Object> Object::to_json() {
    return target_;
  }
}
