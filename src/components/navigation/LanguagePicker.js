import React, {useEffect, useRef} from 'react';

function useOutsideAlerter(ref, callBack) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
          event.preventDefault();
          event.stopPropagation();
          callBack();
      }
    }
    // Bind the event listener
    document.addEventListener("click", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref]);
}

function OutsideAlerter(props) {
  const wrapperRef = useRef(null);
  const callBack = props['callBack'];
  useOutsideAlerter(wrapperRef, callBack);

  return <div ref={wrapperRef}>{props.children}</div>;
}

function LanguagePicker(props) {
    const onSelect = props['onSelect'];
    const value = props['value'];
    const showLanguages = props['showLanguages'];
    const toggleLanguages = props['toggleLanguages'];

    const close = () => {
        toggleLanguages(false);
    };

    const dropDownOptions = {
        'en': '🇬🇧',
        'de': '🇩🇪',
        'es': '🇪🇸',
        'jp': '🇯🇵',
        'zh': '🇨🇳',
        'zh_hk': '🇭🇰',
        'ko': '🇰🇷'
    };

    useEffect(() => {

    }, [showLanguages]);

    return showLanguages ? (
        <OutsideAlerter
            callBack={() => close()}
        >
            <div className="LanguagePicker">
                {
                    Object.keys(dropDownOptions).map(option =>
                        {return <div className={'FlagIcon'} onClick={() => onSelect(option)}>{dropDownOptions[option]}</div>}
                    )
                }
            </div>
        </OutsideAlerter>) : dropDownOptions[value];
}

export default LanguagePicker;
