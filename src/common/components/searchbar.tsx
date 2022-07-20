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
        const val = e.target[0].value;
        router.push(`${route}${val.startsWith('@') ? '' : 'search?q='}${val.startsWith('@') ? val : encodeURIComponent(val)}`);
    }

    return (
        <form className='flex flex-row rounded-full overflow-hidden shadow-inner focus-within:ring-2 bg-slate-50 border border-slate-300 w-min' onSubmit={handleSubmit}>
            <input
                type='text'
                name='query'
                className='px-2 py-1 text-black bg-slate-50 min-w-[32px] outline-none text-center'
                autoComplete='off'
                defaultValue={value}
                placeholder={placeholder}
                spellCheck='false'
            />
            <button className="text-slate-500 p-1 w-7" title="Search" type='submit'><SearchIcon /></button>
        </form>
    )
}