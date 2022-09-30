import { useEffect, useRef } from "react";

const useCloseModal = (open: boolean, setOpen: (value: boolean) => void) => {
  const ref = useRef<HTMLUListElement>(null);

  // TODO: correct type of target
  useEffect(() => {
    const checkIfClickedOutside = (event: { target: any }) => {
      if (open && ref.current && !ref.current.contains(event.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () =>
      document.removeEventListener("mousedown", checkIfClickedOutside);
  }, [open, setOpen]);
  return ref;
};

export default useCloseModal;
