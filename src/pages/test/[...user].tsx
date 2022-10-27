import { Session, unstable_getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import Title from '../../common/components/title';
import ProfileCard from '../../modules/profile/profilecard';
import { ProfileData } from '../../modules/profile/types/profile';
import { getProfile } from '../../modules/twitterapi';

interface Props {
	profile: ProfileData | null;
	error: { title: string, details: string } | null;
}

//fetch the session on the serverside
export async function getServerSideProps(context: any /* NextPageContext */): Promise<{ props: Props }> {
	//check for and attempt to grab user profile
	const slug = context.query['user'] as string[] || undefined;

	//Fetch profile if a handle is passed in (query is valid here if isHandle is valid)
	const profileRes = await getProfile(slug.at(0)!);

	return {
		props: {
			profile: profileRes ? profileRes.data || null : null,
			error: profileRes?.error || null
		},
	}
}

export default function User({ profile, error }: Props) {
	if (error) {
		return (
			<div className='flex flex-col items-center w-screen min-h-screen pt-20'>
				<Title
					title={`Error`}
				/>
				<span className='flex flex-col gap-2 h-fit items-center justify-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-400 dark:border-slate-700'>
					<h1 className='w-full text-center border-b border-slate-300 dark:border-slate-700'>{error.title}</h1>
					{error.details}
				</span>
			</div>
		)
	}

	return (
		<div className='flex flex-col items-center min-h-screen pt-20 px-1'>
			<Title
				title={profile ? `${profile.name} (@${profile.handle})` : undefined}
				image={profile?.image.replace('400x400', '200x200')}
				desc={(profile?.bio instanceof Array) ? profile.bio.map(value => { return (value.link || value.text) }).join('') : profile?.bio || profile ? `Check out ${profile.name}'s (@${profile.handle}) latest tweets as a rolling gallery without ads or distractions!` : undefined}
			/>
			{profile && <ProfileCard profile={profile} />}
		</div>
	)
}