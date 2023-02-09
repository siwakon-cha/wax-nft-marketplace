import React from "react";
import cn from "classnames";

const Pagination = ({result, offset, limit, location, setOffset}) => {
    const currentPage = Math.round(offset/limit);

    const itemClass = cn(
        'flex w-8 h-8 justify-center text-neutral',
        'cursor-pointer bg-paper rounded-2xl opacity-85 hover:bg-bluet',
        {'mx-1': currentPage > 0},
        {'mx-4': currentPage === 0},
    );

    const itemClassUnderlined = cn(
        'flex w-8 h-8 justify-center text-neutral',
        'cursor-pointer bg-bluet rounded-2xl',
        {'mx-1': currentPage > 0},
        {'mx-4': currentPage === 0},
    );

    const pClass = 'my-auto text-center';

    if (result && (result.length === limit || offset > 1))
        return (
            <div className={cn(
                'flex text-right justify-end',
                'w-full md:w-1/2 xl:w-1/5 color-neutral h-10 mr-0 ml-auto mt-2 md:mt-0',
                {'mb-10': location === 'Bottom'},
                {'mb-auto': location === 'Top'})}>
                {currentPage > 0 ? <div className={itemClass} onClick={() => setOffset(0)}>
                    <p className={pClass}>&lt;&lt;</p>
                </div> : '' }
                {currentPage > 0 ? <div className={itemClass} onClick={() => setOffset((currentPage - 1) * limit)}>
                    <p className={pClass}>&lt;</p>
                </div> : '' }
                {currentPage > 0 ? <div className={itemClass} onClick={() => setOffset(
                    (currentPage - 1) * limit)}>
                    <p className={pClass}>{currentPage}</p>
                </div> : '' }
                <div className={itemClassUnderlined} key={`Pagination${currentPage}`} onClick={() => setOffset(currentPage * limit)}>
                    <p className={pClass}>{currentPage + 1}</p>
                </div>
                {result.length === limit ? <div className={itemClass} onClick={() => setOffset((currentPage + 1) * limit)}>
                    <p className={pClass}>{currentPage + 2}</p>
                </div> : '' }
                {result.length === limit ? <div className={itemClass} onClick={() => setOffset((currentPage + 1) * limit)}>
                    <p className={pClass}>&gt;</p>
                </div> : '' }
            </div>
        );
    else
        return (
            <div className={cn(
                'flex text-right justify-evenly',
                'w-1/2 color-neutral h-6 m-auto')}>
            </div>
        );
};

export default Pagination;