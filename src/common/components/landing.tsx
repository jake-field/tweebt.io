import { signIn } from 'next-auth/react';

export default function Landing() {
	return (
		<div className='text-center'>
			<h1 className='text-6xl font-bold'>
				tweebt
			</h1>

			<p className='mt-3 text-2xl'>
				search for tweebt or <a title='log in with Twitter' onClick={() => signIn('twitter')}>log in with Twitter</a> to see your feed
			</p>
		</div>
	)
}