import { SearchIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";

interface Props {
    route: string;
    placeholder?: string;
    value?: string;
}

export default function Searchbar({ route, placeholder, value }: Props) {
    const router = useRouter();

    function handleSubmit(e: any) {
        e.preventDefault();
        router.push(`${route}${e.target[0].value}`);
    }

    return (
        <form className='flex flex-row rounded-lg overflow-hidden shadow-inner focus-within:ring-1 dark:ring-slate-200 bg-slate-50 border border-slate-300 w-min' onSubmit={handleSubmit}>
            <input
                type='text'
                name='query'
                className='px-2 py-1 text-black bg-slate-50 min-w-[32px] outline-none'
                autoComplete='off'
                defaultValue={value}
                placeholder={placeholder}
                spellCheck='false'
            />
            <button className="text-slate-500 p-1 w-7" title="Search" type='submit'><SearchIcon /></button>
        </form>
    )
}