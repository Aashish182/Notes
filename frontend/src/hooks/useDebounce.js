import { useState, useEffect } from "react";

// Delays updating the value until the user stops typing
const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // cleanup on re-render
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;