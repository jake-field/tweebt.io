import { LinkIcon } from "@heroicons/react/solid";
import Image from "next/image";
import { User } from "../../modules/twitter/types/user";

interface Props {
    user: User;
}

//TODO: add a placeholder here and allow null user
//      then if no data, display an error here for cleanliness
export default function ProfileCard({ user }: Props) {
    if (!user.data) return null;
    return (
        <div className='flex flex-row text-left bg-slate-900 w-fit p-4 rounded-lg'>
            <div className='rounded-full overflow-hidden border-2 border-black w-[64px] h-[64px]'>
                    <Image src={user.data.profile_image_url} height={64} width={64} />
            </div>
            <div className='ml-4 max-w-100'>
                <p className='text-lg'>{user.data.name} - @{user.data.username}</p>
                <p className='max-w-lg'>{user.data.description}</p>
                <p className='text-gray-400'><a href={user.data.url} target='_blank'><LinkIcon className='w-4' /> {user.data.url}</a></p>
            </div>
        </div>
    )
}