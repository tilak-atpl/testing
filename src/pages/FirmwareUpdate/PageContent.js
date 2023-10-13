import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Input } from 'antd';
import { matchColor } from '../../utils/constants';

const PageContent = ({ vehicle }) => {
    // const dispatch = useDispatch();
    const history = useHistory();
    const { themeColor } = useSelector( ({User}) => User );

    useEffect( () => {
        if (Object.keys(vehicle).length === 0) {
            history.goBack();
            return;
        }
    }, [history, vehicle]);

    return (
        <div className='w-full h-full flex flex-col items-center justify-between'>
            <div className="w-full flex flex-col items-start justify-start pl-5 py-5" style={{fontSize: 19}}>
                <div> Device Type: X </div>
                <div> Device IMEI: X </div>
            </div>
            <div className="w-full h-1/4 flex flex-col items-center justify-center">
                <div className='p-5' style={{fontSize:18}}> Current Device Firmware Version </div>
                <Input className='w-1/3 text-center py-2' style={{fontSize: 20}} value={'XX'} readOnly />
            </div>
            <div className="w-full h-1/4 flex flex-col items-center justify-center pb-5">
                <div className='p-5' style={{fontSize:18}}> Latest Device Firmware Version </div>
                <Input className='w-1/3 text-center py-2' style={{fontSize: 20}} value={'XX'} readOnly />
            </div>
            <div className="w-full flex flex-col items-center justify-center text-2xl">
                Device is up to date!
            </div>
            <div className='w-2/5 h-1/4 m-10 flex flex-col items-center justify-evenly' style={{border: '1px solid ' + matchColor(themeColor), borderRadius: 15}}>
                <div className='text-2xl'> Device needs an update. </div>
                <div className='flex items-center justify-center'>
                    <Button className='text-white mr-5' style={{background: themeColor, border: '1px solid ' + matchColor(themeColor), width: 150, height: 50}}>
                        Update
                    </Button>
                    <Button className='text-white' style={{background: themeColor, border: '1px solid ' + matchColor(themeColor), width: 150, height: 50}}>
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PageContent;
