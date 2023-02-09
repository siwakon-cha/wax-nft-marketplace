const cn = require("classnames");

const BulkItemBox = ({children, title, titleHeight='h-12', contentHeight='h-16'}) => {
    return (
        <div className={cn('w-1/3 md:w-1/12 flex flex-wrap justify-center')}>
            {title ? <div className={cn('w-full text-center m-auto', titleHeight)}>{title}</div> : '' }
            <div className={cn(
                'w-full text-center m-auto text-primary', contentHeight
            )}>
                {children}
            </div>
        </div>
    );
}

export default BulkItemBox;