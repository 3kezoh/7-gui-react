import { cn } from "../utils";

type ButtonProps = React.ComponentPropsWithoutRef<"button">;

export function Button(props: ButtonProps) {
  const { className, disabled, ...rest } = props;

  const buttonClassName = cn("border border-black px-2", className, {
    "cursor-not-allowed": disabled,
  });

  return (
    <button
      className={buttonClassName}
      disabled={disabled}
      type="button"
      {...rest}
    />
  );
}
