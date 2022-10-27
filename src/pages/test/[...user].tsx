import Title from '../../common/components/title';
import ProfileCard from '../../modules/profile/profilecard';
import { ProfileData } from '../../modules/profile/types/profile';
import { getProfile } from '../../modules/twitterapi';

interface Props {
	profile: ProfileData | null;
	debug_nourl: boolean;
	debug_nobio: boolean
	debug_noname: boolean;
	debug_nometrics: boolean;
	error: { title: string, details: string } | null;
}

//fetch the session on the serverside
export async function getServerSideProps(context: any /* NextPageContext */): Promise<{ props: Props }> {
	//check for and attempt to grab user profile
	const slug = context.query['user'] as string[] || undefined;
	const debug_a = context.query['nourl'] as string || undefined
	const debug_b = context.query['nobio'] as string || undefined;
	const debug_c = context.query['noname'] as string || undefined;
	const debug_d = context.query['nometrics'] as string || undefined;

	//Fetch profile if a handle is passed in (query is valid here if isHandle is valid)
	const profileRes = await getProfile(slug.at(0)!);

	return {
		props: {
			profile: profileRes ? profileRes.data || null : null,
			debug_nourl: debug_a !== undefined,
			debug_nobio: debug_b !== undefined,
			debug_noname: debug_c !== undefined,
			debug_nometrics: debug_d !== undefined,
			error: profileRes?.error || null
		},
	}
}

export default function User({ profile, debug_nobio, debug_nourl, debug_nometrics, debug_noname, error }: Props) {
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
			{profile && <ProfileCard profile={profile} debug_nourl={debug_nourl} debug_nobio={debug_nobio} debug_nometrics={debug_nometrics} debug_noname={debug_noname} />}
		</div>
	)
}