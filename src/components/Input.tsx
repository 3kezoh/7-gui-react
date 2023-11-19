import { cn } from "../utils";

type InputProps = React.ComponentPropsWithoutRef<"input">;

export function Input(props: InputProps) {
  const { className, name, ...rest } = props;
  const inputClassName = cn("border border-black w-full max-w-xs", className);

  return (
    <input
      className={inputClassName}
      type="text"
      id={name}
      name={name}
      {...rest}
    />
  );
}
