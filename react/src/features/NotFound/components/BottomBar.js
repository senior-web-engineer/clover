import React from 'react';
import "./BottomBar.sass";
import placeholder from "../../../assets/placeholder.jpg";
import {FiMoreVertical, FiSettings} from 'react-icons/fi';
import {useGlobal} from "reactn";
import Config from "../../../config";

const BottomBar = () => {
    const version = useGlobal('version')[0];

    return (
            <div className="bottom-bar uk-flex uk-flex-between uk-flex-middle">
                <div className="profile">

                </div>
                <div className="nav">
                    <div className="button">
                        {Config.appName} v{version} - <a href="https://www.honeyside.it" target="_blank">{Config.brand}</a>
                    </div>
                </div>
            </div>
    );
}

export default BottomBar;
