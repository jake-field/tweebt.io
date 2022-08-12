import { SearchIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface Props {
    route: string;
    placeholder?: string;
    value?: string;
}

export default function Searchbar({ route, placeholder, value }: Props) {
    const router = useRouter();
    const [query, setQuery] = useState(value || '');

    useEffect(() => {
        setQuery(router.query['q'] as string || value || '');
    }, [router, value])

    function handleSubmit(e: any) {
        e.preventDefault();
        const val = e.target['query'].value;

        //ignore empty requests
        if (val.length === 0 || val.length === 1 && val.startsWith('@')) return;

        //select route
        let target = `${route}${val.startsWith('@') ? '' : 'search?q='}${val.startsWith('@') ? val : encodeURIComponent(val)}`;

        router.push(target);
    }

    return (
        <form className='flex flex-row rounded-full overflow-hidden shadow-inner focus-within:ring-2 bg-slate-50 border border-slate-300 md:w-72 lg:w-96' onSubmit={handleSubmit}>
            <input
                type='text'
                name='query'
                className='pl-2 py-1 text-black bg-slate-50 min-w-[32px] grow outline-none text-center'
                autoComplete='off'
                defaultValue={query}
                placeholder={placeholder}
                spellCheck='false'
            />
            <button className='text-slate-500 p-1 w-7' title='Search' type='submit'><SearchIcon /></button>
        </form>
    )
}