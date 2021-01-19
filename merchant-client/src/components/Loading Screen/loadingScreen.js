import React from 'react';
import './loadingScreen.scss';


const LoadingScreen = ({loading_text,loadingStatus}) =>{
    
    return(
        <div className={`loading-screen ${loadingStatus ? "show-loader" : ""}`}>
            <div className="main-loading">
                <p className="loading-text">{loading_text}</p>
                <div className="loader">
                    <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                </div> 
            </div>

        </div>
    )
}

export default LoadingScreen;