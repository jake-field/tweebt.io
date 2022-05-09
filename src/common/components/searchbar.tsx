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
        <form className='flex flex-row rounded-lg bg-white' onSubmit={handleSubmit}>
            <input
                type='text'
                name='query'
                className='rounded-l-lg p-1 text-black'
                autoComplete='off'
                defaultValue={value}
                placeholder={placeholder}
                onChange={handleChange}
            />
            <button className="bg-blue-400 text-black p-1 ml-1 rounded-r-lg w-9" type='submit'><SearchIcon /></button>
        </form>
    )
}