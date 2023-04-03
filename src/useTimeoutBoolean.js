import { useEffect, useState } from 'react';

function useTimeoutBoolean(ms = 0) {
  const [bool, setBoolean] = useState(false);

  useEffect(() => {
    if (bool) {
      const timeoutId = setTimeout(() => {
        setBoolean(false);
      }, ms);
      return () => clearTimeout(timeoutId);
    }
  }, [bool, ms]);

  return [bool, setBoolean];
}

export default useTimeoutBoolean;
