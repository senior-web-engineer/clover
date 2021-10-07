import React from 'react';
import "./TopBar.sass";
import placeholder from "../../../assets/placeholder.jpg";
import {FiMoreVertical, FiArrowLeft, FiMoreHorizontal, FiExternalLink} from 'react-icons/fi';
import {useGlobal} from "reactn";

const TopBar = ({back}) => {
    const honeyside = () => window.open("https://www.honeyside.it", "_blank");
    const codeCanyon = () => window.open("https://codecanyon.net/item/clover-realtime-messaging-audio-video-conferencing-web-app-nodejs-react-webrtc-socketio/25737452", "_blank");

    return (
            <div className="top-bar uk-flex uk-flex-between uk-flex-middle">
                <div className="nav">
                    <div className="button mobile" onClick={back}>
                        <FiArrowLeft/>
                    </div>
                </div>
                <div className="nav">
                    <div className="uk-inline">
                        <div className="button" type="button">
                            <FiMoreHorizontal/>
                        </div>
                        <div data-uk-dropdown="mode: click; offset: 5; boundary: .top-bar">
                            <div className="link" onClick={honeyside}>Honeyside <div className="icon"><FiExternalLink/></div></div>
                            <div className="link" onClick={codeCanyon}>CodeCanyon <div className="icon"><FiExternalLink/></div></div>
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default TopBar;
