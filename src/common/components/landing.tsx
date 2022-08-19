import { signIn } from 'next-auth/react';

export default function Landing() {
	return (
		<>
			<span className='text-6xl font-thin border-l border-r px-5'>
				tweebt
			</span>

			<span className='mt-3 text-2xl px-5 text-center'>
				Search above or <a title='Sign In' onClick={() => signIn('twitter')}>sign in with Twitter</a> to see your feed
			</span>
		</>
	)
}