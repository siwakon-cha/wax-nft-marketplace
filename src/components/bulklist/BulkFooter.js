import cn from "classnames";

const BulkFooter = ({children, addedAssets}) => {
    return (
        <div className={cn(
            'relative flex flex-wrap justify-evenly',
            'mx-8 rounded-tr-xl rounded-tl-xl h-84 z-50'
        )}>
            <div className={cn(
                'w-full flex justify-between my-auto mx-3'
            )}>
                {children}
            </div>
            {addedAssets}
        </div>
    );
}

export default BulkFooter;