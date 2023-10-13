import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Table, Select } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Icon } from '@iconify/react';

import { DotaActions } from '../../stores/actions';
import { matchColor } from '../../utils/constants';
import './FotaCampaign.css'

const PageContent = ({ campaign, vehicleList }) => {
    const dispatch = useDispatch();
    const { themeColor } = useSelector( ({User}) => User );
    const [recordData, setRecordData] = useState([] );

    const handleSelectChange = async (type, value, record) => {
        if (type === 'ecu') {
            const dataset_id = record.ecuOptions.filter(ecu => ecu.id === value)[0].pid_datasets[0].id;
            const datasetOptions = await dispatch(DotaActions.fetchDatasetOptions(record.dataset_id));
            let newData = [...recordData];
            let targetRecord = newData.find(item => item.key === record.key);
            if (targetRecord) {
                targetRecord.ecu_id = value;
                targetRecord.dataset_id = dataset_id;
                targetRecord.datasetOptions = datasetOptions;
                targetRecord.datasetOptionId = datasetOptions.length ? datasetOptions[0].id : '';
            }
            setRecordData(newData);
        } else if (type === 'dataset') {
            // Handle dataset select option change here
        }
    }

    useEffect( () => {
        let defaultData = vehicleList.map((vehicle, index) => ({
            key: index,
            index: index + 1,
            vid: vehicle.registration_id,
            ecu_id: vehicle.sub_model.ecus[0].id,
            dataset_id: vehicle.sub_model.ecus[0].pid_datasets[0].id,
            ecuOptions: vehicle.sub_model.ecus,
            datasetOptions: [],
            datasetOptionId: 0,
            download: false,
            flashing: false,
        }));

        Promise.all(
            defaultData.map((item) =>
                dispatch(DotaActions.fetchDatasetOptions(item.dataset_id)).then((datasetOptions) => ({
                    ...item,
                    datasetOptions,
                    datasetOptionId: datasetOptions.length ? datasetOptions[0].id : '',
                }))
            )
        ).then(newData => {
            setRecordData(newData);
        });
    }, [dispatch, vehicleList]);

    const columns = [
        {
            title: 'SI No',
            dataIndex: 'index',
            key: 'No',
            width: 70,
        },
        {
            title: 'Vehicle ID',
            dataIndex: 'vid',
            key: 'vehicle id',
            width: 200,
        },
        {
            title: 'ECU',
            dataIndex: 'ecu',
            key: 'ecu',
            width: '20%',
            ellipsis: true,
            render: (text, record) => 
                <Select className='w-full' value={record.ecu_id} onSelect={value => handleSelectChange('ecu', value, record)}>
                { record.ecuOptions.map( ecu => 
                    <Select.Option key={ecu.id} value={ecu.id}> {ecu.name} </Select.Option>
                )
                }
                </Select>
        },
        {
            title: 'Dataset',
            dataIndex: 'dataset',
            key: 'dataset',
            width: '20%',
            ellipsis: true,
            render: (text, record) =>
                <Select className='w-full' value={record.datasetOptionId} onChange={(value) => handleSelectChange('dataset', value, record)}>
                { record.datasetOptions.map( dataset => 
                    <Select.Option key={dataset.id} value={dataset.id}> {dataset.code} </Select.Option>
                )
                }
                </Select>
        },
        {
            title: 'Download Status',
            dataIndex: 'download',
            key: 'download',
            ellipsis: true,
        },
        {
            title: 'Flashing Status',
            dataIndex: 'flashing',
            key: 'flashing',
            ellipsis: true,
        }
    ];

    return (
        <div className='w-full h-full flex flex-col items-center justify-between overflow-hidden overflow-y-auto p-5'>
            <div className='w-full flex flex-col'>
            <div className="w-full flex items-center justify-between text-[18px] pb-10">
                <div className='flex items-center'>
                    { campaign.label }
                    <Icon className='ml-3' icon="fa:edit" width="22" height="22" />
                </div>
                <div> Status: ---- </div>
                <InfoCircleOutlined className='text-[20px]' />
            </div>
            <div className="w-full h-[400px] flex items-start justify-between">
                <Table
                    columns={columns}
                    dataSource={recordData}
                    pagination={false}
                    scroll={{ y: 320 }} />
            </div>
            </div>
            <div className="w-full h-[50px] flex justify-center items-center text-2xl mt-10">
                <Button
                    className={`w-full h-full text-center text-white m-3`}
                    style={{background: themeColor, border: '1px solid ' + matchColor(themeColor), width: 150, height: 50}}
                    // onClick={() => handleButtonClick('actuatorTest', 'return_control')}
                >
                    Save
                </Button>
                <Button
                    className={`w-full h-full text-center text-white m-3`}
                    style={{background: themeColor, border: '1px solid ' + matchColor(themeColor), width: 150, height: 50}}
                    // onClick={() => handleButtonClick('actuatorTest', 'return_control')}
                >
                    Start Campaign
                </Button>
            </div>
        </div>
    );
};

export default PageContent;
