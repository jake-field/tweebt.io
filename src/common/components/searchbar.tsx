import { SearchIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";

interface Props {
    route: string;
    placeholder?: string;
    value?: string;
}

export default function Searchbar({ route, placeholder, value }: Props) {
    const router = useRouter();
    const [query, setQuery] = useState(value || '');

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setQuery(e.target.value);
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        router.push(`${route}${query}`);
    }

    return (
        <form className='flex flex-row rounded-lg overflow-hidden bg-slate-50' onSubmit={handleSubmit}>
            <input
                type='text'
                name='query'
                className='px-2 w-48 text-black bg-slate-50'
                autoComplete='off'
                defaultValue={value}
                placeholder={placeholder}
                onChange={handleChange}
            />
            <button className="text-slate-900 p-1 w-9" type='submit'><SearchIcon /></button>
        </form>
    )
}