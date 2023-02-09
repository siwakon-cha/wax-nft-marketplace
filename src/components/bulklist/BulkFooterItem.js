import cn from "classnames";

const BulkFooterItem = ({children}) => {
    return (
        <div className={cn(
            'my-auto flex'
        )}>
            {children}
        </div>
    );
}

export default BulkFooterItem;