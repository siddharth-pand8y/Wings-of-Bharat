import React from 'react';

function InfoWindow(props) {
    const { currentMarker, infoContent } = props;

    return (
        <aside className="info-window-box" tabIndex={0}>

            <h2>{currentMarker.title}</h2>
            <article>
                {infoContent}
            </article>
            <p className="attribution">API used: Wikipedia & Google Maps</p>
            <a className="close" href="/">X</a>
		</aside>
    );
}

export default InfoWindow;
