import styles from '../styles/tweet.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { RetweetIcon } from '../../../common/icons/twittericons';
import { Media } from '../types/gallery.types';
import TweetMetrics from './tweetmetrics';
import TextOverlay from './textoverlay';

interface Props {
	item: Media;
	visible: boolean;
	showMetrics?: boolean;
	showTweetText?: boolean;
	mobilemode: boolean;
}

export default function TweetOverlay({ item, visible, showMetrics, showTweetText, mobilemode }: Props) {
	return (
		<div className={`${styles.banneroverlay} ${(!mobilemode) ? 'absolute' : ''} ${visible ? 'opacity-100' : 'opacity-0'}`}>
			<div className={`${styles.banner} z-10 gap-2 justify-center select-text flex-wrap`}>
				<Link href={`/@${item.tweet.author.handle}`} title={`View ${item.tweet.author.name}'s (@${item.tweet.author.handle}) Profile`}>
					<Image src={item.tweet.author.image} alt={item.tweet.author.name + '\'s profile image'} width={24} height={24} />
					{item.tweet.author.name || item.tweet.author.handle}
					{!item.ref_tweet ? <span className='text-gray-300 font-light'>@{item.tweet.author.handle}</span> : ''}
				</Link>

				{item.ref_tweet &&
					<>
						{item.ref_tweet.type === 'retweeted' ? (
							<span
								title={`${item.tweet.author.name} retweeted ${item.ref_tweet.author.handle === item.tweet.author.handle ? 'themself' : item.ref_tweet.author.name}`}
								className='flex gap-2 text-green-400'
							>
								<RetweetIcon />
								{item.ref_tweet.author.handle === item.tweet.author.handle ? ' themself' : ''}
							</span>
						) : (
							<span
								title={`${item.tweet.author.name} ${item.ref_tweet.type!.replace('_', ' ')} ${item.ref_tweet.author.handle === item.tweet.author.handle ? 'themselves' : item.ref_tweet.author.name}`}
								className='text-blue-400'
							>
								{item.ref_tweet.type!.replace('_', ' ')}
								{item.ref_tweet.author.handle === item.tweet.author.handle ? ' themselves' : ''}
							</span>
						)}

						{item.ref_tweet.author.handle !== item.tweet.author.handle &&
							<Link href={`/@${item.ref_tweet.author.handle}`} title={`View ${item.ref_tweet.author.name}'s (@${item.ref_tweet.author.handle}) Profile`}>
								<Image src={item.ref_tweet.author.image} alt={item.ref_tweet.author.name + '\'s profile image'} width={24} height={24} />
								@{item.ref_tweet.author.handle}
							</Link>
						}
					</>
				}
			</div>

			<div className='grow' style={{ contain: 'content' }}>
				{(item.alt_text || item.tweet.text) && !mobilemode && showTweetText &&
					<TextOverlay item={item} showAltButton showTextButton parentVisibility={visible} />
				}
			</div>

			<div className={`${styles.metric} z-20 justify-evenly`}>
				<TweetMetrics item={item} showNumbers={showMetrics} />
			</div>
		</div>
	)
}