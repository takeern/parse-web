import React from 'react';

function Tag(p) {
    const { header, body, height } = p.props;
    return (
        <div style={{
            display: 'flex',
            width: '100%',
            height: height + 'rem',
            overflow: 'hidden',
        }}>
            <TagHeader props={header}/>
            <TagBody props={{...body, type: header.type }}/>
        </div>
    )
}

function TagHeader(p) {
    const { type, size, timestamp, timestampEx, filePostion } = p.props;
    let tagDesc;
    switch (type) {
        case 8:
            tagDesc = 'Audio';
            break;
        case 9:
            tagDesc = 'Video';
            break;
        case 18:
            tagDesc = 'Script';
            break;
        default:
            tagDesc = null;
            break;
    }
    return (
        <div className='tag-header' style={{
            display: 'flex',
            flexWrap: 'wrap',
            width: 300,
            alignContent: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgb(243, 90, 119)',
            position: 'relative',
        }}>
            <Kv props={{key: 'tagType', value: type}}/>
            <Kv props={{key: 'tagSize', value: size}}/>
            <Kv props={{key: 'dts', value: timestamp}}/>
            <Kv props={{key: 'dtsEx', value: timestampEx}}/>
            <Kv props={{key: 'filePostion', value: filePostion}}/>
            {tagDesc && <span style={{
                top: '0px',
                right: '-5px',
                padding: '2px',
                position: 'absolute',
                color: 'white',
                backgroundColor: 'black',
                fontSize: '0.5rem',
            }}>{tagDesc}</span>}
        </div>
    );
}

function TagBody(p) {
    const { type } = p.props;
    return (
        type === 8 ? <Auidopacket props={p.props}/> : <Avcpacket props={p.props}/>
    );
}

function Kv(p) {
    let { key, value, fontSize } = p.props;
    fontSize = fontSize || '0.5rem';
    if (key !== undefined && value !== undefined && value !== null) {
        return (
            <div style={{
                backgroundColor: 'rgb(119, 108, 108)',
                color: 'white',
                padding: '1px 2px',
                margin: 2,
                borderRadius: 6,
                fontSize,
                textAlign: 'center',
                height: 17,
            }}>
                <span>{key}: </span>
                <span>{value.toString()}</span>
            </div>
        )
    } else {
        return null;
    }
}


function Nalu(p) {
    const { size, filePostion, unitType, index } = p.props;
    let typeDesc;
    switch (unitType) {
        case 1:
        case 2:
        case 3:
        case 4:
            typeDesc = '非IDR图像';
            break;
        case 5: 
            typeDesc = 'IDR';
            break;
        case 6:
            typeDesc = 'SEI';
            break;
        case 7:
            typeDesc = 'SPS';
            break;
        case 8:
            typeDesc = 'PPS';
            break;
        case 9:
            typeDesc = '分界符';
            break;
        case 11:
            typeDesc = 'END';
            break;
        case 12:
            typeDesc = '填充';
            break;
        default:
            typeDesc = 'UNHANDLE nal type' + unitType;
            break;
    }
    return (
        <div style={{
            backgroundColor: '#ff8e53'
        }}
        data-nalu-index={index}
        >
            <Kv props={{key: 'filePostion', value: filePostion}}/>
            <Kv props={{key: 'size', value: size}}/>
            <Kv props={{key: 'nalu', value: typeDesc}}/>
        </div>
    );
}

function Auidopacket(p) {
    const { soundFormat, soundRate, soundSize, soundType, length, dts, pts, filePostion } = p.props;
    return (
        <div className='audio-tag' style={{
            width: '100%',
            backgroundColor: '#69d6e4',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Kv props={{key: 'soundFormat', value: soundFormat}}/>
            <Kv props={{key: 'soundRate', value: soundRate}}/>
            <Kv props={{key: 'soundSize', value: soundSize}}/>
            <Kv props={{key: 'soundType', value: soundType}}/>
            <Kv props={{key: 'size', value: length}}/>
            <Kv props={{key: 'dts', value: dts}}/>
            <Kv props={{key: 'pts', value: pts}}/>
            <Kv props={{key: 'filePostion', value: filePostion}}/>
        </div>
    )
}

function Avcpacket(p) {
    let { filePostion, frameType, dts, cts, size, nalus } = p.props;
    nalus = nalus || [];
    if (nalus.length > 5) {
        nalus.length = 5;
        console.warn('展示 nalu 数量超过限制', nalus)
    }
    const list = nalus.map((v, i) => {
        v.index = i;
        return <Nalu key={i} props={v} />
    });

    return (
        <div className='video-tag' style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            overflow: 'hidden',
            width: '100%',
            backgroundColor: '#9a049a',
        }}>
            <div>
                <Kv props={{key: 'keyframe', value: frameType === 1}}/>
                {/* <Kv props={{key: 'filePostion', value: filePostion}}/> */}
                {/* <Kv props={{key: 'size', value: size}}/> */}
                <Kv props={{key: 'dts', value: dts}}/>
                <Kv props={{key: 'pts', value: dts + cts}}/>
            </div>
            {list}
        </div>
    )
}

function FlvHeader(p) {
    const { hasVideo, hasAudio, height } = p.props;

    return (
        <div className='flv-header' style={{
            width: '100%',
            height: height + 'rem',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#8BC34A',
            color: 'white',
        }}>
            <div style={{
                fontSize: '3rem',
                margin: '0px 10px',
                width: '11rem',
            }}>F    L    V</div>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
            }}>
                <Kv props={{key: 'hasVideo', value: hasVideo}}/>
                <Kv props={{key: 'hasAudio', value: hasAudio}}/>
                <Kv props={{key: 'filePostion', value: 0}}/>
                <Kv props={{key: 'size', value: 11}}/>
            </div>
        </div>
    );
}

function Meta(p) {
    let list = [];
    p.props.data = p.props.data || {};
    for (let i in p.props.data) {
        list.push(<Kv key={i} props={{key: i, value: p.props.data[i]}}/>);
    }

    return (
        <div className='meta' style={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            flexWrap: 'wrap',
            width: '100%',
            backgroundColor: '#FFC107',
            overflow: 'hidden',
        }}>
            <span style={{
                padding: '2px',
                color: 'white',
                backgroundColor: 'black',
                fontSize: '0.5rem',
            }}>Metadata</span>
            {list}
        </div>
    );
}

function AvcConfig(p) {
    const { 
        profile_string, 
        level_string, 
        bit_depth, 
        chroma_format_string,
        frame_rate,
        sar_ratio,
        codec_size,
        present_size,
    } = p.props.data;
    return(
        <div className='avc-config' style={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            flexWrap: 'wrap',
            width: '100%',
            backgroundColor: '#673AB7',
            overflow: 'hidden',
            minHeight: '2rem',
        }}>
            <span style={{
                padding: '2px',
                color: 'white',
                backgroundColor: 'black',
                fontSize: '0.5rem',
            }}>AvcConfig</span>
            <Kv props={{key: 'profile', value: profile_string}}/>
            <Kv props={{key: 'level', value: level_string}}/>
            <Kv props={{key: 'bit_depth', value: bit_depth}}/>
            <Kv props={{key: 'chroma_format', value: chroma_format_string}}/>
            <Kv props={{key: 'fps', value: frame_rate.fps}}/>
            <Kv props={{key: 'sar_radio_width', value: sar_ratio.width}}/>
            <Kv props={{key: 'sar_radio_height', value: sar_ratio.height}}/>
            <Kv props={{key: 'codec_size_width', value: codec_size.width}}/>
            <Kv props={{key: 'codec_size_height', value: codec_size.height}}/>
        </div>
    );
}

export {
    FlvHeader,
    Tag,
    Meta,
    AvcConfig,
}