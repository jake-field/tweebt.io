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
        <div className='flex flex-col text-left items-center w-fit max-w-sm'>
            <Head>
                <meta property="og:image" content={user.data.profile_image_url} />
                <meta property="og:image:width" content="400" />
                <meta property="og:image:height" content="400" />
            </Head>

            <div className='rounded-full overflow-hidden shadow-lg w-[100px] h-[100px] border-4 border-slate-800 relative top-7 z-10 hover:scale-[2] transition ease-in-out delay-150 duration-300'>
                <Image src={user.data.profile_image_url} height={400} width={400} quality={100} placeholder='empty' />
            </div>

            <div className='max-w-100 bg-slate-800 rounded-lg p-2 pr-3 pt-14 shadow-lg relative bottom-5'>
                <p className='text-xl font-bold pl-1'>
                    {user.data.name}
                    {user.data.protected && <LockClosedIcon className='w-5 inline align-middle' />}
                    {user.data.verified && <BadgeCheckIcon className='w-5 inline align-middle' />}
                </p>

                <p className='bg-slate-900 rounded-lg p-1 text-sm w-fit mt-1'>
                    <a href={`https://twitter.com/${user.data.username}`} target='_blank'>
                        @{user.data.username} <ExternalLinkIcon className='w-4 inline align-middle' />
                    </a>
                </p>

                {user.data.description &&
                    <p className='max-w-lg text-sm mt-1 whitespace-pre-line pl-1'>
                        <FormatBio bio={user.data.description} />
                    </p>
                }

                {user.data.entities?.url?.urls &&
                    <p className='text-gray-400 text-sm mt-1 pl-1'>
                        <a href={`${user.data.entities.url.urls[0].expanded_url}`} target='_blank'>
                            <LinkIcon className='w-4 inline align-sub' /> {user.data.entities.url.urls[0].display_url}
                        </a>
                    </p>
                }
            </div>
        </div>
    )
}