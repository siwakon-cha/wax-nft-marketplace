import React, {useEffect, useRef, useState} from 'react';

import {getCookie, setCookie} from "../helpers/cookies";

function useOutsideAlerter(ref, callBack, showBanner) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (showBanner && ref.current && !ref.current.contains(event.target)) {
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
  const showBanner = props['showBanner'];
  useOutsideAlerter(wrapperRef, callBack, showBanner);

  return <div ref={wrapperRef}>{props.children}</div>;
}

function TwerpzPopup() {
    const [showBanner, setShowBanner] = useState(false);

    const close = () => {
        setCookie('twerpz', 'false');
        setShowBanner(false);
    };

    const show = () => {
        setCookie('twerpz', 'true');
        setShowBanner(true);
    };

    useEffect(() => {
        if (getCookie('twerpz') !== 'false')
            setTimeout(() => setShowBanner(true), 1000);
    }, [showBanner]);

    return (
        <OutsideAlerter
            showBanner={showBanner}
            callBack={() => close()}
        >
            <div className={showBanner ? "TwerpzPopup Show" : "TwerpzPopup Small"}>
                <div className={showBanner ? "TwerpzPopupContent Show" : "TwerpzPopupContent Closed"}>
                    <div className="TwerpzCloseButton"><img src="/close_btn.svg" alt="X" onClick={() => close()} /></div>
                    <a className="TwerpzPopupImage" target="_blank" href="https://forms.gle/ZdbJ7tcwv8zCHPia8"><img src={'/banner_twerpz.png'} alt="none" /></a>
                </div>
                <div className={showBanner ? "TwerpzButton Hide" : "TwerpzButton Show"} onClick={() => show()}>
                    <div className="TwerpzPopupImage"><img src={'/banner_twerpz.png'} alt="none" /></div>
                </div>
            </div>
        </OutsideAlerter>
    );
}

export default TwerpzPopup;
