import React, { useState } from 'react';


const VList = (p) => {
    let { data, el, baseHeight, config } = p.props;
    const boxHeight = config.boxHeight;
    const wrapHeight = config.scrollLen * boxHeight + 'rem';
    const [scrollData, setScrollData] = useState({
        startIndex: - config.scrollLen,
    });
    const handleScroll = (e) => {
        const { scrollTop } = e.target;
        const index = Math.floor(scrollTop / (baseHeight * boxHeight)) - config.scrollLen;

        if (Math.abs(index - scrollData.startIndex) >= config.scrollLen) {
            setScrollData({
                startIndex: index,
            });
        }
    }
    if (data && data.length !== 0) {
        let list = [];
        let { startIndex } = scrollData;
        const len = startIndex + config.maxLen > data.length ? data.length : startIndex + config.maxLen;
        startIndex = startIndex > 0 ? startIndex : 0;
        let index = 0;
        for (let i = startIndex; i < len; i ++) {

            list.push(
                <div
                style={{
                    position: 'absolute',
                    top: i * boxHeight + 'rem',
                    left: 0,
                    width: '100%',
                }}
                key={index}
                data-tag-index={i}
                >
                    {el({ props: { ...data[i], height: boxHeight, index: index }})}
                </div>
            );
            index ++;
        }

        return (
            <div 
                id='scroll-wrap'
                onScroll={handleScroll}
                onClick={p.handleClick}
                style={{
                    height: wrapHeight,
                    position: 'relative',
                    width: '100%',
                    willChange: 'transform',
                    overflow: 'hidden auto',
                    opacity: '0.95',
                }}>
                    <div 
                    style={{
                        width: 'auto',
                        height: data.length * boxHeight + 'rem',
                        maxWidth: '100%',
                        maxHeight: data.length * boxHeight + 'rem',
                        overflow: 'hidden',
                        position: 'relative',
                    }}>{list}</div>
                </div>
        );
    } else {
        return null;
    }
}

export default VList;