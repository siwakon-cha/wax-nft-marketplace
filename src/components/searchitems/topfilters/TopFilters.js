import Dropdown from "react-dropdown";
import Button from "../../common/util/input/Button";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {
    getAttributeName,
    getBorderName,
    getColorName,
    getTypeName
} from "../../helpers/FormatLinks";
import cn from "classnames";

const TopFilters = ({
    searchSearch, searchTerm, setOrder, orderDir, orderBy, authorCategories, searchAuthor, searchCategory,
    disabled, applyTerm, setTerm
}) => {
    const {t} = useTranslation('common');

    const onSelect = (e) => {
        setOrder(e.value);
    };

    const handleTermChange = (e) => {
        setTerm(e.target.value);
    }

    const dropDownOptions = [
        { value: 'date_desc', label: 'Date (Newest)' },
        { value: 'date_asc', label: 'Date (Oldest)' },
        { value: 'offer_asc', label: 'Price (Lowest)' },
        { value: 'offer_desc', label: 'Price (Highest)' },
        { value: 'aether_desc', label: 'Aether Rate (Highest)' },
        { value: 'aether_asc', label: 'Aether Rate (Lowest)' },
        { value: 'upliftium_desc', label: 'Upliftium Rate (Highest)' },
        { value: 'upliftium_asc', label: 'Upliftium Rate (Lowest)' },
        { value: 'author_asc', label: 'Author (Ascending)' },
        { value: 'author_desc', label: 'Author (Descending)' },
        { value: 'mint', label: 'Mint (Lowest)' },
        { value: 'mint', label: 'Mint (Highest)' },
        { value: 'name_asc', label: 'Name (Ascending)' },
        { value: 'name_desc', label: 'Name (Descending)' },
        { value: 'number_asc', label: 'Number (Ascending)' },
        { value: 'number_desc', label: 'Number (Descending)' },
        { value: 'asset_id_asc', label: 'Asset ID (Ascending)' },
        { value: 'asset_id_desc', label: 'Asset ID (Descending)' },
        { value: 'template_id_asc', label: 'Template ID (Ascending)' },
        { value: 'template_id_desc', label: 'Template ID (Descending)' },
    ];

    const colorName = getColorName(t, searchAuthor, searchCategory);

    const borderName = getBorderName(t, searchAuthor, searchCategory);

    const typeName = getTypeName(t, searchAuthor, searchCategory);

    const attr7Name = getAttributeName(t, searchAuthor, searchCategory, 0);

    const attr8Name = getAttributeName(t, searchAuthor, searchCategory, 1);

    const attr9Name = getAttributeName(t, searchAuthor, searchCategory, 2);

    const attr10Name = getAttributeName(t, searchAuthor, searchCategory, 3);

    if (authorCategories && authorCategories.categories && authorCategories.categories.some(
        (e) => Object.keys(e).includes('attr7') && e['attr7']) && attr7Name)
        dropDownOptions.push({value: 'attr7', label: attr7Name});

    if (authorCategories && authorCategories.categories && authorCategories.categories.some(
        (e) => Object.keys(e).includes('attr8') && e['attr8']) && attr8Name)
        dropDownOptions.push({value: 'attr8', label: attr8Name});

    if (authorCategories && authorCategories.categories && authorCategories.categories.some(
        (e) => Object.keys(e).includes('attr9') && e['attr9']) && attr9Name)
        dropDownOptions.push({value: 'attr9', label: attr9Name});

    if (authorCategories && authorCategories.categories && authorCategories.categories.some(
        (e) => Object.keys(e).includes('attr10') && e['attr10']) && attr10Name)
        dropDownOptions.push({value: 'attr10', label: attr10Name});

    if (authorCategories && authorCategories.categories && authorCategories.categories.some(
        (e) => Object.keys(e).includes('attr9') && e['attr9']) && colorName)
        dropDownOptions.push({ value: 'color', label: colorName });

    if (authorCategories && authorCategories.categories && authorCategories.categories.some(
        (e) => Object.keys(e).includes('border') && e['border']) && borderName)
        dropDownOptions.push({ value: 'border', label: t('search.border') });

    if (authorCategories && authorCategories.categories && authorCategories.categories.some(
        (e) => Object.keys(e).includes('type') && e['type']) && typeName)
        dropDownOptions.push({ value: 'type', label: typeName });

    if (['sales', 'missing', 'below_average', 'below_last_sold', 'cheapest',
        'cheapest_missing', 'aether_listings'].includes(searchSearch)) {
        dropDownOptions.push(
            { value: 'aether_price', label: t('search.price')+'/Aether' },
        );
        dropDownOptions.push(
            { value: 'diff', label: t('search.price_diff') },
        );
    }

    const getOption = (order, dir) => {
        const option = Math.max(dropDownOptions.map(item => item.value).indexOf(order), 0);

        return dropDownOptions[option];
    };

    const defaultOption = getOption(orderBy, orderDir);

    const onSubmit = (e) => {
        applyTerm(e.value);
    };

    return (
        <div className={'flex flex-wrap h-full w-full xl:w-1/2'}>
            <form
                className={'w-auto mb-auto flex md:h-10 bg-bluet rounded-3xl border-2 border-primaryt'}
                onSubmit={onSubmit}
            >
                <input
                    className={cn(
                        'h-9 bg-transparent text-sm text-primary',
                        'outline-none my-auto mx-3 w-48 transition-width'
                    )} name="term" placeholder="Name, Template ID, Asset ID" type="text" value={searchTerm}
                    onChange={handleTermChange}
                />
                <button onClick={() => applyTerm(searchTerm)} disabled={disabled} className={"w-6 h-7 my-auto mr-3"}>
                    <img src="/search.svg" alt="Search" />
                </button>
            </form>
            <div className={cn(
                'relative flex justify-center md:justify-start h-16 my-auto w-full md:w-1/2 xl:w-auto mx-4'
            )}>
                <Dropdown
                    options={dropDownOptions}
                    onChange={onSelect}
                    value={defaultOption}
                    placeholder={t('search.order_by')}
                    id="DropdownField14"
                    disabled={ disabled }
                />
            </div>
        </div>
    )
}

export default TopFilters;