import React from "react";
const LoadingScreen = () => {
    return (
        <>
            <div className='splash-screen'>
                <div className='logo'>
                    <img alt="logo" src="./assets/images/img/logo.png" />
                    <div className="lds-ring">
                        <div> </div>
                        <div> </div>
                        <div> </div>
                        <div> </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoadingScreen;