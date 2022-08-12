import { MouseEventHandler } from "react";

interface Props {
	label: string;
	className?: string;
	checked?: boolean;
	disabled?: boolean;
	onClick?: MouseEventHandler<HTMLInputElement>;
	children?: any;
}

export default function ToggleSwitch({ label, className, checked, disabled, onClick, children }: Props) {
	const inputId = `toggle-${label.toLowerCase().replaceAll(' ', '-')}`;

	return (
		<div title={label} className={`flex gap-2 justify-between items-center ${className}`}>
			<input
				alt={label}
				id={inputId}
				type='checkbox'
				disabled={disabled}
				className='absolute peer hidden'
				onClick={onClick}
				defaultChecked={checked}
			/>
			<label
				title={label}
				htmlFor={inputId}
				className='peer-enabled:cursor-pointer'
			>
				{children || label}
			</label>
			<label
				title={label}
				htmlFor={inputId}
				className='
					rounded-full
					peer-enabled:cursor-pointer
					peer-enabled:hover:ring-2
					peer-checked:justify-end 
					peer-enabled:peer-checked:bg-slate-400
					peer-enabled:bg-slate-800
					bg-slate-600
					w-8
					h-4
					flex
					items-center
				'
			>
				<span
					title={disabled ? 'Disabled' : 'Toggle'}
					className='rounded-full h-4 w-4'
					style={{ backgroundColor: disabled ? 'slategrey' : 'white' }}
				/>
			</label>
		</div>
	)
}