#include <uv.h>

#include "Object.hpp"

namespace melt {
  class Heap {
    public:
      void inject(Object carrier);
    private:
  };

  void Heap::inject(Object carrier) {
    uv_rusage_t usage;
    uv_getrusage(&usage);

    Object cpu;

    cpu.set("user", getUsages(usage.ru_utime) - getUsages(usage_.ru_utime));
    cpu.set("system", getUsages(usage.ru_stime) - getUsages(usage_.ru_stime));

    carrier.set("cpu", cpu);

  }


}
