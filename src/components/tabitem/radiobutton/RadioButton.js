import cn from "classnames";

const RadioButton = ({active}) => {
    return (
        <div className={cn('text-primary w-8 h-8')}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g className={'text-primary'} data-name="Layer 2">
                    <g data-name="radio-button-off">
                        <rect width="24" height="24" opacity="0"/>
                        <path d="M12 22a10 10 0 1 1 10-10 10 10 0 0 1-10 10zm0-18a8 8 0 1 0 8 8 8 8 0 0 0-8-8z"/>
                        {
                            active ? <path d="M12 7a5 5 0 1 0 5 5 5 5 0 0 0-5-5z"/> : ''
                        }
                    </g>
                </g>
            </svg>
        </div>
    );
};

export default RadioButton;