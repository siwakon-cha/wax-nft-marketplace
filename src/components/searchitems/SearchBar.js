import React, {useState} from "react";

import {useTranslation} from "react-i18next";
import {useRouter} from "next/router";
import cn from "classnames";


const SearchBar = React.memo(props => {

    const {t, i18n} = useTranslation('common');

    const [showInput, setShowInput] = useState(false);
    const [tempSearch, setTempSearch] = useState('');
    const router = useRouter();

    const search = (e) => {
        e.preventDefault();
        router.push(`/search?term=${tempSearch}`)
    };

    const changeSearch = (e) => {
        const val = e.target.value;
        setTempSearch(val);
    };

    return (
        <form className={cn(
            'w-auto flex h-10 mx-auto my-auto bg-bluet rounded-3xl border-2 border-primaryt',
        )} onSubmit={search} target={'/search'}>
            <input className={cn(
                'w-16 h-9 bg-transparent text-sm text-primary outline-none my-auto mx-3',
                'focus:w-36 active:w-36 transition-width'
            )} name="term" placeholder={t('navigation.search')} type="text" onChange={changeSearch} value={tempSearch}  />
            <button disabled={(!tempSearch || tempSearch.length < 3)} className={cn(
                'w-6 h-7 my-auto mr-3'
            )} onClick={search}>
                <img src='/search.svg' alt="Search" />
            </button>
        </form>
    );
});

export default SearchBar;
