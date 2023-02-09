import Link from "next/link";
import cn from "classnames";

const SetsOverviewItem = ({set, account}) => {
    return (
        <Link className={cn('cursor-pointer')} href={
            `/sets/${set.collection}${account ? `?account=${account}` : ''}`
        }>
            <div className={cn(
                'relative w-56 h-80 min-w-min rounded-md overflow-hidden',
                'center p-3 shadow bg-paper rounded-2xl mx-auto my-2 ' +
                'backdrop-filter backdrop-blur-sm'
            )}>
                <div className={cn('w-52 h-52 flex')}>
                    <img className={'m-auto'} src={`https://ipfs.hivebp.io/media/${set.collection}`} />
                </div>
                <div className={cn('w-52 text-neutral')}>
                    {set.name}
                </div>
                <div className={cn('w-full text-neutral flex border-primaryt border-t-2 p-2')}>
                    <div className={cn('w-1/3 p-1 text-xs border-primaryt border-r-2')}>
                        <div className={cn('')}>
                            Sets
                        </div>
                        <div className={cn('')}>
                            {set.sets}
                        </div>
                    </div>
                    <div className={cn('w-1/3 p-1 text-xs border-primaryt border-r-2')}>
                        <div className={cn('')}>
                            Started
                        </div>
                        <div className={cn('')}>
                            {set.started ? set.started : 'n/a'}
                        </div>
                    </div>
                    <div className={cn('w-1/3 p-1 text-xs')}>
                        <div className={cn('')}>
                            Completed
                        </div>
                        <div className={cn('')}>
                            {set.completed ? set.completed : 'n/a'}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default SetsOverviewItem;