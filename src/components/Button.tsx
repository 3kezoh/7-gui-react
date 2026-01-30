import { cn } from "../utils";

type ButtonProps = React.ComponentPropsWithoutRef<"button">;

export function Button(props: ButtonProps) {
	const { className, disabled, type, ...rest } = props;

	const buttonClassName = cn(
		"border px-2",
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
			type={type ?? "button"}
			{...rest}
		/>
	);
}
