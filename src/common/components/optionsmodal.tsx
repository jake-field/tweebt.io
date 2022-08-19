import { CogIcon, XIcon } from "@heroicons/react/solid";
import { useEffect } from "react";
import { ResultsContext } from "../contexts/appsettings/results";
import { ModalViewContext, TileViewContext } from "../contexts/appsettings/view";
import ToggleSwitch from "./toggleswitch";

interface Props {
	visible?: boolean;
	onClose?: () => void;
}

export default function OptionsModal({ visible, onClose }: Props) {
	const liClassName = 'p-1 text-center rounded-lg bg-slate-700';
	const toggleClassName = 'justify-center';
	const rowClassName = 'px-1 odd:bg-slate-600'

	//Only update contexts on apply
	function handleApply(e: any) {

	}

	useEffect(() => {
		fixPage(visible || false);
	}, [visible]);

	//lock page on open
	function fixPage(fixed: boolean) {
		//hide scrollbars on open, force fixed for the sake of mobile, then restore scroll on close
		const scroll = document.body.style.top;
		const s = -(scrollY).toString();
		document.body.style.overflowY = fixed ? 'hidden' : '';
		document.body.style.position = fixed ? 'fixed' : '';
		document.body.style.top = fixed ? `${s}px` : '';
		document.body.style.width = fixed ? '100%' : '';

		if (!fixed) {
			const num = Number(scroll.substring(0, scroll.indexOf('px')));
			scrollTo({ top: -num });
		}

		//if on mobile, make the background black so that the device browser has consistent banner colors
		if (window.matchMedia('(pointer: coarse)').matches) document.body.style.backgroundColor = fixed ? 'black' : '';
	}

	return (
		<div
			className='absolute top-0 left-0 w-screen h-screen font-light text-sm bg-black bg-opacity-50 items-center justify-center z-50'
			style={{ display: visible ? 'flex' : 'none' }}
		>
			<div className='bg-slate-700 border border-slate-600 shadow-lg w-full sm:w-auto min-w-[325px] sm:max-h-[95%] text-white rounded-lg flex flex-col items-center justify-center' style={{ contain: 'content' }}>
				<div className='w-full flex justify-between border-b border-slate-500 p-2'>
					&nbsp;
					<span className='flex gap-1'>
						<CogIcon className='w-5' />
						Additional Settings
					</span>
					<XIcon className='w-5 hover:text-red-400 cursor-pointer' onClick={onClose} />
				</div>

				<div className='overflow-y-auto w-full'>
					<div className='w-full'>
						<h2 className='p-2 text-center'>Results Settings:</h2>
						<div className='flex flex-col p-2 gap-2 bg-slate-900'>
							<div className={liClassName + ' cursor-default flex flex-col'} title='Keyword Blacklist'>
								<div className='flex justify-between items-center pb-1 px-1'>
									<span>Blacklist:</span>
									<span className='text-xs text-gray-300'>(use spaces to separate keywords)</span>
								</div>
								<ResultsContext.Consumer>
									{({ blacklist, set }) =>
										<textarea
											name='blacklist'
											defaultValue={blacklist}
											placeholder={'Space separated keywords to filter out of the results you see.\nExample: @user #tag alcohol'}
											className='rounded-lg p-1 text-sm text-black bg-gray-100 font-normal'
											rows={3}
										>
										</textarea>
									}
								</ResultsContext.Consumer>
							</div>
						</div>
					</div>

					<div className='w-full'>
						<h2 className='p-2 text-center'>View Settings:</h2>
						<div className='flex flex-col p-2 gap-2 bg-slate-900'>
							<ModalViewContext.Consumer>
								{modalSettings =>
									<TileViewContext.Consumer>
										{tileSettings =>
											<div className='flex flex-col bg-slate-700 rounded-lg' style={{ contain: 'content' }}>
												<table>
													<thead>
														<tr className='bg-slate-700 border-b border-b-slate-400'>
															<th className=''></th>
															<th>Tiles</th>
															<th>Popup</th>
														</tr>
													</thead>
													<tbody>
														<tr className={rowClassName}>
															<td className='p-1'>Show actions (Like, Reply, ...)</td>
															<td><ToggleSwitch className={toggleClassName} hideLabel checked={tileSettings.showActions} label='Show actions on Tiles' /></td>
															<td><ToggleSwitch className={toggleClassName} hideLabel checked={modalSettings.showActions} label='Show actions on Popup' /></td>
														</tr>
														<tr className={rowClassName}>
															<td className='p-1'>Show action metrics (eg. 10k likes)</td>
															<td><ToggleSwitch className={toggleClassName} hideLabel checked={tileSettings.showMetrics} label='Show metrics on Tiles' /></td>
															<td><ToggleSwitch className={toggleClassName} hideLabel checked={modalSettings.showMetrics} label='Show metrics on Popup' /></td>
														</tr>
														<tr className={rowClassName}>
															<td className='p-1'>Show alt-text button</td>
															<td><ToggleSwitch className={toggleClassName} hideLabel checked={tileSettings.showAltButton} label='Show alt-text on Tiles' /></td>
															<td><ToggleSwitch className={toggleClassName} hideLabel checked={modalSettings.showAltButton} label='Show alt-text on Popup' /></td>
														</tr>
														<tr className={rowClassName}>
															<td className='p-1'>Show authors</td>
															<td><ToggleSwitch className={toggleClassName} hideLabel checked={tileSettings.showAuthors} label='Show authors on Tiles' /></td>
															<td><ToggleSwitch className={toggleClassName} hideLabel checked={modalSettings.showAuthors} label='Show authors on Popup' /></td>
														</tr>
														<tr className={rowClassName}>
															<td className='p-1'>Show author on their profile</td>
															<td><ToggleSwitch className={toggleClassName} hideLabel checked={tileSettings.showAuthorIfOwnProfile} label='Show author on their own profile on Tiles' /></td>
															<td><ToggleSwitch className={toggleClassName} hideLabel disabled label='Show author on their own profile on Popup' /></td>
														</tr>
														<tr className={rowClassName}>
															<td className='p-1'>Show share button</td>
															<td><ToggleSwitch className={toggleClassName} hideLabel checked={tileSettings.showSharing} label='Show Share on Tiles' /></td>
															<td><ToggleSwitch className={toggleClassName} hideLabel checked={modalSettings.showSharing} label='Show Share on Popup' /></td>
														</tr>
														<tr className={rowClassName}>
															<td className='p-1'>Show Tweet text button</td>
															<td><ToggleSwitch className={toggleClassName} hideLabel checked={tileSettings.showTextButton} label='Show Tweet text on Tiles' /></td>
															<td><ToggleSwitch className={toggleClassName} hideLabel checked={modalSettings.showTextButton} label='Show Tweet text on Popup' /></td>
														</tr>
														<tr className={rowClassName}>
															<td className='p-1'>Enable links in Tweet text</td>
															<td><ToggleSwitch className={toggleClassName} hideLabel checked={tileSettings.richText} label='Enable links on Tiles' /></td>
															<td><ToggleSwitch className={toggleClassName} hideLabel checked={modalSettings.richText} label='Enable links on Popup' /></td>
														</tr>
													</tbody>
												</table>
											</div>
										}
									</TileViewContext.Consumer>
								}
							</ModalViewContext.Consumer>
						</div>
					</div>

					<div className='w-full flex justify-end items-center p-2 gap-1'>
						<div className='py-1 px-2 rounded-lg bg-gray-500 hover:bg-red-500 hover:ring-2 ring-red-400 cursor-pointer' onClick={onClose}>Cancel</div>
						<div className='py-1 px-2 rounded-lg bg-green-700 hover:bg-green-500 hover:ring-2 ring-green-400 cursor-pointer' onClick={(e) => handleApply(e)}>Apply</div>
					</div>
				</div>
			</div>
		</div>
	)
}