import { FlvHeader, Tag, Meta, AvcConfig } from "./box";
import React, { useEffect, useState, useCallback, useRef } from 'react';
import VList from './VList';
import ShowBuffer from "./ShowBuffer";


function Parse(props) {
    const config = {
        boxHeight: 5,       // 5rem
        scrollLen: 5,       // 展示数量
        maxLen: 5 * 5,      // 最大渲染数量
    }
    const [data, setData] = useState(null);
    const [bufferDesc, setDesc] = useState();
    const [scrollData, setScrollData] = useState({
        startIndex: - config.scrollLen,
    });
    useEffect(() => {
        const fetchData = async () => {
            await fetch('http://127.0.0.1:3000/getParseData')
            .then(data => data && data.json())
            .then(res => {
                if (res.code === 100) {
                    console.log(res.data);
                    res.data = readParseData(res.data);
                    res.data.baseHeight = parseInt(getComputedStyle(document.body).fontSize);
                    console.log(res.data);
                    setData(res.data);
                }
            });
        };
        fetchData();
    }, []);

    const handleScroll = (e) => {
        const { scrollTop } = e.target;
        const index = Math.floor(scrollTop / data.baseHeight) - config.scrollLen;
        console.log(index, scrollData.startIndex);
        if (Math.abs(index - scrollData.startIndex) > config.scrollLen) {
            setScrollData({
                startIndex: index,
            });
        }
    }

    const handleClick = (e) => {
        let target = e.target;
        let tagIndex, naluIndex;
        while(target.id !== 'scroll-wrap') {

            if (target.getAttribute('data-nalu-index')) {
                naluIndex = parseInt(target.getAttribute('data-nalu-index'), 10);
            }

            if (target.getAttribute('data-tag-index')) {
                tagIndex = parseInt(target.getAttribute('data-tag-index'), 10);
            }
            target = target.parentNode;
        }
        if (!isNaN(tagIndex) && !isNaN(naluIndex)) {
            console.log(tagIndex, naluIndex);
            const nalu = data.tagsData[tagIndex].body.nalus[naluIndex];
            setDesc(nalu);
        }
    }
    if (!data) {
        return null;
    }

    return (
        <div className='container' style={{
            // display: 'flex'
        }}>
            <div className='content' style={{
                width: 1000,
            }}>
                <FlvHeader props={{
                    hasVideo: data.header.hasVideo,
                    hasAudio: data.header.hasAudio,
                    height: '3rem',
                }}/>
                <Meta props={{
                    height: config.boxHeight,
                    data: {
                        ...data.metaData,
                        ...data.audioAcc,
                    },
                }}/>
                <AvcConfig props={{    
                    data: {
                        ...data.spsConfig,
                    }
                }}/>
                <VList 
                handleScroll={handleScroll}
                handleClick={handleClick}
                props={{
                    data: data.tagsData,
                    startIndex: scrollData.startIndex,
                    maxLen: 5,
                    el: Tag,
                    baseHeight: data.baseHeight,
                    config,
                }}/>
            </div>
            <div style={{
                width: 650,
            }}>
                <ShowBuffer props={{
                    ...bufferDesc,
                    baseHeight: data.baseHeight,
                }}/>
            </div>
        </div>
    )    
}

Parse.staticProps = {
    tagStart: 3,
};

function readParseData(data) {
    const tagsData = [];
    let auidoTagIndex = 0;
    let videoTagIndex = 0;
    for (let i = Parse.staticProps.tagStart; i < data.tagHeaders.length; i ++) {
        const { type } = data.tagHeaders[i];
        let body = null;
        switch (type) {
            case 8:
                body = data.audioTags[auidoTagIndex];
                auidoTagIndex++;
                break;
            case 9:
                body = data.avcPackets[videoTagIndex];
                videoTagIndex++;
                break;
            default:
                console.warn(`readParseData: unhandle unitType: ${type}`);
                break;
        }
        tagsData.push({
            header: data.tagHeaders[i],
            body,
        });
    }
    data.tagsData = tagsData;
    return data;
}

export default Parse;