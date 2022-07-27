import { BadgeCheckIcon, ExternalLinkIcon, LinkIcon, LockClosedIcon } from '@heroicons/react/solid';
import Image from 'next/image';
import Link from 'next/link';
import Profile from './types/profile';

interface Props {
    profile: Profile;
}

//TODO: add a placeholder here and allow null user
//      then if no data, display an error here for cleanliness
export default function ProfileCard({ profile }: Props) {
    if (!profile) return null;
    return (
        <div className='flex flex-col items-center w-fit max-w-sm text-center relative -top-5'>
            <div className='select-none rounded-full overflow-hidden shadow-2xl w-[100px] h-[100px] border-4 border-slate-50 dark:border-slate-700 relative top-7 z-10 hover:scale-[1.5] transition-transform ease-in-out delay-150 duration-300'>
                <Image src={profile.image} priority={true} height={400} width={400} quality={100} placeholder='empty' unoptimized={true} />
            </div>

            <div className='max-w-100 bg-slate-100 dark:bg-slate-800 rounded-lg pb-2 px-3 pt-14 shadow-lg relative bottom-5 flex flex-col text-sm gap-2 items-center'>
                <span className='text-xl font-bold inline-flex gap-1'>
                    {profile.name}
                    {profile.protected && <p title='Protected' className='inline-flex'><LockClosedIcon className='w-5 text-blue-500 dark:text-blue-400' /></p>}
                    {profile.verified && <p title='Verified' className='inline-flex'><BadgeCheckIcon className='w-5 text-blue-500 dark:text-blue-400' /></p>}
                </span>

                <a 
                href={`https://twitter.com/${profile.handle}`}
                title={`Open ${profile.name}'s profile on Twitter`}
                className='bg-slate-200 dark:bg-slate-900 rounded-lg p-1 gap-1 inline-flex w-fit'
                target='_blank' 
                >
                    @{profile.handle}<ExternalLinkIcon className='w-4 pointer-events-none' />
                </a>

                {profile.bio &&
                    <p className='whitespace-pre-line'>
                        {(profile.bio instanceof Array) ? (
                            profile.bio.map((value, index) => {
                                if (value.text) {
                                    return value.text;
                                }
                                else if (value.link) {
                                    if (value.link.startsWith('@')) return <Link key={index} href={value.link}>{value.link}</Link>;
                                    else if (value.link.startsWith('#')) return <Link key={index} href={`/tags/${value.link.substring(1)}`}>{value.link}</Link>;
                                    else return <a key={index} href={(!value.link.startsWith('http') ? 'https://' : '') + value.link} target='_blank'>{value.link}</a>
                                }
                                return 'error';
                            })
                        ) : (
                            profile.bio
                        )}
                    </p>
                }

                {profile.url &&
                    <p>
                        <a href={(!profile.url.startsWith('http') ? 'https://' : '') + profile.url} target='_blank' className='inline-flex gap-1'>
                            <LinkIcon className='w-4' /><span className='text-ellipsis whitespace-nowrap overflow-hidden max-w-xs'>{profile.url}</span>
                        </a>
                    </p>
                }
            </div>
        </div>
    )
}