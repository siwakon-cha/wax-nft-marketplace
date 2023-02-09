import React, {useState} from 'react';
import {useTranslation} from "react-i18next";
import ShowMoreOrLessButton from '../common/util/input/ShowMoreOrLessButton';
import {get} from "../helpers/Api";
import {useQuery} from "react-query";
import LoadingIndicator from "../loadingindicator";
import Link from 'next/link';

const UserSetList = (props) => {
    const userName = props['userName'];

    const {t, i18n} = useTranslation('common');
    const [showNum, setShowNum] = useState(10);

    const language = props['lang'] ? props['lang'] : 'en';

    if (!process.browser && language)
        i18n.changeLanguage(language);

    const { isLoading, error, data } = useQuery(`user-set-list-${userName}`, () => get(`get-sets/${userName}`));

    return isLoading ? <LoadingIndicator/> : (
        <div className="SetsTable">
            <table>
              <tbody>
                <tr>
                    <th>{t('profile.collection')}</th>
                    <th>{t('profile.completed')}</th>
                    <th>{t('profile.started')}</th>
                    <th>{t('profile.total')}</th>
                </tr>
                { data && data.sort((a, b) => b.completedSets - a.completedSets).slice(0, showNum).map(set => (
                    <tr>
                        <td>
                            <Link href={`/sets?account=${userName}?collection=${set.author}`}>
                                <div className={"NextLink"}>{set.collectionName}</div>
                            </Link>
                        </td>
                        <td>{set.completedSets}</td>
                        <td>{set.startSets}</td>
                        <td>{set.numSets}</td>
                    </tr>
                ))}
              </tbody>
            </table>
            { !isLoading && data && showNum < data.length ? <ShowMoreOrLessButton showNum={showNum} setShowNum={setShowNum} /> : '' }
            { !isLoading && data && showNum >= data.length ? <ShowMoreOrLessButton setShowNum={setShowNum} resultsNum={10} showLess={true} /> : '' }
        </div>
    );
};

export default UserSetList;
