export const MenuItems = [
    {
        key: 0,
        type: 'input',
        label: 'Terminal Application',
        value: 'terminalApp'
    }, {
        key: 1,
        type: 'input',
        label: 'Read DTC',
        value: 'readDtc'
    }, {
        key: 2,
        type: 'input',
        label: 'Live Parameters',
        value: 'liveParam'
    }, {
        key: 3,
        type: 'input',
        label: 'Write Parameters',
        value: 'writeParam'
    }, {
        key: 4,
        type: 'input',
        label: 'Actuator Test',
        value: 'actuatorTest'
    }, {
        key: 5,
        type: 'input',
        label: 'Routine Test',
        value: 'routineTest'
    }, {
        key: 6,
        type: 'input',
        label: 'ECU Information',
        value: 'ecuInfo'
    }, {
        key: 7,
        type: 'input',
        label: 'Flashing',
        value: 'flashing'
    }
];

export const setFrameFormat = (type, frame, channel) => {
    const txFrameLen = frame.length / 2;
    const txFrameLen_Hex = ('000' + txFrameLen.toString(16)).slice(-3);
    const crc = ('0000' + CRC16_CCITT(frame, txFrameLen).toString(16)).slice(-4);

    const command = type + txFrameLen_Hex + channel + frame + crc;
    return command;
}

export const CRC16_CCITT = (buffer, size) => {
    let crc = 0xFFFF;

    for (let i = 0; i < size; i++) {
        const val = parseInt( buffer.slice(i * 2, i * 2 + 2), 16);
        crc ^= (val << 8);
        for (let j = 0; j < 8; j++) {
            if ((crc & 0x8000) !== 0) {
                crc = ((crc << 1) ^ 0x1021);
            } else {
                crc <<= 1;
            }
        }
    }
    return crc & 0xFFFF;
}