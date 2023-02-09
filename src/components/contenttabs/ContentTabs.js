import {Tabs} from "react-bootstrap";
import cn from "classnames";

const ContentTabs = ({children, tabKey, onSelect}) => {
    return (
        <div className={"relative mx-1 md:mx-4"} >
            <Tabs className={cn(
                'flex flex-wrap justify-evenly my-4 h-auto lg:h-12 text-md text-neutral bg-bluet rounded-xl'
            )} defaultActiveKey={tabKey} id="latest-trades-newest-assets-switch" onSelect={onSelect}>
                {children}
            </Tabs>
        </div>
    );
};

export default ContentTabs;