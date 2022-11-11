'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Props {
    route: string;
    placeholder?: string;
    value?: string;
}

export default function Searchbar({ route, placeholder, value }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(value || '');

    useEffect(() => {
        setQuery(searchParams.get('q') || value || '');
    }, [searchParams, value])

    function handleSubmit(e: any) {
        e.preventDefault();
        const val = e.target['query'].value as string;

        //ignore empty requests
        if (val.length === 0 || val.length === 1 && val.startsWith('@')) return;

        //select route
        let target = `${route}${val.startsWith('@') ? '' : 'search/'}${val.startsWith('@') ? val : val.replace('#', '%23')}`;

        router.push(target);
    }

    return (
        <form className='flex flex-row rounded-full overflow-hidden shadow-inner focus-within:ring-2 bg-white dark:bg-slate-200 border border-slate-300 md:w-72 lg:w-96' onSubmit={handleSubmit}>
            <input
                type='text'
                name='query'
                className='pl-2 py-1 text-black dark:bg-slate-200 placeholder:text-stone-500 min-w-[32px] grow outline-none text-center'
                autoComplete='off'
                defaultValue={query}
                placeholder={placeholder}
                spellCheck='false'
            />
            <button className='text-slate-500 pr-2 w-7' title='Search' type='submit'><MagnifyingGlassIcon /></button>
        </form>
    )
}