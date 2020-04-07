import React, { useEffect, useState } from 'react';
import VList from './VList';

export default function ShowBuffer(p) {
    const { size, filePostion, baseHeight } = p.props;
    const [buffer, setBuffer] = useState();
    const [base, setBase] = useState(16);
    const config = {
        boxHeight: 1.5,       // 5rem
        scrollLen: 10,       // 数量单位
        maxLen: 3 * 10,     // 最大渲染数量
    }
    useEffect(() => {
        const getBuffer = async () => {
            return await fetch('http://127.0.0.1:3000/getBuffer', {
                headers: {
                    Range: `bytes=${filePostion}-${filePostion + size - 1}`,
                },
            }).then(res => res.arrayBuffer())
            .then(buffer => setBuffer(new Uint8Array(buffer)));
        }
        if (size && filePostion) {
            getBuffer();
        }
    }, [size, filePostion]);

    if (!buffer) {
        return null;
    }


    const baseData = [];
    const arr = [];
    for (let i = 0; i < buffer.length; i++) {
        if (i !== 0 && i % 10 === 0) {
            baseData.push({ data: {
                arr: [...arr],
                base,
            } });
            arr.length = 0;
        }
        arr.push(buffer[i].toString(base));
    }
    if (arr.length !== 0) {
        baseData.push({ data: {
            arr: [...arr],
            base,
        } });
    }
    const list = new Array(11).fill(0).map((_, index) => span(index, index, base));
    return(
        <div style={{
            backgroundColor: 'black',
            color: 'white',
        }}>
            {list}
            <VList 
            props={{
                data: baseData,
                el: Bf,
                length,
                baseHeight,
                config,
            }}
            />
        </div>
    );
}

const span = (value, i, base) => <span style={{ 
    width: base === 16 ? '55px' : '55px', 
    display: 'inline-block',
    textAlign: 'end',
}} key={i}>{value}</span>;

const Bf = (p) => {
    const { data, index } = p.props;
    const fontSize = data.base === 16 ? '1rem' : '0.5rem';
    const arr = data.arr.map((item, i) => span(item, i + 1, data.base));
    arr.unshift(span(index + 1, 0, data.base));
    return (
        <div className='bf-content' style={{
            fontSize,
        }}>{arr}</div>
    );
}