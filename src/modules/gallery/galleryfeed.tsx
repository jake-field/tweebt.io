import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import Gallery from './types/gallery';
import GalleryComponent from './components/gallery';
import { SpinnerIcon } from '../../common/icons/spinnericon';
import { ResultsContext } from '../../common/contexts/appsettings/results';

interface Props {
	apiEndpoint: string;
}

export default function GalleryFeed({ apiEndpoint }: Props) {
	const router = useRouter();
	const resultsContext = useContext(ResultsContext);
	const [gallery, setGallery] = useState<Gallery[]>([]);
	const [loading, setLoading] = useState(false);

	//Clear gallery on route exit to ensure clear page when changing usernames/searchterms
	useEffect(() => {
		return () => setGallery([]);
	}, [router]);

	//Double check for empty gallery, fetch data if empty
	useEffect(() => {
		if (gallery.length === 0 && !loading) fetchData();
	})

	//function for fetching data
	function fetchData() {
		//ignore request if already fetching, prevents double ups/unwanted requests
		if (loading) return;
		setLoading(true);

		let pagination = '';
		if (gallery.length > 0) {
			const token = gallery[gallery.length - 1].meta?.next_token;
			pagination = token ? '&next=' + token : '';
			if (pagination === '') return; //error, ignore
		}

		let exclude = '';
		if (!apiEndpoint.startsWith('/api/search')) {
			let target = apiEndpoint.startsWith('/api/user') ? resultsContext.profileOptions : resultsContext.feedOptions;
			let merge: string[] = [];
			if (target.replies === false) merge.push('replies');
			if (target.retweets === false) merge.push('retweets');
			if (merge.length > 0) exclude = '&exclude=' + merge.join(',');
		} else console.log('cannot use excludes here')

		//TODO: make a pagination object or even an api object for specific values
		fetch(`${apiEndpoint}${apiEndpoint.includes('?') ? '&' : '?'}max_results=100${pagination}${exclude}`)
			.then((res) => {
				//intercept response status to catch errors
				if (res.status != 200) {
					//TODO: this should be refreshed using refresh tokens, please implement this ASAP
					console.log('GalleryFeed(): ', 'fetchData(): ', `fetch denied by api, status code: ${res.status} [${res.statusText}]`);
					signOut();
					router.push('/');
					throw res.statusText
				}
				return res
			})
			.then((res) => res.json())
			.then((data: Gallery) => {
				//store for items or if the meta was fully recieved
				//storing for meta helps prevent re-requesting empty results
				if ((data.items && data.items.length > 0) || data.meta) {
					setGallery([...gallery, data]);
				} else {
					console.log('GalleryFeed(): ', 'fetchData(): ', 'fetch failed, api did not return either items or metadata');
				}
			}).finally(() => {
				setLoading(false);
			}).catch(err => {
				console.log('GalleryFeed(): ', 'fetchData(): ', 'fetch failed with error: ', err);
			});
	}

	//Check if there are more that can be fetched based on the next token
	function hasMore() {
		if (gallery.length > 0) {
			return gallery[gallery.length - 1].meta?.next_token ? true : false;
		}

		//if gallery is empty, return true. THIS MAY BE WRONG HERE
		return (gallery.length === 0);
	}

	return (
		<div className='flex flex-col items-center w-full text-center sm:px-3 md:px-3'>
			{gallery.map((item, i) => {
				if (item.error) {
					return (
						<span key={i}>
							<p>{item.error.title}</p>
							<p>{item.error.detail}</p>
						</span>
					)
				} else if (item.items.length === 0 && i === 0) {
					return <p key={i}>No items to show</p>
				}
			})}

			<GalleryComponent gallery={gallery} loadNext={fetchData} canLoadMore={hasMore} />

			{(loading || hasMore()) &&
				<div className='flex flex-row items-center justify-center h-48'>
					<SpinnerIcon className='w-10 h-10' />
				</div>
			}

			{!hasMore() &&
				<div className='flex flex-row items-center justify-center h-48 text-gray-600 dark:text-gray-400'>
					You&apos;ve gone as far back as I can show!
				</div>
			}
		</div>
	)
}