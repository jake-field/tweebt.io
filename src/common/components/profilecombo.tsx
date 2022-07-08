import { ChevronDownIcon } from "@heroicons/react/solid";
import { Session } from "next-auth";
import Image from "next/image";

interface Props {
	session?: Session;
}

export default function ProfileCombo({ session }: Props) {
	return (
		<span className='text-sm font-medium gap-4 flex items-center'>
			{session?.user?.image ? (
				<span className='flex items-center justify-center gap-1 bg-slate-800 rounded-full pr-2'>
					<Image src={session?.user?.image} width={36} height={36} className='rounded-full' />
					<span className='ml-1'>{session.user.name}</span>
					<ChevronDownIcon className='w-5' />
				</span>
			) : (
				<span>Not logged in</span>
			)}
		</span>
	)
}