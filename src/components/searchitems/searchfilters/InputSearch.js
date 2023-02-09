import cn from "classnames";
import React, {useState} from "react";

const InputSearch = ({applyTerm, handleTermChange, disabled, value, placeholder}) => {
    const onSubmit = (e) => {
        applyTerm(e.value);
    };

    return (
        <form
            className={'w-auto flex h-10 mx-auto my-auto bg-bluet rounded-3xl border-2 border-primaryt'}
            onSubmit={onSubmit}
        >
            <input
                className={cn(
                    'h-9 bg-transparent text-sm text-primary outline-none my-auto mx-3',
                    'w-full transition-width'
                )} name="term" placeholder={placeholder} type="text" value={value}
                onChange={handleTermChange}
            />
            <button onClick={() => applyTerm(value)} disabled={disabled} className={"w-6 h-7 my-auto mr-3"}>
                <img src="/search.svg" alt="Search" />
            </button>
        </form>
    );
}

export default InputSearch;