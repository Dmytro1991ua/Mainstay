import { debounce } from "lodash";
import { useEffect, useState } from "react";

export const useDebounce = <T>(value: T, ms: number): T => {
  const [deferred, setDeferred] = useState(value);

  const apply = debounce((v: T) => setDeferred(v), ms);

  useEffect(() => {
    apply(value);

    return apply.cancel;
  }, [value, apply]);

  return deferred;
};
