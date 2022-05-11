import { BadgeCheckIcon, ExternalLinkIcon, LinkIcon, LockClosedIcon } from "@heroicons/react/solid";
import Head from "next/head";
import Image from "next/image";
import { User } from "../../modules/twitter/types/user";
import FormatBio from "../utils/formatBio";

interface Props {
    user: User;
}

//TODO: add a placeholder here and allow null user
//      then if no data, display an error here for cleanliness
export default function ProfileCard({ user }: Props) {
    if (!user.data) return null;
    return (
        <div className='flex flex-col items-center w-fit max-w-sm text-center'>
            <Head>
                <meta property="twitter:image" content={user.data.profile_image_url} />
                <meta property="og:image" content={user.data.profile_image_url} />
            </Head>

            <div className='rounded-full overflow-hidden shadow-lg w-[100px] h-[100px] border-4 border-slate-800 relative top-7 z-10 hover:scale-[1.5] transition ease-in-out delay-150 duration-300'>
                <Image src={user.data.profile_image_url} priority={true} height={400} width={400} quality={100} placeholder='empty' />
            </div>

            <div className='max-w-100 bg-slate-800 rounded-lg pb-2 px-3 pt-14 shadow-lg relative bottom-5 flex flex-col text-sm gap-2'>
                <p className='text-xl font-bold inline-flex gap-1 justify-center'>
                    {user.data.name}
                    {user.data.protected && <LockClosedIcon className='w-5' />}
                    {user.data.verified && <BadgeCheckIcon className='w-5' />}
                </p>

                <p>
                    <a href={`https://twitter.com/${user.data.username}`} target='_blank' className='bg-slate-900 rounded-lg p-1 inline-flex'>
                        @{user.data.username}<ExternalLinkIcon className='w-4' />
                    </a>
                </p>

                {user.data.description &&
                    <p className='whitespace-pre-line'>
                        <FormatBio bio={user.data.description} />
                    </p>
                }

                {user.data.entities?.url?.urls &&
                    <p>
                        <a href={`${user.data.entities.url.urls[0].expanded_url}`} target='_blank' className='inline-flex gap-1'>
                            <LinkIcon className='w-4' /> {user.data.entities.url.urls[0].display_url}
                        </a>
                    </p>
                }
            </div>
        </div>
    )
}