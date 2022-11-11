'use client';

import styles from './styles/profilecard.module.css';
import Image from 'next/image';
import { TwitterIcon } from '../../common/icons/twittericons';
import { formatNumber, pluralize } from '../../common/utils/formatnumber';
import formatTwitterText from '../../common/utils/richtwittertext';
import { ProfileData } from './types/profile';
import { useEffect, useState } from 'react';
import { CheckBadgeIcon, LinkIcon, LockClosedIcon, UserGroupIcon, UsersIcon } from '@heroicons/react/24/solid';

interface Props {
    profile: ProfileData;
}

//TODO: add a placeholder here and allow null user
//      then if no data, display an error here for cleanliness
export default function ProfileCard({ profile }: Props) {
    const [bio, setBio] = useState<string | undefined>(undefined);

    //Assuming hydration error comes from Heroku's build environment, only render the bio on the client, not the server
    useEffect(() => {
        if (profile.bio) setBio(profile.bio);
    }, [profile]);

    return (
        <div className={styles.container}>
            <div className={styles.image}>
                <Image
                    src={profile.image}
                    alt={`@${profile.handle}`}
                    height={400}
                    width={400}
                    unoptimized={true} //image comes back as 400x400 here, no need to optimized and waste server resources
                    placeholder='empty'
                    draggable={false}
                />
            </div>
            <div className={styles.card}>
                <span className={styles.header}>
                    {profile.name}
                    {profile.protected && <p title='Protected'><LockClosedIcon /></p>}
                    {profile.verified && <p title='Verified'><CheckBadgeIcon /></p>}
                </span>
                <a
                    href={`https://twitter.com/${profile.handle}`}
                    title={`Open ${profile.name}'s profile on Twitter`}
                    className={styles.handle}
                    target='_blank'
                    rel='noreferrer'
                >
                    @{profile.handle}<TwitterIcon />
                </a>

                {bio && <p className={styles.bio}>{formatTwitterText(bio, true)}</p>}
                {!bio && profile.bio && <p className={styles.bio}>{profile.bio}</p>}

                {profile.url &&
                    <a href={`https://${profile.url}`} className={styles.url} target='_blank' rel='noreferrer'>
                        <LinkIcon /><span>{profile.url}</span>
                    </a>
                }

                <span className={styles.metrics}>
                    <p title={`${pluralize(profile.tweet_count, 'Tweet')}`}><TwitterIcon />{formatNumber(profile.tweet_count)}</p>
                    <p title={`Following ${pluralize(profile.following_count, 'Pe', 'rson', 'ople')}`}><UsersIcon />{formatNumber(profile.following_count)}</p>
                    <p title={`${pluralize(profile.follower_count, 'Follower')}`}><UserGroupIcon />{formatNumber(profile.follower_count)}</p>
                </span>
            </div>
        </div >
    )
}