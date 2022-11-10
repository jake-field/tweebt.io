import { MouseEventHandler } from "react";

interface Props {
	id?: string;
	label?: string;
	className?: string;
	checked?: boolean;
	disabled?: boolean;
	hideLabel?: boolean;
	onClick?: MouseEventHandler<HTMLInputElement>;
	children?: any;
}

export default function ToggleSwitch({ id, label, className, checked, disabled, hideLabel, onClick, children }: Props) {
	if (id === undefined && label === undefined) console.warn('toggle switch is missing both id and label, please include at least one to ensure functionality!');
	const inputId = id || `toggle-${label?.toLowerCase().replaceAll(' ', '-')}`;

	return (
		<div title={label} className={`flex gap-2 items-center ${className}`}>
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
				style={{ display: hideLabel ? 'none' : 'block' }}
			>
				{children || label}
			</label>
			<label
				title={label}
				htmlFor={inputId}
				className='
					flex items-center w-8 h-4 rounded-full
					border dark:border-0 border-slate-300 shadow-inner
					peer-enabled:cursor-pointer
					peer-enabled:hover:ring-2
					peer-checked:justify-end 
					peer-enabled:peer-checked:bg-lime-500
					peer-enabled:bg-slate-400 bg-slate-400
					overflow-hidden
				'
			>
				<span
					title={disabled ? 'Disabled' : 'Toggle'}
					className={`rounded-full h-4 w-4 border dark:border-0 border-slate-300 shadow-lg drop-shadow-lg ${disabled ? 'bg-slate-200' : 'bg-white'}`}
				/>
			</label>
		</div>
	)
}