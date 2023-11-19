import { cn } from "../utils";

type ButtonProps = React.ComponentPropsWithoutRef<"button">;

export function Button(props: ButtonProps) {
  const { className, disabled, ...rest } = props;

  const buttonClassName = cn(
    "border border-black px-2",
    className,
    {
      "transition-colors hover:text-white hover:bg-black": !disabled,
    },
    {
      "cursor-not-allowed bg-gray-200 text-gray-400 border-gray-400": disabled,
    },
  );

  return (
    <button
      className={buttonClassName}
      disabled={disabled}
      type="button"
      {...rest}
    />
  );
}
