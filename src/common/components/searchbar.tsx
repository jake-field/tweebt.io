import { SearchIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';

interface Props {
    route: string;
    placeholder?: string;
    value?: string;
}

export default function Searchbar({ route, placeholder, value }: Props) {
    const router = useRouter();

    function handleSubmit(e: any) {
        e.preventDefault();

        const val = e.target['query'].value;
        const excludeRetweets = e.target['retweets'].checked;
        const excludeReplies = e.target['replies'].checked;

        //ignore empty requests
        if (val.length === 0 || val.length === 1 && val.startsWith('@')) return;

        //select route
        let target = `${route}${val.startsWith('@') ? '' : 'search?q='}${val.startsWith('@') ? val : encodeURIComponent(val)}`;

        //use exclude terms?
        //Only operate on handles for now. It can be used on handles and homefeed, but not search results
        if (val.startsWith('@') && (excludeReplies || excludeRetweets)) {
            target += target.includes('?') ? '&exclude=' : '?exclude=';
            target += excludeRetweets ? excludeReplies ? 'retweets,replies' : 'retweets' : excludeReplies ? 'replies' : '';
        }

        router.push(target);
    }

    return (
        <form className='flex group flex-row rounded-full overflow-hidden shadow-inner focus-within:ring-2 bg-slate-50 border border-slate-300 w-min' onSubmit={handleSubmit}>
            <input
                type='text'
                name='query'
                className='px-2 py-1 text-black bg-slate-50 min-w-[32px] outline-none text-center'
                autoComplete='off'
                defaultValue={value}
                placeholder={placeholder}
                spellCheck='false'
            />
            <button className='text-slate-500 p-1 w-7' title='Search' type='submit'><SearchIcon /></button>
            <div className='absolute bg-slate-50 px-1 pb-2 pt-10 -z-10 rounded-t-2xl rounded-b-lg w-full text-black text-sm hidden flex-row flex-wrap gap-1 group-focus-within:flex'>
                <span>Exclude:</span>
                <span className='bg-slate-300 px-1 rounded-lg flex justify-center items-center gap-1'>
                    <input type='checkbox' name='retweets' id='retweets' title='Retweets' />
                    <label htmlFor='retweets'>Retweets</label>
                </span>
                <span className='bg-slate-300 px-1 rounded-lg flex justify-center items-center gap-1'>
                    <input type='checkbox' name='replies' id='replies' title='Replies' />
                    <label htmlFor='replies'>Replies</label>
                </span>
            </div>
        </form>
    )
}