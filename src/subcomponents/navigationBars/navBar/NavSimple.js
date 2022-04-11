import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/images/img/logo.png";
import { getFromStorage } from "@utils/localJSONStorage";
import { Button } from 'react-bootstrap';
import styles from './nav.css';

let useClickOutSide = (handler) => {
    let domNode = useRef();

    useEffect(() => {
        let mayBehandler = (event) => {
            if (!domNode.current.contains(event.target)) {
                handler();
            }
        };

        document.addEventListener("mousedown", mayBehandler);

        return () => {
            document.removeEventListener("mousedown", mayBehandler);
        };
    });

    return domNode;
};

const NavSimple = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [slider, setSlider] = useState(true);
    const [encryptedData, setEncryptedData] = useState(false);
    const [showEx, setShowEx] = useState(false);
    const [currentNet, setCurrentNet] = useState([]);

    const handleSlider = () => setSlider(!slider);
    const handleShowEx = () => setShowEx(!showEx);

    useEffect(() => {
        try {
            let net = JSON.parse(getFromStorage("currentNetwork", []));
            setCurrentNet(net.Name);
            let logincheck = sessionStorage.getItem("loggedIn");
            if (logincheck == "true") {
                setIsLoggedIn(true);
            }
            let publicObj = getFromStorage("PUB_OBJ", []);
            publicObj = JSON.parse(publicObj);
            if (publicObj) {
                setEncryptedData(true);
            }
        } catch { }
    }, []);

    const SliderAccountData = [
        [
            {
                title: "Create Account",
                path: "/newaccount",
                cName: encryptedData ? "d-none" : styles.navtext,
                icon: "fad fa-plus",
            },
            {
                title: "Import Account",
                path: "/importaccount",
                cName: encryptedData ? "d-none" : styles.navtext,
                icon: "fad fa-arrow-down",
            },
            {
                title: "Login",
                path: "/login",
                cName: isLoggedIn || !encryptedData ? "d-none" : styles.navtext,
                icon: "fas fa-sign-in-alt",
            },
            {
                title: "Dashboard",
                path: "/dashboard",
                cName: isLoggedIn ? styles.navtext : "d-none",
                icon: "fad fa-tachometer-fast",
            },
            {
                title: "Export Account",
                path: "/exportaccount",
                cName: isLoggedIn ? styles.navtext : "d-none",
                icon: "fad fa-arrow-up",
            },
            {
                title: "Send/Receive",
                path: "/transaction",
                cName: isLoggedIn ? styles.navtext : "d-none",
                icon: "fad fa-coins",
            },
            {
                title: "Vote/Unvote",
                path: "/voting",
                cName: isLoggedIn ? styles.navtext : "d-none",
                icon: "fas fa-vote-yea",
            },
            {
                title: "Register Delegate",
                path: "/voting",
                cName: isLoggedIn ? styles.navtext : "d-none",
                icon: "fas fa-user-plus",
            },
        ],
        [
            {
                title: "Transactions",
                path: "/alltransactions",
                cName: styles.navtext,
                icon: "fas fa-exchange-alt",
            },
            {
                title: "Blocks",
                path: "/blocks",
                cName: styles.navtext,
                icon: "fas fa-th-large",
            },
            /* Accounts Section of Explorer */
            // {
            //   title: "Accounts",
            //   path: "/accounts",
            //   cName: styles.navtext,
            //   icon: "fad fa-user-alt",
            // },
            {
                title: "Delegates",
                path: "/delegates",
                cName: styles.navtext,
                icon: "fas fa-award",
            },
        ],
        [
            {
                title: "Log Out",
                path: "/logout",
                cName: isLoggedIn ? styles.navtext : "d-none",
                icon: "fad fa-sign-out",
            },
            {
                title: "Remove Account",
                path: "/remove",
                cName: encryptedData ? styles.navtext : "d-none",
                icon: "fas fa-user-slash text-danger",
            },
        ],
    ];

    const handleClick = (items) => {
        const loc = window.location.href.search(items.path) == "-1" ? false : true;
        setSlider(loc);
    };

    let clickNode = useClickOutSide(() => {
        setSlider(true);
    });

    return (
        <div className={`${styles.navbar} sticky-top`}>
            <img
                className={`${styles.logo}`}
                src={logo}
                alt="Pheaton"
                onClick={() => (window.location = "#/dashboard")}
            />
            <i className={`fas fa-align-left ${styles.menu}`} onClick={handleSlider} />
            <div ref={clickNode} className={slider ? `${styles.navbarnew}` : `${styles.navbarnewactive}`}>
                <div className={`${styles.navback}`}>
                    <i className="far fa-chevron-left" onClick={handleSlider} />
                    <h3>My Account</h3>
                </div>
                <ul className={`${styles.uldesign}`}>
                    {SliderAccountData[0].map((items, id) => (
                        <Link
                            to={items.path}
                            key={id}
                            onClick={(items) => handleClick(items)}
                        >
                            <li className={items.cName}>
                                <i className={items.icon} />
                                {items.title}
                            </li>
                        </Link>
                    ))}
                </ul>
                <ul className={`${styles.uldesign}`}>
                    <div
                        className={`${styles.navtext}`}
                        onClick={handleShowEx}
                        style={{ cursor: "pointer" }}
                    >
                        <i className="fas fa-globe-asia" />
                        Explorer
                        <i
                            className={
                                showEx ? "fas fa-angle-up ml-2" : "fas fa-angle-down ml-2"
                            }
                        />
                    </div>
                    <div className={showEx ? "fade-in-text" : "d-none fade-in-text"}>
                        {SliderAccountData[1].map((items, id) => (
                            <Link
                                to={items.path}
                                key={id}
                                onClick={(items) => handleClick(items)}
                            >
                                <li className={items.cName} style={{ paddingLeft: "50px" }}>
                                    <i className={items.icon} />
                                    {items.title}
                                </li>
                            </Link>
                        ))}
                    </div>
                </ul>
                <ul className={`${styles.uldesign}`}>
                    {SliderAccountData[2].map((item, id) => (
                        <Link
                            to={item.path}
                            key={id}
                        >
                            <li className={item.cName}>
                                <i className={item.icon} />
                                {item.title}
                            </li>
                        </Link>
                    ))}
                </ul>
            </div>
            <div className="w-100 text-right mt-1">
                <Button variant="secondary"
                    className="text-truncate"
                    disabled
                    title="Current Network"
                    style={{
                        width: "9.4em", backgroundColor: "#3c404b", textOverflow: "ellipsis", outline: 0, boxShadow: "none"
                    }}>
                    {currentNet}</Button>
            </div>
        </div>
    );
};

export default NavSimple;
