import {
  ReactNode,
  useId,
  Children,
  isValidElement,
  cloneElement,
} from "react";

export interface LabelForProps {
  label: string;
  children: ReactNode;
}

export function LabelFor({ label, children }: LabelForProps) {
  const id = useId();
  console.log(id);

  const childrenWithId = Children.map(children, (child) => {
    if (isValidElement(child)) {
      // @ts-ignore
      return cloneElement(child, { id });
    }
    return child;
  });
  return (
    <>
      <label htmlFor={id} className="basis-1/2">
        {label}
      </label>
      <div className="basis-1/2 text-right ">{childrenWithId}</div>
    </>
  );
}
