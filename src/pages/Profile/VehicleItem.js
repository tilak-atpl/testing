import React from 'react';
import { useSelector } from 'react-redux';
import { Avatar } from 'antd';

const VehicleItem = ({ vehicle }) => {
    const { themeColor } = useSelector( ({User}) => User );
    const { picture, id, registration_id, vin, imei } = vehicle;
    const mac_id = imei.length ? imei[0].mac_id : '';

    return (
        <div className='w-full h-full flex items-center justify-bewteen p-3' style={{border: '1px solid' + themeColor, borderRadius: 10}}>
            <div style={{width: 150}}>
                { picture === null ?
                <Avatar size={120} style={{background: themeColor, fontSize: 40}}> { registration_id[0].toUpperCase() } </Avatar>
                :
                <Avatar size={120} src={picture} />
                }
            </div>
            <div className='w-1/2 flex flex-col'>
                <div className='pb-3'> {registration_id} </div>
                <div> {vin} </div>
            </div>
            <div className='w-1/3 flex flex-col items-start'>
                <div className='pb-3'> {id} </div>
                <div> {mac_id} </div>
            </div>
        </div>
    );
}

export default VehicleItem;
