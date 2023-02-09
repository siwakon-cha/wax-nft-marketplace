import React from "react"
import cn from "classnames";

const UserPicture = ({ userPicture }) => {
    return(
        <div className={cn('flex justify-center my-2.5 mx-auto')}>
            {userPicture ? <img className = 'max-h-24' src={userPicture} /> : ''}
        </div>
    )
}

export default UserPicture;

