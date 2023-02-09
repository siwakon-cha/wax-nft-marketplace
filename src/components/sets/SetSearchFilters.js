import cn from "classnames";
import Dropdown from "react-dropdown";
import React, {useContext, useState} from "react";
import {
    createAttributes,
    createBorders,
    createCategories,
    createColors, createNames,
    createRarities,
    createTypes,
    createVariants, getAttributeName, getBorderName, getColorName, getRarityName, getTypeName, getVariantName
} from "../helpers/FormatLinks";
import {useTranslation} from "react-i18next";
import FilterElement from "../searchitems/searchfilters/FilterElement";
import SelectionField from "../searchitems/searchfilters/SelectionField";
import {Context} from "../waxplorer";

const SetSearchFilters = (
    {
        searchAuthor, searchCategory, searchRarity, searchVariant, searchColor, searchType, searchName, searchBorder,
        searchAttr7, searchAttr8, searchSet, searchArtist, setVars, includeTubes, searchCompleted, orderBy,
        authorCategories, searchOffset, setIncludeTubes, orderDir, isLoading
    }) => {
    const [data, setData] = useState( null);

    const [ state, dispatch ] = useContext(Context);

    const categories = state.setCategories && state.setCategories[searchAuthor];

    const {t} = useTranslation('common');

    const rarityName = getRarityName(t, searchAuthor, searchCategory);

    const borderName = getBorderName(t, searchAuthor, searchCategory);

    const variantName = getVariantName(t, searchAuthor, searchCategory);

    const colorName = getColorName(t, searchAuthor, searchCategory);

    const typeName = getTypeName(t, searchAuthor, searchCategory);

    const setDropDownOptions = [];

    if (['kogsofficial', 'darkcountryh', 'mlb.topps'].includes(searchAuthor))
        setDropDownOptions.push({value: '', label: 'All'});

    if (searchAuthor === 'kogsofficial') {
        setDropDownOptions.push(
            {value: 'rainbowset', label: 'Rainbow Set'}
        );

        setDropDownOptions.push(
            {value: 'superset', label: 'Superset'}
        );

        setDropDownOptions.push(
            {value: 'royalset', label: 'Royal Superset'}
        )
    } else if (searchAuthor === 'darkcountryh') {
        setDropDownOptions.push(
            {value: 'rarityset', label: t('search.rarity') + ' Set'}
        );
        setDropDownOptions.push(
            {value: 'heroset', label: 'Hero Set'}
        );
    } else if (searchAuthor === 'mlb.topps') {
        setDropDownOptions.push(
            {value: 'rarityset', label: t('search.rarity') + ' Set'}
        );
        setDropDownOptions.push(
            {value: 'teamset', label: 'Team Set'}
        );
    }

    const categoryDropDownOptions = categories ? createCategories(categories.filter(
        item => searchAuthor ? searchAuthor === item['author'] && item['category'] !== null
            && (!searchRarity || item['rarity'] === searchRarity)
            && (!searchVariant || item['variant'] === searchVariant)
            && (!searchColor || item['color'] === searchColor)
            && (!searchType || item['type'] === searchType)
            && (!searchName || item['name'] === searchName)
            && (!searchBorder || !item['border'] || item['border'].toString() === searchBorder.toString())
            : item['category'] !== null), t('search.category')) : null;

    const completedDropDownOptions = [
        { value: '', label: 'All' },
        { value: 'completed',  label: t('profile.completed') },
        { value: 'uncompleted', label: t('profile.uncompleted') }
    ];

    const rarityDropDownOptions = categories ? createRarities(categories.filter(
            item => searchAuthor ? searchAuthor === item['author'] && item['rarity'] !== null
                && (!searchCategory || item['category'] === searchCategory)
                && (!searchVariant || item['variant'] === searchVariant)
                && (!searchColor || item['color'] === searchColor)
                && (!searchType || item['type'] === searchType)
                && (!searchName || item['name'] === searchName)
                && (!searchBorder || !item['border'] || item['border'].toString() === searchBorder.toString())
                : item['rarity'] !== null),
        rarityName) : null;

    const variantDropDownOptions = categories ? createVariants(categories.filter(
            item => searchAuthor ? searchAuthor === item['author'] && item['variant'] !== null
                && (!searchCategory || item['category'] === searchCategory)
                && (!searchColor || item['color'] === searchColor)
                && (!searchRarity || item['rarity'] === searchRarity)
                && (!searchType || item['type'] === searchType)
                && (!searchName || item['name'] === searchName)
                && (!searchBorder || !item['border'] || item['border'].toString() === searchBorder.toString())
                : item['variant'] !== null),
        variantName) : null;

    const colorDropDownOptions = categories ? createColors(categories.filter(
            item => searchAuthor ? searchAuthor === item['author'] && item['color'] !== null
                && (!searchCategory || item['category'] === searchCategory)
                && (!searchVariant || item['variant'] === searchVariant)
                && (!searchRarity || item['rarity'] === searchRarity)
                && (!searchType || item['type'] === searchType)
                && (!searchName || item['name'] === searchName)
                && (!searchBorder || !item['border'] || item['border'].toString() === searchBorder.toString())
                : item['color'] !== null),
        colorName) : null;

    const borderDropDownOptions = categories ? createBorders(categories.filter(
            item => searchAuthor ? searchAuthor === item['author'] && item['border'] !== null && item['border'] !== 0
                && (!searchCategory || item['category'] === searchCategory)
                && (!searchRarity || item['rarity'] === searchRarity)
                && (!searchVariant || item['variant'] === searchVariant)
                && (!searchType || item['type'] === searchType)
                && (!searchName || item['name'] === searchName)
                && (!searchColor || item['color'] === searchColor) : item['border'] !== null && item['border'] !== 0),
        borderName) : null;

    const replaceType = (item) => {
        if (item['type'])
            item['type'] = item['type'].replace('Kog ', '').replace('Slammer ', '');
        return item;
    };

    const typeDropDownOptions = categories ? createTypes(categories.filter(
        item => searchAuthor ? searchAuthor === item['author'] && item['type'] !== null
            && (!searchCategory || item['category'] === searchCategory)
            && (!searchRarity || item['rarity'] === searchRarity)
            && (!searchVariant || item['variant'] === searchVariant)
            && (!searchColor || item['color'] === searchColor)
            && (!searchName || item['name'] === searchName)
            && (!searchBorder || !item['border'] || item['border'].toString() === searchBorder.toString())  : item['type'] !== null).map(
        item => item['author'] === 'kogsofficial' ? replaceType(item) : item), typeName) : null;

    const nameDropDownOptions = categories ? createNames(categories.filter(
            item => searchAuthor ? searchAuthor === item['author'] && item['name'] !== null
                && (!searchCategory || item['category'] === searchCategory)
                && (!searchRarity || item['rarity'] === searchRarity)
                && (!searchVariant || item['variant'] === searchVariant)
                && (!searchColor || item['color'] === searchColor)
                && (!searchType || item['type'] === searchType)
                && (!searchBorder || !item['border'] || item['border'].toString() === searchBorder.toString()) : item['name'] !== null),
        t('search.name')) : null;

    const attr7Name = getAttributeName(t, searchAuthor, searchCategory, 0);

    const attr8Name = getAttributeName(t, searchAuthor, searchCategory, 1);

    const attr7Options = categories ? createAttributes(categories.filter(
        item => searchAuthor ? item['author'] === searchAuthor && item['attr7'] !== null
            && (!searchCategory || item['category'] === searchCategory)
            && (!searchVariant || item['variant'] === searchVariant)
            && (!searchRarity || item['rarity'] === searchRarity)
            && (!searchColor || item['color'] === searchColor)
            && (!searchAttr8 || item['attr8'] === searchAttr8)
            && (!searchBorder || !item['border'] ||  item['border'].toString() === searchBorder.toString())
            : item['attr7'] !== null), 'attr7', attr7Name) : null;

    const attr8Options = categories ? createAttributes(categories.filter(
        item => searchAuthor ? item['author'] === searchAuthor && item['attr8'] !== null
            && (!searchCategory || item['category'] === searchCategory)
            && (!searchVariant || item['variant'] === searchVariant)
            && (!searchRarity || item['rarity'] === searchRarity)
            && (!searchColor || item['color'] === searchColor)
            && (!searchAttr7 || item['attr7'] === searchAttr7)
            && (!searchBorder || !item['border'] ||  item['border'].toString() === searchBorder.toString())
            : item['attr8'] !== null), 'attr8', attr8Name) : null;

    const sets = {};

    const seriesDropDownOptions = [];

    const getSet = (setName, variant, rarity, color, border, type, name) => {
        if (setName === 'rainbowset') {
            if (color)
                return '';
        }
        if (setName === 'superset') {
            if (name)
                return '';
        }

        return setName;
    };

    const onSelectVariant = (e) => {
        let color = true;
        let rarity = true;
        let type = true;
        let border = true;
        let name = true;
        let attr7 = true;
        let attr8 = true;

        if (data) {
            rarity = categories.filter(item => item['variant'] === e.value).map(
                item => item.rarity).includes(searchRarity);
            color = categories.filter(item => item['variant'] === e.value).map(
                item => item.color).includes(searchColor);
            type = categories.filter(item => item['variant'] === e.value).map(
                item => item.type).includes(searchType);
            border = categories.filter(item => item['variant'] === e.value).map(
                item => item.border && item.border.toString()).includes(searchBorder);
            name = categories.filter(item => item['variant'] === e.value).map(
                item => item.name).includes(searchName);
            attr7 = categories.filter(item => item['variant'] === e.value).map(
                item => item.attr7).includes(searchAttr7);
            attr8 = categories.filter(item => item['variant'] === e.value).map(
                item => item.attr8).includes(searchAttr8);
        }

        const setName = getSet(searchSet, e.value, rarity ? searchRarity : '', color ? searchColor : '',border ? searchBorder : '', type ? searchType : '', name ? searchName : '');

        setVars(searchAuthor, searchCategory, e.value, rarity ? searchRarity : '', color ? searchColor : '',
            border ? searchBorder : '', type ? searchType : '', attr7 ? searchAttr7 : '', attr8 ? searchAttr8 : '', setName, searchArtist, name ? searchName : '', 0, includeTubes, searchCompleted, orderBy);
    };

    const onSelectRarity = (e) => {
        let color = true;
        let type = true;
        let border = true;
        let variant = true;
        let name = true;
        let attr7 = true;
        let attr8 = true;

        if (data) {
            color = categories.filter(item => item['rarity'] === e.value).map(
                item => item.color).includes(searchColor);
            type = categories.filter(item => item['rarity'] === e.value).map(
                item => item.type).includes(searchType);
            border = categories.filter(item => item['rarity'] === e.value).map(
                item => item.border && item.border.toString()).includes(searchBorder);
            variant = categories.filter(item => item['rarity'] === e.value).map(
                item => item.variant).includes(searchVariant);
            name = categories.filter(item => item['rarity'] === e.value).map(
                item => item.name).includes(searchName);
            attr7 = categories.filter(item => item['rarity'] === e.value).map(
                item => item.attr7).includes(searchAttr7);
            attr8 = categories.filter(item => item['rarity'] === e.value).map(
                item => item.attr8).includes(searchAttr8);
        }

        const setName = getSet(searchSet, variant ? searchVariant : '', e.value, color ? searchColor : '',border ? searchBorder : '', type ? searchType : '', name ? searchName : '');

        setVars(searchAuthor, searchCategory, variant ? searchVariant : '', e.value, color ? searchColor : '',
            border ? searchBorder : '', type ? searchType : '', attr7 ? searchAttr7 : '', attr8 ? searchAttr8 : '',
            setName, searchArtist, name ? searchName : '', 0, includeTubes, searchCompleted, orderBy);
    };

    const onSelectColor = (e) => {
        let variant = true;
        let rarity = true;
        let type = true;
        let border = true;
        let name = true;
        let attr7 = true;
        let attr8 = true;

        if (data) {
            variant = categories.filter(item => item['color'] === e.value).map(item => item.variant).includes(searchVariant);
            rarity = categories.filter(item => item['color'] === e.value).map(item => item.rarity).includes(searchRarity);
            type = categories.filter(item => item['color'] === e.value).map(item => item.type).includes(searchType);
            border = categories.filter(item => item['color'] === e.value).map(item => item.border && item.border.toString()).includes(searchBorder);
            name = categories.filter(item => item['border'] === e.value).map(item => item.name).includes(searchName);
            attr7 = categories.filter(item => item['border'] === e.value).map(item => item.attr7).includes(searchAttr7);
            attr8 = categories.filter(item => item['border'] === e.value).map(item => item.attr8).includes(searchAttr8);
        }

        const setName = getSet(searchSet, variant ? searchVariant : '', rarity ? searchRarity : '', e.value,border ? searchBorder : '', type ? searchType : '', name ? searchName : '');

        setVars(searchAuthor, searchCategory, variant ? searchVariant : '', rarity ? searchRarity : '',
            e.value, border ? searchBorder : '', type ? searchType : '', attr7 ? searchAttr7 : '',
            attr8 ? searchAttr8 : '', setName, searchArtist, name ? searchName : '', 0,
            includeTubes, searchCompleted, orderBy);
    };

    const onSelectName = (e) => {
        let variant = true;
        let rarity = true;
        let color = true;
        let border = true;
        let type = true;
        let attr7 = true;
        let attr8 = true;

        if (data) {
            variant = categories.filter(item => item['name'] === e.value).map(item => item.variant).includes(searchVariant);
            rarity = categories.filter(item => item['name'] === e.value).map(item => item.rarity).includes(searchRarity);
            color = categories.filter(item => item['name'] === e.value).map(item => item.color).includes(searchColor);
            border = categories.filter(item => item['name'] === e.value).map(item => item.border && item.border.toString()).includes(searchBorder);
            type = categories.filter(item => item['name'] === e.value).map(item => item.type).includes(searchType);
            attr7 = categories.filter(item => item['name'] === e.value).map(item => item.attr7).includes(searchAttr7);
            attr8 = categories.filter(item => item['name'] === e.value).map(item => item.attr8).includes(searchAttr8);
        }

        const setName = getSet(searchSet, variant ? searchVariant : '', rarity ? searchRarity : '', color ? searchColor : '',border ? searchBorder : '', type ? searchType : '', e.value);
        setVars(searchAuthor, searchCategory, variant ? searchVariant : '', rarity ? searchRarity : '',
            color ? searchColor : '', border ? searchBorder : '', type ? searchType : '',
            attr7 ? searchAttr7 : '', attr8 ? searchAttr8 : '', setName, searchArtist, e.value,
            0, includeTubes, searchCompleted, orderBy);
    };

    const onSelectBorder = (e) => {
        let variant = true;
        let rarity = true;
        let color = true;
        let type = true;
        let name = true;
        let attr7 = true;
        let attr8 = true;

        if (data) {
            variant = categories.filter(item => item['border'].toString() === e.value).map(item => item.variant).includes(searchVariant);
            rarity = categories.filter(item => item['border'].toString() === e.value).map(item => item.rarity).includes(searchRarity);
            color = categories.filter(item => item['border'].toString() === (e.value)).map(item => item.color).includes(searchColor);
            type = categories.filter(item => item['border'].toString() === e.value).map(item => item.type).includes(searchType);
            name = categories.filter(item => item['border'].toString() === e.value).map(item => item.name).includes(searchName);
            attr7 = categories.filter(item => item['border'] === e.value).map(item => item.attr7).includes(searchAttr7);
            attr8 = categories.filter(item => item['border'] === e.value).map(item => item.attr8).includes(searchAttr8);
        }

        const setName = getSet(searchSet, variant ? searchVariant : '', rarity ? searchRarity : '', color ? searchColor : '',e.value, type ? searchType : '', name ? searchName : '');
        setVars(searchAuthor, searchCategory, variant ? searchVariant : '', rarity ? searchRarity : '',
            color ? searchColor : '', e.value, type ? searchType : '', attr7 ? searchAttr7 : '',
            attr8 ? searchAttr8 : '', setName, searchArtist, name ? searchName : '', 0,
            includeTubes, searchCompleted, orderBy);
    };

    const onSelectType = (e) => {
        let variant = true;
        let rarity = true;
        let color = true;
        let border = true;
        let name = true;
        let attr7 = true;
        let attr8 = true;

        if (data) {
            variant = categories.filter(item => item['type'] === e.value).map(item => item.variant).includes(searchVariant);
            rarity = categories.filter(item => item['type'] === e.value).map(item => item.rarity).includes(searchRarity);
            color = categories.filter(item => item['type'] === e.value).map(item => item.color).includes(searchColor);
            border = categories.filter(item => item['type'] === e.value).map(item => item.border && item.border.toString()).includes(searchBorder);
            name = categories.filter(item => item['type'] === e.value).map(item => item.name).includes(searchName);
            attr7 = categories.filter(item => item['type'] === e.value).map(item => item.attr7).includes(searchAttr7);
            attr8 = categories.filter(item => item['type'] === e.value).map(item => item.attr8).includes(searchAttr8);
        }

        const setName = getSet(searchSet, variant ? searchVariant : '', rarity ? searchRarity : '', color ? searchColor : '',border ? searchBorder : '', e.value, name ? searchName : '');
        setVars(searchAuthor, searchCategory, variant ? searchVariant : '', rarity ? searchRarity : '',
            color ? searchColor : '', border ? searchBorder : '', e.value, attr7 ? searchAttr7 : '',
            attr8 ? searchAttr8 : '', setName, searchArtist, name ? searchName : '', 0,
            includeTubes, searchCompleted, orderBy);
    };

    const onSelectAttr7 = (e) => {
        let variant = true;
        let rarity = true;
        let color = true;
        let border = true;
        let name = true;
        let type = true;
        let attr8 = true;

        if (data) {
            variant = categories.filter(item => item['attr7'] === e.value).map(item => item.variant).includes(searchVariant);
            rarity = categories.filter(item => item['attr7'] === e.value).map(item => item.rarity).includes(searchRarity);
            color = categories.filter(item => item['attr7'] === e.value).map(item => item.color).includes(searchColor);
            border = categories.filter(item => item['attr7'] === e.value).map(item => item.border && item.border.toString()).includes(searchBorder);
            name = categories.filter(item => item['attr7'] === e.value).map(item => item.name).includes(searchName);
            type = categories.filter(item => item['attr7'] === e.value).map(item => item.type).includes(searchType);
            attr8 = categories.filter(item => item['attr7'] === e.value).map(item => item.attr8).includes(searchAttr8);
        }

        const setName = getSet(searchSet, variant ? searchVariant : '', rarity ? searchRarity : '', color ? searchColor : '',border ? searchBorder : '', type ? searchType : '', name ? searchName : '');
        setVars(searchAuthor, searchCategory, variant ? searchVariant : '', rarity ? searchRarity : '',
            color ? searchColor : '', border ? searchBorder : '', type ? searchType : '', e.value,
            attr8 ? searchAttr8 : '', setName, searchArtist, name ? searchName : '', 0,
            includeTubes, searchCompleted, orderBy);
    };

    const onSelectAttr8 = (e) => {
        let variant = true;
        let rarity = true;
        let color = true;
        let border = true;
        let name = true;
        let type = true;
        let attr7 = true;

        if (data) {
            variant = categories.filter(item => item['attr8'] === e.value).map(item => item.variant).includes(searchVariant);
            rarity = categories.filter(item => item['attr8'] === e.value).map(item => item.rarity).includes(searchRarity);
            color = categories.filter(item => item['attr8'] === e.value).map(item => item.color).includes(searchColor);
            border = categories.filter(item => item['attr8'] === e.value).map(item => item.border && item.border.toString()).includes(searchBorder);
            name = categories.filter(item => item['attr8'] === e.value).map(item => item.name).includes(searchName);
            type = categories.filter(item => item['attr8'] === e.value).map(item => item.type).includes(searchType);
            attr7 = categories.filter(item => item['attr8'] === e.value).map(item => item.attr7).includes(searchAttr7);
        }

        const setName = getSet(searchSet, variant ? searchVariant : '', rarity ? searchRarity : '', color ? searchColor : '',border ? searchBorder : '', type ? searchType : '', name ? searchName : '');
        setVars(searchAuthor, searchCategory, variant ? searchVariant : '', rarity ? searchRarity : '',
            color ? searchColor : '', border ? searchBorder : '', type ? searchType : '',
            attr7 ? searchAttr7 : '', e.value, setName, searchArtist, name ? searchName : '',
            0, includeTubes, searchCompleted, orderBy);
    };

    const onSelectCompletion = (e) => {
        setVars(searchAuthor, searchCategory, searchVariant, searchRarity, searchColor, searchBorder, searchType,
            searchAttr7, searchAttr8, searchSet, searchArtist, searchName, searchOffset, includeTubes,
            e.value, orderBy)
    };

    if (authorCategories && categories) {
        authorCategories.map(item => sets[item['name']] = []);

        authorCategories.sort((a, b) => ('' + a.name).localeCompare(b.name)).map(item => seriesDropDownOptions.push(
            {value: item['author'], label: item['numCompleted'] && item['numSets'] ? `${item['name']} (${item['numCompleted']}/${item['numSets']})` : item['name']}
        ));

        categories.filter(item => `${item['collectionName']}` in sets).map(item => sets[`${item['collectionName']}`].push(
            {
                author: item['author'], category: item['category'], rarity: item['rarity'], score: item['score'],
                variant: item['variant'], color: item['color'], type: item['type'], border: item['border'], name: item['name']
            }
        ));
    }

    const onSelectCategory = (e) => {
        const category = e.value;

        let rarity = true;
        let color = true;
        let border = true;
        let type = true;
        let variant = true;
        let name = true;
        let attr7 = true;
        let attr8 = true;

        if (data) {
            variant = categories.filter(item => searchAuthor === item['author'] && item['category'] === category).map(item => item.variant).includes(searchVariant);
            rarity = categories.filter(item => searchAuthor === item['author'] && item['category'] === category).map(item => item.rarity).includes(searchRarity);
            color = categories.filter(item => searchAuthor === item['author'] && item['category'] === category).map(item => item.color).includes(searchColor);
            border = categories.filter(item => searchAuthor === item['author'] && item['category'] === category).map(item => item.border).includes(searchBorder);
            type = categories.filter(item => searchAuthor === item['author'] && item['category'] === category).map(item => item.type).includes(searchType);
            name = categories.filter(item => searchAuthor === item['author'] && item['category'] === category).map(item => item.name).includes(searchName);
            attr7 = categories.filter(item => searchAuthor === item['author'] && item['category'] === category).map(item => item.attr7).includes(searchAttr7);
            attr8 = categories.filter(item => searchAuthor === item['author'] && item['category'] === category).map(item => item.attr8).includes(searchAttr8);
        }

        const setName = getSet(searchSet, e.value, rarity ? searchRarity : '', color ? searchColor : '',border ? searchBorder : '', type ? searchType : '', name ? searchName : '');

        setVars(searchAuthor, category,variant ? searchVariant : '', rarity ? searchRarity : '',
            color ? searchColor : '',border ? searchBorder : '', type ? searchType : '',
            attr7 ? searchAttr7 : '', attr8 ? searchAttr8 : '', setName, searchArtist,
            name ? searchName : '', 0, includeTubes, searchCompleted, orderBy);
    };

    const onSelectSet = (e) => {

        let rarity = false;
        let color = false;
        let border = false;
        let type = false;
        let variant = false;
        let name = false;
        let attr7 = false;
        let attr8 = false;

        const set = e.value;

        if (set === 'rainbowset') {
            rarity = true;
            variant = true;
            name = true;
        }

        setVars(searchAuthor, '',variant ? searchVariant : '', rarity ? searchRarity : '',
            color ? searchColor : '', border ? searchBorder : '', type ? searchType : '',
            attr7 ? searchAttr7 : '', attr8 ? searchAttr8 : '', e.value, '',
            name ? searchName : '', 0, includeTubes, searchCompleted, orderBy);
    };

    const getCategoryOption = (cateogory) => {
        return Math.max(categoryDropDownOptions.map(item => item.value).indexOf(cateogory), 0);
    };

    const getRarityOption = (rarity) => {
        return Math.max(rarityDropDownOptions.map(item => item.value).indexOf(rarity), 0);
    };

    const getCompletionOption = (completion) => {
        return Math.max(completedDropDownOptions.map(item => item.value).indexOf(completion), 0);
    };

    const getVariantOption = (variant) => {
        return Math.max(variantDropDownOptions.map(item => item.value).indexOf(variant), 0);
    };

    const getSetOption = (set) => {
        return Math.max(setDropDownOptions.map(item => item.value).indexOf(set), 0);
    };

    const getColorOption = (color) => {
        return Math.max(colorDropDownOptions.map(item => item.value).indexOf(color), 0);
    };

    const getBorderOption = (border) => {
        if (!border)
            return -1;
        return Math.max(borderDropDownOptions.map(item => item.value.toString()).indexOf(
            border || border === 0 ? border.toString() : ''), 0);
    };

    const getTypeOption = (type) => {
        return Math.max(typeDropDownOptions.map(item => item.value).indexOf(type), 0);
    };

    const getNameOption = (name) => {
        return Math.max(nameDropDownOptions.map(item => item.value).indexOf(name), 0);
    };

    const getAttributeOption = (list, value) => {
        return Math.max(list.map(item => item.value).indexOf(value), 0);
    };

    const defaultCategoryOption = categoryDropDownOptions ? categoryDropDownOptions[getCategoryOption(searchCategory)]: 0;
    const defaultVariantOption = variantDropDownOptions ? variantDropDownOptions[getVariantOption(searchVariant)]: null;
    const defaultRarityOption = rarityDropDownOptions ? rarityDropDownOptions[getRarityOption(searchRarity)]: null;
    const defaultCompletedOption = completedDropDownOptions ? completedDropDownOptions[getCompletionOption(searchCompleted)]: null;
    const defaultSetOption = setDropDownOptions ? setDropDownOptions[getSetOption(searchSet)]: null;
    const defaultBorderOption = borderDropDownOptions ? borderDropDownOptions[getBorderOption(searchBorder)]: null;
    const defaultTypeOption = typeDropDownOptions ? typeDropDownOptions[getTypeOption(searchType)]: null;
    const defaultColorOption = colorDropDownOptions ? colorDropDownOptions[getColorOption(searchColor)] : null;
    const defaultNameOption = nameDropDownOptions ? nameDropDownOptions[getNameOption(searchName)]: null;
    const defaultAttr7Option = attr7Options ? attr7Options[getAttributeOption(attr7Options, searchAttr7)] : null;
    const defaultAttr8Option = attr8Options ? attr8Options[getAttributeOption(attr8Options, searchAttr8)] : null;

    const toggleTubes = () => {
        setIncludeTubes(!includeTubes);
    };

    const onSelectSort = (e) => {
        setVars(searchAuthor, searchCategory, searchVariant, searchRarity, searchColor, searchBorder, searchType,
            searchAttr7, searchAttr8, searchSet, searchArtist, searchName, searchOffset, includeTubes,
            searchCompleted, e.value);
    };

    const sortByOtions = [
        { value: 'completion', label: t('profile.completion') },
        { value: 'score', label: t('profile.score') }
    ];

    const getOption = (order, dir) => {
        const option = Math.max(sortByOtions.map(item => item.value).indexOf(order), 0);

        return sortByOtions[option];
    };

    const defaultOption = getOption(orderBy, orderDir);

    return (
        <div
            className={cn(
                'overflow-x-hidden p-4',
                'bg-paper rounded-2xl shadow',
                'w-full bg-gradient-to-b from-bluet via-blueg to-browng',
                'md:w-1/5 xl:w-1/6 c-h-page'
            )}
        >
                { setDropDownOptions.length > 1 ?
                    <FilterElement
                        title={'Set'}
                        active={searchSet}
                    >
                        <SelectionField
                            options={setDropDownOptions}
                            onChange={onSelectSet}
                            value={defaultSetOption}
                            placeholder='Set'
                            id="DropdownField"
                            disabled={ isLoading ? 'disabled' : '' }
                        />
                    </FilterElement> : '' }
                { categoryDropDownOptions && categoryDropDownOptions.length > 1 ?
                    <FilterElement
                        title={t('search.category')}
                        active={searchCategory}
                    >
                        <SelectionField
                            options={categoryDropDownOptions}
                            onChange={onSelectCategory}
                            value={defaultCategoryOption}
                            placeholder={t('search.category')}
                            id="DropdownField"
                            disabled={ isLoading ? 'disabled' : '' }
                        />
                    </FilterElement> : '' }
                { variantDropDownOptions && variantDropDownOptions.length > 1 ?
                    <FilterElement
                        title={variantName}
                        active={searchVariant}
                    >
                        <SelectionField
                            options={variantDropDownOptions}
                            onChange={onSelectVariant}
                            value={defaultVariantOption}
                            placeholder={variantName}
                            id="DropdownField"
                            disabled={ isLoading ? 'disabled' : '' }
                        />
                    </FilterElement> : '' }
                { rarityDropDownOptions ?
                    <FilterElement
                        title={rarityName}
                        active={searchRarity}
                    >
                        <SelectionField
                            options={rarityDropDownOptions}
                            onChange={onSelectRarity}
                            value={defaultRarityOption}
                            placeholder={rarityName}
                            id="DropdownField"
                            disabled={ isLoading ? 'disabled' : '' }
                        />
                    </FilterElement> : '' }
                { typeDropDownOptions ?
                    <FilterElement
                        title={typeName}
                        active={searchType}
                    >
                        <SelectionField
                            options={typeDropDownOptions}
                            onChange={onSelectType}
                            value={defaultTypeOption}
                            placeholder={typeName}
                            id="DropdownField"
                            disabled={ isLoading ? 'disabled' : '' }
                        />
                    </FilterElement> : '' }
                { nameDropDownOptions ?
                    <FilterElement
                        title={t('search.name')}
                        active={searchName}
                    >
                        <SelectionField
                            options={nameDropDownOptions}
                            onChange={onSelectName}
                            value={defaultNameOption}
                            placeholder={t('search.name')}
                            id="DropdownField"
                            disabled={ !nameDropDownOptions || isLoading ? 'disabled' : '' }
                        />
                    </FilterElement> : '' }
                { borderDropDownOptions ?
                    <FilterElement
                        title={borderName}
                        active={searchBorder || searchBorder === 0}
                    >
                        <SelectionField
                            options={borderDropDownOptions}
                            onChange={onSelectBorder}
                            value={defaultBorderOption}
                            placeholder={borderName}
                            id="DropdownField"
                            disabled={ !borderDropDownOptions || isLoading ? 'disabled' : '' }
                        />
                    </FilterElement> : '' }
                { colorDropDownOptions ?
                    <FilterElement
                        title={colorName}
                        active={searchColor}
                    >
                        <SelectionField
                            options={colorDropDownOptions}
                            onChange={onSelectColor}
                            value={defaultColorOption}
                            placeholder={colorName}
                            id="DropdownField"
                            disabled={ !colorDropDownOptions || isLoading ? 'disabled' : '' }
                        />
                    </FilterElement> : '' }
                { attr7Options ?
                    <FilterElement
                        title={attr7Name}
                        active={searchAttr7}
                    >
                        <SelectionField
                            options={attr7Options}
                            onChange={onSelectAttr7}
                            value={defaultAttr7Option}
                            placeholder={attr7Name}
                            id="DropdownField"
                            disabled={ !attr7Options || isLoading ? 'disabled' : '' }
                        />
                    </FilterElement> : '' }
                { searchAuthor === 'kogsofficial' ?
                    <FilterElement
                        title={attr8Name}
                        active={searchAttr8}
                    >
                        <SelectionField
                            options={attr8Options}
                            onChange={onSelectAttr8}
                            value={defaultAttr8Option}
                            placeholder={attr8Name}
                            id="DropdownField"
                            disabled={ !attr8Options || isLoading ? 'disabled' : '' }
                        />
                    </FilterElement> : '' }
                <FilterElement
                    title={t('profile.completion')}
                    active={searchCompleted}
                >
                    <SelectionField
                        options={completedDropDownOptions}
                        onChange={onSelectCompletion}
                        value={defaultCompletedOption}
                        placeholder={t('profile.completion')}
                        id="DropdownField"
                        disabled={ !completedDropDownOptions || isLoading ? 'disabled' : '' }
                    />
                </FilterElement>
                { searchAuthor === 'kogsofficial' ?
                    <FilterElement
                        title={t('search.include_tubes')}
                        active={!includeTubes}
                    >
                        <div className={cn('flex')}
                             onClick={toggleTubes}
                        >
                            { includeTubes ?
                                <img className={'w-5 h-5'} src="/checkmark-square-2-outline.svg" alt="fav"/> :
                                <img className={'w-5 h-5'} src="/square-outline.svg" alt="fav"/> }
                            <div>{t('search.include_tubes')}</div>
                        </div>
                    </FilterElement> : '' }

                <FilterElement
                    title={t('search.sort_by')}
                    active={orderBy}
                >
                    <SelectionField
                        options={sortByOtions}
                        onChange={onSelectSort}
                        value={defaultOption}
                        placeholder={t('search.sort_by')}
                        id="DropdownField14"
                        disabled={ isLoading ? 'disabled' : '' }
                    />
                </FilterElement>
        </div>
    );
}

export default SetSearchFilters;