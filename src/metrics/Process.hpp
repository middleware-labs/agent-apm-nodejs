#include <uv.h>

#include "Object.hpp"

namespace melt {
  class Process {
    public:
      void inject(Object carrier);
    private:
      uv_rusage_t usage_;
      virtual uint64_t getUsages(uv_timeval_t timeval);
  };

  void Process::inject(Object carrier) {
    uv_rusage_t usage;
    uv_getrusage(&usage);

    Object cpu;

    cpu.set("user", getUsages(usage.ru_utime) - getUsages(usage_.ru_utime));
    cpu.set("system", getUsages(usage.ru_stime) - getUsages(usage_.ru_stime));

    carrier.set("cpu", cpu);

    usage_ = usage;
  }

  uint64_t Process::getUsages(uv_timeval_t timeval) {
      return timeval.tv_sec * 1000 * 1000 + timeval.tv_usec;
  }
}
