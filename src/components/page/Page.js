import Banner from "../banner/Banner";
import React, {useContext, useState} from "react";
import {Context} from "../waxplorer";
import cn from "classnames";
import Header from "../Header/Header";
import Footer from "../footer";

const Page = ({id, title, image= 'https://www.nfthive.io/nfthive-logo.png', description, children, classNames}) => {
    const [showScrollUpIcon, setShowScrollUpIcon] = useState(false);
    const [ state, dispatch ] = useContext(Context);

    const handleScroll = e => {
        let element = e.target;

        if (element.id === id) {
            setShowScrollUpIcon(element.scrollTop > element.clientHeight);
            if (element.scrollHeight - element.scrollTop === element.clientHeight) {
                dispatch({ type: 'SET_SCROLLED_DOWN', payload: true });
            } else if (state.scrolledDown) {
                dispatch({ type: 'SET_SCROLLED_DOWN', payload: false });
            }
        }
    };

    const scrollUp = () => {
        if (process.browser) {
            const element = document.getElementById(id);
            element.scrollTo({left: 0, top: 0, behavior: "smooth"});
        }
    };

    return (
        <div
            className={cn(
                'overflow-x-hidden c-h-page',
                'm-auto ml-0 z-10',
                'c-w-sideNav w-screen InsideScroll ', classNames
            )}
            onScroll={e => handleScroll(e)}
            id={id}
        >
            <Header
                title={title}
                description={description}
                image={image}
            />
            <div
                className={cn(
                    'min-h-content w-full'
                )}
            >
                <Banner show={state.show_banner}/>
                {children}
                {showScrollUpIcon ? <div className={cn(
                    'absolute right-4 bottom-6 w-10 h-10'
                )} onClick={scrollUp}>
                    <img src = "/up-arrow.svg" />
                </div> : ''}
            </div>
            <Footer />
        </div>
    )
}

export default Page;